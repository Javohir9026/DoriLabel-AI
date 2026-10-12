import { NextRequest, NextResponse } from "next/server";
import { getProvider } from "@/lib/ai/provider";
import { parseWithRetry } from "@/lib/ai/parse";
import { checkRateLimit } from "@/lib/rate-limit";
import { similarOptionsInputSchema, similarOptionsSchema } from "@/lib/schemas/condition";

export const runtime = "nodejs";
export const maxDuration = 60;

const error = (code: string, status: number) => NextResponse.json({ error: { code, message: code } }, { status });

export async function POST(request: NextRequest) {
  try {
    const input = similarOptionsInputSchema.safeParse(await request.json());
    if (!input.success) return error("INVALID_INPUT", 400);
    const rate = checkRateLimit(request.headers.get("x-forwarded-for")?.split(",")[0] ?? "unknown");
    if (!rate.ok) return NextResponse.json({ error: { code: "RATE_LIMITED", message: "RATE_LIMITED" } }, { status: 429, headers: { "Retry-After": String(rate.retryAfter) } });

    const provider = await getProvider();
    const call = (repairHint?: string) => provider.findSimilarOptions({ locale: input.data.locale, text: input.data.summary, repairHint });
    const result = await parseWithRetry(await call(), similarOptionsSchema, async (validationError) => call(validationError));
    return NextResponse.json(result);
  } catch (cause) {
    const message = cause instanceof Error ? cause.message : "INTERNAL";
    if (message === "AI_RATE_LIMITED") return error("RATE_LIMITED", 429);
    if (message === "TIMEOUT") return error("TIMEOUT", 504);
    if (message === "AI_INVALID_OUTPUT") return error(message, 502);
    return error("AI_FAILED", 502);
  }
}
