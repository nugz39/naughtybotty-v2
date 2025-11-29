import { NextRequest } from "next/server";
import { z } from "zod";
import { hfGenerateImage } from "@/lib/hfRouter";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const BodySchema = z.object({
  prompt: z.string().min(1, "Prompt is required").max(2000, "Prompt too long"),
  width: z.number().int().min(256).max(1536).optional(),
  height: z.number().int().min(256).max(1536).optional(),
  num_inference_steps: z.number().int().min(1).max(80).optional(),
  guidance_scale: z.number().min(0).max(30).optional(),
  seed: z.number().int().min(0).max(2147483647).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const json = await req.json().catch(() => null);
    const parsed = BodySchema.safeParse(json);

    if (!parsed.success) {
      return Response.json(
        { ok: false, error: parsed.error.issues.map((i) => i.message).join(", ") },
        { status: 400 }
      );
    }

    const {
      prompt,
      width = 768,
      height = 960,
      num_inference_steps = 16,
      guidance_scale = 7.5,
      seed,
    } = parsed.data;

    const payload: any = {
      inputs: prompt,
      parameters: { width, height, num_inference_steps, guidance_scale },
      options: { wait_for_model: true },
    };
    if (typeof seed === "number") payload.parameters.seed = seed;

    const out: any = await hfGenerateImage(payload);

    const ct = (out?.contentType as string) || "image/png";
    const bytesU8 =
      out?.bytes instanceof ArrayBuffer
        ? new Uint8Array(out.bytes)
        : (out?.bytes as Uint8Array);

    return new Response(bytesU8, {
      status: 200,
      headers: { "Content-Type": ct, "Cache-Control": "no-store" },
    });
  } catch (e: any) {
    return Response.json({ ok: false, error: e?.message ?? "Generation failed" }, { status: 500 });
  }
}
