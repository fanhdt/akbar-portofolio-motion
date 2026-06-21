/* eslint-disable @typescript-eslint/no-unused-expressions */
"use client";

import { useEffect, useRef, useState } from "react";
import type { YTPlayerLike, VimeoPlayerLike } from "@/types/video-players";

interface ProjectVideoSectionProps {
  videoUrl?: string;
}

type Platform = "youtube" | "vimeo" | null;

function parseVideo(url: string): { platform: Platform; id: string | null } {
  if (!url) return { platform: null, id: null };

  const ytMatch = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  if (ytMatch) return { platform: "youtube", id: ytMatch[1] };

  const vimeoMatch = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeoMatch) return { platform: "vimeo", id: vimeoMatch[1] };

  return { platform: null, id: null };
}

function formatTime(seconds: number): string {
  if (!isFinite(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function loadScript(src: string, isLoadedCheck: () => boolean): Promise<void> {
  return new Promise((resolve) => {
    if (isLoadedCheck()) return resolve();
    const existing = document.querySelector(`script[src="${src}"]`);
    if (existing) {
      existing.addEventListener("load", () => resolve());
      return;
    }
    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.onload = () => resolve();
    document.body.appendChild(script);
  });
}

export default function ProjectVideoSection({ videoUrl }: ProjectVideoSectionProps) {
  const { platform, id } = videoUrl ? parseVideo(videoUrl) : { platform: null, id: null };

  const containerRef = useRef<HTMLDivElement>(null);
  const ytPlayerRef = useRef<YTPlayerLike | null>(null);
  const vimeoPlayerRef = useRef<VimeoPlayerLike | null>(null);
  const rafRef = useRef<number | null>(null);

  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [volume, setVolume] = useState(100);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isSeeking, setIsSeeking] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!id || !containerRef.current) return;

    let cancelled = false;

    if (platform === "youtube") {
      loadScript("https://www.youtube.com/iframe_api", () => !!window.YT?.Player).then(() => {
        const initPlayer = () => {
          if (cancelled || !containerRef.current) return;
          ytPlayerRef.current = new window.YT!.Player(containerRef.current, {
            videoId: id,
            playerVars: {
              autoplay: 1,
              mute: 1,
              controls: 0,
              rel: 0,
              modestbranding: 1,
              showinfo: 0,
              iv_load_policy: 3,
              disablekb: 1,
              fs: 0,
              playsinline: 1,
            },
            events: {
              onReady: () => {
                setIsReady(true);
                setDuration(ytPlayerRef.current?.getDuration() ?? 0);
              },
            },
          });
        };

        if (window.YT?.Player) {
          initPlayer();
        } else {
          window.onYouTubeIframeAPIReady = initPlayer;
        }
      });
    }

    if (platform === "vimeo") {
      loadScript("https://player.vimeo.com/api/player.js", () => !!window.Vimeo?.Player).then(() => {
        if (cancelled || !containerRef.current || !window.Vimeo) return;
        const player = new window.Vimeo.Player(containerRef.current, {
          id: Number(id),
          autoplay: true,
          muted: true,
          controls: false,
          background: false,
          loop: true,
        });
        vimeoPlayerRef.current = player;

        player.on("loaded", async () => {
          setIsReady(true);
          setDuration(await player.getDuration());
        });
      });
    }

    return () => {
      cancelled = true;
      ytPlayerRef.current?.destroy?.();
      vimeoPlayerRef.current?.destroy?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, platform]);

  useEffect(() => {
    if (!isReady) return;

    const tick = async () => {
      if (!isSeeking) {
        if (platform === "youtube" && ytPlayerRef.current) {
          setCurrentTime(ytPlayerRef.current.getCurrentTime());
        } else if (platform === "vimeo" && vimeoPlayerRef.current) {
          setCurrentTime(await vimeoPlayerRef.current.getCurrentTime());
        }
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isReady, isSeeking, platform]);

  const togglePlay = () => {
    if (platform === "youtube" && ytPlayerRef.current) {
      isPlaying ? ytPlayerRef.current.pauseVideo() : ytPlayerRef.current.playVideo();
    } else if (platform === "vimeo" && vimeoPlayerRef.current) {
      isPlaying ? vimeoPlayerRef.current.pause() : vimeoPlayerRef.current.play();
    }
    setIsPlaying((prev) => !prev);
  };

  const toggleMute = () => {
    if (platform === "youtube" && ytPlayerRef.current) {
      if (isMuted) {
        ytPlayerRef.current.unMute();
        ytPlayerRef.current.setVolume(volume || 50);
      } else {
        ytPlayerRef.current.mute();
      }
    } else if (platform === "vimeo" && vimeoPlayerRef.current) {
      vimeoPlayerRef.current.setVolume(isMuted ? (volume || 50) / 100 : 0);
    }
    setIsMuted((prev) => !prev);
  };

  const handleVolumeChange = (value: number) => {
    setVolume(value);
    setIsMuted(value === 0);
    if (platform === "youtube" && ytPlayerRef.current) {
      ytPlayerRef.current.setVolume(value);
      if (value === 0) ytPlayerRef.current.mute();
      else ytPlayerRef.current.unMute();
    } else if (platform === "vimeo" && vimeoPlayerRef.current) {
      vimeoPlayerRef.current.setVolume(value / 100);
    }
  };

  const handleSeek = (value: number) => {
    setCurrentTime(value);
    if (platform === "youtube" && ytPlayerRef.current) {
      ytPlayerRef.current.seekTo(value, true);
    } else if (platform === "vimeo" && vimeoPlayerRef.current) {
      vimeoPlayerRef.current.setCurrentTime(value);
    }
  };

  if (!videoUrl || !id) return null;

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <section className="w-full bg-white px-4 md:px-16 py-8 md:py-12">
      <div className="w-full mx-auto">
        <div className="w-full aspect-video relative overflow-hidden bg-neutral-100 group">
          <div ref={containerRef} className="w-full h-full" />

          <div className="absolute bottom-0 left-0 right-0 px-4 py-3 bg-gradient-to-t from-black/70 to-transparent flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button onClick={togglePlay} aria-label={isPlaying ? "Pause" : "Play"} className="text-white shrink-0 hover:scale-110 transition-transform">
              {isPlaying ? (
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                  <rect x="6" y="5" width="4" height="14" />
                  <rect x="14" y="5" width="4" height="14" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>

            <span className="text-white text-xs tabular-nums shrink-0 w-9">{formatTime(currentTime)}</span>

            <input
              type="range"
              min={0}
              max={duration || 0}
              step={0.1}
              value={currentTime}
              onChange={(e) => handleSeek(Number(e.target.value))}
              onMouseDown={() => setIsSeeking(true)}
              onMouseUp={() => setIsSeeking(false)}
              onTouchStart={() => setIsSeeking(true)}
              onTouchEnd={() => setIsSeeking(false)}
              className="flex-1 h-1 accent-white cursor-pointer"
              style={{
                background: `linear-gradient(to right, white ${progressPercent}%, rgba(255,255,255,0.3) ${progressPercent}%)`,
              }}
            />

            <span className="text-white text-xs tabular-nums shrink-0 w-9">{formatTime(duration)}</span>

            <div className="flex items-center gap-2 shrink-0">
              <button onClick={toggleMute} aria-label={isMuted ? "Unmute" : "Mute"} className="text-white hover:scale-110 transition-transform">
                {isMuted || volume === 0 ? (
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path d="M3 9v6h4l5 5V4L7 9H3zm15.5 3l2.5-2.5-1.41-1.41L17.59 12l-2.5-2.5-1.41 1.41L16.18 13l-2.5 2.5 1.41 1.41 2.5-2.5 2.5 2.5 1.41-1.41-2.5-2.5z" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0014 8v8a4.5 4.5 0 002.5-4zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                  </svg>
                )}
              </button>
              <input type="range" min={0} max={100} value={isMuted ? 0 : volume} onChange={(e) => handleVolumeChange(Number(e.target.value))} className="w-16 h-1 accent-white cursor-pointer" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
