"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

type Mode = "image" | "video";

type Args = {
  setMode: (m: Mode) => void;
  setPrompt: (p: string) => void;
  setSelectedCharacterId: (id: string) => void;
  setAspect: (a: string) => void;
  setSeed: (n: number) => void;
};

export function useStudioQueryPrefill({
  setMode,
  setPrompt,
  setSelectedCharacterId,
  setAspect,
  setSeed,
}: Args) {
  const sp = useSearchParams();

  useEffect(() => {
    if (!sp) return;

    const mode = sp.get("mode");
    if (mode === "image" || mode === "video") setMode(mode);

    const prompt = sp.get("prompt");
    if (typeof prompt === "string" && prompt.length > 0) setPrompt(prompt);

    const character = sp.get("character");
    if (typeof character === "string" && character.length > 0) setSelectedCharacterId(character);

    const aspect = sp.get("aspect");
    if (typeof aspect === "string" && aspect.length > 0) setAspect(aspect);

    const seedRaw = sp.get("seed");
    if (seedRaw) {
      const n = Number(seedRaw);
      if (!Number.isNaN(n)) setSeed(n);
    }
    // we only want this on initial mount / param change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sp]);
}
