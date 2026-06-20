"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Project {
  title: string;
  slug: string;
  category: string;
  videoUrl: string;
}

interface ProjectGalleryProps {
  initialProjects: Project[];
}

function getEmbedUrl(url: string) {
  if (!url) return "";

  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);

  if (match && match[2].length === 11) {
    const videoId = match[2];
    const params = new URLSearchParams({
      autoplay: "1",
      mute: "1",
      controls: "0", // hilangkan semua UI bawaan YouTube
      showinfo: "0",
      rel: "0",
      loop: "1",
      playlist: videoId,
      modestbranding: "1", // kecilkan logo YouTube
      iv_load_policy: "3", // hilangkan anotasi
      disablekb: "1", // matikan shortcut keyboard
      fs: "0", // hilangkan tombol fullscreen
    });
    return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
  }

  if (url.includes("vimeo.com")) {
    const vimeoId = url.split("/").pop();
    const params = new URLSearchParams({
      autoplay: "1",
      muted: "1",
      background: "1", // mode background Vimeo: otomatis hilangkan semua UI & title
      controls: "0",
    });
    return `https://player.vimeo.com/video/${vimeoId}?${params.toString()}`;
  }

  return url;
}

/**
 * Komponen terpisah per-card supaya tiap video punya state "ready" sendiri.
 * Overlay solid HITAM PEKAT (bukan abu-abu) menutupi iframe selama beberapa
 * saat pertama untuk menyembunyikan flash logo/tombol/garis loading YouTube
 * yang muncul sebelum autoplay benar-benar jalan bersih.
 */
function ProjectVideoThumb({ title, videoUrl }: { title: string; videoUrl: string }) {
  const [isReady, setIsReady] = useState(false);
  const embedUrl = getEmbedUrl(videoUrl);

  useEffect(() => {
    if (!embedUrl) return;
    // Durasi sedikit lebih lama supaya benar-benar nutupin proses buffering awal
    const timer = setTimeout(() => setIsReady(true), 2500);
    return () => clearTimeout(timer);
  }, [embedUrl]);

  return (
    <div className="aspect-[4/3] w-full bg-black overflow-hidden mb-4 relative flex items-center justify-center text-neutral-700">
      {embedUrl ? (
        <>
          <iframe
            src={embedUrl}
            // scale lebih besar memastikan tidak ada celah/garis tepi video yang kelihatan
            className="w-full h-full scale-[1.6] object-cover pointer-events-none select-none"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            title={title}
            tabIndex={-1}
          />
          {/* Overlay hitam pekat menutupi flash awal (logo, tombol, garis loading YouTube) */}
          <div className={`absolute inset-0 bg-black transition-opacity duration-500 ${isReady ? "opacity-0 pointer-events-none" : "opacity-100"}`} />
        </>
      ) : (
        <span className="text-xs font-medium tracking-wider uppercase">View Project 🎬</span>
      )}
      {/* Overlay transparan mutlak supaya klik tetap mengarah ke <Link>, bukan ke iframe */}
      <div className="absolute inset-0 bg-transparent z-10" />
    </div>
  );
}

export default function ProjectGallery({ initialProjects }: ProjectGalleryProps) {
  const [filter, setFilter] = useState("all");

  const filteredProjects = initialProjects.filter((project) => {
    if (filter === "all") return true;
    return project.category === filter;
  });

  return (
    <section id="projects" className="w-full">
      {/* Tombol Filter Kategori */}
      <div className="flex gap-6 text-sm font-medium pb-4 mb-10">
        <button onClick={() => setFilter("all")} className={`transition-colors relative pb-4 -mb-[17px] ${filter === "all" ? "text-black border-b-2 border-black" : "text-neutral-500 hover:text-neutral-300"}`}>
          All
        </button>
        <button onClick={() => setFilter("clients")} className={`transition-colors relative pb-4 -mb-[17px] ${filter === "clients" ? "text-black border-b-2 border-black" : "text-neutral-500 hover:text-neutral-300"}`}>
          Clients
        </button>
        <button onClick={() => setFilter("personal")} className={`transition-colors relative pb-4 -mb-[17px] ${filter === "personal" ? "text-black border-b-2 border-black" : "text-neutral-500 hover:text-neutral-300"}`}>
          Personal
        </button>
      </div>

      {/* Grid Galeri Karya (4 Kolom Sesuai Gambar UI) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
        {filteredProjects.map((project) => (
          <Link key={project.slug} href={`/project/${project.slug}`} className="group block">
            <ProjectVideoThumb title={project.title} videoUrl={project.videoUrl} />

            {/* Judul Karya di Bawah Video */}
            <h3 className="text-sm font-medium text-neutral-900 group-hover:text-neutral-500 transition-colors">{project.title}</h3>
          </Link>
        ))}
      </div>

      {/* State jika kategori kosong */}
      {filteredProjects.length === 0 && <div className="w-full text-center py-20 text-neutral-500 text-sm">Belum ada karya di kategori ini.</div>}
    </section>
  );
}
