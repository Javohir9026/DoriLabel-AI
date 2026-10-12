"use client";

import { useEffect, useRef, useState } from "react";
import { AlertTriangle, ArrowRight, Camera, CheckCircle2, ChevronDown, ExternalLink, FileImage, HeartPulse, ImagePlus, Info, Moon, Pill, ScanLine, ShieldAlert, ShieldCheck, Sparkles, Stethoscope, Sun, UploadCloud, X } from "lucide-react";
import type { Locale } from "@/lib/schemas/common";
import { localeNames, ui } from "@/lib/i18n/ui";
import "./result.css";
import "./similar-options.css";
import "./result-dark.css";
import "./language.css";
import "./dropdown-layer.css";
import "./telegram-promo.css";
import "./camera.css";
import "./feature.css";

type Tab = "drug" | "condition";
type Result = Record<string, unknown>;
type UploadedImage = { file: File; previewUrl: string };
type Translation = (typeof ui)[Locale];

const languages: Locale[] = ["uz", "ru", "tg", "en"];

export default function Home() {
  const [tab, setTab] = useState<Tab>("drug");
  const [dark, setDark] = useState(false);
  const [locale, setLocale] = useState<Locale>(() => { if (typeof window === "undefined") return "uz"; const saved = window.localStorage.getItem("dorilabel-locale"); return saved && languages.includes(saved as Locale) ? saved as Locale : "uz"; });
  const [languageOpen, setLanguageOpen] = useState(false);
  const [drugName, setDrugName] = useState("");
  const [description, setDescription] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [preview, setPreview] = useState<UploadedImage | null>(null);
  const galleryInput = useRef<HTMLInputElement>(null);
  const cameraInput = useRef<HTMLInputElement>(null);
  const imagesRef = useRef<UploadedImage[]>([]);
  const t = ui[locale];

  useEffect(() => { imagesRef.current = images; }, [images]);
  useEffect(() => () => imagesRef.current.forEach((image) => URL.revokeObjectURL(image.previewUrl)), []);
  useEffect(() => { document.documentElement.lang = locale; window.localStorage.setItem("dorilabel-locale", locale); }, [locale]);
  useEffect(() => { const brand = document.querySelector<HTMLElement>(".brand"); const goHome = () => window.location.assign("/"); brand?.addEventListener("click", goHome); return () => brand?.removeEventListener("click", goHome); }, []);
  useEffect(() => { const footer = document.querySelector<HTMLElement>(".footer .container"); if (!footer || footer.querySelector(".telegram-promo")) return; const promo = document.createElement("a"); promo.className = "telegram-promo"; promo.href = "https://t.me/DoriLabel_ai_bot"; promo.target = "_blank"; promo.rel = "noreferrer"; promo.setAttribute("aria-label", "DoriLabel AI Telegram botini ochish"); promo.innerHTML = '<span class="telegram-promo-copy"><span class="telegram-promo-icon">➤</span><span><strong>Telegram bot orqali ham foydalaning</strong><span>Dori va alomatlar bo‘yicha tezkor yordam</span></span></span><span class="telegram-promo-handle">@DoriLabel_ai_bot</span>'; footer.append(promo); return () => promo.remove(); }, []);
  useEffect(() => { const button = document.querySelector<HTMLButtonElement>(".upload-actions .primary"); if (!button) return; let stream: MediaStream | null = null; const closeCamera = (sheet?: HTMLElement) => { stream?.getTracks().forEach((track) => track.stop()); stream = null; sheet?.remove(); }; const openCamera = async (event: Event) => { event.preventDefault(); event.stopPropagation(); if (!navigator.mediaDevices?.getUserMedia) { cameraInput.current?.click(); return; } try { stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: "environment" } }, audio: false }); const sheet = document.createElement("div"); sheet.className = "camera-sheet"; const content = document.createElement("div"); content.className = "camera-sheet-content"; const video = document.createElement("video"); video.className = "camera-sheet-video"; video.autoplay = true; video.playsInline = true; video.srcObject = stream; const actions = document.createElement("div"); actions.className = "camera-sheet-actions"; const cancel = document.createElement("button"); cancel.className = "camera-cancel"; cancel.textContent = "Bekor qilish"; const capture = document.createElement("button"); capture.className = "camera-capture"; capture.textContent = "Suratga olish"; cancel.onclick = () => closeCamera(sheet); capture.onclick = () => { if (!video.videoWidth) return; const canvas = document.createElement("canvas"); canvas.width = video.videoWidth; canvas.height = video.videoHeight; canvas.getContext("2d")?.drawImage(video, 0, 0); canvas.toBlob((blob) => { if (!blob) return; const files = new DataTransfer(); files.items.add(new File([blob], `dori-${Date.now()}.jpg`, { type: "image/jpeg" })); selectFiles(files.files); closeCamera(sheet); }, "image/jpeg", 0.9); }; actions.append(cancel, capture); content.append(video, actions); sheet.append(content); document.body.append(sheet); } catch { cameraInput.current?.click(); } }; button.addEventListener("click", openCamera, true); return () => { button.removeEventListener("click", openCamera, true); closeCamera(); }; }, []);

  useEffect(() => {
    const projectInfo: Record<Locale, string[]> = {
      uz: ["DoriLabel AI — dori va alomatlar haqida umumiy ma’lumot olish uchun yordamchi.", "Dori rasmini yuklang, nomini yozing yoki alomatlaringizni batafsil tasvirlang.", "4 tilda ishlaydi. Natija shifokor maslahatini almashtirmaydi."],
      ru: ["DoriLabel AI — помощник со справочной информацией о лекарствах и симптомах.", "Загрузите фото лекарства, укажите его название или подробно опишите симптомы.", "Работает на 4 языках. Результат не заменяет консультацию врача."],
      tg: ["DoriLabel AI — ёрдамчӣ барои гирифтани маълумоти умумӣ дар бораи доруҳо ва аломатҳо.", "Расми доруро бор кунед, номи онро нависед ё аломатҳоро пурра тавсиф кунед.", "Бо 4 забон кор мекунад. Натиҷа маслиҳати духтурро иваз намекунад."],
      en: ["DoriLabel AI is a guide to general information about medicines and symptoms.", "Upload a medicine photo, enter its name, or describe your symptoms in detail.", "Available in 4 languages. Results do not replace medical advice."],
    };
    document.querySelectorAll<HTMLSpanElement>(".feature-grid .feature > span").forEach((element, index) => {
      element.textContent = projectInfo[locale][index] ?? "";
    });
  }, [locale]);

  function selectFiles(fileList: FileList | null) {
    const accepted = Array.from(fileList ?? []).filter((file) => ["image/jpeg", "image/png", "image/webp"].includes(file.type) && file.size <= 4 * 1024 * 1024);
    setImages((current) => [...current, ...accepted.slice(0, 4 - current.length).map((file) => ({ file, previewUrl: URL.createObjectURL(file) }))]);
  }
  function removeImage(image: UploadedImage) { if (preview?.previewUrl === image.previewUrl) setPreview(null); URL.revokeObjectURL(image.previewUrl); setImages((current) => current.filter((item) => item.previewUrl !== image.previewUrl)); }
  function changeLocale(next: Locale) { setLocale(next); setLanguageOpen(false); setResult(null); setError(""); }
  async function analyze() {
    setError(""); setResult(null);
    if (tab === "drug" && !drugName.trim() && images.length === 0) { setError(clientError(locale, "drug")); return; }
    if (tab === "condition" && description.trim().length < 10) { setError(clientError(locale, "condition")); return; }
    setLoading(true);
    try {
      let response: Response;
      if (tab === "drug") { const body = new FormData(); images.forEach((image) => body.append("images", image.file)); body.append("drugName", drugName); body.append("locale", locale); response = await fetch("/api/analyze-drug", { method: "POST", body }); }
      else response = await fetch("/api/analyze-condition", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ description, ageGroup: "unknown", sex: "unknown", pregnantOrNursing: "unknown", locale }) });
      const data = await response.json() as Result;
      if (!response.ok) throw new Error(clientError(locale, "api"));
      setResult(data);
    } catch (cause) { setError(cause instanceof Error ? cause.message : clientError(locale, "api")); } finally { setLoading(false); }
  }

  return <><header className="container header"><div className="brand"><span><HeartPulse size={22} /></span><b>DoriLabel AI</b></div><div className="header-actions"><div className="language-switcher"><button className="btn secondary language-trigger" aria-label="Language" aria-expanded={languageOpen} onClick={() => setLanguageOpen((open) => !open)}><span>{locale.toUpperCase()}</span><ChevronDown size={16} /></button>{languageOpen && <div className="language-menu" role="menu">{languages.map((language) => <button key={language} className={locale === language ? "selected" : ""} role="menuitem" onClick={() => changeLocale(language)}><span>{language.toUpperCase()}</span>{localeNames[language]}</button>)}</div>}</div><button className="btn secondary icon-btn" aria-label="Theme" onClick={() => { setDark(!dark); document.documentElement.classList.toggle("dark", !dark); }}>{dark ? <Sun size={19} /> : <Moon size={19} />}</button></div></header><main><section className="container hero"><div className="hero-grid"><div><span className="eyebrow"><Sparkles size={14} /> AI</span><h1>{t.heroTitle}</h1><p className="muted">{t.heroText}</p><div className="trust-row"><span className="tiny"><ShieldCheck size={16} color="var(--brand)" /> {t.private}</span><span className="tiny"><Stethoscope size={16} color="var(--brand)" /> {t.noDiagnosis}</span></div></div><div className="hero-orb"><ScanLine size={100} color="white" strokeWidth={1.4} /></div></div></section><section className="container"><div className="card workspace"><div className="tab-bar"><span className={`tab-indicator ${tab === "condition" ? "condition" : ""}`} /><button className={`tab ${tab === "drug" ? "active" : ""}`} onClick={() => { setTab("drug"); setResult(null); }}><FileImage size={18} /> {t.drug}</button><button className={`tab ${tab === "condition" ? "active" : ""}`} onClick={() => { setTab("condition"); setResult(null); }}><HeartPulse size={18} /> {t.condition}</button></div><div className="form-content">{tab === "drug" ? <div className="grid"><div className="card upload"><input ref={galleryInput} type="file" accept="image/jpeg,image/png,image/webp" multiple hidden onChange={(event) => selectFiles(event.target.files)} /><input ref={cameraInput} type="file" accept="image/jpeg,image/png,image/webp" capture="environment" hidden onChange={(event) => selectFiles(event.target.files)} /><span className="upload-icon"><UploadCloud size={30} /></span><b>{t.uploadTitle}</b><span className="tiny">{t.uploadHint}</span><div className="upload-actions"><button type="button" className="btn secondary" onClick={() => galleryInput.current?.click()}><ImagePlus size={17} /> {t.chooseImage}</button><button type="button" className="btn primary" onClick={() => cameraInput.current?.click()}><Camera size={17} /> {t.camera}</button></div></div>{images.length > 0 && <div className="image-grid">{images.map((image) => <article className="image-card" key={image.previewUrl}><button className="image-button" onClick={() => setPreview(image)}><img src={image.previewUrl} alt="Uploaded medicine" /></button><button className="image-remove" onClick={() => removeImage(image)}><X size={16} /></button><span title={image.file.name}>{image.file.name}</span></article>)}</div>}<input className="field" value={drugName} maxLength={120} placeholder={t.drugPlaceholder} onChange={(event) => setDrugName(event.target.value)} /></div> : <div className="grid"><textarea className="field" rows={7} maxLength={1500} value={description} placeholder={t.symptomPlaceholder} onChange={(event) => setDescription(event.target.value)} /><span className="tiny muted">{description.length}/1500</span></div>}{error && <p role="alert" className="error-text">{error}</p>}{loading ? <div className="progress" aria-live="polite"><Sparkles className="spinner" color="var(--brand)" /><div><b>{t.analyzing}</b><br /><span className="tiny muted">{t.analyzingHint}</span></div></div> : <button className="btn primary analyze-button" onClick={() => void analyze()}>{t.analyze} <ArrowRight size={18} /></button>}</div></div>{result && <ResultCard result={result} onReset={() => setResult(null)} t={t} />}</section><section className="container feature-grid"><Feature icon={<UploadCloud />} title="1" text={t.uploadTitle} /><Feature icon={<ScanLine />} title="2" text={t.analyzingHint} /><Feature icon={<ShieldCheck />} title="3" text={t.noDiagnosis} /></section></main>{preview && <div className="image-modal" role="dialog" aria-modal="true" onMouseDown={() => setPreview(null)}><div className="image-modal-content" onMouseDown={(event) => event.stopPropagation()}><button className="image-modal-close" onClick={() => setPreview(null)}><X size={22} /></button><img src={preview.previewUrl} alt="Uploaded medicine" /><p>{preview.file.name}</p></div></div>}<footer className="footer"><div className="container muted">{t.disclaimer}</div></footer></>;
}

function clientError(locale: Locale, kind: "drug" | "condition" | "api") { const messages: Record<Locale, Record<typeof kind, string>> = { uz: { drug: "Dori nomi yoki rasm kiriting.", condition: "Tavsif kamida 10 belgidan iborat bo‘lsin.", api: "Tahlilni bajarib bo‘lmadi. API sozlamasi yoki limitni tekshiring." }, ru: { drug: "Укажите название лекарства или добавьте фото.", condition: "Описание должно содержать минимум 10 символов.", api: "Не удалось выполнить анализ. Проверьте настройки API или лимит." }, tg: { drug: "Номи дору ё расмро ворид кунед.", condition: "Тавсиф бояд ҳадди ақал 10 аломат дошта бошад.", api: "Таҳлил иҷро нашуд. Танзимоти API ё лимитро санҷед." }, en: { drug: "Enter a medicine name or add an image.", condition: "Description must contain at least 10 characters.", api: "Analysis could not be completed. Check the API settings or limit." } }; return messages[locale][kind]; }
function Feature({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) { return <article className="card feature">{icon}<b>{title}</b><span className="muted tiny">{text}</span></article>; }
function isRecord(value: unknown): value is Result { return typeof value === "object" && value !== null && !Array.isArray(value); }
function asText(value: unknown, fallback = "—"): string { return typeof value === "string" && value.trim() ? value.trim() : fallback; }
function asList(value: unknown): string[] { return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string" && item.trim().length > 0) : []; }
function List({ items }: { items: string[] }) { return items.length ? <ul className="result-list">{items.map((item, index) => <li key={`${item}-${index}`}><CheckCircle2 size={16} />{item}</li>)}</ul> : <p className="result-empty">—</p>; }
function Sources({ sources, t }: { sources: unknown; t: Translation }) { const valid = Array.isArray(sources) ? sources.filter(isRecord).filter((source) => typeof source.title === "string" && typeof source.url === "string" && source.url.startsWith("https://")) : []; return valid.length ? <div className="sources"><b>{t.sources}</b>{valid.map((source, index) => <a key={`${String(source.url)}-${index}`} href={String(source.url)} target="_blank" rel="noreferrer"><ExternalLink size={14} />{String(source.title)}</a>)}</div> : null; }
function DrugItemCard({ item, t }: { item: Result; t: Translation }) { const ingredients = Array.isArray(item.activeIngredients) ? item.activeIngredients.filter(isRecord) : []; return <article className="drug-result-card"><div className="drug-result-head"><div className="result-title-icon"><Pill size={22} /><div><h2>{asText(item.brandName, asText(item.genericName))}</h2><p>{asText(item.genericName)}</p></div></div><span className={`confidence ${String(item.confidence)}`}>{String(item.confidence)}</span></div><div className="ingredient-row">{ingredients.map((ingredient, index) => <span key={index}>{asText(ingredient.name)} {ingredient.strength ? `· ${asText(ingredient.strength)}` : ""}</span>)}</div><div className="result-highlight"><b>{t.purpose}</b><p>{asText(item.purpose)}</p></div><div className="result-columns"><section><h3>{t.howToTake}</h3><p><b>{t.timing}</b> {asText(isRecord(item.howToTake) ? item.howToTake.timing : null)}</p><p>{asText(isRecord(item.howToTake) ? item.howToTake.generalDirections : null)}</p></section><section><h3>{t.cautions}</h3><List items={asList(item.contraindications)} /></section></div><details><summary>{t.details}</summary><div className="details-content"><section><h3>{t.usedFor}</h3><List items={asList(item.usedFor)} /></section><section><h3>{t.sideEffects}</h3><p><b>{t.common}</b></p><List items={isRecord(item.sideEffects) ? asList(item.sideEffects.common) : []} /><p><b>{t.serious}</b></p><List items={isRecord(item.sideEffects) ? asList(item.sideEffects.serious) : []} /></section><section><h3>{t.interactions}</h3><List items={asList(item.interactions)} /></section><section><h3>{t.storage}</h3><p>{asText(item.storage)}</p></section></div></details><div className="doctor-box"><ShieldAlert size={20} /><div><b>{t.doctor}</b><List items={asList(item.seeDoctorIf)} /></div></div><Sources sources={item.sources} t={t} /></article>; }
function OtcCard({ option, t }: { option: Result; t: Translation }) { return <article className="otc-card"><div className="otc-icon"><Pill size={25} /></div><div className="otc-main"><h3>{asText(option.activeIngredient)}</h3><p>{asText(option.purpose)}</p><div className="otc-directions"><b>{t.directions}</b><span>{asText(option.howToTake)}</span></div><div className="otc-caution"><ShieldAlert size={17} /><div><b>{t.cautions}</b><List items={asList(option.cautions)} /></div></div><Sources sources={option.sources} t={t} /></div></article>; }
function ConditionResult({ result, t }: { result: Result; t: Translation }) {
  const options = Array.isArray(result.otcOptions) ? result.otcOptions.filter(isRecord) : [];
  const [additionalOptions, setAdditionalOptions] = useState<Result[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(false);
  const [optionsError, setOptionsError] = useState("");
  const locale = (typeof document === "undefined" ? "uz" : document.documentElement.lang) as Locale;
  const copy: Record<Locale, { more: string; loading: string; title: string; note: string; error: string }> = {
    uz: { more: "Yana 3 ta variantni ko‘rish", loading: "Qo‘shimcha variantlar izlanmoqda…", title: "Qo‘shimcha variantlar", note: "Bu variantlar faqat ma’lumot uchun. Qabul qilishdan oldin farmatsevt yoki shifokor bilan tekshiring.", error: "Qo‘shimcha variantlarni olish imkoni bo‘lmadi." },
    ru: { more: "Показать ещё 3 варианта", loading: "Подбираем дополнительные варианты…", title: "Дополнительные варианты", note: "Это справочная информация. Перед приёмом уточните совместимость у врача или фармацевта.", error: "Не удалось получить дополнительные варианты." },
    tg: { more: "Боз 3 вариантро дидан", loading: "Вариантҳои иловагӣ ҷустуҷӯ мешаванд…", title: "Вариантҳои иловагӣ", note: "Ин вариантҳо танҳо барои маълумотанд. Пеш аз қабул бо духтур ё дорусоз санҷед.", error: "Вариантҳои иловагиро гирифтан имконнопазир шуд." },
    en: { more: "Show 3 more options", loading: "Finding additional options…", title: "Additional options", note: "These options are for information only. Check suitability with a doctor or pharmacist before use.", error: "Additional options could not be retrieved." },
  };
  const labels = copy[locale] ?? copy.uz;
  const loadMore = async () => {
    setLoadingOptions(true); setOptionsError("");
    try {
      const response = await fetch("/api/similar-options", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ summary: asText(result.summary), locale }) });
      const body: unknown = await response.json();
      if (!response.ok || !isRecord(body) || !Array.isArray(body.otcOptions)) throw new Error("SIMILAR_OPTIONS_FAILED");
      setAdditionalOptions(body.otcOptions.filter(isRecord));
    } catch { setOptionsError(labels.error); } finally { setLoadingOptions(false); }
  };
  return <div className="condition-result"><div><span className="eyebrow">{t.symptomAnalysis}</span><h2>{asText(result.summary)}</h2></div><section><h3>{t.selfCare}</h3><List items={asList(result.selfCare)} /></section>{result.urgency !== "emergency" && <section className="otc-section"><div className="otc-section-head"><div><h3>{t.otcTitle}</h3><p className="muted">{t.otcIntro}</p></div>{options.length > 0 && additionalOptions.length === 0 && <button className="btn secondary more-options-button" type="button" onClick={() => void loadMore()} disabled={loadingOptions}><Sparkles size={17} />{loadingOptions ? labels.loading : labels.more}</button>}</div>{options.length > 0 && <div className="otc-grid primary-options"><OtcCard option={options[0]} t={t} /></div>}{optionsError && <p className="error-text">{optionsError}</p>}{additionalOptions.length > 0 && <div className="additional-options"><div><b>{labels.title}</b><p className="tiny muted">{labels.note}</p></div><div className="otc-grid">{additionalOptions.map((option, index) => <OtcCard option={option} t={t} key={`${asText(option.activeIngredient)}-${index}`} />)}</div></div>}</section>}<section><h3>{t.doctor}</h3><List items={asList(result.seeDoctorIf)} /></section><Sources sources={result.sources} t={t} /></div>;
}
function ResultCard({ result, onReset, t }: { result: Result; onReset: () => void; t: Translation }) { const items = Array.isArray(result.items) ? result.items.filter(isRecord) : []; const drug = "inputType" in result && "items" in result; const emergency = result.urgency === "emergency"; return <section className="grid result card">{emergency && <div className="card alert" role="alert"><AlertTriangle /><div><b>{t.emergency}</b><p>{asText(result.emergencyMessage)}</p><a className="btn primary" href="tel:103">{t.call103}</a></div></div>}{drug ? <><div className="result-intro"><span className="eyebrow">{t.drugAnalysis}</span><h1>{items.length ? `${items.length} ${t.oneDrugReady}` : t.notFound}</h1><p>{asList(result.generalNotes).join(" ")}</p></div>{items.map((item, index) => <DrugItemCard item={item} t={t} key={index} />)}</> : <ConditionResult result={result} t={t} />}<div className="disclaimer"><Info size={18} />{asText(result.disclaimer, t.disclaimer)}</div><button className="btn secondary" onClick={onReset}>{t.newRequest}</button></section>; }
