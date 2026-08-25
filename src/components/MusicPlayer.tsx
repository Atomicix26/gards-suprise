"use client";

import { Music, Music as MusicOff } from "lucide-react";

type MusicPlayerProps = {
  isPlaying: boolean;
  onToggle: () => void;
};

export default function MusicPlayer({ isPlaying, onToggle }: MusicPlayerProps) {
  return (
    <button
      onClick={onToggle}
      aria-label={isPlaying ? "Turn music off" : "Turn music on"}
      aria-pressed={isPlaying}
      className="fixed right-4 top-4 z-[60] flex items-center gap-2 rounded-full border border-pink-300/70 bg-gradient-to-r from-[#1d0d1d] via-[#3b1630] to-[#20162f] px-3.5 py-2 text-xs font-medium text-white shadow-[0_0_24px_rgba(255,93,162,0.35)] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_28px_rgba(255,93,162,0.5)] md:right-6 md:top-6"
    >
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-pink-400 via-fuchsia-400 to-violet-500 text-[10px] text-white shadow-lg shadow-pink-500/30">
        {isPlaying ? (
          <Music className="h-3.5 w-3.5" />
        ) : (
          <MusicOff className="h-3.5 w-3.5" />
        )}
      </span>
      <span className="hidden tracking-[0.12em] text-white/90 sm:inline">
        {isPlaying ? "MUSIC ON" : "MUSIC OFF"}
      </span>
    </button>
  );
}
