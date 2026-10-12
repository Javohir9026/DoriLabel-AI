# AGENTS.md — DoriLabel AI

Sen DoriLabel AI loyihasida ishlayotgan senior full-stack muhandissan. Ishni boshlashdan oldin `docs/` ichidagi fayllarni o'qi: TZ.md, ARCHITECTURE.md, API.md, AI_PROMPTS.md, UI_UX.md, SAFETY.md.

## Loyiha
Foydalanuvchi dori qutisi/retsept rasmini yuklaydi yoki kasallik belgilarini yozadi. AI tahlil qiladi, internetdan qidiradi va tushunarli, tuzilgan ma'lumot qaytaradi. **Login yo'q, ma'lumotlar bazasi yo'q (MVP).** Bitta sahifa, 2 tab: "Dori bo'yicha" va "Kasallik bo'yicha".

## Stack (o'zgartirma)
Next.js (App Router) + TypeScript (strict) + Tailwind CSS + shadcn/ui + zod + pnpm. Backend — Next.js Route Handlers (`app/api/**`). AI chaqiruvlari faqat serverda.

## Qat'iy qoidalar
1. **Tibbiy xavfsizlik** — `docs/SAFETY.md` majburiy. AI tashxis qo'ymaydi, retsept yozmaydi, shaxsiy dozani buyurmaydi. Har natijada ogohlantirish (disclaimer) bo'lishi shart.
2. **API kalitlar** hech qachon klientga chiqmasin. Faqat `process.env`, faqat serverda. `.env.example` ni yangila, `.env*` ni commit qilma.
3. **Rasmlar saqlanmaydi.** Diskka, bazaga, logga yozilmaydi. Faqat xotirada ishlanadi.
4. **Barcha AI javoblari** zod bilan validatsiya qilinadi (`docs/API.md`). Validatsiyadan o'tmasa — bir marta qayta urin, keyin xato qaytar.
5. **Til:** UI va AI javobi default o'zbekcha (lotin). Ru/En — `lib/i18n`.
6. **Kod:** `any` yo'q, `console.log` qoldirma, funksiyalar kichik, nomlar inglizcha, UI matnlari i18n faylida.
7. **Har bir UI komponent**: loading, empty, error, dark mode, mobile (360px dan boshlab) holatlarini qamrab olsin. Boolean/null/undefined holatlarini aniq tekshir.
8. Yangi paket qo'shishdan oldin kerakligini asosla. Keraksiz kutubxona qo'shma.
9. Har vazifa oxirida: `pnpm lint && pnpm typecheck && pnpm build` o'tishi shart.
10. Fayllarni **to'liq** yoz (qisman diff emas), agar o'zgarish keng bo'lsa.

## Ish tartibi
Vazifani `docs/TASKS.md` dan ol → rejani 3-5 qatorda yoz → bajar → tekshir → nima qilganingni qisqa yoz. Noaniq joyda to'xtab so'rama: `docs/TZ.md` dagi eng oqilona variantni tanla va izohda ko'rsat.

## Qilma
- Foydalanuvchi akkaunti, to'lov, admin panel qo'shma (MVP tashqarisida).
- Rasmni bazaga/cloud storage'ga yuklama.
- AI javobiga "ishonch bilan" tashxis yoki aniq doza (mg/kun) qo'shma — faqat yo'riqnoma (instruksiya) asosidagi umumiy ma'lumot.
