import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";

const originalProvider = process.env.AI_PROVIDER;

beforeAll(() => {
  vi.stubEnv("AI_PROVIDER", "mock");
});

afterAll(() => {
  if (originalProvider === undefined) vi.unstubAllEnvs();
  else vi.stubEnv("AI_PROVIDER", originalProvider);
});

describe("analysis API routes", () => {
  it("returns a safe, localized response for a valid condition request", async () => {
    const { POST } = await import("@/app/api/analyze-condition/route");
    const response = await POST(new Request("http://localhost/api/analyze-condition", {
      method: "POST",
      headers: { "content-type": "application/json", "x-forwarded-for": "api-condition-test" },
      body: JSON.stringify({ description: "Ikki kundan beri tomog'im og'riyapti va yengil yo'tal bor.", ageGroup: "adult", sex: "unknown", pregnantOrNursing: "unknown", locale: "uz" }),
    }) as never);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.disclaimer).toContain("shifokor");
  });

  it("elevates red-flag symptoms to an emergency response", async () => {
    const { POST } = await import("@/app/api/analyze-condition/route");
    const response = await POST(new Request("http://localhost/api/analyze-condition", {
      method: "POST",
      headers: { "content-type": "application/json", "x-forwarded-for": "api-emergency-test" },
      body: JSON.stringify({ description: "Ko'kragim og'riyapti va nafasim qisilyapti.", ageGroup: "adult", sex: "unknown", pregnantOrNursing: "unknown", locale: "uz" }),
    }) as never);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.urgency).toBe("emergency");
    expect(body.emergencyMessage).toBeTruthy();
  });

  it("rejects an invalid condition request", async () => {
    const { POST } = await import("@/app/api/analyze-condition/route");
    const response = await POST(new Request("http://localhost/api/analyze-condition", {
      method: "POST",
      headers: { "content-type": "application/json", "x-forwarded-for": "api-invalid-test" },
      body: JSON.stringify({ description: "qisqa", locale: "uz" }),
    }) as never);

    expect(response.status).toBe(400);
  });

  it("returns an item for a medication name", async () => {
    const { POST } = await import("@/app/api/analyze-drug/route");
    const form = new FormData();
    form.set("drugName", "Paracetamol");
    form.set("locale", "uz");
    const response = await POST(new Request("http://localhost/api/analyze-drug", {
      method: "POST",
      headers: { "x-forwarded-for": "api-drug-test" },
      body: form,
    }) as never);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.items).toHaveLength(1);
    expect(body.disclaimer).toContain("shifokor");
  });

  it("returns exactly three additional OTC options", async () => {
    const { POST } = await import("@/app/api/similar-options/route");
    const response = await POST(new Request("http://localhost/api/similar-options", {
      method: "POST",
      headers: { "content-type": "application/json", "x-forwarded-for": "api-similar-options-test" },
      body: JSON.stringify({ summary: "Ikki kundan beri bosh og'rig'i va yengil isitma bor.", locale: "uz" }),
    }) as never);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.otcOptions).toHaveLength(3);
  });
});
