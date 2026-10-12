import { describe, expect, it } from "vitest";
import { hasRedFlag } from "@/lib/safety/redflags";

describe("red-flag safety detection", () => {
  it.each(["Ko‘kragim qattiq og‘riyapti va nafasim qisilyapti", "Мне трудно дышать", "Нафаскашӣ душвор аст", "I have chest pain and fainted"])("detects emergency symptoms: %s", (text) => expect(hasRedFlag(text)).toBe(true));
  it("does not mark ordinary symptom text as an emergency", () => expect(hasRedFlag("Ikki kundan beri tomog‘im og‘riyapti")).toBe(false));
});
