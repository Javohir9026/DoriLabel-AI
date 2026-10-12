# Texnik topshiriq (TZ) — DoriLabel AI

## 1. Maqsad
Odamlar dori nomi, tarkibi, qo'llanilishi va ichish tartibini tushunmaganda tez va ishonchli javob olishi uchun AI-yordamchi web sayt. Maqsadli auditoriya: O'zbekiston foydalanuvchilari (asosan mobil telefon).

## 2. Asosiy qoidalar
- Ro'yxatdan o'tish / login **yo'q**.
- Bitta asosiy sahifa (`/`), ikki tab.
- Til: o'zbek (lotin) default; ru, en qo'shimcha.
- Mobile-first, tez, minimal.
- MVP'da DB yo'q. Tarix — faqat brauzer `localStorage`'da (ixtiyoriy, o'chirish mumkin).

## 3. Funksional talablar

### 3.1 Tab 1 — "Dori bo'yicha so'rash"
**Kirish:**
- 1–4 ta rasm: dori qutisi (old/orqa), blister, yo'riqnoma (varaq) yoki **retsept**. Kamera (mobilda) yoki galereyadan.
- Ixtiyoriy matn maydoni: "Qo'shimcha savol" (masalan: "Bolaga mumkinmi?").
- Ixtiyoriy: dori nomini qo'lda yozish (rasm bo'lmasa).
- "Tahlil qilish" tugmasi.

**Jarayon:**
1. Klient rasmni siqadi (max 1600px, JPEG ~0.8, har biri ≤ 4 MB), EXIF'ni olib tashlaydi.
2. Server rasmdan matn va dori nomini aniqlaydi (vision).
3. AI internetdan qidiradi (rasmiy yo'riqnoma, DrugBank/WHO/rasmiy ro'yxatlar, ishlab chiqaruvchi sayti, Sog'liqni saqlash vazirligi manbalari ustuvor).
4. Tuzilgan natija qaytaradi (3.4).

**Retsept rasmi:** bir nechta dori bo'lsa — har biri alohida karta. Qo'l yozuvi o'qilmasa, "ishonch past" deb belgilanadi va foydalanuvchiga aniqlashtirish so'raladi; taxmin qilib to'qima.

### 3.2 Tab 2 — "Kasallik bo'yicha so'rash"
**Kirish:**
- Matn maydoni (min 10, max 1500 belgi): "Menda shunday holatlar kuzatilyapti…".
- Ixtiyoriy tezkor maydonlar: yosh oralig'i (bola / kattalar / 60+), jins, homiladorlik/emizish (ha/yo'q), surunkali kasallik/allergiya (erkin matn), belgilar necha kundan beri.
- "Tahlil qilish" tugmasi.

**Natija:** (3.5) mumkin bo'lgan sabablar (tashxis emas), uyda qilish mumkin choralar, retseptsiz sotiladigan dori variantlari (faol modda, nima uchun, qachon va qanday ichiladi — umumiy yo'riqnoma asosida), ogohlantirish belgilari, qachon shifokorga borish kerak.

**Favqulodda holat:** matnda xavfli belgilar bo'lsa (ko'krak og'rig'i, nafas qisilishi, hushdan ketish, kuchli qon ketish, insult belgilari, o'z joniga qasd fikrlari va h.k.) — AI oddiy tavsiya o'rniga darhol qizil ogohlantirish chiqaradi: "103 ga qo'ng'iroq qiling / eng yaqin shifoxonaga boring". Qarang: `SAFETY.md`.

### 3.3 Umumiy
- Natija yuklanayotganda bosqichli progress: "Rasm o'qilmoqda → Dori aniqlanmoqda → Ma'lumot qidirilmoqda → Javob tayyorlanmoqda".
- Natija ostida: manbalar ro'yxati (havola bilan), "Natijani nusxalash", "Ulashish" (matn), "Yangi so'rov".
- Har natijada pastda doimiy disclaimer.
- Xato holatlari: tarmoq, timeout, rasm o'qilmadi, dori topilmadi, rate limit, AI javobi yaroqsiz.
- Rate limit: bir IP ga soatiga 10 so'rov (sozlanadi). Cheklanganda tushunarli xabar.

### 3.4 Dori natijasi (kartada ko'rsatiladigan bo'limlar)
1. **Nomi** (savdo nomi + xalqaro nomi/faol modda + miqdori, shakli: tabletka/sirop va h.k.), ishlab chiqaruvchi, ishonch darajasi.
2. **Nima uchun ishlatiladi** (qisqa, oddiy tilda).
3. **Qaysi kasalliklarda/holatlarda qo'llaniladi.**
4. **Qanday va qachon ichiladi** (ovqatdan oldin/keyin, kuniga necha marta — faqat yo'riqnomada yozilgan umumiy ma'lumot; "Aniq dozani shifokor belgilaydi" izohi bilan).
5. **Kimlarga mumkin emas** (qarshi ko'rsatmalar), homiladorlik/emizish, bolalar.
6. **Yon ta'sirlar** (tez-tez / jiddiy).
7. **Boshqa dorilar/ovqat/alkogol bilan o'zaro ta'sir.**
8. **Saqlash sharoiti.**
9. **Qachon shifokorga murojaat qilish kerak.**
10. **Manbalar.**

### 3.5 Kasallik natijasi
1. Qisqa xulosa (urgency darajasi: `self_care | see_doctor_soon | urgent | emergency`).
2. Mumkin bo'lgan sabablar (tashxis emas).
3. Uyda qilish mumkin choralar.
4. Tavsiya etiladigan retseptsiz dorilar (faol modda, vazifasi, qachon/qanday ichiladi, ehtiyot choralari). Retsept talab qiladigan dorilar (antibiotik, gormon, psixotrop va h.k.) **tavsiya qilinmaydi**.
5. Xavfli belgilar (red flags).
6. Qachon shifokorga borish kerak.
7. Manbalar.

## 4. Nofunksional talablar
- Birinchi kontentli ko'rinish < 2 s (mobil 4G).
- Natija vaqti: odatda 10–40 s; timeout 60 s.
- Lighthouse: Performance ≥ 85, Accessibility ≥ 95.
- WCAG AA kontrast, klaviatura bilan boshqarish, `aria-live` natija/progress uchun.
- Dark/light mode (tizim sozlamasiga ergashadi).
- Maxfiylik: rasmlar va matnlar saqlanmaydi, logga yozilmaydi; IP faqat rate limit uchun (hash).
- SEO: asosiy meta, OG rasm, `robots.txt`, `sitemap.xml`; sahifada FAQ va "Qanday ishlaydi".

## 5. MVP tashqarisida (keyin)
Akkaunt, to'lov, dorixona narxlari/mavjudligi, shtrix-kod skaneri, ovozli kiritish, Telegram bot, PWA offline, admin panel.

## 6. Qabul mezonlari
- [ ] Dori qutisi rasmi bilan 3.4 dagi barcha bo'limlar to'g'ri chiqadi.
- [ ] Retseptda 2+ dori alohida kartalarda chiqadi.
- [ ] Kasallik tabida xavfli belgi kiritilganda `emergency` ogohlantirish chiqadi.
- [ ] Rasm/matn serverda saqlanmaydi (kod va loglar tekshiriladi).
- [ ] Yaroqsiz fayl (PDF, 20 MB rasm, rasm bo'lmagan) chiroyli xato beradi.
- [ ] 360px, 768px, 1280px da to'g'ri ko'rinadi; dark mode ishlaydi.
- [ ] Rate limit ishlaydi.
- [ ] `pnpm lint && pnpm typecheck && pnpm build` xatosiz.
