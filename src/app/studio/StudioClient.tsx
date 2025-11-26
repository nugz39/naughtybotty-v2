"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useStudioQueryPrefill } from "@/hooks/useStudioQueryPrefill";

type Mode = "image" | "video";

type GenResult = {
  id: string;
  mode: Mode;
  prompt: string;
  character?: string;
  aspect?: string;
  seed?: number | null;
  url?: string | null; // blob URL
  createdAt?: string;
  error?: string;
};

function clsx(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}

function aspectToSize(aspect: string) {
  switch (aspect) {
    case "16:9":
      return { width: 1024, height: 576 };
    case "1:1":
      return { width: 768, height: 768 };
    case "4:5":
    default:
      return { width: 768, height: 960 };
  }
}

export default function StudioClient() {
  // ---- local "auth"
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [hasStudioAccess, setHasStudioAccess] = useState(false);

  useEffect(() => {
    try {
      const li = localStorage.getItem("nb_logged_in") === "true";
      // IMPORTANT: for now, treat login as access so you can build backend without getting blocked
      // Later you can swap this to a real plan check (trial/studio flags).
      const saRaw = localStorage.getItem("nb_studio_access") === "true";
      setIsLoggedIn(li);
      setHasStudioAccess(li || saRaw);
    } catch {}
  }, []);

  function doLogout() {
    try {
      localStorage.removeItem("nb_logged_in");
      localStorage.removeItem("nb_studio_access");
    } catch {}
    setIsLoggedIn(false);
    setHasStudioAccess(false);
  }

  // ---- studio state
  const [mode, setMode] = useState<Mode>("image");
  const [prompt, setPrompt] = useState("");
  const [selectedCharacterId, setSelectedCharacterId] = useState<string>("nova");
  const [aspect, setAspect] = useState<string>("4:5");
  const [seed, setSeed] = useState<number>(20251201);

  const [steps, setSteps] = useState<number>(30);
  const [guidance, setGuidance] = useState<number>(7.5);

  // Video placeholders (UI only)
  const [videoDuration, setVideoDuration] = useState<number>(6);
  const [videoModel, setVideoModel] = useState<string>("Studio Video v1 (coming soon)");

  const [isGenerating, setIsGenerating] = useState(false);
  const [results, setResults] = useState<GenResult[]>([]);
  const [active, setActive] = useState<GenResult | null>(null);

  const canGenerate = prompt.trim().length > 0 && !isGenerating;

  // ---- Prefill from URL query
  useStudioQueryPrefill({
    setMode: (m) => setMode(m),
    setPrompt: (p) => setPrompt(p),
    setSelectedCharacterId: (id) => setSelectedCharacterId(id),
    setAspect: (a) => setAspect(a),
    setSeed: (n) => setSeed(n),
  });

  // clean up blob URLs to avoid memory leaks
  useEffect(() => {
    return () => {
      for (const r of results) {
        if (r.url?.startsWith("blob:")) URL.revokeObjectURL(r.url);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const characterOptions = useMemo(
    () => [
      { id: "nova", label: "Nova" },
      { id: "luxe", label: "Luxe" },
      { id: "cipher", label: "Cipher" },
      { id: "aria", label: "Aria" },
      { id: "vega", label: "Vega" },
      { id: "ember", label: "Ember" },
      { id: "onyx", label: "Onyx" },
      { id: "seraph", label: "Seraph" },
      { id: "dahlia", label: "Dahlia" },
      { id: "nyx", label: "Nyx" },
      { id: "solaris", label: "Solaris" },
      { id: "faye", label: "Faye" },
      { id: "riven", label: "Riven" },
      { id: "astra", label: "Astra" },
      { id: "echo", label: "Echo" },
      { id: "marrow", label: "Marrow" },
    ],
    []
  );

  async function onGenerate() {
    if (!canGenerate) return;

    if (mode === "video") {
      const info: GenResult = {
        id: `info_${Date.now()}`,
        mode,
        prompt,
        character: selectedCharacterId,
        aspect,
        seed,
        error: "Video generation is coming soon. (UI is ready — backend endpoint will be wired next.)",
        createdAt: new Date().toISOString(),
      };
      setResults((prev) => [info, ...prev]);
      setActive(info);
      return;
    }

    // image
    setIsGenerating(true);
    try {
      const { width, height } = aspectToSize(aspect);

      const r = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          width,
          height,
          num_inference_steps: steps,
          guidance_scale: guidance,
          seed,
        }),
      });

      const ct = r.headers.get("content-type") || "";

      if (!r.ok && ct.includes("application/json")) {
        const data = await r.json().catch(() => ({}));
        const errMsg = data?.error || data?.message || `Generate failed (${r.status})`;
        const fail: GenResult = {
          id: `err_${Date.now()}`,
          mode,
          prompt,
          character: selectedCharacterId,
          aspect,
          seed,
          error: errMsg,
          createdAt: new Date().toISOString(),
        };
        setResults((prev) => [fail, ...prev]);
        setActive(fail);
        return;
      }

      if (!r.ok) {
        const fail: GenResult = {
          id: `err_${Date.now()}`,
          mode,
          prompt,
          character: selectedCharacterId,
          aspect,
          seed,
          error: `Generate failed (${r.status})`,
          createdAt: new Date().toISOString(),
        };
        setResults((prev) => [fail, ...prev]);
        setActive(fail);
        return;
      }

      if (ct.startsWith("image/") || ct.includes("octet-stream")) {
        const bytes = await r.arrayBuffer();
        const blob = new Blob([bytes], { type: ct.startsWith("image/") ? ct : "image/png" });
        const url = URL.createObjectURL(blob);

        const ok: GenResult = {
          id: `gen_${Date.now()}`,
          mode,
          prompt,
          character: selectedCharacterId,
          aspect,
          seed,
          url,
          createdAt: new Date().toISOString(),
        };

        setResults((prev) => [ok, ...prev]);
        setActive(ok);
        return;
      }

      const text = await r.text().catch(() => "");
      const fail: GenResult = {
        id: `err_${Date.now()}`,
        mode,
        prompt,
        character: selectedCharacterId,
        aspect,
        seed,
        error: `Unexpected response (${ct || "no content-type"}): ${text.slice(0, 120)}`,
        createdAt: new Date().toISOString(),
      };
      setResults((prev) => [fail, ...prev]);
      setActive(fail);
    } catch (e: any) {
      const fail: GenResult = {
        id: `err_${Date.now()}`,
        mode,
        prompt,
        character: selectedCharacterId,
        aspect,
        seed,
        error: e?.message ?? "Network error",
        createdAt: new Date().toISOString(),
      };
      setResults((prev) => [fail, ...prev]);
      setActive(fail);
    } finally {
      setIsGenerating(false);
    }
  }

  const primaryBtn =
    "inline-flex h-11 items-center justify-center rounded-full bg-gradient-to-r from-[#ff3bff] to-[#c56bfb] px-6 text-sm font-semibold text-white shadow-[0_0_30px_rgba(255,59,255,0.22)] hover:brightness-110 disabled:opacity-60";
  const outlineBtn =
    "inline-flex h-11 items-center justify-center rounded-full border border-[#c56bfb]/50 bg-white/5 px-6 text-sm font-semibold text-[#F4ECFF] hover:bg-white/10";

  return (
    <main className="relative mx-auto w-full max-w-6xl px-4 py-10">
      {!isLoggedIn || !hasStudioAccess ? (
        <section className="mx-auto max-w-2xl rounded-3xl border border-[#c56bfb]/40 bg-gradient-to-b from-[#0A0013] to-[#120021] p-8 text-center shadow-[0_0_70px_rgba(255,59,255,0.12)]">
          <h1 className="text-3xl font-semibold tracking-tight text-[#F4ECFF] md:text-4xl">
            Unlock NaughtyBotty Studio
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-[#C4B3D9]">
            Start a free 3-day Studio trial or upgrade your plan to generate images and videos.
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link href="/pricing" className={outlineBtn}>
              View Pricing
            </Link>
            <Link href="/login?next=/studio" className={primaryBtn}>
              Login / Create account
            </Link>
          </div>

          <div className="mt-6 text-xs text-[#C4B3D9]">
            Studio presets from character pages will auto-fill once you unlock access.
          </div>
        </section>
      ) : (
        <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          {/* Left: prompt + preview */}
          <div className="rounded-3xl border border-[#c56bfb]/30 bg-gradient-to-b from-[#0A0013] to-[#120021] p-6 shadow-[0_0_55px_rgba(255,59,255,0.08)]">
            <div className="flex items-center justify-between gap-3">
              <h1 className="text-2xl font-semibold tracking-tight text-[#F4ECFF] md:text-3xl">
                NaughtyBotty Studio
              </h1>

              <button onClick={doLogout} className={outlineBtn} type="button">
                Logout
              </button>
            </div>

            {/* Mode tabs */}
            <div className="mt-5 flex w-full items-center gap-2 rounded-full border border-[#c56bfb]/25 bg-white/5 p-1">
              {(["image", "video"] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMode(m)}
                  className={clsx(
                    "h-10 flex-1 rounded-full text-sm font-semibold transition",
                    mode === m
                      ? "bg-gradient-to-r from-[#ff3bff] to-[#c56bfb] text-white shadow-[0_0_25px_rgba(255,59,255,0.18)]"
                      : "text-[#C4B3D9] hover:text-[#F4ECFF]"
                  )}
                >
                  {m === "image" ? "Image" : "Video"}
                </button>
              ))}
            </div>

            <div className="mt-5">
              <label className="text-xs font-semibold text-[#C4B3D9]">Prompt</label>
              <textarea
                className="mt-2 w-full rounded-2xl border border-[#c56bfb]/25 bg-black/30 p-4 text-sm text-[#F4ECFF] outline-none placeholder:text-[#C4B3D9]/60 focus:border-[#ff3bff]/55"
                placeholder={mode === "video" ? "Describe your video scene..." : "Describe your image scene..."}
                rows={5}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
              <div className="mt-2 text-xs text-[#C4B3D9]">
                Synthetic-only. No real-person deepfakes.
              </div>
            </div>

            {/* Video options (placeholder UI) */}
            {mode === "video" && (
              <div className="mt-5 grid gap-4 rounded-2xl border border-[#c56bfb]/20 bg-white/5 p-4">
                <div className="grid gap-2">
                  <label className="text-xs font-semibold text-[#C4B3D9]">Duration</label>
                  <select
                    className="h-11 w-full rounded-2xl border border-[#c56bfb]/25 bg-black/30 px-3 text-sm text-[#F4ECFF] outline-none"
                    value={videoDuration}
                    onChange={(e) => setVideoDuration(Number(e.target.value))}
                  >
                    <option value={4}>4s</option>
                    <option value={6}>6s</option>
                    <option value={8}>8s</option>
                  </select>
                </div>

                <div className="grid gap-2">
                  <label className="text-xs font-semibold text-[#C4B3D9]">Model</label>
                  <select
                    className="h-11 w-full rounded-2xl border border-[#c56bfb]/25 bg-black/30 px-3 text-sm text-[#F4ECFF] outline-none"
                    value={videoModel}
                    onChange={(e) => setVideoModel(e.target.value)}
                  >
                    <option>Studio Video v1 (coming soon)</option>
                  </select>
                </div>

                <div className="text-xs text-[#C4B3D9]">
                  Video generation is being wired next. This panel is ready.
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-col gap-2 sm:flex-row">
                <button
                  className={primaryBtn}
                  type="button"
                  onClick={onGenerate}
                  disabled={!canGenerate}
                  title={mode === "video" ? "Video backend coming soon" : undefined}
                >
                  {isGenerating ? "Generating..." : mode === "video" ? "Generate Video" : "Generate"}
                </button>

                {active?.url ? (
                  <a
                    href={active.url}
                    download={`naughtybotty-${active.character || "scene"}-${active.id}.png`}
                    className={outlineBtn}
                  >
                    Download PNG
                  </a>
                ) : (
                  <button className={outlineBtn} type="button" disabled>
                    Download PNG
                  </button>
                )}
              </div>

              <div className="text-xs text-[#C4B3D9]">
                Character presets & deeper controls will expand here later.
              </div>
            </div>

            {/* Preview */}
            <div className="mt-7 rounded-3xl border border-[#c56bfb]/20 bg-black/25 p-4">
              <div className="mb-3 flex items-center justify-between">
                <div className="text-sm font-semibold text-[#F4ECFF]">Preview</div>
                {active?.createdAt ? (
                  <div className="text-xs text-[#C4B3D9]">
                    {new Date(active.createdAt).toLocaleString()}
                  </div>
                ) : null}
              </div>

              {active?.error ? (
                <div className="rounded-2xl border border-[#ff3bff]/30 bg-[#ff3bff]/10 p-4 text-sm text-[#F4ECFF]">
                  {active.error}
                </div>
              ) : active?.url ? (
                <div className="overflow-hidden rounded-2xl border border-[#c56bfb]/25 bg-black/40">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={active.url} alt="Generated" className="h-auto w-full" />
                </div>
              ) : (
                <div className="flex min-h-[220px] items-center justify-center rounded-2xl border border-dashed border-[#c56bfb]/25 bg-black/30 text-sm text-[#C4B3D9]">
                  Generate to see your output here.
                </div>
              )}
            </div>
          </div>

          {/* Right: controls + history */}
          <div className="rounded-3xl border border-[#c56bfb]/30 bg-gradient-to-b from-[#0A0013] to-[#120021] p-6 shadow-[0_0_55px_rgba(255,59,255,0.08)]">
            <div className="text-sm font-semibold text-[#F4ECFF]">Controls</div>

            <div className="mt-4 grid gap-4">
              <div className="grid gap-2">
                <label className="text-xs font-semibold text-[#C4B3D9]">Character</label>
                <select
                  className="h-11 w-full rounded-2xl border border-[#c56bfb]/25 bg-black/30 px-3 text-sm text-[#F4ECFF] outline-none"
                  value={selectedCharacterId}
                  onChange={(e) => setSelectedCharacterId(e.target.value)}
                >
                  {characterOptions.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid gap-2">
                <label className="text-xs font-semibold text-[#C4B3D9]">Aspect</label>
                <select
                  className="h-11 w-full rounded-2xl border border-[#c56bfb]/25 bg-black/30 px-3 text-sm text-[#F4ECFF] outline-none"
                  value={aspect}
                  onChange={(e) => setAspect(e.target.value)}
                  disabled={mode === "video"} // optional: keep UI consistent for now
                >
                  <option value="4:5">4:5 (portrait)</option>
                  <option value="16:9">16:9 (landscape)</option>
                  <option value="1:1">1:1 (square)</option>
                </select>
                {mode === "video" ? (
                  <div className="text-xs text-[#C4B3D9]">Video aspect will be wired later.</div>
                ) : null}
              </div>

              {mode === "image" ? (
                <>
                  <div className="grid gap-2">
                    <label className="text-xs font-semibold text-[#C4B3D9]">Steps</label>
                    <input
                      type="number"
                      className="h-11 w-full rounded-2xl border border-[#c56bfb]/25 bg-black/30 px-3 text-sm text-[#F4ECFF] outline-none"
                      value={steps}
                      onChange={(e) => setSteps(Number(e.target.value))}
                      min={1}
                      max={80}
                    />
                  </div>

                  <div className="grid gap-2">
                    <label className="text-xs font-semibold text-[#C4B3D9]">Guidance</label>
                    <input
                      type="number"
                      className="h-11 w-full rounded-2xl border border-[#c56bfb]/25 bg-black/30 px-3 text-sm text-[#F4ECFF] outline-none"
                      value={guidance}
                      onChange={(e) => setGuidance(Number(e.target.value))}
                      min={0}
                      max={30}
                      step={0.5}
                    />
                  </div>

                  <div className="grid gap-2">
                    <label className="text-xs font-semibold text-[#C4B3D9]">Seed</label>
                    <input
                      type="number"
                      className="h-11 w-full rounded-2xl border border-[#c56bfb]/25 bg-black/30 px-3 text-sm text-[#F4ECFF] outline-none"
                      value={seed}
                      onChange={(e) => setSeed(Number(e.target.value))}
                    />
                  </div>
                </>
              ) : (
                <div className="rounded-2xl border border-[#c56bfb]/20 bg-white/5 p-4 text-sm text-[#C4B3D9]">
                  Video controls will live here once the backend endpoint is live.
                  <div className="mt-2 text-xs">
                    Planned: frames, fps, motion strength, camera presets.
                  </div>
                </div>
              )}
            </div>

            <div className="mt-7 border-t border-white/10 pt-5">
              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold text-[#F4ECFF]">History</div>
                <button
                  type="button"
                  className="text-xs text-[#C4B3D9] hover:text-[#F4ECFF]"
                  onClick={() => {
                    // revoke existing blob URLs
                    for (const r of results) {
                      if (r.url?.startsWith("blob:")) URL.revokeObjectURL(r.url);
                    }
                    setResults([]);
                    setActive(null);
                  }}
                >
                  Clear
                </button>
              </div>

              <div className="mt-4 grid gap-3">
                {results.length === 0 ? (
                  <div className="rounded-2xl border border-[#c56bfb]/20 bg-black/25 p-4 text-sm text-[#C4B3D9]">
                    Your latest generations will appear here.
                  </div>
                ) : (
                  results.slice(0, 8).map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setActive(r)}
                      className={clsx(
                        "flex items-start gap-3 rounded-2xl border bg-black/25 p-3 text-left transition hover:brightness-110",
                        active?.id === r.id ? "border-[#ff3bff]/50" : "border-[#c56bfb]/20"
                      )}
                    >
                      <div className="h-14 w-14 overflow-hidden rounded-xl border border-[#c56bfb]/20 bg-black/30">
                        {r.url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={r.url} alt="" className="h-full w-full object-cover" />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-[10px] text-[#C4B3D9]">
                            {r.mode.toUpperCase()}
                          </div>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-3">
                          <div className="truncate text-sm font-semibold text-[#F4ECFF]">
                            {r.character ? r.character.toUpperCase() : "SCENE"}
                          </div>
                          <div className="text-[10px] text-[#C4B3D9]">{r.aspect || ""}</div>
                        </div>
                        <div className="mt-1 line-clamp-2 text-xs text-[#C4B3D9]">{r.prompt}</div>
                        {r.error ? (
                          <div className="mt-1 text-xs text-[#ff7bd6]">{r.error}</div>
                        ) : null}
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
