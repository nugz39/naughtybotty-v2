"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useStudioQueryPrefill } from "@/hooks/useStudioQueryPrefill";

type Mode = "image" | "video" | "remix";

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
      const sa = localStorage.getItem("nb_studio_access") === "true";
      setIsLoggedIn(li);
      setHasStudioAccess(li && sa);
    } catch {}
  }, []);

  // ---- studio state
  const [mode, setMode] = useState<Mode>("image");
  const [prompt, setPrompt] = useState("");
  const [selectedCharacterId, setSelectedCharacterId] = useState<string>("nova");
  const [aspect, setAspect] = useState<string>("4:5");
  const [seed, setSeed] = useState<number>(20251201);

  const [steps, setSteps] = useState<number>(16);
  const [guidance, setGuidance] = useState<number>(7.5);

  // Remix-only controls
  const [baseImage, setBaseImage] = useState<File | null>(null);
  const [strength, setStrength] = useState<number>(0.65);

  const [isGenerating, setIsGenerating] = useState(false);
  const [results, setResults] = useState<GenResult[]>([]);
  const [active, setActive] = useState<GenResult | null>(null);

  const canGenerate =
    prompt.trim().length > 0 &&
    !isGenerating &&
    (mode !== "remix" || !!baseImage);

  // ---- Prefill from URL query (uses useSearchParams internally)
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

    setIsGenerating(true);
    try {
      const { width, height } = aspectToSize(aspect);

      // ---- VIDEO (still backend dependent)
      if (mode === "video") {
        const r = await fetch("/api/generate-video", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prompt,
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

        if (ct.startsWith("video/") || ct.includes("octet-stream")) {
          const bytes = await r.arrayBuffer();
          const blob = new Blob([bytes], { type: ct.startsWith("video/") ? ct : "video/mp4" });
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
          error: `Unexpected response (${ct || "no content-type"}): ${text.slice(0, 160)}`,
          createdAt: new Date().toISOString(),
        };
        setResults((prev) => [fail, ...prev]);
        setActive(fail);
        return;
      }

      // ---- REMIX (image-to-image)
      if (mode === "remix") {
        if (!baseImage) return;

        const fd = new FormData();
        fd.set("prompt", prompt);
        fd.set("strength", String(strength));
        fd.set("width", String(width));
        fd.set("height", String(height));
        fd.set("num_inference_steps", String(steps));
        fd.set("guidance_scale", String(guidance));
        fd.set("seed", String(seed));
        fd.set("image", baseImage);

        const r = await fetch("/api/remix", { method: "POST", body: fd });
        const ct = r.headers.get("content-type") || "";

        if (!r.ok && ct.includes("application/json")) {
          const data = await r.json().catch(() => ({}));
          const errMsg = data?.error || data?.message || `Remix failed (${r.status})`;
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
            error: `Remix failed (${r.status})`,
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
          error: `Unexpected response (${ct || "no content-type"}): ${text.slice(0, 160)}`,
          createdAt: new Date().toISOString(),
        };
        setResults((prev) => [fail, ...prev]);
        setActive(fail);
        return;
      }

      // ---- IMAGE (text-to-image)
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
        error: `Unexpected response (${ct || "no content-type"}): ${text.slice(0, 160)}`,
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
            <Link
              href="/pricing"
              className="inline-flex h-11 items-center justify-center rounded-full border border-[#c56bfb]/50 bg-white/5 px-6 text-sm font-semibold text-[#F4ECFF] hover:bg-white/10"
            >
              View Pricing
            </Link>
            <Link
              href="/login?next=/studio"
              className="inline-flex h-11 items-center justify-center rounded-full bg-gradient-to-r from-[#ff3bff] to-[#c56bfb] px-6 text-sm font-semibold text-white shadow-[0_0_30px_rgba(255,59,255,0.22)] hover:brightness-110"
            >
              Login / Create account
            </Link>
          </div>

          <div className="mt-6 text-xs text-[#C4B3D9]">
            Studio presets from character pages will auto-fill once you unlock access.
          </div>
        </section>
      ) : (
        <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          {/* LEFT */}
          <div className="rounded-3xl border border-[#c56bfb]/35 bg-white/5 p-6 shadow-[0_0_70px_rgba(255,59,255,0.08)]">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h1 className="text-3xl font-semibold tracking-tight text-[#F4ECFF]">
                  NaughtyBotty Studio
                </h1>
                <div className="mt-1 text-sm text-[#C4B3D9]">
                  Synthetic-only. No real-person deepfakes.
                </div>
              </div>

              <div className="flex gap-2">
                {(["image", "video", "remix"] as Mode[]).map((m) => (
                  <button
                    key={m}
                    onClick={() => setMode(m)}
                    className={clsx(
                      "h-9 rounded-full px-4 text-sm font-semibold transition",
                      mode === m
                        ? "bg-gradient-to-r from-[#ff3bff] to-[#c56bfb] text-white shadow-[0_0_22px_rgba(255,59,255,0.18)]"
                        : "border border-[#c56bfb]/45 bg-white/5 text-[#F4ECFF] hover:bg-white/10"
                    )}
                  >
                    {m === "image" ? "Image" : m === "video" ? "Video" : "Remix"}
                  </button>
                ))}
              </div>
            </div>

            {/* Prompt */}
            <div className="mt-6">
              <label className="text-xs font-semibold tracking-wide text-[#C4B3D9]">
                Prompt
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={
                  mode === "remix"
                    ? "Describe what to change/keep. e.g. NOVA-core, neon bokeh, chrome accents…"
                    : "Describe the scene…"
                }
                className="mt-2 h-32 w-full resize-none rounded-2xl border border-[#c56bfb]/30 bg-black/20 p-4 text-sm text-[#F4ECFF] outline-none placeholder:text-[#C4B3D9]/60 focus:border-[#ff3bff]/60"
              />
            </div>

            {/* Remix uploader */}
            {mode === "remix" && (
              <div className="mt-5 rounded-2xl border border-[#c56bfb]/25 bg-black/10 p-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="text-sm font-semibold text-[#F4ECFF]">Base image (PNG/JPG)</div>
                    <div className="text-xs text-[#C4B3D9]">
                      Upload an existing Nova image to keep face/identity consistent.
                    </div>
                  </div>

                  <input
                    type="file" data-remix-file="true"
                    accept="image/*"
                    onChange={(e) => setBaseImage(e.target.files?.[0] ?? null)}
                    className="w-full text-sm text-[#C4B3D9] file:mr-3 file:rounded-full file:border-0 file:bg-white/10 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-[#F4ECFF] hover:file:bg-white/15 sm:w-auto"
                  />
                </div>

                <div className="mt-4">
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-semibold text-[#C4B3D9]">Strength</div>
                    <div className="text-xs text-[#C4B3D9]">{strength.toFixed(2)}</div>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.01}
                    value={strength}
                    onChange={(e) => setStrength(Number(e.target.value))}
                    className="mt-2 w-full accent-[#ff3bff]"
                  />
                  <div className="mt-1 text-[11px] text-[#C4B3D9]/80">
                    Lower = preserves base image more. Higher = changes more.
                  </div>
                </div>
              </div>
            )}

            {/* Generate button */}
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <button
                onClick={onGenerate}
                disabled={!canGenerate}
                className={clsx(
                  "inline-flex h-11 items-center justify-center rounded-full px-6 text-sm font-semibold text-white transition",
                  canGenerate
                    ? "bg-gradient-to-r from-[#ff3bff] to-[#c56bfb] shadow-[0_0_30px_rgba(255,59,255,0.22)] hover:brightness-110 active:scale-[0.99]"
                    : "bg-white/10 text-white/50"
                )}
              >
                {isGenerating ? "Generating…" : mode === "video" ? "Generate Video" : mode === "remix" ? "Generate Remix" : "Generate"}
              </button>

              <div className="text-xs text-[#C4B3D9]">
                Tip: keep the same seed for consistency.
              </div>
            </div>

            {/* Active preview */}
            {active?.url && (
              <div className="mt-6 overflow-hidden rounded-3xl border border-[#c56bfb]/25 bg-black/20">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                {active.mode === "video" ? (
                  <video controls className="h-full w-full">
                    <source src={active.url} />
                  </video>
                ) : (
                  <img src={active.url} alt="Generated" className="h-full w-full object-cover" />
                )}
              </div>
            )}

            {active?.error && (
              <div className="mt-6 rounded-3xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-[#F4ECFF]">
                {active.error}
              </div>
            )}
          </div>

          {/* RIGHT */}
          <div className="rounded-3xl border border-[#c56bfb]/35 bg-white/5 p-6">
            <div className="text-sm font-semibold text-[#F4ECFF]">Controls</div>

            <div className="mt-4 grid gap-4">
              <div>
                <div className="text-xs font-semibold text-[#C4B3D9]">Character</div>
                <select
                  value={selectedCharacterId}
                  onChange={(e) => setSelectedCharacterId(e.target.value)}
                  className="mt-2 h-11 w-full rounded-2xl border border-[#c56bfb]/30 bg-black/20 px-4 text-sm text-[#F4ECFF] outline-none focus:border-[#ff3bff]/60"
                >
                  {characterOptions.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <div className="text-xs font-semibold text-[#C4B3D9]">Aspect</div>
                <div className="mt-2 flex gap-2">
                  {["4:5", "1:1", "16:9"].map((a) => (
                    <button
                      key={a}
                      onClick={() => setAspect(a)}
                      className={clsx(
                        "h-9 flex-1 rounded-full px-3 text-sm font-semibold transition",
                        aspect === a
                          ? "bg-white/10 text-[#F4ECFF] ring-1 ring-[#ff3bff]/35"
                          : "border border-[#c56bfb]/30 bg-black/10 text-[#C4B3D9] hover:bg-white/5"
                      )}
                    >
                      {a}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="text-xs font-semibold text-[#C4B3D9]">Steps</div>
                  <input
                    type="number"
                    value={steps}
                    min={1}
                    max={80}
                    onChange={(e) => setSteps(Number(e.target.value))}
                    className="mt-2 h-11 w-full rounded-2xl border border-[#c56bfb]/30 bg-black/20 px-4 text-sm text-[#F4ECFF] outline-none focus:border-[#ff3bff]/60"
                  />
                </div>
                <div>
                  <div className="text-xs font-semibold text-[#C4B3D9]">Guidance</div>
                  <input
                    type="number"
                    value={guidance}
                    step={0.1}
                    min={0}
                    max={30}
                    onChange={(e) => setGuidance(Number(e.target.value))}
                    className="mt-2 h-11 w-full rounded-2xl border border-[#c56bfb]/30 bg-black/20 px-4 text-sm text-[#F4ECFF] outline-none focus:border-[#ff3bff]/60"
                  />
                </div>
              </div>

              <div>
                <div className="text-xs font-semibold text-[#C4B3D9]">Seed</div>
                <input
                  type="number"
                  value={seed}
                  onChange={(e) => setSeed(Number(e.target.value))}
                  className="mt-2 h-11 w-full rounded-2xl border border-[#c56bfb]/30 bg-black/20 px-4 text-sm text-[#F4ECFF] outline-none focus:border-[#ff3bff]/60"
                />
              </div>

              <div className="rounded-2xl border border-[#c56bfb]/25 bg-black/10 p-4">
                <div className="text-xs font-semibold text-[#F4ECFF]">History</div>
                <div className="mt-3 space-y-3">
                  {results.slice(0, 6).map((r) => (
                    <button
                      key={r.id}
                      onClick={() => setActive(r)}
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-left text-xs text-[#C4B3D9] hover:bg-white/10"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-[#F4ECFF]">
                          {r.mode.toUpperCase()} • {r.character || "—"}
                        </span>
                        <span className="text-[10px] text-[#C4B3D9]/80">
                          {r.createdAt ? new Date(r.createdAt).toLocaleString() : ""}
                        </span>
                      </div>
                      <div className="mt-1 line-clamp-2">{r.prompt}</div>
                      {r.error && <div className="mt-1 text-red-300">{r.error}</div>}
                    </button>
                  ))}
                  {results.length === 0 && (
                    <div className="text-xs text-[#C4B3D9]">No generations yet.</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
