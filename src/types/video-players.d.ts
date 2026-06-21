// src/types/video-players.d.ts

export interface YTPlayerLike {
  playVideo: () => void;
  pauseVideo: () => void;
  seekTo: (seconds: number, allowSeekAhead: boolean) => void;
  mute: () => void;
  unMute: () => void;
  isMuted: () => boolean;
  setVolume: (v: number) => void;
  getVolume: () => number;
  getCurrentTime: () => number;
  getDuration: () => number;
  destroy: () => void;
}

export interface VimeoPlayerLike {
  play: () => Promise<void>;
  pause: () => Promise<void>;
  setCurrentTime: (seconds: number) => Promise<number>;
  getCurrentTime: () => Promise<number>;
  getDuration: () => Promise<number>;
  setVolume: (v: number) => Promise<number>;
  getVolume: () => Promise<number>;
  on: (event: string, cb: (data?: unknown) => void) => void;
  destroy: () => Promise<void>;
}

declare global {
  interface Window {
    YT?: {
      Player: new (el: HTMLElement | string, config: Record<string, unknown>) => YTPlayerLike;
    };
    onYouTubeIframeAPIReady?: () => void;
    Vimeo?: {
      Player: new (el: HTMLElement, config: Record<string, unknown>) => VimeoPlayerLike;
    };
  }
}

// Wajib ada export kosong supaya file ini dianggap module, bukan script global biasa
export {};
