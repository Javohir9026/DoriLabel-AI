import { NextRequest, NextResponse } from "next/server";
import { getProvider } from "@/lib/ai/provider";
import { parseWithRetry } from "@/lib/ai/parse";
import { checkRateLimit } from "@/lib/rate-limit";
import { conditionAnalysisSchema, conditionInputSchema } from "@/lib/schemas/condition";
import { disclaimer, emergencyMessage } from "@/lib/safety/disclaimer";
import { hasRedFlag } from "@/lib/safety/redflags";

export const runtime = "nodejs";
export const maxDuration = 60;
const error = (code: string, status: number) => NextResponse.json({ error: { code, message: code } }, { status });

export async function POST(request: NextRequest) {
  try {
    const input = conditionInputSchema.safeParse(await request.json());
    if (!input.success) return error("INVALID_INPUT", 400);
    const rate = checkRateLimit(request.headers.get("x-forwarded-for")?.split(",")[0] ?? "unknown");
    if (!rate.ok) return NextResponse.json({ error: { code: "RATE_LIMITED", message: "RATE_LIMITED" } }, { status: 429, headers: { "Retry-After": String(rate.retryAfter) } });
    const redFlag = hasRedFlag(input.data.description);
    const provider = await getProvider();
    const call = (repairHint?: string) => provider.analyzeCondition({ locale: input.data.locale, text: JSON.stringify(input.data), redFlag, repairHint });
    const result = await parseWithRetry(await call(), conditionAnalysisSchema, async (validationError) => call(validationError));
    return NextResponse.json({ ...result, urgency: redFlag ? "emergency" : result.urgency, emergencyMessage: redFlag ? (result.emergencyMessage ?? emergencyMessage(input.data.locale)) : result.emergencyMessage, disclaimer: disclaimer(input.data.locale) });
  } catch (cause) {
    const message = cause instanceof Error ? cause.message : "INTERNAL";
    if (message === "AI_RATE_LIMITED") return error("RATE_LIMITED", 429);
    if (message === "TIMEOUT") return error("TIMEOUT", 504);
    if (message === "AI_INVALID_OUTPUT") return error(message, 502);
    return error("AI_FAILED", 502);
  }
}
