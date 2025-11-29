"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

type Mode = "image" | "video";

export function useStudioQueryPrefill(opts: {
  setMode: (m: Mode) => void;
  setPrompt: (p: string) => void;
  setSelectedCharacterId: (id: string) => void;
  setAspect: (a: string) => void;
  setSeed: (n: number) => void;
}) {
  const sp = useSearchParams();

  useEffect(() => {
    const mode = (sp.get("mode") || "").toLowerCase();
    if (mode === "image" || mode === "video") opts.setMode(mode);

    const prompt = sp.get("prompt");
    if (prompt) opts.setPrompt(prompt);

    const character = sp.get("character");
    if (character) opts.setSelectedCharacterId(character);

    const aspect = sp.get("aspect");
    if (aspect) opts.setAspect(aspect);

    const seed = sp.get("seed");
    if (seed && !Number.isNaN(Number(seed))) opts.setSeed(Number(seed));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
