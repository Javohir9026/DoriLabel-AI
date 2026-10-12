import { describe, expect, it } from "vitest";
import { z } from "zod";
import { extractJson, parseWithRetry } from "@/lib/ai/parse";

describe("AI JSON parsing", () => {
  it("extracts JSON from a fenced response", () => expect(extractJson("```json\n{\"answer\":\"ok\"}\n``` ")).toEqual({ answer: "ok" }));
  it("retries once when the first response is invalid", async () => { const retry = async () => "{\"answer\":\"fixed\"}"; await expect(parseWithRetry("not JSON", z.object({ answer: z.string() }), retry)).resolves.toEqual({ answer: "fixed" }); });
});
