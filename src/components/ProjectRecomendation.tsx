// src/components/ProjectRecomendation.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface RecommendationItem {
  title: string;
  slug: string;
  videoUrl?: string;
}

interface ProjectRecommendationsProps {
  projects: RecommendationItem[];
}

function getEmbedUrl(url?: string) {
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

/**
 * Komponen terpisah per-card supaya tiap video punya state "ready" sendiri.
 * Overlay hitam pekat menutupi iframe selama beberapa saat pertama untuk
 * menyembunyikan flash logo/tombol YouTube sebelum autoplay jalan bersih.
 */
function RecommendationVideoThumb({ title, videoUrl }: { title: string; videoUrl?: string }) {
  const [isReady, setIsReady] = useState(false);
  const embedUrl = getEmbedUrl(videoUrl);

  useEffect(() => {
    if (!embedUrl) return;
    const timer = setTimeout(() => setIsReady(true), 2500);
    return () => clearTimeout(timer);
  }, [embedUrl]);

  return (
    <div className="aspect-video w-full bg-black overflow-hidden mb-3 relative flex items-center justify-center text-neutral-600">
      {embedUrl ? (
        <>
          <iframe
            src={embedUrl}
            className="w-full h-full scale-[1.02] object-cover pointer-events-none select-none"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            title={title}
            tabIndex={-1}
          />
          <div className={`absolute inset-0 bg-black transition-opacity duration-500 ${isReady ? "opacity-0 pointer-events-none" : "opacity-100"}`} />
        </>
      ) : (
        <span className="text-xs font-medium tracking-wider uppercase text-white">View Project</span>
      )}
      {/* Overlay transparan mutlak supaya klik tetap mengarah ke <Link>, bukan ke iframe */}
      <div className="absolute inset-0 bg-transparent z-10" />
    </div>
  );
}

export default function ProjectRecommendations({ projects }: ProjectRecommendationsProps) {
  if (!projects || projects.length === 0) return null;

  return (
    <section className="mb-16">
      <h2 className="text-lg font-semibold text-neutral-900 mb-6">Other Projects</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {projects.map((item) => (
          <Link key={item.slug} href={`/project/${item.slug}`} className="group block">
            <RecommendationVideoThumb title={item.title} videoUrl={item.videoUrl} />
            <h3 className="text-sm font-medium text-neutral-900 group-hover:text-neutral-500 transition-colors">{item.title}</h3>
          </Link>
        ))}
      </div>
    </section>
  );
}
