"use client";

import { useRef, useState } from "react";
import ParticleBackground from "@/components/ParticleBackground";
import FloatingHearts from "@/components/FloatingHearts";
import Navigation from "@/components/Navigation";
import MusicPlayer from "@/components/MusicPlayer";
import Hero from "@/components/Hero";
import StorySection from "@/components/StorySection";
import PhotoSection from "@/components/PhotoSection";
import GalaxyGallery from "@/components/GalaxyGallery";
import Counter from "@/components/Counter";
import Timeline from "@/components/Timeline";
import MemoryCard from "@/components/MemoryCard";
import SecretMessage from "@/components/SecretMessage";
import FinalSection from "@/components/FinalSection";
import ContentEditor from "@/components/ContentEditor";
import { ContentProvider, useAnniversaryContent, type AnniversaryContent } from "@/lib/content";

function ExperienceContent({ editable, showEditor, autoOpen, onSave }: { editable: boolean; showEditor: boolean; autoOpen: boolean; onSave?: (content: AnniversaryContent, password: string) => Promise<void> | void }) {
  const { content } = useAnniversaryContent();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const toggleMusic = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) { audio.pause(); setIsPlaying(false); return; }
    audio.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
  };
  const start = () => { audioRef.current?.play().then(() => setIsPlaying(true)).catch(() => undefined); };

  return <>
    <main className="relative min-h-screen w-full bg-void-gradient">
      {content.musicUrl && <audio ref={audioRef} src={content.musicUrl} loop preload="none" />}
      <ParticleBackground /><FloatingHearts /><Navigation />
      {content.musicUrl && <MusicPlayer isPlaying={isPlaying} onToggle={toggleMusic} />}
      <div className="relative z-10"><Hero onStart={start} /><StorySection /><PhotoSection /><GalaxyGallery /><Counter /><Timeline /><MemoryCard /><SecretMessage /><FinalSection /></div>
      {showEditor && <ContentEditor autoOpen={autoOpen} onSave={onSave} />}
    </main>
  </>;
}

export default function AnniversaryExperience({ initial, editable = false, autoOpen = false, onSave }: { initial?: AnniversaryContent; editable?: boolean; autoOpen?: boolean; onSave?: (content: AnniversaryContent, password: string) => Promise<void> | void }) {
  return <ContentProvider initial={initial}><ExperienceContent editable={editable} showEditor={editable || !initial} autoOpen={autoOpen} onSave={onSave} /></ContentProvider>;
}
