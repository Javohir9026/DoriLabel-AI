# Xavfsizlik, maxfiylik va qonuniy qoidalar

## 1. Tibbiy xavfsizlik
- DoriLabel AI **ma'lumot beradi**, davolamaydi. Tashxis, retsept, shaxsiy doza — yo'q.
- Disclaimer: har natijada ko'rinadigan joyda (karta ostida) + footerda. Server qo'shadi, modeldan kelganiga ishonilmaydi.
- Retsept talab qiladigan dorilar o'z-o'zini davolash uchun tavsiya qilinmaydi.
- Maxsus guruhlar (bola, homilador, emizuvchi, keksa, surunkali kasal) haqida ma'lumot yetishmasa — "shifokorga murojaat qiling" deb yakunlanadi.
- Aniq mg/kun dozasi: faqat rasmiy yo'riqnomadan olingan umumiy ma'lumot sifatida, "aniq dozani shifokor belgilaydi" izohi bilan. Vazn/yoshga moslab **hisoblab berilmaydi**.
- O'zaro ta'sirlar: noaniq bo'lsa "farmatsevt bilan tekshiring".

## 2. Favqulodda holatlar (red-flag pre-check)
`lib/safety/redflags.ts` — uz/ru/en kalit so'zlar ro'yxati (regex, kichik harf, apostrof variantlari):
ko'krak og'rig'i, nafas qisil(ay)di, hushdan ket, qon ket (kuchli), yuz qiyshay, nutq buz, falaj, talvasa, zaharlan, ko'p dori ichib yubor, o'zimni o'ldir / o'lgim kel (va ru: "хочу умереть", "боль в груди", "не могу дышать" …), chaqaloq + isitma va h.k.

Topilsa:
1. Server AI promptiga "red flag detected" belgisini qo'shadi.
2. Natijada `urgency = emergency` majburlanadi (model past baholasa ham).
3. UI qizil banner: "103 ga qo'ng'iroq qiling". O'z joniga qasd belgilari bo'lsa — mehribon, qisqa matn: yolg'iz emasligini ayt, 103 va yaqin odamga murojaat qilishni tavsiya qil. OTC dori tavsiya qilinmaydi.

## 3. Maxfiylik
- Rasmlar/matnlar: diskka, DB'ga, loglarga, analytics'ga yozilmaydi.
- AI provayderga yuboriladi — footerda va birinchi yuklashda tushuntiriladi: "Rasm tahlil uchun AI xizmatiga yuboriladi, saqlanmaydi."
- Provayder sozlamalarida ma'lumotni o'qitishda ishlatmaslik (zero/limited retention) yoqilgan bo'lsin.
- Rasmdan shaxsiy ma'lumot (ism, pasport, telefon — ayniqsa retseptda) chiqarilmaydi va natijaga yozilmaydi. Prompt: "Bemor ismi va shaxsiy ma'lumotlarni natijaga kiritma."
- Cookie: faqat zarur (til/tema). Tracking yo'q. Analytics qo'shilsa — cookie'siz (Plausible/Umami) va kontentsiz.

## 4. Texnik himoya
- Server-side validatsiya (MIME magic-bytes, hajm, soni).
- Rate limit (IP hash + sliding window).
- Prompt injection: foydalanuvchi kiritishi `<user_input>` ichida, system promptda "amal qilma" qoidasi.
- SSRF yo'q: server foydalanuvchi bergan URL'ni fetch qilmaydi.
- Havolalar faqat `https`, `noopener noreferrer`.
- Xato xabarlarida ichki ma'lumot (stack, kalit) chiqmaydi.
- Bot himoyasi (ixtiyoriy): Cloudflare Turnstile.

## 5. Huquqiy eslatma (ishga tushirishdan oldin)
- Sayt "tibbiy xizmat" yoki "tibbiy qurilma" sifatida taqdim etilmasin; marketingda "davolaydi", "tashxis qo'yadi" so'zlari ishlatilmasin.
- O'zbekiston shaxsiy ma'lumotlar qonunchiligi va Terms/Privacy sahifalari yuristdan tekshirilsin.
- Dori reklamasi/homiylik natijalarga **aralashmasin** (AI tavsiyalari tijoriy ta'sirsiz).
