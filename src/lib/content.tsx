"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import * as defaults from "@/data/memories";

export type AnniversaryContent = {
  couple: typeof defaults.couple;
  openingText: typeof defaults.openingText;
  musicUrl: typeof defaults.musicUrl;
  introText: typeof defaults.introText;
  photos: typeof defaults.photos;
  counterText: typeof defaults.counterText;
  timelineTitle: typeof defaults.timelineTitle;
  memoryCardsTitle: typeof defaults.memoryCardsTitle;
  memories: typeof defaults.memories;
  memoryCards: typeof defaults.memoryCards;
  galaxyPhotos: typeof defaults.galaxyPhotos;
  galaxyIntro: typeof defaults.galaxyIntro;
  secretMessage: typeof defaults.secretMessage;
  finalScene: typeof defaults.finalScene;
};

export const defaultContent: AnniversaryContent = {
  couple: defaults.couple,
  openingText: defaults.openingText,
  musicUrl: defaults.musicUrl,
  introText: defaults.introText,
  photos: defaults.photos,
  counterText: defaults.counterText,
  timelineTitle: defaults.timelineTitle,
  memoryCardsTitle: defaults.memoryCardsTitle,
  memories: defaults.memories,
  memoryCards: defaults.memoryCards,
  galaxyPhotos: defaults.galaxyPhotos,
  galaxyIntro: defaults.galaxyIntro,
  secretMessage: defaults.secretMessage,
  finalScene: defaults.finalScene,
};

const ContentContext = createContext<{
  content: AnniversaryContent;
  updateContent: (content: AnniversaryContent) => void;
  resetContent: () => void;
}>({ content: defaultContent, updateContent: () => undefined, resetContent: () => undefined });

export function ContentProvider({ children, initial }: { children: ReactNode; initial?: AnniversaryContent }) {
  const [content, setContent] = useState(initial ?? defaultContent);

  useEffect(() => {
    if (initial) return;
    const saved = window.localStorage.getItem("anniversary-content");
    if (saved) {
      try { setContent(JSON.parse(saved)); } catch { window.localStorage.removeItem("anniversary-content"); }
    }
  }, [initial]);

  const updateContent = (next: AnniversaryContent) => {
    setContent(next);
    window.localStorage.setItem("anniversary-content", JSON.stringify(next));
  };

  const resetContent = () => {
    setContent(defaultContent);
    window.localStorage.removeItem("anniversary-content");
  };

  return <ContentContext.Provider value={{ content, updateContent, resetContent }}>{children}</ContentContext.Provider>;
}

export function useAnniversaryContent() {
  return useContext(ContentContext);
}
