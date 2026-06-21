"use client";

import { useEffect, useRef, useState } from "react";
import type { YTPlayerLike } from "@/types/video-players";

interface AutoLoopClipProps {
  videoId: string;
  /** Posisi mulai loop, dalam persen durasi video (0-1) */
  startFraction: number;
  /** Panjang loop dalam detik */
  loopDuration?: number;
}

function loadYouTubeApi(): Promise<void> {
  return new Promise((resolve) => {
    if (window.YT?.Player) return resolve();
    const existing = document.querySelector('script[src="https://www.youtube.com/iframe_api"]');
    if (!existing) {
      const script = document.createElement("script");
      script.src = "https://www.youtube.com/iframe_api";
      script.async = true;
      document.body.appendChild(script);
    }
    const prevCallback = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      prevCallback?.();
      resolve();
    };
    const checkInterval = setInterval(() => {
      if (window.YT?.Player) {
        clearInterval(checkInterval);
        resolve();
      }
    }, 200);
  });
}

/**
 * Memutar segmen pendek (loop) dari video YouTube yang sama, dimulai dari
 * persentase durasi tertentu. Dipakai sebagai fallback otomatis untuk
 * highlight clips kalau user belum upload video manual.
 */
export default function AutoLoopClip({ videoId, startFraction, loopDuration = 3 }: AutoLoopClipProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YTPlayerLike | null>(null);
  const startTimeRef = useRef<number>(0);
  const rafRef = useRef<number | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    loadYouTubeApi().then(() => {
      if (cancelled || !containerRef.current || !window.YT) return;

      playerRef.current = new window.YT.Player(containerRef.current, {
        videoId,
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
          onReady: (e: { target: YTPlayerLike }) => {
            const duration = e.target.getDuration();
            const start = Math.max(1, duration * startFraction);
            startTimeRef.current = start;
            e.target.mute();
            e.target.seekTo(start, true);
            e.target.playVideo();
            setIsReady(true);
          },
        },
      });
    });

    return () => {
      cancelled = true;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      playerRef.current?.destroy?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoId, startFraction]);

  useEffect(() => {
    if (!isReady) return;

    const tick = () => {
      const player = playerRef.current;
      if (player) {
        const current = player.getCurrentTime();
        if (current >= startTimeRef.current + loopDuration) {
          player.seekTo(startTimeRef.current, true);
        }
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isReady, loopDuration]);

  return (
    <div className="relative w-full aspect-video bg-black overflow-hidden">
      <div ref={containerRef} className="absolute inset-0 w-full h-full scale-[1.02] pointer-events-none select-none" />
    </div>
  );
}
