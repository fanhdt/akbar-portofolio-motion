// src/components/StyleframesSection.tsx
import Image from "next/image";
import AutoLoopClip from "./AutoLoopClip";

interface ImageFrame {
  url: string;
  caption?: string;
}

interface ClipFile {
  url: string;
  caption?: string;
}

interface StyleframesSectionProps {
  styleframes?: ImageFrame[];
  highlightClips?: ClipFile[];
  videoUrl?: string;
}

function getYoutubeId(url?: string): string | null {
  if (!url) return null;
  const match = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : null;
}

// Titik-titik persentase durasi video untuk auto-loop (25%, 50%, 75%)
const AUTO_LOOP_FRACTIONS = [0.25, 0.5, 0.75];

export default function StyleframesSection({ styleframes, highlightClips, videoUrl }: StyleframesSectionProps) {
  const hasManualClips = highlightClips && highlightClips.length > 0;
  const hasManualImages = !hasManualClips && styleframes && styleframes.length > 0;
  const youtubeId = getYoutubeId(videoUrl);
  const canAutoLoop = !hasManualClips && !hasManualImages && youtubeId;

  if (!hasManualClips && !hasManualImages && !canAutoLoop) return null;

  return (
    <section className="mb-16">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-sm font-medium text-neutral-900">Styleframes</h2>
        {canAutoLoop && <span className="text-xs text-neutral-400"></span>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Prioritas 1: video clip manual upload */}
        {hasManualClips &&
          highlightClips!.map((clip, i) => (
            <div key={i} className="relative w-full aspect-video bg-black overflow-hidden">
              <video src={clip.url} autoPlay loop muted playsInline className="w-full h-full object-cover" />
            </div>
          ))}

        {/* Prioritas 2: gambar still-frame manual upload */}
        {hasManualImages &&
          styleframes!.map((frame, i) => (
            <div key={i} className="relative w-full aspect-video bg-black overflow-hidden">
              <Image src={frame.url} alt={frame.caption || `Styleframe ${i + 1}`} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
            </div>
          ))}

        {/* Prioritas 3: auto-loop dari video YouTube di beberapa timestamp */}
        {canAutoLoop && AUTO_LOOP_FRACTIONS.map((fraction, i) => <AutoLoopClip key={i} videoId={youtubeId!} startFraction={fraction} loopDuration={3} />)}
      </div>
    </section>
  );
}
