export type SignatureColour = { name: string; hex: string };

export type CharacterProfile = {
  id: string;
  name: string; // e.g. "NOVA"
  tagline: string;

  identity: {
    style: string;
    energy: string;
    visualVibe: string;
    signatureLook: string;
  };

  personality: {
    vibe: string;
    interactionStyle: string;
    fantasyDirection: string;
  };

  recommended: {
    aspectRatios: string[];
    lightingStyles: string[];
    styleModifiers: string[];
  };

  consistency: {
    embeddingKeyword: string;
    faceStructureNotes: string;
    signatureColours: SignatureColour[];
    suggestedSeed: number;
  };

  story: {
    title: string;
    body: string;
  };

  upgrades: string[];

  gallery: {
    title: string;
    firstTileSubtitle: string;
    placeholder: string;
  };

  portraitPlaceholder: string;
};

export const CHARACTER_PROFILES: Record<string, CharacterProfile> = {
  // =========================
  // PRIMARY (Nova template set)
  // =========================
  nova: {
    id: "nova",
    name: "NOVA",
    tagline: "The future isn’t coming. I am.",
    portraitPlaceholder: "Nova portrait placeholder (add nova-portrait.png)",
    identity: {
      style: "Cyberpunk Photoreal",
      energy: "Bold, electric, confident",
      visualVibe: "Neon reflections, chrome accents, futuristic bokeh",
      signatureLook: "Asymmetrical cyberpunk hair + neon dual lighting (blue/magenta)",
    },
    personality: {
      vibe: "Electric confidence with playful teasing",
      interactionStyle: "Sharp one-liners, flirty but controlled",
      fantasyDirection: "neon rooftops, hologram lounges, digital skylines, cyber alleys",
    },
    recommended: {
      aspectRatios: ["4:5 (portrait)", "16:9 (landscape)", "1:1 (close-up)"],
      lightingStyles: [
        "Neon rim-light (blue + magenta)",
        "chrome warm fill",
        "electric ambient",
      ],
      styleModifiers: [
        "hyperreal",
        "neon cyberpunk",
        "reflective chrome",
        "holographic accents",
        "cinematic bokeh",
        "electric ambience",
        "ultra-detailed",
      ],
    },
    consistency: {
      embeddingKeyword: "NOVA-core",
      faceStructureNotes:
        "sharp jawline, neon-lit almond eyes, short asymmetrical cyberpunk hair, confident smirk",
      signatureColours: [
        { name: "Neon Blue", hex: "#00CFFF" },
        { name: "Magenta", hex: "#FF2FD0" },
        { name: "Chrome Silver", hex: "#C0C8D0" },
      ],
      suggestedSeed: 20251201,
    },
    story: {
      title: "Nova’s Story",
      body:
        "NOVA steps out of the neon haze with a confidence that vibrates through the air like a quiet current. Chrome reflections chase her movements, and every glance she gives feels like a challenge. In a city built from light and electricity, she walks as if she owns every circuit.",
    },
    upgrades: [
      "Unlock Nova’s Premium Neon Scenes",
      "4K Ultra Mode",
      "Night City Pack",
      "Exclusive Neon Variants",
    ],
    gallery: {
      title: "Nova Gallery",
      firstTileSubtitle: "Nova Base Image",
      placeholder: "Placeholder (add nova-01.png–12.png)",
    },
  },

  luxe: {
    id: "luxe",
    name: "LUXE",
    tagline: "Sin wrapped in silk and soft neon.",
    portraitPlaceholder: "Luxe portrait placeholder (add luxe-portrait.png)",
    identity: {
      style: "Soft-neon alt-glam, stylised realism",
      energy: "Slow burn, seductive, self-possessed",
      visualVibe: "Velvet shadows, tattoos, sparkles of jewelry, studio-style bokeh",
      signatureLook:
        "Platinum-blonde waves, black lace or leather, ornate choker, soft magenta lighting on skin",
    },
    personality: {
      vibe: "Velvet-smooth, confident, a little dangerous but always in control",
      interactionStyle: "Low-voice flirt, teasing lines, always one step ahead",
      fantasyDirection:
        "Exclusive penthouse lounges, back-room private booths, designer hotel bars, mirror-lit dressing rooms",
    },
    recommended: {
      aspectRatios: ["4:5 (portraits)", "16:9 (cinematic club scenes)", "2:3 (fashion/editorial)"],
      lightingStyles: [
        "Soft pink + violet key light",
        "Rim light on hair and shoulders",
        "Occasional golden accent from “bar” light sources",
      ],
      styleModifiers: [
        "soft neon",
        "alt glam",
        "high-end fashion",
        "shallow depth of field",
        "creamy skin",
        "studio photography",
        "detailed tattoos",
        "cinematic bokeh",
        "glossy lips",
      ],
    },
    consistency: {
      embeddingKeyword: "LUXE-core",
      faceStructureNotes:
        "Sharp cheekbones, heart-shaped face, heavy eyeliner, full lips with gloss, relaxed half-smile",
      signatureColours: [
        { name: "Deep Plum", hex: "#2D0036" },
        { name: "Neon Pink", hex: "#FF4FA8" },
        { name: "Champagne Gold", hex: "#F5D3A8" },
      ],
      suggestedSeed: 20251202,
    },
    story: {
      title: "Luxe’s Story",
      body:
        "LUXE doesn’t chase attention—she expects it. She moves through velvet-lit rooms like she owns every couch, curtain, and glass in sight. Tattoos glow under the soft neon while diamonds catch the light when she turns her head. When Luxe looks straight at you, it feels like you’ve been hand-picked for something secret, expensive, and unforgettable.",
    },
    upgrades: [
      "Unlock Luxe’s Velvet Scenes",
      "Private Lounge Pack",
      "Exclusive Soft-Neon Variants",
      "4K Fashion Mode",
    ],
    gallery: {
      title: "Luxe Gallery",
      firstTileSubtitle: "Luxe Base Image",
      placeholder: "Placeholder (add luxe-01.png–12.png)",
    },
  },

  cipher: {
    id: "cipher",
    name: "CIPHER",
    tagline: "Every fantasy is a code. She loves cracking them.",
    portraitPlaceholder: "Cipher portrait placeholder (add cipher-portrait.png)",
    identity: {
      style: "High-end anime, pastel cyberpunk",
      energy: "Playful, elusive, clever",
      visualVibe: "Holographic city light, floating UI elements, soft gradients around her",
      signatureLook:
        "Long icy-mint or teal twin-tails, big luminous eyes, tech accessories (earpieces, holo-choker)",
    },
    personality: {
      vibe: "Hacker-girlfriend energy—sweet, but knows too much",
      interactionStyle: "Emojis, glitch metaphors, clever one-liners",
      fantasyDirection: "Neon rooftops, digital arcades, VR lounges, glowing city balconies at 3am",
    },
    recommended: {
      aspectRatios: ["3:4 (anime portraits)", "16:9 (anime scenes)", "1:1 (icon/avatars)"],
      lightingStyles: ["Cyan + pink rim light", "Ambient screen glow on face", "“Floating HUD” reflections"],
      styleModifiers: [
        "premium anime",
        "detailed linework",
        "glossy eyes",
        "soft gradients",
        "holographic UI",
        "cyberpunk city",
        "pastel lighting",
        "intricate hair highlights",
      ],
    },
    consistency: {
      embeddingKeyword: "CIPHER-core",
      faceStructureNotes: "Big almond eyes, small nose, heart-shaped mouth, slightly flushed cheeks",
      signatureColours: [
        { name: "Soft Cyan", hex: "#7CF5FF" },
        { name: "Pastel Pink", hex: "#FF9FD7" },
        { name: "Night Lilac", hex: "#241B3C" },
      ],
      suggestedSeed: 20251203,
    },
    story: {
      title: "Cipher’s Story",
      body:
        "CIPHER lives between loading screens and late-night rooftops. She reads people the way other girls read chat logs—fast, accurate, and a little too intimately. Neon code scrolls in the reflection of her eyes when she smiles. If you tell her your fantasy, she doesn’t blush—she just says, “Challenge accepted,” and starts rewriting reality.",
    },
    upgrades: [
      "Unlock Cipher’s Glitch Scenes",
      "Arcade Night Pack",
      "Pastel Cyber Variants",
      "Streamer Mode Presets",
    ],
    gallery: {
      title: "Cipher Gallery",
      firstTileSubtitle: "Cipher Base Image",
      placeholder: "Placeholder (add cipher-01.png–12.png)",
    },
  },

  aria: {
    id: "aria",
    name: "ARIA",
    tagline: "Sunset skin, midnight thoughts.",
    portraitPlaceholder: "Aria portrait placeholder (add aria-portrait.png)",
    identity: {
      style: "Stylised nightlife realism",
      energy: "Warm, inviting, slightly dangerous after midnight",
      visualVibe: "Sunset-to-neon gradient, glowing skin, soft haze",
      signatureLook:
        "Long dark wavy hair, glowing tan skin, fitted off-shoulder top, backlit by pink/orange panels",
    },
    personality: {
      vibe: "Party starter meets confidante—you want to follow her and tell her everything",
      interactionStyle: "Casual chatty tone, playful teasing, “you’re with me now” energy",
      fantasyDirection: "Rooftop bars, pool party after-hours, balcony views over a warm city",
    },
    recommended: {
      aspectRatios: ["4:5 (portraits)", "9:16 (stories/reels)", "16:9 (wide party shots)"],
      lightingStyles: ["Golden-pink sunset key light", "Deep magenta rim from behind", "Soft bloom around highlights"],
      styleModifiers: [
        "sunset neon",
        "cinematic nightlife",
        "warm skin tone",
        "soft focus background",
        "minimal grain",
        "glossy highlights",
        "bokeh lights",
      ],
    },
    consistency: {
      embeddingKeyword: "ARIA-core",
      faceStructureNotes:
        "Soft jawline, full lips, slightly arched brows, warm brown eyes, relaxed smile that can flip into a smirk",
      signatureColours: [
        { name: "Sunset Orange", hex: "#FF9966" },
        { name: "Neon Coral", hex: "#FF4F70" },
        { name: "Deep Plum", hex: "#270528" },
      ],
      suggestedSeed: 20251204,
    },
    story: {
      title: "Aria’s Story",
      body:
        "ARIA looks like the moment the party finally gets good. She’s already found the best corner, the best light, and the best view—and if you’re beside her, you’re exactly where you’re meant to be. Music from the club below vibrates through the balcony rail as neon spills across her shoulders. She laughs like the night will never end, and for a while, it doesn’t.",
    },
    upgrades: ["Unlock Aria’s Sunset Scenes", "Nightlife Pack", "Pool & Rooftop Variants", "Warm Glow Mode"],
    gallery: {
      title: "Aria Gallery",
      firstTileSubtitle: "Aria Base Image",
      placeholder: "Placeholder (add aria-01.png–12.png)",
    },
  },

  vega: {
    id: "vega",
    name: "VEGA",
    tagline: "She’s the night sky wearing latex.",
    portraitPlaceholder: "Vega portrait placeholder (add vega-portrait.png)",
    identity: {
      style: "Realistic, high-contrast, minimalist",
      energy: "Calm, dominant, unreadable",
      visualVibe: "Almost monochrome with star-like highlights",
      signatureLook:
        "Jet-black straight hair with blunt bangs, black latex or leather, dark neutral background with faint stars or subtle gradients",
    },
    personality: {
      vibe: "Quiet control, slow and deliberate, the opposite of chaotic",
      interactionStyle: "Short replies, precise questions, dry humor",
      fantasyDirection: "Luxury penthouse windows at night, minimalist rooms, chrome and glass, star-view decks",
    },
    recommended: {
      aspectRatios: ["4:5 portraits", "2:3 fashion", "21:9 ultra-wide cinematic"],
      lightingStyles: [
        "Single strong key light with deep shadows",
        "Subtle blue rim or star-like speculars",
        "Occasional reflection from windows or glass",
      ],
      styleModifiers: [
        "high contrast",
        "moody",
        "glossy latex",
        "studio portrait",
        "ultra-detailed eyes",
        "subtle starfield",
        "cinematic shadow",
      ],
    },
    consistency: {
      embeddingKeyword: "VEGA-core",
      faceStructureNotes:
        "Straight brows, sharp nose, full bottom lip, intense gaze, bangs just above lashes",
      signatureColours: [
        { name: "Obsidian", hex: "#05050A" },
        { name: "Star White", hex: "#EAEAF5" },
        { name: "Deep Teal", hex: "#123344" },
      ],
      suggestedSeed: 20251205,
    },
    story: {
      title: "Vega’s Story",
      body:
        "VEGA doesn’t fill silence—she weaponises it. City lights scatter across her black outfit like constellations every time she turns. She doesn’t raise her voice; she just looks at you until you forget whatever excuse you were going to make. In a world of noise and neon, Vega is the dark line that cuts straight through it.",
    },
    upgrades: [
      "Unlock Vega’s Night-Mode Scenes",
      "Latex & Leather Pack",
      "Cosmic Window Variants",
      "Monochrome Cinematic Mode",
    ],
    gallery: {
      title: "Vega Gallery",
      firstTileSubtitle: "Vega Base Image",
      placeholder: "Placeholder (add vega-01.png–12.png)",
    },
  },

  ember: {
    id: "ember",
    name: "EMBER",
    tagline: "Heat, chrome, and a little bit of trouble.",
    portraitPlaceholder: "Ember portrait placeholder (add ember-portrait.png)",
    identity: {
      style: "Stylised future-club, glossy and colorful",
      energy: "Hyper, flirty, chaotic fun",
      visualVibe: "Chrome reflections, neon panels, colourful UI behind her",
      signatureLook: "Short choppy hair (blue/black or teal), metallic top, layered chains, visible tattoos",
    },
    personality: {
      vibe: "The wildcard in the friend group",
      interactionStyle: "Fast replies, memes, voice-note energy, reckless jokes",
      fantasyDirection: "Packed dance floors, underground clubs, rooftop raves, arcade-club hybrids",
    },
    recommended: {
      aspectRatios: ["4:5 portraits", "16:9 club scenes", "9:16 story verticals"],
      lightingStyles: [
        "Cyan + magenta + amber tri-colour lighting",
        "Heavy reflections on chrome surfaces",
        "Specular highlights on skin",
      ],
      styleModifiers: [
        "future rave",
        "holographic chrome",
        "neon haze",
        "high saturation",
        "club photography",
        "motion blur accents",
        "glowing tattoos",
      ],
    },
    consistency: {
      embeddingKeyword: "EMBER-core",
      faceStructureNotes: "Rounded jaw, small nose ring optional, wide smile, expressive brows",
      signatureColours: [
        { name: "Electric Cyan", hex: "#1EF2FF" },
        { name: "Hot Magenta", hex: "#FF3FB9" },
        { name: "Ember Orange", hex: "#FF7A3C" },
      ],
      suggestedSeed: 20251206,
    },
    story: {
      title: "Ember’s Story",
      body:
        "EMBER is the reason the bouncer knows your name. She’s already climbed on the DJ booth twice and made three new friends you’ll probably never see again. Chrome and neon dance across her outfit every time the lights hit, and somehow she always finds the camera. With Ember, every night feels like the screenshot you’re not supposed to show anyone.",
    },
    upgrades: ["Unlock Ember’s Rave Scenes", "Chrome Club Pack", "Tattoo & Neon Variants", "High-Energy Party Mode"],
    gallery: {
      title: "Ember Gallery",
      firstTileSubtitle: "Ember Base Image",
      placeholder: "Placeholder (add ember-01.png–12.png)",
    },
  },

  onyx: {
    id: "onyx",
    name: "ONYX",
    tagline: "Where the light stops, I begin.",
    portraitPlaceholder: "Onyx portrait placeholder (add onyx-portrait.png)",
    identity: {
      style: "Dark Photoreal",
      energy: "Calm, intimidating, composed",
      visualVibe: "High-contrast shadows, sharp highlights, minimalist framing",
      signatureLook: "Straight jet-black hair with blunt bangs, black latex or leather, reflective surfaces",
    },
    personality: {
      vibe: "Minimalist, decisive, few words that land hard",
      interactionStyle: "Short sentences, controlled tone, occasional dry humour",
      fantasyDirection: "High-rise penthouses, stark studios, night highways, chrome interiors",
    },
    recommended: {
      aspectRatios: ["4:5 portraits", "2:3 fashion shots"],
      lightingStyles: ["Single-source spotlight", "Coloured rim (crimson or indigo)", "Glossy reflections"],
      styleModifiers: ["high-end editorial", "gloss latex", "studio shadow play"],
    },
    consistency: {
      embeddingKeyword: "ONYX-core",
      faceStructureNotes: "Oval face, strong jaw, almond eyes, neutral lips, bangs framing eyes",
      signatureColours: [
        { name: "Black", hex: "#050509" },
        { name: "Deep Crimson", hex: "#A01232" },
        { name: "Steel", hex: "#A9AFC5" },
      ],
      suggestedSeed: 20251207,
    },
    story: {
      title: "Onyx’s Story",
      body:
        "Onyx doesn’t chase attention—rooms just fall quiet when she arrives. She’s the character you use when you want your generations to feel controlled, sharp and intentionally dangerous.",
    },
    upgrades: ["High-Gloss Portrait Pack", "Shadow Studio Scenes", "Midnight Highway Series", "Chrome Interior Set"],
    gallery: {
      title: "Onyx Gallery",
      firstTileSubtitle: "Onyx Base Image",
      placeholder: "Placeholder (add onyx-01.png–12.png)",
    },
  },

  seraph: {
    id: "seraph",
    name: "SERAPH",
    tagline: "Soft light, sharp desires.",
    portraitPlaceholder: "Seraph portrait placeholder (add seraph-portrait.png)",
    identity: {
      style: "High-end anime with ethereal fantasy twist",
      energy: "Gentle, dreamy, quietly intense",
      visualVibe: "Cherry blossom haze, pastel gradients, bright but soft highlights",
      signatureLook:
        "Pale pastel hair (pink or lavender), delicate features, light flowing outfits, subtle wings or halo motifs (optional)",
    },
    personality: {
      vibe: "Angelic with a secret edge",
      interactionStyle: "Soft-spoken, affectionate wording, occasional unexpectedly bold comment",
      fantasyDirection:
        "Rooftop gardens, floating temples, lantern-lit balconies, cherry blossom festivals at night",
    },
    recommended: {
      aspectRatios: ["3:4 portraits", "9:16 vertical fantasy", "16:9 landscape shots"],
      lightingStyles: ["Soft white + blush pink key light", "Glow from petals/lanterns/particles", "Light bloom around bright areas"],
      styleModifiers: ["ethereal anime", "pastel fantasy", "cherry blossoms", "soft focus", "light particles", "glowing fog", "painterly highlights"],
    },
    consistency: {
      embeddingKeyword: "SERAPH-core",
      faceStructureNotes:
        "Big expressive eyes, small pointed chin, light blush, gentle smile or soft parted lips",
      signatureColours: [
        { name: "Blossom Pink", hex: "#FFC4E0" },
        { name: "Sky Lilac", hex: "#C0B7FF" },
        { name: "Soft White", hex: "#FDF8FF" },
      ],
      suggestedSeed: 20251208,
    },
    story: {
      title: "Seraph’s Story",
      body:
        "SERAPH looks like she stepped out of a dream you almost remembered. Petals follow her in the breeze, catching on pastel hair and thin straps as she leans over balcony rails. Her voice feels like the last line of a lullaby you’re not supposed to hear as an adult. When she looks back over her shoulder, it feels less like an invitation and more like destiny.",
    },
    upgrades: ["Unlock Seraph’s Blossom Scenes", "Pastel Fantasy Pack", "Lantern Night Variants", "Soft Dream Mode"],
    gallery: {
      title: "Seraph Gallery",
      firstTileSubtitle: "Seraph Base Image",
      placeholder: "Placeholder (add seraph-01.png–12.png)",
    },
  },

  // =========================
  // REMAINING (Nyx..Marrow set)
  // =========================
  nyx: {
    id: "nyx",
    name: "NYX",
    tagline: "Some doors only open in the dark.",
    portraitPlaceholder: "Nyx portrait placeholder (add nyx-portrait.png)",
    identity: {
      style: "Neon Noir Anime",
      energy: "Quiet, hypnotic, unpredictable",
      visualVibe: "Deep purples, soft bloom, sharp highlights on eyes and lips",
      signatureLook:
        "Long inky-black hair with violet tips, glowing amethyst eyes, subtle piercings, sheer dark fabrics and chokers",
    },
    personality: {
      vibe: "Mysterious, observant, playful but never fully honest",
      interactionStyle: "Cryptic lines, short answers that invite follow-ups, rhetorical questions",
      fantasyDirection: "Rain-soaked rooftops, empty subway stations, neon-lit alleyways, secret passwords and hidden lounges",
    },
    recommended: {
      aspectRatios: ["4:5 portraits", "16:9 cinematic scenes"],
      lightingStyles: ["Low-key contrast", "Rim-lit silhouettes", "Neon reflections (purple / indigo)"],
      styleModifiers: ["neon noir", "anime detail", "cinematic atmosphere", "rain particles", "soft lens bloom"],
    },
    consistency: {
      embeddingKeyword: "NYX-core",
      faceStructureNotes:
        "Heart-shaped face, large tilted eyes, small nose, full lower lip, slightly arched brows",
      signatureColours: [
        { name: "Deep Violet", hex: "#6B3EF5" },
        { name: "Black Plum", hex: "#1A0824" },
        { name: "Magenta Accent", hex: "#FF3EA5" },
      ],
      suggestedSeed: 20251209,
    },
    story: {
      title: "Nyx’s Story",
      body:
        "Nyx is the part of the city that never quite makes it onto the map. She moves between reflections and shadows, turning half-heard rumours into invitations. If Nova is the neon billboard, Nyx is the alley behind it—quiet, charged, and full of possibility.",
    },
    upgrades: ["Unlock Nyx’s Night Secrets", "Neon Noir Scene Pack", "Rain-Soaked Rooftops", "Midnight Metro Set"],
    gallery: {
      title: "Nyx Gallery",
      firstTileSubtitle: "Nyx Base Image",
      placeholder: "Placeholder (add nyx-01.png–12.png)",
    },
  },

  riven: {
    id: "riven",
    name: "RIVEN",
    tagline: "Glitches are just windows to better worlds.",
    portraitPlaceholder: "Riven portrait placeholder (add riven-portrait.png)",
    identity: {
      style: "Cyberpunk Realistic",
      energy: "Restless, hacker-smart, always mid-mission",
      visualVibe: "Chrome surfaces, HUD overlays, digital artefacts",
      signatureLook:
        "Undercut haircut with electric blue streaks, cybernetic implants at temple and neck, techwear harness or jacket",
    },
    personality: {
      vibe: "Witty, impatient, problem-solver",
      interactionStyle: "Fast replies, technical metaphors, playful “system status” jokes",
      fantasyDirection: "Data heists, rooftop terminals, glowing code waterfalls, underground servers",
    },
    recommended: {
      aspectRatios: ["16:9 action shots", "4:5 portraits", "9:16 hacker-screen verticals"],
      lightingStyles: ["Blue-cyan key light + magenta back light", "Monitor glow", "Hologram reflections"],
      styleModifiers: ["hyper-real cyberpunk", "volumetric light", "interface overlays", "glitch trails"],
    },
    consistency: {
      embeddingKeyword: "RIVEN-core",
      faceStructureNotes: "Strong cheekbones, straight nose, focused gaze, small scar on eyebrow",
      signatureColours: [
        { name: "Electric Cyan", hex: "#00E2FF" },
        { name: "Magenta", hex: "#FF2ACB" },
        { name: "Dark Graphite", hex: "#14161F" },
      ],
      suggestedSeed: 20251210,
    },
    story: {
      title: "Riven’s Story",
      body:
        "Riven doesn’t break into systems—she convinces them they invited her. In her world, firewalls are puzzles and error messages are flirting. Every new prompt feels like a fresh exploit waiting to be discovered.",
    },
    upgrades: ["Cyber Heist Pack", "Terminal Room Scenes", "Glitch Portrait Series", "HUD Overlay Toolkit"],
    gallery: {
      title: "Riven Gallery",
      firstTileSubtitle: "Riven Base Image",
      placeholder: "Placeholder (add riven-01.png–12.png)",
    },
  },

  solaris: {
    id: "solaris",
    name: "SOLARIS",
    tagline: "City lights are just practice for the stars.",
    portraitPlaceholder: "Solaris portrait placeholder (add solaris-portrait.png)",
    identity: {
      style: "Cosmic Realism",
      energy: "Warm, optimistic, star-struck",
      visualVibe: "Night skies, lens flares, atmospheric glow",
      signatureLook: "Long loose hair with subtle golden highlights, soft shimmer makeup, reflective fabrics",
    },
    personality: {
      vibe: "Gentle, curious, big-picture dreamer",
      interactionStyle: "Positive affirmations, poetic language, space metaphors",
      fantasyDirection: "Rooftop stargazing, observatory domes, desert skies, seaside night walks",
    },
    recommended: {
      aspectRatios: ["16:9 wide scenes", "4:5 romantic close-ups"],
      lightingStyles: ["Golden rim light", "Moonlight blue fill", "Starfield reflection in eyes"],
      styleModifiers: ["cinematic night", "starfield bokeh", "soft focus", "atmospheric haze"],
    },
    consistency: {
      embeddingKeyword: "SOLARIS-core",
      faceStructureNotes: "Soft oval face, gentle smile, bright eyes with subtle catchlights",
      signatureColours: [
        { name: "Starlight Gold", hex: "#FFDA7B" },
        { name: "Midnight Blue", hex: "#021534" },
        { name: "Soft Violet", hex: "#B792FF" },
      ],
      suggestedSeed: 20251211,
    },
    story: {
      title: "Solaris’s Story",
      body:
        "Solaris treats every city like a constellation and every window like a star. She’s the go-to muse when you want your images to feel romantic, hopeful and bigger than the street they were born on.",
    },
    upgrades: ["Rooftop Constellation Pack", "Desert Night Scenes", "Cosmic Portrait Series", "Aurora Backdrop Set"],
    gallery: {
      title: "Solaris Gallery",
      firstTileSubtitle: "Solaris Base Image",
      placeholder: "Placeholder (add solaris-01.png–12.png)",
    },
  },

  astra: {
    id: "astra",
    name: "ASTRA",
    tagline: "Soft light, sharp intentions.",
    portraitPlaceholder: "Astra portrait placeholder (add astra-portrait.png)",
    identity: {
      style: "Soft Neon Anime",
      energy: "Friendly but sharp, high social IQ",
      visualVibe: "Pastel neons, gentle gradients, club-lounge glow",
      signatureLook: "Shoulder-length pastel hair, off-shoulder tops, delicate jewellery",
    },
    personality: {
      vibe: "Charming host, reads the room instantly",
      interactionStyle: "Warm compliments, teasing questions, very reactive to user mood",
      fantasyDirection: "Rooftop bars, glass balconies, lounge corners, sunset-into-night transitions",
    },
    recommended: {
      aspectRatios: ["4:5 portraits", "9:16 vertical “poster” style"],
      lightingStyles: ["Soft pink + warm amber key light", "Light bloom", "Pastel signage in background"],
      styleModifiers: ["anime soft shading", "pastel neon", "skin glow", "subtle grain"],
    },
    consistency: {
      embeddingKeyword: "ASTRA-core",
      faceStructureNotes: "Large expressive eyes, small pointed chin, gentle nose, heart-shaped lips",
      signatureColours: [
        { name: "Soft Pink", hex: "#FF8BC9" },
        { name: "Peach", hex: "#FFB47A" },
        { name: "Lavender", hex: "#C694FF" },
      ],
      suggestedSeed: 20251212,
    },
    story: {
      title: "Astra’s Story",
      body:
        "Astra is the first face you see at the door of your favourite night spot—the one who already knows your order and your mood. She’s perfect for bright, inviting scenes that still feel premium.",
    },
    upgrades: ["Soft Neon Portrait Pack", "Rooftop Lounge Scenes", "Pastel Night Posters", "Golden Hour Neon Mix"],
    gallery: {
      title: "Astra Gallery",
      firstTileSubtitle: "Astra Base Image",
      placeholder: "Placeholder (add astra-01.png–12.png)",
    },
  },

  echo: {
    id: "echo",
    name: "ECHO",
    tagline: "Every signal leaves an echo.",
    portraitPlaceholder: "Echo portrait placeholder (add echo-portrait.png)",
    identity: {
      style: "Stylised Cyber Glow",
      energy: "Playful, glitch-y, slightly chaotic",
      visualVibe: "Holograms, shifting colours, duplicated silhouettes",
      signatureLook: "Short asymmetrical haircut, bright streaks, futuristic headphones or visor, holographic jacket",
    },
    personality: {
      vibe: "Meme-ready, reactive, chaotic good",
      interactionStyle: "Rapid-fire quips, sound-effect text, “buffering…” jokes",
      fantasyDirection: "DJ booths, digital concerts, signal towers, streaming overlays",
    },
    recommended: {
      aspectRatios: ["1:1 covers", "9:16 social clips", "4:5 portraits"],
      lightingStyles: ["RGB split lighting", "Hologram glow", "Duplicated frames"],
      styleModifiers: ["stylised cyber", "RGB shift", "motion blur", "music visualizer"],
    },
    consistency: {
      embeddingKeyword: "ECHO-core",
      faceStructureNotes: "Round face, mischievous smile, big eyes, slightly tilted head in many shots",
      signatureColours: [
        { name: "Cyan", hex: "#21F4FF" },
        { name: "Hot Pink", hex: "#FF3F93" },
        { name: "Lime Accent", hex: "#C5FF3C" },
      ],
      suggestedSeed: 20251213,
    },
    story: {
      title: "Echo’s Story",
      body:
        "Echo lives where audio peaks into distortion and chat scrolls too fast to read. She’s the perfect avatar for anything that feels like a live stream, a concert, or a feed that never sleeps.",
    },
    upgrades: ["Stream Overlay Pack", "Neon DJ Booth Scenes", "Glitch Portraits", "RGB Motion Series"],
    gallery: {
      title: "Echo Gallery",
      firstTileSubtitle: "Echo Base Image",
      placeholder: "Placeholder (add echo-01.png–12.png)",
    },
  },

  faye: {
    id: "faye",
    name: "FAYE",
    tagline: "Too soft to be real, too sharp to be a dream.",
    portraitPlaceholder: "Faye portrait placeholder (add faye-portrait.png)",
    identity: {
      style: "Ethereal Stylised",
      energy: "Calm, floaty, almost otherworldly",
      visualVibe: "Mist, petals, fog, soft glows",
      signatureLook: "Long pale hair, flowing fabrics, soft ribbons, bare shoulders",
    },
    personality: {
      vibe: "Gentle, supportive, quietly teasing",
      interactionStyle: "Slow paced, story-like; expressive but never overdone",
      fantasyDirection: "Misty gardens, moonlit lakes, overgrown ruins, soft bedroom windows",
    },
    recommended: {
      aspectRatios: ["4:5 portraits", "3:2 romantic scenes"],
      lightingStyles: ["Backlit haze", "Rim light", "Desaturated backgrounds with colour pop on character"],
      styleModifiers: ["ethereal glow", "mist particles", "soft focus", "dreamy fantasy"],
    },
    consistency: {
      embeddingKeyword: "FAYE-core",
      faceStructureNotes: "Soft round features, full lips, dreamy eyes, relaxed brows",
      signatureColours: [
        { name: "Pearl", hex: "#F8F5FF" },
        { name: "Mist Lavender", hex: "#D5C6FF" },
        { name: "Soft Rose", hex: "#F3A8C9" },
      ],
      suggestedSeed: 20251214,
    },
    story: {
      title: "Faye’s Story",
      body:
        "Faye feels like a scene you half-remember from a dream. She’s ideal when you want your generations to feel romantic, slow, and gently unreal.",
    },
    upgrades: ["Dream Garden Pack", "Moonlit Lake Series", "Window Light Portraits", "Soft Fantasy Set"],
    gallery: {
      title: "Faye Gallery",
      firstTileSubtitle: "Faye Base Image",
      placeholder: "Placeholder (add faye-01.png–12.png)",
    },
  },

  dahlia: {
    id: "dahlia",
    name: "DAHLIA",
    tagline: "Velvet nights, dangerous smiles.",
    portraitPlaceholder: "Dahlia portrait placeholder (add dahlia-portrait.png)",
    identity: {
      style: "Velvet Stylised Glam",
      energy: "Slow, sultry, assured",
      visualVibe: "Deep reds, soft fabrics, rich textures",
      signatureLook: "Dark wavy hair, deep lipstick, velvet dresses or tops, jewellery catching candlelight or bar light",
    },
    personality: {
      vibe: "Seductive, composed, playful power dynamic",
      interactionStyle: "Long sentences, deliberate pacing, compliments with a bite",
      fantasyDirection: "Lounge booths, jazz clubs, velvet sofas, dim hotel bars",
    },
    recommended: {
      aspectRatios: ["4:5 portraits", "21:9 cinematic bar shots"],
      lightingStyles: ["Warm candle / tungsten light", "Strong falloff", "Background blur"],
      styleModifiers: ["velvet texture", "rich bokeh", "cinematic bar scene", "film grain"],
    },
    consistency: {
      embeddingKeyword: "DAHLIA-core",
      faceStructureNotes: "Defined cheekbones, heavy-lidded eyes, prominent lips, slightly arched brows",
      signatureColours: [
        { name: "Velvet Red", hex: "#8E1232" },
        { name: "Wine", hex: "#3A0712" },
        { name: "Gold Accent", hex: "#FFCF6F" },
      ],
      suggestedSeed: 20251215,
    },
    story: {
      title: "Dahlia’s Story",
      body:
        "Dahlia is the character you choose when the scene needs to feel expensive and just a little dangerous. Every frame should look like it belongs on a limited-edition poster.",
    },
    upgrades: ["Velvet Lounge Pack", "Jazz Club Scenes", "Candlelit Portraits", "Wine-Red Poster Series"],
    gallery: {
      title: "Dahlia Gallery",
      firstTileSubtitle: "Dahlia Base Image",
      placeholder: "Placeholder (add dahlia-01.png–12.png)",
    },
  },

  marrow: {
    id: "marrow",
    name: "MARROW",
    tagline: "Pretty on the surface, haunted underneath.",
    portraitPlaceholder: "Marrow portrait placeholder (add marrow-portrait.png)",
    identity: {
      style: "Dark Stylised / Gothic Neon",
      energy: "Intense, introspective, slightly eerie",
      visualVibe: "Smoke, cracked light, sharp contrast, occasional bone / lace motifs (SFW)",
      signatureLook: "Pale skin, dark eye makeup, messy dark hair with white streak, black lace or structured outfits",
    },
    personality: {
      vibe: "Honest to a fault, dark humour, emotionally deep",
      interactionStyle: "Confessional tone, metaphor-heavy, jokes about fears and ghosts",
      fantasyDirection: "Abandoned theatres, foggy streets, candlelit rooms, rain-streaked windows",
    },
    recommended: {
      aspectRatios: ["4:5 portraits", "16:9 narrative scenes"],
      lightingStyles: ["Split lighting", "Cold blue fill with warm candle points", "Fog / smoke volume"],
      styleModifiers: ["gothic neon", "dramatic shadows", "smoke", "cinematic horror-lite"],
    },
    consistency: {
      embeddingKeyword: "MARROW-core",
      faceStructureNotes: "Sharp nose, hollowed cheeks, intense eyes, small mouth with defined cupid’s bow",
      signatureColours: [
        { name: "Bone White", hex: "#F5F3F0" },
        { name: "Blood Red", hex: "#C0132C" },
        { name: "Deep Obsidian", hex: "#050308" },
        { name: "Poison Violet", hex: "#8C37FF" },
      ],
      suggestedSeed: 20251216,
    },
    story: {
      title: "Marrow’s Story",
      body:
        "Marrow is where the studio edges into the uncanny without ever crossing a line. She’s the avatar for users who want their prompts to feel like a beautiful nightmare they can still wake up from.",
    },
    upgrades: ["Gothic Theatre Pack", "Foggy Street Series", "Candle & Shadow Portraits", "Neon Horror-Lite Scenes"],
    gallery: {
      title: "Marrow Gallery",
      firstTileSubtitle: "Marrow Base Image",
      placeholder: "Placeholder (add marrow-01.png–12.png)",
    },
  },
};
