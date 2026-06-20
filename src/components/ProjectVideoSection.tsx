"use client";

import { useMemo } from "react";

interface ProjectVideoSectionProps {
  videoUrl?: string;
}

function getEmbedUrl(url: string): string | null {
  if (!url) return null;

  const ytMatch = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  if (ytMatch) {
    const id = ytMatch[1];
    const params = new URLSearchParams({
      autoplay: "1",
      mute: "1",
      rel: "0",
      modestbranding: "1",
      showinfo: "0",
      iv_load_policy: "3",
      controls: "0",
      disablekb: "1",
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
      title: "0",
      byline: "0",
      portrait: "0",
      controls: "0",
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
      <div className="w-full mx-auto">
        <div className="w-full aspect-video relative overflow-hidden bg-neutral-100">
          <iframe src={embedUrl} title="Project video" allow="autoplay; fullscreen; picture-in-picture" allowFullScreen className="w-full h-full" />
        </div>
      </div>
    </section>
  );
}
