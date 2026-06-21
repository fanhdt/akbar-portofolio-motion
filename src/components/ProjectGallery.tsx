"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

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
      controls: "0",
      showinfo: "0",
      rel: "0",
      loop: "1",
      playlist: videoId,
      modestbranding: "1",
      iv_load_policy: "3",
      disablekb: "1",
      fs: "0",
    });
    return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
  }

  if (url.includes("vimeo.com")) {
    const vimeoId = url.split("/").pop();
    const params = new URLSearchParams({
      autoplay: "1",
      muted: "1",
      background: "1",
      controls: "0",
    });
    return `https://player.vimeo.com/video/${vimeoId}?${params.toString()}`;
  }

  return url;
}

function ProjectVideoThumb({ title, videoUrl }: { title: string; videoUrl: string }) {
  const [isReady, setIsReady] = useState(false);
  const embedUrl = getEmbedUrl(videoUrl);

  useEffect(() => {
    if (!embedUrl) return;
    const timer = setTimeout(() => setIsReady(true), 2500);
    return () => clearTimeout(timer);
  }, [embedUrl]);

  return (
    <div className="aspect-video w-full bg-black overflow-hidden relative flex items-center justify-center text-neutral-700">
      {embedUrl ? (
        <>
          <motion.iframe
            src={embedUrl}
            className="w-full h-full scale-[1.02] object-cover pointer-events-none select-none"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            title={title}
            tabIndex={-1}
            initial={false}
            whileHover={{ scale: 1.08 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          />
          <div className={`absolute inset-0 bg-black transition-opacity duration-500 ${isReady ? "opacity-0 pointer-events-none" : "opacity-100"}`} />
        </>
      ) : (
        <span className="text-xs font-medium tracking-wider uppercase">View Project 🎬</span>
      )}
      <div className="absolute inset-0 bg-transparent z-10" />
    </div>
  );
}

const FILTERS = [
  { value: "all", label: "All" },
  { value: "clients", label: "Clients" },
  { value: "personal", label: "Personal" },
];

// Reveal satu-satu pakai delay manual berdasarkan index (lebih reliable
// daripada staggerChildren saat tiap card pakai whileInView sendiri)
const cardVariants = {
  hidden: {
    opacity: 0,
    y: 32,
  },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      delay: i * 0.06,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
  exit: {
    opacity: 0,
    y: -16,
    transition: { duration: 0.25, ease: [0.4, 0, 1, 1] },
  },
};

function ProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <motion.div layout custom={index} variants={cardVariants} initial="hidden" whileInView="show" exit="exit" viewport={{ once: true, amount: 0.3 }} className="group">
      <Link href={`/project/${project.slug}`} className="block">
        {/* Nomor urut kecil, muncul fade saat hover - sentuhan khas portfolio studio */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] text-neutral-400 tabular-nums opacity-0 group-hover:opacity-100 transition-opacity duration-300">{String(index + 1).padStart(2, "0")}</span>
        </div>

        <div className="overflow-hidden">
          <ProjectVideoThumb title={project.title} videoUrl={project.videoUrl} />
        </div>

        {/* Judul dengan garis bawah yang "tumbuh" dari kiri saat hover */}
        <div className="mt-4 relative inline-block">
          <h3 className="text-sm font-medium text-neutral-900 transition-colors">{project.title}</h3>
          <span className="absolute left-0 -bottom-1 h-px w-full bg-neutral-900 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-400 ease-out" />
        </div>
      </Link>
    </motion.div>
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
      {/* Tombol Filter Kategori - garis bawah geser smooth + tap feedback */}
      <div className="flex gap-6 text-base font-semibold pb-4">
        {FILTERS.map((f) => {
          const isActive = filter === f.value;
          return (
            <motion.button key={f.value} onClick={() => setFilter(f.value)} whileTap={{ scale: 0.94 }} className={`transition-colors relative pb-2 ${isActive ? "text-black" : "text-neutral-500 hover:text-neutral-300"}`}>
              {f.label}
              {isActive && <motion.span layoutId="filter-underline" className="absolute left-0 right-0 -bottom-[1px] h-[2px] bg-black" transition={{ type: "spring", stiffness: 380, damping: 30 }} />}
            </motion.button>
          );
        })}
      </div>

      {/* Grid Galeri Karya - card animasi masuk/keluar satu-satu saat filter berubah */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
        <AnimatePresence mode="popLayout">
          {filteredProjects.map((project, index) => (
            <ProjectCard key={project.slug} project={project} index={index} />
          ))}
        </AnimatePresence>
      </div>

      {/* State jika kategori kosong */}
      <AnimatePresence>
        {filteredProjects.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full text-center py-20 text-neutral-500 text-sm">
            Belum ada karya di kategori ini.
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
