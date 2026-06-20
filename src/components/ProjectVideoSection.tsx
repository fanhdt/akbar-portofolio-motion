// src/components/ProjectVideoSection.tsx
"use client";

import { useMemo } from "react";

interface ProjectVideoSectionProps {
  videoUrl?: string;
}

function getEmbedUrl(url: string): string | null {
  if (!url) return null;

  // YouTube: support youtu.be/ID, watch?v=ID, embed/ID, shorts/ID
  const ytMatch = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  if (ytMatch) {
    const id = ytMatch[1];
    const params = new URLSearchParams({
      autoplay: "1",
      mute: "1", // wajib di-mute, browser blokir autoplay dengan suara
      rel: "0", // tidak menampilkan video lain dari channel berbeda saat selesai
      modestbranding: "1", // hilangkan logo YouTube
      showinfo: "0", // hilangkan judul/info di awal (legacy, masih membantu di beberapa browser)
      iv_load_policy: "3", // hilangkan anotasi
      controls: "0", // hilangkan semua UI termasuk overlay judul di kiri atas
      disablekb: "1", // matikan kontrol keyboard karena tidak ada UI untuk fokus
    });
    return `https://www.youtube.com/embed/${id}?${params.toString()}`;
  }

  // Vimeo: vimeo.com/ID
  const vimeoMatch = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeoMatch) {
    const id = vimeoMatch[1];
    const params = new URLSearchParams({
      autoplay: "1",
      muted: "1",
      title: "0", // hilangkan judul
      byline: "0", // hilangkan nama pembuat
      portrait: "0", // hilangkan foto profil
      controls: "0", // hilangkan semua UI controls
    });
    return `https://player.vimeo.com/video/${id}?${params.toString()}`;
  }

  return null;
}

export default function ProjectVideoSection({ videoUrl }: ProjectVideoSectionProps) {
  const embedUrl = useMemo(() => (videoUrl ? getEmbedUrl(videoUrl) : null), [videoUrl]);

  if (!videoUrl || !embedUrl) return null;

  return (
    <section className="w-full bg-white px-4 md:px-16 py-8 md:py-12">
      {/* max-w membatasi ukuran video supaya tidak terlalu besar / perlu di-scroll */}
      <div className="w-full mx-auto">
        <div className="w-full aspect-video relative overflow-hidden bg-neutral-100">
          <iframe src={embedUrl} title="Project video" allow="autoplay; fullscreen; picture-in-picture" allowFullScreen className="w-full h-full" />
        </div>
      </div>
    </section>
  );
}
