"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { CharacterProfile } from "@/data/characterProfiles";

function clsx(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

function buildStudioUrl(opts: {
  mode: "image" | "remix";
  character: string;
  seed?: number;
  aspect?: string;
  prompt?: string;
  baseImageUrl?: string;
}) {
  const u = new URL("/studio", "http://local");
  u.searchParams.set("mode", opts.mode);
  u.searchParams.set("character", opts.character);
  if (opts.seed !== undefined) u.searchParams.set("seed", String(opts.seed));
  if (opts.aspect) u.searchParams.set("aspect", opts.aspect);
  if (opts.prompt) u.searchParams.set("prompt", opts.prompt);
  if (opts.baseImageUrl) u.searchParams.set("base", opts.baseImageUrl);
  return u.pathname + u.search;
}

export default function CharacterProfileClient({ profile }: { profile: CharacterProfile }) {
  const [activeSrc, setActiveSrc] = useState<string | null>(null);

  const portraitSrc = `/assets/characters/${profile.id}/portrait.png`;

  const tiles = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => {
      const idx = i + 1;
      const src = `/assets/characters/${profile.id}/gallery/${pad2(idx)}.png`;
      return { idx, src };
    });
  }, [profile.id]);

  const gradientHeading =
    "bg-gradient-to-r from-[#ff3bff] via-[#c56bfb] to-[#47d6ff] bg-clip-text text-transparent";

  return (
    <main className="relative mx-auto w-full max-w-6xl px-4 py-10">
      {/* HERO */}
      <section className="mx-auto max-w-4xl text-center">
        <h1 className={clsx("text-5xl font-semibold tracking-tight md:text-6xl", gradientHeading)}>
          {profile.name}
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-[#C4B3D9] md:text-base">
          “{profile.tagline}”
        </p>

        <div className="relative mx-auto mt-8 w-full max-w-sm">
          <div className="pointer-events-none absolute -inset-8 rounded-[3rem] bg-[radial-gradient(circle_at_center,rgba(255,59,255,0.22),rgba(197,107,251,0.10),transparent_60%)] blur-2xl" />
          <div className="relative overflow-hidden rounded-3xl border border-[#c56bfb]/40 bg-black/20 shadow-[0_0_80px_rgba(255,59,255,0.14)]">
            <div className="aspect-[4/5] w-full">
              {/* Use <img> so missing assets just show placeholder text */}
              <img
                src={portraitSrc}
                alt={`${profile.name} portrait`}
                className="h-full w-full object-cover"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = "none";
                }}
              />
              <div className="flex h-full w-full items-center justify-center px-6 text-center text-xs text-[#C4B3D9]">
                {profile.name.charAt(0) + profile.name.slice(1).toLowerCase()} portrait placeholder (add portrait.png)
              </div>
            </div>
          </div>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              href={buildStudioUrl({
                mode: "image",
                character: profile.id,
                seed: profile.consistency.suggestedSeed,
                aspect: "4:5",
              })}
              className="inline-flex h-11 min-w-[220px] items-center justify-center rounded-full bg-gradient-to-r from-[#ff3bff] to-[#c56bfb] px-6 text-sm font-semibold text-white shadow-[0_0_30px_rgba(255,59,255,0.22)] transition hover:brightness-110 active:translate-y-[1px]"
            >
              Generate With {profile.name.charAt(0) + profile.name.slice(1).toLowerCase()}
            </Link>

            <Link
              href={buildStudioUrl({
                mode: "remix",
                character: profile.id,
                seed: profile.consistency.suggestedSeed,
                aspect: "4:5",
              })}
              className="inline-flex h-11 min-w-[220px] items-center justify-center rounded-full border border-[#c56bfb]/55 bg-white/5 px-6 text-sm font-semibold text-[#F4ECFF] transition hover:bg-white/10 active:translate-y-[1px]"
            >
              Remix {profile.name.charAt(0) + profile.name.slice(1).toLowerCase()}
            </Link>
          </div>
        </div>
      </section>

      {/* INFO CARDS */}
      <section className="mx-auto mt-10 grid max-w-6xl grid-cols-1 gap-4 md:grid-cols-2">
        <Card title="Identity">
          <KV k="Style" v={profile.identity.style} />
          <KV k="Energy" v={profile.identity.energy} />
          <KV k="Visual Vibe" v={profile.identity.visualVibe} />
          <KV k="Signature Look" v={profile.identity.signatureLook} />
        </Card>

        <Card title="Personality">
          <KV k="Vibe" v={profile.personality.vibe} />
          <KV k="Interaction Style" v={profile.personality.interactionStyle} />
          <KV k="Fantasy Direction (SFW)" v={profile.personality.fantasyDirection} />
        </Card>

        <Card title="Recommended Generation Settings">
          <SubTitle>Aspect Ratios</SubTitle>
          <Bullets items={profile.recommended.aspectRatios} />
          <SubTitle className="mt-4">Lighting Styles</SubTitle>
          <Bullets items={profile.recommended.lightingStyles} />
          <SubTitle className="mt-4">Style Modifiers</SubTitle>
          <Pills items={profile.recommended.styleModifiers} />
        </Card>

        <Card title="Consistency Settings">
          <KV k="Embedding Keyword" v={profile.consistency.embeddingKeyword} mono />
          <KV k="Face Structure Notes" v={profile.consistency.faceStructureNotes} />
          <div className="mt-3 grid grid-cols-1 gap-2">
            <div className="text-xs font-semibold text-[#F4ECFF]">Signature Colours</div>
            <div className="flex flex-wrap gap-2">
              {profile.consistency.signatureColours.map((c) => (
                <span
                  key={c.hex}
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-[#C4B3D9]"
                >
                  <span
                    className="h-3 w-3 rounded-full border border-white/15"
                    style={{ backgroundColor: c.hex }}
                  />
                  <span className="text-[#F4ECFF]">{c.name}</span>
                  <span className="font-mono">{c.hex}</span>
                </span>
              ))}
            </div>
          </div>
          <KV k="Suggested Seed" v={String(profile.consistency.suggestedSeed)} mono />
        </Card>
      </section>

      {/* GALLERY */}
      <section className="mx-auto mt-10 max-w-6xl">
        <h2 className="text-xl font-semibold text-[#F4ECFF]">
          {profile.name.charAt(0) + profile.name.slice(1).toLowerCase()} Gallery
        </h2>
        <p className="mt-1 text-sm text-[#C4B3D9]">
          Placeholders (add 01.png–12.png). Click tiles to preview.
        </p>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {tiles.map((t) => (
            <div
              key={t.idx}
              className="group overflow-hidden rounded-3xl border border-[#c56bfb]/30 bg-black/15 shadow-[0_0_40px_rgba(255,0,255,0.06)] transition hover:shadow-[0_0_60px_rgba(255,59,255,0.14)]"
            >
              <button
                type="button"
                onClick={() => setActiveSrc(t.src)}
                className="relative block w-full text-left"
              >
                <div className="aspect-[3/4] w-full">
                  <img
                    src={t.src}
                    alt={`${profile.name} gallery ${t.idx}`}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.display = "none";
                    }}
                  />
                  <div className="flex h-full w-full items-center justify-center px-5 text-center text-xs text-[#C4B3D9]">
                    Placeholder (add {pad2(t.idx)}.png)
                  </div>
                </div>
                <div className="pointer-events-none absolute inset-0 opacity-0 transition group-hover:opacity-100">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,59,255,0.18),transparent_55%)]" />
                </div>
              </button>

              <div className="flex flex-col gap-2 p-3">
                <Link
                  href={buildStudioUrl({
                    mode: "image",
                    character: profile.id,
                    seed: profile.consistency.suggestedSeed,
                    aspect: "4:5",
                    prompt: profile.recommended.styleModifiers.join(", "),
                  })}
                  className="inline-flex h-10 items-center justify-center rounded-full bg-gradient-to-r from-[#ff3bff] to-[#c56bfb] text-xs font-semibold text-white transition hover:brightness-110 active:translate-y-[1px]"
                >
                  Generate More Like This
                </Link>

                <Link
                  href={buildStudioUrl({
                    mode: "remix",
                    character: profile.id,
                    seed: profile.consistency.suggestedSeed,
                    aspect: "4:5",
                    baseImageUrl: t.src,
                  })}
                  className="inline-flex h-10 items-center justify-center rounded-full border border-[#c56bfb]/55 bg-white/5 text-xs font-semibold text-[#F4ECFF] transition hover:bg-white/10 active:translate-y-[1px]"
                >
                  Use As Base Image
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* STORY */}
      <section className="mx-auto mt-10 max-w-5xl rounded-3xl border border-white/10 bg-black/15 p-8 text-center shadow-[0_0_70px_rgba(255,59,255,0.08)]">
        <h2 className={clsx("text-2xl font-semibold", gradientHeading)}>{profile.story.title}</h2>
        <p className="mx-auto mt-4 max-w-3xl text-sm leading-relaxed text-[#C4B3D9] md:text-base">
          {profile.story.body}
        </p>
      </section>

      {/* UPGRADE STRIP */}
      <section className="mx-auto mt-6 max-w-6xl rounded-3xl border border-white/10 bg-black/10 p-4">
        <div className="flex flex-wrap justify-center gap-2">
          {profile.upgrades.map((label) => (
            <Link
              key={label}
              href="/pricing"
              className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#ff3bff] to-[#c56bfb] px-4 py-2 text-xs font-semibold text-white shadow-[0_0_24px_rgba(255,59,255,0.12)] transition hover:brightness-110 active:translate-y-[1px]"
            >
              {label}
            </Link>
          ))}
        </div>
      </section>

      {/* MODAL */}
      {activeSrc ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          onClick={() => setActiveSrc(null)}
        >
          <div
            className="w-full max-w-3xl overflow-hidden rounded-3xl border border-[#c56bfb]/40 bg-[#0A0013] shadow-[0_0_80px_rgba(255,59,255,0.18)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
              <div className="text-sm font-semibold text-[#F4ECFF]">Preview</div>
              <button
                type="button"
                onClick={() => setActiveSrc(null)}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-[#F4ECFF] hover:bg-white/10"
              >
                Close
              </button>
            </div>
            <div className="p-4">
              <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/20">
                <img src={activeSrc} alt="Preview" className="h-full w-full object-contain" />
              </div>
              <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-end">
                <Link
                  href={buildStudioUrl({
                    mode: "image",
                    character: profile.id,
                    seed: profile.consistency.suggestedSeed,
                    aspect: "4:5",
                    prompt: profile.recommended.styleModifiers.join(", "),
                  })}
                  className="inline-flex h-10 items-center justify-center rounded-full bg-gradient-to-r from-[#ff3bff] to-[#c56bfb] px-5 text-xs font-semibold text-white hover:brightness-110"
                >
                  Generate More Like This
                </Link>
                <Link
                  href={buildStudioUrl({
                    mode: "remix",
                    character: profile.id,
                    seed: profile.consistency.suggestedSeed,
                    aspect: "4:5",
                    baseImageUrl: activeSrc,
                  })}
                  className="inline-flex h-10 items-center justify-center rounded-full border border-[#c56bfb]/55 bg-white/5 px-5 text-xs font-semibold text-[#F4ECFF] hover:bg-white/10"
                >
                  Use As Base Image
                </Link>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-black/15 p-6 shadow-[0_0_60px_rgba(255,0,255,0.06)]">
      <div className="text-sm font-semibold text-[#F4ECFF]">{title}</div>
      <div className="mt-4 space-y-3">{children}</div>
    </div>
  );
}

function KV({ k, v, mono }: { k: string; v: string; mono?: boolean }) {
  return (
    <div>
      <div className="text-xs font-semibold text-[#F4ECFF]">{k}</div>
      <div className={clsx("mt-1 text-sm text-[#C4B3D9]", mono && "font-mono text-xs")}>{v}</div>
    </div>
  );
}

function SubTitle({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={clsx("text-xs font-semibold text-[#F4ECFF]", className)}>{children}</div>;
}

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="mt-2 space-y-2 text-sm text-[#C4B3D9]">
      {items.map((x) => (
        <li key={x} className="flex gap-2">
          <span className="mt-[6px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#ff3bff]" />
          <span>{x}</span>
        </li>
      ))}
    </ul>
  );
}

function Pills({ items }: { items: string[] }) {
  return (
    <div className="mt-2 flex flex-wrap gap-2">
      {items.map((x) => (
        <span
          key={x}
          className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-[#C4B3D9]"
        >
          {x}
        </span>
      ))}
    </div>
  );
}
