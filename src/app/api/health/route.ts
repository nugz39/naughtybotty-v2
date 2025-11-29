export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  return Response.json({
    ok: true,
    service: "naughtybotty-v2",
    ts: new Date().toISOString(),
    hf: {
      tokenPresent: Boolean(process.env.HF_TOKEN),
      tokenPrefix: (process.env.HF_TOKEN || "").slice(0, 6) || null, // just "hf_..." prefix, not the token
      imageModel: process.env.HF_MODEL_IMAGE || null,
      imageAlt: process.env.HF_MODEL_IMAGE_ALT || null,
      videoModel: process.env.HF_MODEL_VIDEO || null,
      videoAlt: process.env.HF_MODEL_VIDEO_ALT || null,
    },
  });
}
