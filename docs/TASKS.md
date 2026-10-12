# Vazifalar (vibe coding uchun) — Codex'ga ketma-ket bering

Har bosqichdan oldin Codex'ga ayting: "AGENTS.md va docs/ ni o'qi." Har bosqich oxirida `pnpm lint && pnpm typecheck && pnpm build`.

---
## 1-bosqich: Loyiha poydevori
```
Next.js (App Router, TypeScript strict, Tailwind, src/ papka, pnpm) loyihasini yarat. shadcn/ui o'rnat (button, tabs, textarea, input, card, accordion, badge, skeleton, sonner, drawer). docs/ARCHITECTURE.md dagi papka strukturasini bo'sh fayllar bilan tuz. .env.example, security headerlar (next.config.ts), ESLint/Prettier sozla. Inter shrifti, dark mode (next-themes), uz/ru/en i18n (lib/i18n, default uz) ni sozla. Header (logo, til, tema) va Footer (disclaimer) yoz.
```
**Tayyor:** bo'sh sahifa Header/Footer bilan, til va tema ishlaydi.

## 2-bosqich: Sxemalar va xavfsizlik qatlami
```
docs/API.md dagi zod sxemalarni src/lib/schemas ga yoz. lib/safety/redflags.ts (uz/ru/en kalit so'zlar, birlik testlari bilan) va lib/safety/disclaimer.ts ni yoz. lib/rate-limit.ts: Upstash mavjud bo'lsa u, bo'lmasa in-memory fallback; IP ni hash qil. lib/ai/parse.ts: JSON ajratish + zod safeParse + 1 marta retry mantiqi. Vitest qo'sh va redflags/parse uchun testlar yoz.
```
**Tayyor:** testlar o'tadi.

## 3-bosqich: AI provayder qatlami
```
lib/ai/provider.ts interfeysini (analyzeDrug, analyzeCondition) yoz. openai.ts va anthropic.ts implementatsiyalarini yoz: vision (rasm) va web search tool, model nomi faqat env'dan. prompts.ts ga docs/AI_PROMPTS.md dagi promptlarni ko'chir. Timeout (REQUEST_TIMEOUT_MS) va AbortSignal qo'llab-quvvatla. Xatolarni AI_FAILED/TIMEOUT kodlariga o'gir. Provayder SDK'ning joriy rasmiy hujjatiga qarab yoz.
```
**Tayyor:** provayder mock bilan ham, haqiqiy kalit bilan ham ishlaydi (`AI_PROVIDER=mock` rejimi dev uchun).

## 4-bosqich: API route'lar
```
app/api/analyze-drug/route.ts va app/api/analyze-condition/route.ts ni docs/API.md bo'yicha yoz: server validatsiya (MIME magic-bytes, hajm, soni), rate limit, red-flag pre-check (faqat condition), AI chaqiruvi, zod validatsiya, disclaimer va emergencyMessage ni server qo'shishi, standart xato formati. Rasm hech qayerga yozilmasin va loglanmasin. runtime=nodejs, maxDuration=60.
```
**Tayyor:** curl bilan ikkala endpoint ishlaydi, xato kodlari to'g'ri.

## 5-bosqich: Dori tabi (UI)
```
docs/UI_UX.md bo'yicha ImageUploader (kamera/galereya/drag&drop, max 4, miniatura, o'chirish), lib/image.ts (klientda 1600px gacha siqish, EXIF olib tashlash, hajm/format tekshiruvi), DrugForm, ProgressSteps, DrugResultCard (accordion bo'limlar, confidence badge), PrescriptionResult, SourcesList, ErrorState ni yoz. useAnalyze hook (AbortController bilan bekor qilish). Barcha holatlar: idle/loading/success/error/rate-limited/offline. Mobil 360px, dark mode.
```

## 6-bosqich: Kasallik tabi (UI)
```
ConditionForm (textarea sanagich, yig'iladigan qo'shimcha maydonlar), UrgencyBanner (4 daraja, emergency uchun role="alert" va tel:103 tugma), ConditionResult (bo'limlar, OTC kartalar) ni yoz. Validatsiya xabarlari i18n'da. Natijadan keyin "Yangi so'rov".
```

## 7-bosqich: Asosiy sahifa va tarix
```
app/page.tsx: Hero, Tabs (Dori | Kasallik), "Qanday ishlaydi", FAQ, footer. HistoryDrawer: localStorage'da oxirgi 10 natija (rasmsiz), tozalash tugmasi, birinchi saqlashda tushuntirish. "Nusxalash" va "Ulashish" (Web Share API, fallback clipboard).
```

## 8-bosqich: Sayqal va sifat
```
SEO (metadata, OG rasm, robots, sitemap), Lighthouse tekshiruvi (Perf ≥85, A11y ≥95), klaviatura/ekran o'quvchi tekshiruvi, bo'sh/xato holatlarini ko'rib chiq, Playwright bilan 2 ta e2e (dori mock oqimi, kasallik emergency oqimi). TZ.md "Qabul mezonlari" ro'yxatini birma-bir tekshirib hisobot ber.
```

## 9-bosqich: Deploy
```
Vercel uchun env'larni README ga yoz, production build tekshir, Privacy va Terms sahifalarini (docs/SAFETY.md 3 va 5-bo'limlar asosida) qo'sh, Turnstile (ixtiyoriy) integratsiyasini qo'sh.
```

---
## Keyingi g'oyalar (MVP'dan keyin)
Shtrix-kod skaneri, dorixona narx/mavjudlik, Telegram bot, ovozli kiritish, PWA, akkaunt va tarix sinxronizatsiyasi.
