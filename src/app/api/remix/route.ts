import { z } from "zod";
import Replicate from "replicate";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const FormSchema = z.object({
  prompt: z.string().min(1, "Prompt is required").max(2000, "Prompt too long"),
  strength: z.coerce.number().min(0).max(1).default(0.65),
});

function assertEnv(name: string, value: string | undefined) {
  if (!value) throw new Error(`${name} missing. Add it to .env.local and restart.`);
}

async function fileToDataUrl(file: File) {
  const buf = Buffer.from(await file.arrayBuffer());
  const mime = file.type || "image/png";
  return `data:${mime};base64,${buf.toString("base64")}`;
}

export async function POST(req: Request) {
  try {
    const token = process.env.REPLICATE_API_TOKEN;
    assertEnv("REPLICATE_API_TOKEN", token);

    const form = await req.formData();

    const image = form.get("image");
    if (!(image instanceof File)) {
      return Response.json({ ok: false, error: "Missing image file" }, { status: 400 });
    }

    const prompt = String(form.get("prompt") ?? "");
    const strengthRaw = form.get("strength") ?? "0.65";

    const parsed = FormSchema.safeParse({ prompt, strength: strengthRaw });
    if (!parsed.success) {
      return Response.json(
        { ok: false, error: parsed.error.issues.map((i) => i.message).join(", ") },
        { status: 400 }
      );
    }

    // SDXL img2img model on Replicate (stable choice for Remix)
    const VERSION =
      "stability-ai/sdxl:7762fd03f0b2c8f4f8f24c6d85d6df4d8f3f8c3cb1e4e9f0a9cf0b7e6e5b8d2a";

    const replicate = new Replicate({ auth: token });
    const imageDataUrl = await fileToDataUrl(image);

    const output: any = await replicate.run(VERSION as any, {
      input: {
        prompt: parsed.data.prompt,
        image: imageDataUrl,
        strength: parsed.data.strength,
        num_inference_steps: 30,
        guidance_scale: 7.5,
      },
    });

    const url =
      (Array.isArray(output) ? output[0] : output?.[0]) ||
      output?.url ||
      output?.image ||
      null;

    if (!url || typeof url !== "string") {
      return Response.json(
        { ok: false, error: `Malformed Replicate response: ${JSON.stringify(output).slice(0, 400)}` },
        { status: 500 }
      );
    }

    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) {
      const t = await res.text().catch(() => "");
      return Response.json(
        { ok: false, error: `Failed to fetch remix image (${res.status}): ${t.slice(0, 200)}` },
        { status: 500 }
      );
    }

    const bytes = await res.arrayBuffer();
    const ct = res.headers.get("content-type") || "image/png";

    return new Response(new Uint8Array(bytes), {
      status: 200,
      headers: {
        "Content-Type": ct.startsWith("image/") ? ct : "image/png",
        "Cache-Control": "no-store",
      },
    });
  } catch (e: any) {
    return Response.json({ ok: false, error: e?.message ?? "Remix failed" }, { status: 500 });
  }
}
