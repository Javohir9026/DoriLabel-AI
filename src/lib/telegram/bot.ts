import { getProvider } from "@/lib/ai/provider";
import { parseWithRetry } from "@/lib/ai/parse";
import { conditionAnalysisSchema } from "@/lib/schemas/condition";
import { drugAnalysisSchema } from "@/lib/schemas/drug";
import type { Locale } from "@/lib/schemas/common";
import { disclaimer, emergencyMessage } from "@/lib/safety/disclaimer";
import { hasRedFlag } from "@/lib/safety/redflags";

type TelegramUser = { id: number; first_name?: string; language_code?: string };
type TelegramMessage = { chat: { id: number; type: string }; from?: TelegramUser; text?: string; photo?: Array<{ file_id: string }>; caption?: string };
export type TelegramUpdate = { update_id: number; message?: TelegramMessage; callback_query?: { id: string; from: TelegramUser; message?: TelegramMessage; data?: string } };
type TelegramResponse<T> = { ok: boolean; result: T };
type Mode = "condition" | "drug";

const userLocales = new Map<number, Locale>();
const userModes = new Map<number, Mode>();
const localeList: Locale[] = ["uz", "ru", "tg", "en"];
const fallbackLocale = (language?: string): Locale => language?.startsWith("ru") ? "ru" : language?.startsWith("tg") ? "tg" : language?.startsWith("en") ? "en" : "uz";
const apiUrl = (method: string) => `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/${method}`;

async function telegram<T>(method: string, body: Record<string, unknown>): Promise<T> {
  const response = await fetch(apiUrl(method), { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  const data = await response.json() as TelegramResponse<T>;
  if (!response.ok || !data.ok) throw new Error("TELEGRAM_FAILED");
  return data.result;
}

function copy(locale: Locale) {
  return {
    greeting: { uz: "Salom, {name}! 👋\n\nMen DoriLabel AI — dori va alomatlar haqida umumiy, tushunarli ma’lumot beruvchi yordamchiman. Avval tilni tanlang.", ru: "Здравствуйте, {name}! 👋\n\nЯ DoriLabel AI — помощник с понятной общей информацией о лекарствах и симптомах. Сначала выберите язык.", tg: "Салом, {name}! 👋\n\nМан DoriLabel AI — ёвар барои маълумоти фаҳмо ва умумӣ дар бораи доруҳо ва аломатҳо. Аввал забонро интихоб кунед.", en: "Hello, {name}! 👋\n\nI am DoriLabel AI — your assistant for clear general information about medicines and symptoms. First, choose a language." }[locale],
    ready: { uz: "Tayyor! Quyidagi tugmalardan birini tanlang.", ru: "Готово! Выберите одну из кнопок ниже.", tg: "Омода! Яке аз тугмаҳои зерро интихоб кунед.", en: "Ready! Choose one of the buttons below." }[locale],
    drug: { uz: "💊 Dori bo‘yicha", ru: "💊 О лекарстве", tg: "💊 Дар бораи дору", en: "💊 Medicine" }[locale],
    condition: { uz: "🩺 Belgilar bo‘yicha", ru: "🩺 По симптомам", tg: "🩺 Аз рӯи аломатҳо", en: "🩺 Symptoms" }[locale],
    language: { uz: "🌐 Tilni o‘zgartirish", ru: "🌐 Изменить язык", tg: "🌐 Иваз кардани забон", en: "🌐 Change language" }[locale],
    web: { uz: "🌐 Web ilovani ochish", ru: "🌐 Открыть веб-приложение", tg: "🌐 Кушодани веб-барнома", en: "🌐 Open web app" }[locale],
    drugPrompt: { uz: "Dori rasmini yuboring yoki dori nomini yozing.", ru: "Отправьте фото лекарства или напишите его название.", tg: "Расми доруро фиристед ё номи доруро нависед.", en: "Send a medicine photo or type its name." }[locale],
    conditionPrompt: { uz: "Alomatlaringizni batafsil yozing. Masalan: “Ikki kundan beri isitmam bor”.", ru: "Подробно опишите симптомы. Например: «У меня температура уже два дня».", tg: "Аломатҳоро муфассал нависед. Масалан: «Ду рӯз аст таб дорам».", en: "Describe your symptoms in detail. For example: “I have had a fever for two days”." }[locale],
    wait: { uz: "⏳ Tahlil qilinmoqda…", ru: "⏳ Анализ выполняется…", tg: "⏳ Таҳлил шуда истодааст…", en: "⏳ Analyzing…" }[locale],
    error: { uz: "Tahlil bajarilmadi. Birozdan keyin yana urinib ko‘ring.", ru: "Не удалось выполнить анализ. Попробуйте ещё раз позже.", tg: "Таҳлил иҷро нашуд. Баъдтар боз кӯшиш кунед.", en: "Analysis could not be completed. Please try again later." }[locale],
  };
}

function languageKeyboard() { return { inline_keyboard: [[{ text: "🇺🇿 O‘zbek", callback_data: "lang:uz" }, { text: "🇷🇺 Русский", callback_data: "lang:ru" }], [{ text: "🇹🇯 Тоҷикӣ", callback_data: "lang:tg" }, { text: "🇬🇧 English", callback_data: "lang:en" }]] }; }
function mainKeyboard(locale: Locale) {
  const text = copy(locale); const url = process.env.TELEGRAM_WEB_APP_URL?.startsWith("https://") ? process.env.TELEGRAM_WEB_APP_URL : undefined;
  const rows: Array<Array<Record<string, unknown>>> = [[{ text: text.drug }, { text: text.condition }], [{ text: text.language }]];
  if (url) rows[1].push({ text: text.web, web_app: { url } });
  return { keyboard: rows, resize_keyboard: true, is_persistent: true };
}
async function send(chatId: number, text: string, markup?: Record<string, unknown>) { return telegram("sendMessage", { chat_id: chatId, text: text.slice(0, 4000), reply_markup: markup, disable_web_page_preview: true }); }
function list(items: string[]) { return items.length ? items.map((item) => `• ${item}`).join("\n") : "—"; }
function conditionText(result: { urgency: string; summary: string; selfCare: string[]; otcOptions: Array<{ activeIngredient: string; purpose: string; howToTake: string; cautions: string[] }>; redFlags: string[]; seeDoctorIf: string[]; emergencyMessage: string | null; disclaimer: string }, locale: Locale) { const emergency = result.urgency === "emergency" ? `\n🚨 ${result.emergencyMessage ?? emergencyMessage(locale)}\n` : ""; const otc = result.urgency === "emergency" ? "" : result.otcOptions.map((item) => `\n💊 ${item.activeIngredient}\n${item.purpose}\n${item.howToTake}\n⚠️ ${list(item.cautions)}`).join("\n"); return `${emergency}\n🩺 ${result.summary}\n\n✅ ${list(result.selfCare)}${otc}\n\n⚠️ ${list(result.redFlags)}\n\n👨‍⚕️ ${list(result.seeDoctorIf)}\n\nℹ️ ${result.disclaimer}`; }
function drugText(result: { items: Array<{ brandName: string | null; genericName: string | null; purpose: string; howToTake: { generalDirections: string | null; note: string }; contraindications: string[]; seeDoctorIf: string[] }>; disclaimer: string }) { return `${result.items.map((item) => `💊 ${item.brandName ?? item.genericName ?? "Dori"}\n${item.purpose}\n\n📌 ${item.howToTake.generalDirections ?? "—"}\n${item.howToTake.note}\n\n⚠️ ${list(item.contraindications)}\n👨‍⚕️ ${list(item.seeDoctorIf)}`).join("\n\n")}\n\nℹ️ ${result.disclaimer}`; }
async function analyzeCondition(chatId: number, text: string, locale: Locale) { const redFlag = hasRedFlag(text); const provider = await getProvider(); const call = (repairHint?: string) => provider.analyzeCondition({ locale, text: JSON.stringify({ description: text, locale }), redFlag, repairHint }); const result = await parseWithRetry(await call(), conditionAnalysisSchema, async (hint) => call(hint)); await send(chatId, conditionText({ ...result, urgency: redFlag ? "emergency" : result.urgency, emergencyMessage: redFlag ? (result.emergencyMessage ?? emergencyMessage(locale)) : result.emergencyMessage, disclaimer: disclaimer(locale) }, locale), mainKeyboard(locale)); }
async function analyzeDrug(chatId: number, locale: Locale, drugName: string, image?: { mimeType: string; base64: string }) { const provider = await getProvider(); const call = (repairHint?: string) => provider.analyzeDrug({ locale, text: `Dori nomi: ${drugName}`, images: image ? [image] : undefined, repairHint }); const result = await parseWithRetry(await call(), drugAnalysisSchema, async (hint) => call(hint)); await send(chatId, drugText({ ...result, disclaimer: disclaimer(locale) }), mainKeyboard(locale)); }
async function telegramPhoto(photo: { file_id: string }): Promise<{ mimeType: string; base64: string }> { const file = await telegram<{ file_path: string }>("getFile", { file_id: photo.file_id }); const response = await fetch(`https://api.telegram.org/file/bot${process.env.TELEGRAM_BOT_TOKEN}/${file.file_path}`); if (!response.ok) throw new Error("TELEGRAM_FILE_FAILED"); return { mimeType: "image/jpeg", base64: Buffer.from(await response.arrayBuffer()).toString("base64") }; }

export async function handleTelegramUpdate(update: TelegramUpdate) {
  if (!process.env.TELEGRAM_BOT_TOKEN) throw new Error("TELEGRAM_NOT_CONFIGURED");
  if (update.callback_query) { const callback = update.callback_query; const locale = callback.data?.startsWith("lang:") ? callback.data.slice(5) as Locale : undefined; if (locale && localeList.includes(locale)) { userLocales.set(callback.from.id, locale); userModes.set(callback.from.id, "condition"); await telegram("answerCallbackQuery", { callback_query_id: callback.id, text: "✓" }); if (callback.message) await send(callback.message.chat.id, copy(locale).ready, mainKeyboard(locale)); } return; }
  const message = update.message; if (!message || message.chat.type !== "private") return;
  const userId = message.from?.id ?? 0; const locale = userLocales.get(userId) ?? fallbackLocale(message.from?.language_code); const text = (message.text ?? message.caption ?? "").trim(); const labels = copy(locale);
  if (text === "/start") { const name = message.from?.first_name?.trim() || "do‘st"; await send(message.chat.id, labels.greeting.replace("{name}", name), languageKeyboard()); return; }
  if (text === "/help") { await send(message.chat.id, labels.ready, mainKeyboard(locale)); return; }
  if (text === labels.language) { await send(message.chat.id, labels.greeting.replace("{name}", message.from?.first_name ?? ""), languageKeyboard()); return; }
  if (text === labels.drug) { userModes.set(userId, "drug"); await send(message.chat.id, labels.drugPrompt, mainKeyboard(locale)); return; }
  if (text === labels.condition) { userModes.set(userId, "condition"); await send(message.chat.id, labels.conditionPrompt, mainKeyboard(locale)); return; }
  if (text === labels.web && !process.env.TELEGRAM_WEB_APP_URL?.startsWith("https://")) { await send(message.chat.id, "Web App uchun HTTPS URL kerak.", mainKeyboard(locale)); return; }
  await send(message.chat.id, labels.wait, mainKeyboard(locale));
  try { if (message.photo?.length) { await analyzeDrug(message.chat.id, locale, text, await telegramPhoto(message.photo.at(-1)!)); return; } const mode = userModes.get(userId) ?? "condition"; if (text.startsWith("/dori ") || text.startsWith("/drug ") || mode === "drug") { userModes.set(userId, "condition"); await analyzeDrug(message.chat.id, locale, text.replace(/^\/(dori|drug)\s+/i, "")); return; } if (text.length >= 10) { await analyzeCondition(message.chat.id, text, locale); return; } await send(message.chat.id, labels.conditionPrompt, mainKeyboard(locale)); } catch { await send(message.chat.id, labels.error, mainKeyboard(locale)); }
}
