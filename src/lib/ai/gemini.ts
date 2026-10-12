import type { AiProvider, AnalyzeInput } from "./provider";
import { conditionPrompt, drugPrompt, similarOptionsPrompt } from "./prompts";
import { geminiConditionSchema, geminiDrugSchema, geminiSimilarOptionsSchema } from "./gemini-schema";

type GeminiResponse = { candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }> };

async function request(systemInstruction: string, input: AnalyzeInput, responseJsonSchema: Record<string, unknown>): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  const model = process.env.GEMINI_MODEL;
  if (!apiKey || !model) throw new Error("AI_FAILED");

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), Number(process.env.REQUEST_TIMEOUT_MS ?? 60000));
  const parts: Array<{ text?: string; inlineData?: { mimeType: string; data: string } }> = [{ text: `<user_input>${input.text}</user_input>` }];
  input.images?.forEach((image) => parts.push({ inlineData: { mimeType: image.mimeType, data: image.base64 } }));

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`, {
      method: "POST",
      headers: { "x-goog-api-key": apiKey, "Content-Type": "application/json" },
      body: JSON.stringify({ systemInstruction: { parts: [{ text: `${systemInstruction}${input.repairHint ? `\n\nA previous response failed validation. Correct these schema issues and return the complete JSON object: ${input.repairHint}` : ""}` }] }, contents: [{ role: "user", parts }], generationConfig: { responseMimeType: "application/json", responseJsonSchema, temperature: 0.2 } }),
      signal: controller.signal,
    });
    if (!response.ok) {
      const details = (await response.text()).slice(0, 500);
      console.error("Gemini generateContent failed", { status: response.status, details });
      if (response.status === 429) throw new Error("AI_RATE_LIMITED");
      if (response.status === 401 || response.status === 403) throw new Error("AI_AUTH_FAILED");
      throw new Error("AI_FAILED");
    }
    const data = await response.json() as GeminiResponse;
    const output = data.candidates?.[0]?.content?.parts?.map((part) => part.text ?? "").join("").trim();
    if (!output) throw new Error("AI_FAILED");
    return output;
  } catch (cause) {
    if (cause instanceof DOMException && cause.name === "AbortError") throw new Error("TIMEOUT");
    throw cause;
  } finally { clearTimeout(timer); }
}

export const geminiProvider: AiProvider = {
  analyzeDrug: (input) => request(drugPrompt(input.locale), input, geminiDrugSchema),
  analyzeCondition: (input) => request(conditionPrompt(input.locale, Boolean(input.redFlag)), input, geminiConditionSchema),
  findSimilarOptions: (input) => request(similarOptionsPrompt(input.locale), input, geminiSimilarOptionsSchema),
};
