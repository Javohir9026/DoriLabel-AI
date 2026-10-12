# UI / UX

## Umumiy
Toza, ishonchli "tibbiy" ko'rinish: oq/och fon, asosiy rang — yashil-firuza (#0F9D8A atrofida), ogohlantirish — sariq/qizil. Dark mode: to'q kulrang, kontrast saqlanadi. Shrift: Inter (kirill+lotin). Radius 12–16px, yumshoq soyalar. Mobile-first.

## Sahifa tuzilishi (`/`)
1. **Header**: logo "DoriLabel AI", til almashtirgich (UZ/RU/EN), tema tugmasi, "Tarix" tugmasi.
2. **Hero** (qisqa): sarlavha "Dorini rasmga oling — tushunarli javob oling", 1 qator tushuntirish.
3. **Tablar** (segmented control, sticky mobilda): `Dori bo'yicha` | `Kasallik bo'yicha`.
4. **Tab kontenti** (forma yoki natija).
5. **Qanday ishlaydi** (3 qadam), **FAQ** (4–5 savol), **Footer** (disclaimer, maxfiylik eslatmasi).

## Dori tabi
- Katta yuklash zonasi: "Rasmga oling yoki yuklang" (mobilda `capture="environment"` bilan kamera tugmasi + galereya tugmasi). Drag&drop (desktop).
- Miniaturalar (max 4), har birida o'chirish tugmasi, "Old tomon / Orqa tomon / Yo'riqnoma" yorlig'i ixtiyoriy.
- Maslahat matni: "Nomi va faol modda yozuvi aniq ko'ringan bo'lsin."
- Ixtiyoriy qo'shimcha: dori nomi, savol.
- "Tahlil qilish" tugmasi: rasm ham, nom ham yo'q bo'lsa disabled.
- Natija: har dori uchun karta; tepada nomi + ishonch belgisi (high/medium/low badge). Bo'limlar accordion (birinchi 3 tasi ochiq: Nima uchun, Qachon va qanday ichiladi, Qarshi ko'rsatmalar). Retseptda kartalar ro'yxati + tepada "N ta dori topildi".
- `identified=false` / `confidence=low`: sariq blok "Aniq o'qib bo'lmadi: {needsClarification}. Yaxshiroq rasm yuklang yoki nomini yozing." + "Qayta urinish".

## Kasallik tabi
- Katta textarea + belgilar sanagich (0/1500), placeholder misol: "Ikki kundan beri tomog'im og'riyapti, harorat 37.8…".
- Qo'shimcha maydonlar yig'iladigan blokda ("Aniqroq natija uchun").
- Natija tepasida `UrgencyBanner`:
  - `self_care` — yashil, `see_doctor_soon` — sariq, `urgent` — to'q sariq, `emergency` — qizil, to'liq kenglikda, "103" tugmasi (`tel:103`).
- Keyin bo'limlar: Xulosa, Mumkin bo'lgan sabablar, Uyda qilish mumkin, Retseptsiz dorilar (kartalar), Xavfli belgilar, Shifokorga qachon.

## Holatlar (har ekran uchun majburiy)
| Holat | Ko'rinish |
|---|---|
| idle | forma |
| validating | inline xato matnlari |
| loading | `ProgressSteps` (4 bosqich, skeleton), "Bekor qilish" tugmasi (AbortController) |
| success | natija + "Yangi so'rov" |
| error | `ErrorState` (xato kodiga mos matn + "Qayta urinish") |
| rate-limited | qancha kutish kerakligi (Retry-After) |
| offline | "Internet aloqasi yo'q" |

## Kirish (accessibility)
- Barcha tugmalarda aniq `aria-label`, fokus halqasi ko'rinadi.
- Progress va natija `aria-live="polite"`; emergency — `role="alert"`.
- Rang yagona ma'lumot tashuvchisi bo'lmasin (ikonka + matn).
- Tegish maydoni ≥ 44px.

## Tarix (ixtiyoriy)
`localStorage`: oxirgi 10 natija (rasmsiz, faqat matnli natija JSON). "Tarixni tozalash" tugmasi. Birinchi marta saqlashdan oldin tushuntirish: "Tarix faqat shu qurilmada saqlanadi."

## Mikro-matnlar
Barchasi `lib/i18n` da. Hardcode qilingan UI matni bo'lmasin.
