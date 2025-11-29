"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ImageViewerModal } from "@/components/ui/ImageViewerModal";

function enc(s: string) {
  return encodeURIComponent(s);
}

function studioUrl(opts: {
  mode: "image" | "remix";
  character: string;
  prompt?: string;
  aspect?: "4:5" | "16:9" | "1:1";
  seed?: number;
}) {
  const p = new URLSearchParams();
  p.set("mode", opts.mode);
  p.set("character", opts.character);
  if (opts.prompt) p.set("prompt", enc(opts.prompt));
  if (opts.aspect) p.set("aspect", opts.aspect);
  if (opts.seed) p.set("seed", String(opts.seed));
  return `/studio?${p.toString()}`;
}

export default function NovaProfilePage() {
  const [open, setOpen] = useState(false);
  const [activeSrc, setActiveSrc] = useState<string | null>(null);
  const [activeTitle, setActiveTitle] = useState<string>("");

  const novaPrompt = useMemo(() => {
    return [
      "CIPHER — cyberpunk photoreal woman, electric confidence, neon reflections, chrome accents, futuristic bokeh",
      "asymmetrical cyberpunk hair, neon dual lighting (blue/magenta), confident smirk, sharp jawline, neon-lit almond eyes",
      "hyperreal, neon cyberpunk, reflective chrome, holographic accents, cinematic bokeh, electric ambience, ultra-detailed",
      "embedding keyword: CIPHER-core, signature colours #00CFFF #FF2FD0 #C0C8D0",
    ].join(", ");
  }, []);

  const heroPortrait = "/assets/characters/cipher/portrait.png";

  const gallery = useMemo(() => {
    return Array.from({ length: 12 }).map((_, i) => {
      const idx = String(i + 1).padStart(2, "0");
      return {
        key: `cipher-${idx}`,
        title: `Cipher Gallery #${idx}`,
        src: `/assets/characters/cipher/${idx}.png`,
      };
    });
  }, []);

  return (
    <main className="relative mx-auto w-full max-w-6xl px-4 py-10">
      {/* HERO */}
      <section className="relative overflow-hidden rounded-3xl border border-[#c56bfb]/40 bg-gradient-to-b from-[#0A0013] to-[#120021] p-6 shadow-[0_0_70px_rgba(255,59,255,0.12)] md:p-10">
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
            style={{
              background:
                "radial-gradient(circle, rgba(255,59,255,0.18), rgba(0,207,255,0.10), transparent 65%)",
            }}
          />
        </div>

        <div className="relative z-10 flex flex-col items-center text-center">
          <h1 className="text-5xl font-semibold tracking-tight md:text-6xl">
            <span className="bg-gradient-to-r from-[#ff3bff] via-[#c56bfb] to-[#00cfff] bg-clip-text text-transparent">
              CIPHER
            </span>
          </h1>
          <p className="mt-2 text-base text-[#C4B3D9] md:text-lg">“The future isn’t coming. I am.”</p>

          <div className="mt-7 w-full max-w-[520px]">
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl border border-white/10 bg-black/20 shadow-[0_0_60px_rgba(0,207,255,0.10)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={heroPortrait}
                alt="Cipher portrait"
                className="h-full w-full object-cover"
                onError={(e) => {
                  // fallback to placeholder text if missing
                  (e.currentTarget as HTMLImageElement).style.display = "none";
                  const parent = e.currentTarget.parentElement;
                  if (parent && !parent.querySelector("[data-fallback='1']")) {
                    const d = document.createElement("div");
                    d.setAttribute("data-fallback", "1");
                    d.className = "flex h-full w-full items-center justify-center text-sm text-[#C4B3D9]";
                    d.textContent = "Cipher portrait placeholder (add portrait.png)";
                    parent.appendChild(d);
                  }
                }}
              />
            </div>

            <div className="mt-5 flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
              <Link
                href={studioUrl({
                  mode: "image",
                  character: "cipher",
                  prompt: novaPrompt,
                  aspect: "4:5",
                  seed: 20251201,
                })}
                className="inline-flex h-11 items-center justify-center rounded-full bg-gradient-to-r from-[#ff3bff] to-[#c56bfb] px-6 text-sm font-semibold text-white shadow-[0_0_30px_rgba(255,59,255,0.22)] hover:brightness-110"
              >
                Generate With Cipher
              </Link>

              <Link
                href={studioUrl({
                  mode: "remix",
                  character: "cipher",
                  prompt: novaPrompt,
                  aspect: "4:5",
                  seed: 20251201,
                })}
                className="inline-flex h-11 items-center justify-center rounded-full border border-[#c56bfb]/50 bg-white/5 px-6 text-sm font-semibold text-[#F4ECFF] hover:bg-white/10"
              >
                Remix Cipher
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CARDS */}
      <section className="mt-8 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-black/20 p-5 shadow-[0_0_26px_rgba(255,0,255,0.06)]">
          <div className="text-sm font-semibold text-[#F4ECFF]">Identity</div>
          <div className="mt-3 space-y-2 text-sm text-[#C4B3D9]">
            <div>
              <span className="text-[#F4ECFF]">Style:</span> Cyberpunk Photoreal
            </div>
            <div>
              <span className="text-[#F4ECFF]">Energy:</span> Bold, electric, confident
            </div>
            <div>
              <span className="text-[#F4ECFF]">Visual Vibe:</span> Neon reflections, chrome accents, futuristic bokeh
            </div>
            <div>
              <span className="text-[#F4ECFF]">Signature Look:</span> Asymmetrical cyberpunk hair + neon dual lighting (blue/magenta)
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/20 p-5 shadow-[0_0_26px_rgba(255,0,255,0.06)]">
          <div className="text-sm font-semibold text-[#F4ECFF]">Personality</div>
          <div className="mt-3 space-y-2 text-sm text-[#C4B3D9]">
            <div>
              <span className="text-[#F4ECFF]">Vibe:</span> Electric confidence with playful teasing
            </div>
            <div>
              <span className="text-[#F4ECFF]">Interaction Style:</span> Sharp one-liners, flirty but controlled
            </div>
            <div>
              <span className="text-[#F4ECFF]">Fantasy Direction (SFW):</span> neon rooftops, hologram lounges, digital skylines, cyber alleys
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/20 p-5 shadow-[0_0_26px_rgba(255,0,255,0.06)]">
          <div className="text-sm font-semibold text-[#F4ECFF]">Recommended Generation Settings</div>
          <div className="mt-3 space-y-3 text-sm text-[#C4B3D9]">
            <div>
              <div className="text-[#F4ECFF]">Aspect Ratios</div>
              <div className="mt-1">4:5 (portrait), 16:9 (landscape), 1:1 (close-up)</div>
            </div>
            <div>
              <div className="text-[#F4ECFF]">Lighting Styles</div>
              <div className="mt-1">Neon rim-light (blue + magenta), chrome warm fill, electric ambient</div>
            </div>
            <div>
              <div className="text-[#F4ECFF]">Style Modifiers</div>
              <div className="mt-1">
                hyperreal, neon cyberpunk, reflective chrome, holographic accents, cinematic bokeh, electric ambience, ultra-detailed
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-[#c56bfb]/30 bg-gradient-to-b from-black/25 to-black/10 p-5 shadow-[0_0_36px_rgba(197,107,251,0.10)]">
          <div className="text-sm font-semibold text-[#F4ECFF]">Consistency Settings</div>
          <div className="mt-3 space-y-2 text-sm text-[#C4B3D9]">
            <div>
              <span className="text-[#F4ECFF]">Embedding Keyword:</span> CIPHER-core
            </div>
            <div>
              <span className="text-[#F4ECFF]">Face Structure Notes:</span> sharp jawline, neon-lit almond eyes, short asymmetrical cyberpunk hair, confident smirk
            </div>
            <div>
              <span className="text-[#F4ECFF]">Signature Colours:</span> Neon Blue #00CFFF, Magenta #FF2FD0, Chrome Silver #C0C8D0
            </div>
            <div>
              <span className="text-[#F4ECFF]">Suggested Seed:</span> 20251201
            </div>
          </div>
        </div>
      </section>

      {/* GALLERY */}
      <section className="mt-9">
        <div className="mb-3 text-sm font-semibold text-[#F4ECFF]">Cipher Gallery</div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {gallery.map((g) => (
            <div key={g.key} className="rounded-2xl border border-white/10 bg-black/20 p-3">
              <button
                type="button"
                onClick={() => {
                  setActiveSrc(g.src);
                  setActiveTitle(g.title);
                  setOpen(true);
                }}
                className="group relative w-full overflow-hidden rounded-2xl border border-white/10 bg-black/20"
              >
                <div className="aspect-[4/5] w-full">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={g.src ?? ""}
                    alt={g.title}
                    className="h-full w-full object-cover transition duration-200 group-hover:brightness-110"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.display = "none";
                      const parent = e.currentTarget.parentElement;
                      if (parent && !parent.querySelector("[data-fallback='1']")) {
                        const d = document.createElement("div");
                        d.setAttribute("data-fallback", "1");
                        d.className = "flex h-full w-full items-center justify-center text-sm text-[#C4B3D9]";
                        d.textContent = "Placeholder (add 01.png–12.png)";
                        parent.appendChild(d);
                      }
                    }}
                  />
                </div>
                <div
                  className="absolute inset-0 opacity-0 transition duration-200 group-hover:opacity-100"
                  style={{ boxShadow: "0 0 0 2px rgba(255,59,255,0.22), 0 0 40px rgba(197,107,251,0.18)" }}
                />
              </button>

              <div className="mt-3 grid gap-2">
                <Link
                  href={studioUrl({ mode: "image", character: "cipher", prompt: novaPrompt, aspect: "4:5", seed: 20251201 })}
                  className="inline-flex h-10 items-center justify-center rounded-xl bg-gradient-to-r from-[#ff3bff] to-[#c56bfb] text-xs font-semibold text-white hover:brightness-110"
                >
                  Generate More Like This
                </Link>

                <Link
                  href={studioUrl({ mode: "remix", character: "cipher", prompt: novaPrompt, aspect: "4:5", seed: 20251201 })}
                  className="inline-flex h-10 items-center justify-center rounded-xl border border-[#c56bfb]/50 bg-white/5 text-xs font-semibold text-[#F4ECFF] hover:bg-white/10"
                >
                  Use As Base Image
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* STORY */}
      <section className="mt-10 rounded-3xl border border-white/10 bg-gradient-to-b from-black/25 to-black/10 p-7 text-center shadow-[0_0_40px_rgba(0,207,255,0.08)]">
        <div className="text-sm font-semibold text-[#F4ECFF]">Cipher’s Story</div>
        <p className="mx-auto mt-4 max-w-3xl text-[15px] leading-relaxed text-[#C4B3D9]">
          CIPHER steps out of the neon haze with a confidence that vibrates through the air like a quiet current. Chrome
          reflections chase her movements, and every glance she gives feels like a challenge. In a city built from light
          and electricity, she walks as if she owns every circuit.
        </p>
      </section>

      {/* MONETISATION HOOKS */}
      <section className="mt-8 rounded-2xl border border-white/10 bg-black/20 p-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="text-sm font-semibold text-[#F4ECFF]">Upgrade Cipher</div>
          <div className="flex flex-wrap gap-2">
            {["Unlock Cipher’s Premium Neon Scenes", "Streamer Mode Presets", "Arcade Night Pack", "Pastel Cyber Variants"].map(
              (t) => (
                <Link
                  key={t}
                  href="/pricing"
                  className="inline-flex h-10 items-center justify-center rounded-full bg-gradient-to-r from-[#ff3bff] to-[#c56bfb] px-4 text-xs font-semibold text-white shadow-[0_0_22px_rgba(255,59,255,0.18)] hover:brightness-110"
                >
                  {t}
                </Link>
              )
            )}
          </div>
        </div>
      </section>

      <ImageViewerModal open={open} src={activeSrc} title={activeTitle} onClose={() => setOpen(false)} />
    </main>
  );
}
