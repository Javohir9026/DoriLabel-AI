# DoriLabel AI

Dori qutisi/retsept rasmini yoki kasallik tavsifini AI orqali tahlil qilib, tushunarli ma'lumot beradigan web sayt. Login/ro'yxatdan o'tish yo'q.

## Hujjatlar (Codex shularni o'qiydi)
| Fayl | Mazmuni |
|---|---|
| `AGENTS.md` | AI agent uchun asosiy qoidalar (har doim birinchi o'qiladi) |
| `docs/TZ.md` | Texnik topshiriq (nima qilinadi) |
| `docs/ARCHITECTURE.md` | Stack, papka strukturasi, oqimlar, env |
| `docs/API.md` | Endpointlar va zod sxemalar |
| `docs/AI_PROMPTS.md` | System promptlar, JSON natija formati |
| `docs/UI_UX.md` | Dizayn, ekranlar, holatlar |
| `docs/SAFETY.md` | Tibbiy xavfsizlik, maxfiylik, qonuniy qoidalar |
| `docs/TASKS.md` | Bosqichma-bosqich vibe coding vazifalari (Codex promptlari) |

## Boshlash
1. Bu papkani yangi repo ildiziga qo'ying.
2. Codex'ga: `AGENTS.md va docs/TASKS.md ni o'qi, 1-bosqichdan boshla.`
3. Har bosqichdan keyin `pnpm lint && pnpm typecheck && pnpm build` ishlating.

## Gemini Free API

1. Google AI Studio'da Gemini API kalitini yarating.
2. `.env.example` faylidan `.env` nusxa oling.
3. Quyidagini to'ldiring:

```env
AI_PROVIDER=gemini
GEMINI_API_KEY=kalitingizni_bu_yerga_yozing
GEMINI_MODEL=gemini-flash-lite-latest
```

Kalit faqat serverda ishlatiladi va brauzerga yuborilmaydi. Free tier limitlari hamda mavjud modellar Google AI Studio hisobida ko'rinadi.

## Telegram bot va Mini App

Bot quyidagilarni qo'llab-quvvatlaydi: alomatlarni matn bilan tahlil qilish, dori rasmi, `/dori Paracetamol` buyrug'i, til tanlash va web ilovani Telegram Mini App sifatida ochish.

1. BotFather orqali bot yarating va tokenni oling.
2. Production domeningiz HTTPS bo'lgach, `.env` ga yozing:

```env
TELEGRAM_BOT_TOKEN=...
TELEGRAM_WEBHOOK_SECRET=uzun_tasodifiy_maxfiy_matn
TELEGRAM_WEB_APP_URL=https://sizning-domeningiz.uz
```

3. Quyidagi so'rov bilan webhook'ni ulang (token va secretni o'zingizniki bilan almashtiring):

```text
https://api.telegram.org/bot<TOKEN>/setWebhook?url=https://sizning-domeningiz.uz/api/telegram/webhook&secret_token=<SECRET>
```

Botga `/start` yuboring. “Web ilovani ochish” tugmasi saytni Telegram ichida Mini App tarzida ochadi. Bot API webhook va Mini App tugmalari Telegram’ning rasmiy [Bot API](https://core.telegram.org/bots/api) hamda [Mini Apps hujjatlariga](https://core.telegram.org/bots/webapps) mos.

### Local polling rejimi

Webhook va tunnel ishlatmasdan local test qilish uchun `.env` ichida `TELEGRAM_BOT_TOKEN` bo'lishi kifoya. Keyin bitta buyruq ishlating:

```bash
npm run dev
```

Bu buyruq front-end hamda Telegram bot polling processini bir vaqtda ishga tushiradi. Alohida ishlatish kerak bo'lsa `npm run dev:web` yoki `npm run bot:dev` dan foydalaning. Polling boshlanganda webhook avtomatik o'chiriladi. Local rejimda `TELEGRAM_WEB_APP_URL`ni bo'sh qoldiring: bot tahlil funksiyalari ishlaydi, lekin Telegram HTTPS talab qilgani uchun Mini App tugmasi chiqmaydi. Mini App uchun tunnel yoki production HTTPS URL kiriting.

## Deploy checklist

Productionga chiqarishdan oldin quyidagilarni tekshiring:

1. Hosting sozlamalarida `.env` dagi barcha server kalitlarini kiriting; `NEXT_PUBLIC_SITE_URL` va `TELEGRAM_WEB_APP_URL` uchun haqiqiy `https://` domeningizni yozing.
2. `TELEGRAM_BOT_TOKEN`, `GEMINI_API_KEY` va `TELEGRAM_WEBHOOK_SECRET`ni Git repositoryga yuklamang. Ularni faqat hostingning Environment Variables bo'limida saqlang.
3. Productionda Telegram uchun polling emas, webhookdan foydalaning. Deploydan keyin Bot API orqali `/api/telegram/webhook` URLiga webhook o'rnating.
4. Builddan avval `pnpm test && pnpm lint && pnpm typecheck && pnpm build` buyrug'ini ishlating.
5. Dori va sog'liq bo'yicha natijalarni real qurilmada, to'rtala tilda, oddiy va emergency so'rovlar bilan tekshiring. Ilova tashxis o'rnini bosmasligini doimo ko'rsating.
