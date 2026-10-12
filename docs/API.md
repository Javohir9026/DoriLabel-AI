# API va sxemalar

Barcha javoblar JSON. Xato formati:
```json
{ "error": { "code": "RATE_LIMITED", "message": "Matn (i18n kaliti)" } }
```
Xato kodlari: `INVALID_INPUT`, `FILE_TOO_LARGE`, `UNSUPPORTED_TYPE`, `TOO_MANY_FILES`, `RATE_LIMITED` (429, `Retry-After`), `AI_FAILED` (502), `AI_INVALID_OUTPUT` (502), `TIMEOUT` (504), `INTERNAL` (500).

## POST /api/analyze-drug
`multipart/form-data`:
- `images`: 0–4 fayl (jpeg/png/webp, har biri ≤ MAX_IMAGE_MB)
- `drugName`: string, ixtiyoriy (≤ 120)
- `question`: string, ixtiyoriy (≤ 500)
- `locale`: `uz | ru | en` (default `uz`)

Kamida `images` yoki `drugName` bo'lishi shart.

Javob 200: `DrugAnalysis`.

## POST /api/analyze-condition
```json
{
  "description": "string, 10..1500",
  "ageGroup": "child | adult | senior | unknown",
  "sex": "female | male | unknown",
  "pregnantOrNursing": "yes | no | unknown",
  "chronicOrAllergies": "string?, ≤300",
  "duration": "string?, ≤100",
  "locale": "uz | ru | en"
}
```
Javob 200: `ConditionAnalysis`.

## Zod sxemalar (`src/lib/schemas`)
```ts
import { z } from "zod";

export const Source = z.object({
  title: z.string().min(1),
  url: z.string().url().refine((u) => u.startsWith("https://")),
});

export const Confidence = z.enum(["high", "medium", "low"]);

export const DrugItem = z.object({
  identified: z.boolean(),
  confidence: Confidence,
  brandName: z.string().nullable(),
  genericName: z.string().nullable(),
  activeIngredients: z.array(z.object({ name: z.string(), strength: z.string().nullable() })),
  form: z.string().nullable(),            // tabletka, sirop...
  manufacturer: z.string().nullable(),
  purpose: z.string(),                    // oddiy tilda qisqa
  usedFor: z.array(z.string()),           // kasalliklar/holatlar
  howToTake: z.object({
    timing: z.string().nullable(),        // ovqatdan oldin/keyin
    generalDirections: z.string().nullable(), // yo'riqnomadagi umumiy ma'lumot
    note: z.string(),                     // "aniq dozani shifokor belgilaydi"
  }),
  contraindications: z.array(z.string()),
  pregnancyNursing: z.string().nullable(),
  children: z.string().nullable(),
  sideEffects: z.object({ common: z.array(z.string()), serious: z.array(z.string()) }),
  interactions: z.array(z.string()),
  storage: z.string().nullable(),
  seeDoctorIf: z.array(z.string()),
  needsClarification: z.string().nullable(), // o'qilmagan/noaniq joy
  sources: z.array(Source),
});

export const DrugAnalysis = z.object({
  inputType: z.enum(["package", "leaflet", "prescription", "name_only"]),
  items: z.array(DrugItem).min(0).max(15),
  generalNotes: z.array(z.string()),
  disclaimer: z.string(),
});

export const Urgency = z.enum(["self_care", "see_doctor_soon", "urgent", "emergency"]);

export const OtcOption = z.object({
  activeIngredient: z.string(),
  exampleBrands: z.array(z.string()),
  purpose: z.string(),
  howToTake: z.string(),                  // umumiy yo'riqnoma asosida
  cautions: z.array(z.string()),
  sources: z.array(Source),
});

export const ConditionAnalysis = z.object({
  urgency: Urgency,
  summary: z.string(),
  possibleCauses: z.array(z.string()),
  selfCare: z.array(z.string()),
  otcOptions: z.array(OtcOption),
  redFlags: z.array(z.string()),
  seeDoctorIf: z.array(z.string()),
  emergencyMessage: z.string().nullable(), // urgency=emergency bo'lsa majburiy
  sources: z.array(Source),
  disclaimer: z.string(),
});
```

## Qoidalar
- `parse.ts`: model javobidan JSON ni ajrat (kod bloki/ortiqcha matnni olib tashla) → `safeParse` → muvaffaqiyatsiz bo'lsa **1 marta** xatoni ko'rsatib qayta so'ra → baribir bo'lmasa `AI_INVALID_OUTPUT`.
- Server natijaga `disclaimer` ni o'zi qo'shadi/ustiga yozadi (modelga ishonma): `lib/safety/disclaimer.ts`.
- `urgency === "emergency"` bo'lsa `emergencyMessage` null bo'lmasin; bo'lsa server default matnni qo'yadi.
- `identified=false` yoki `confidence=low` bo'lsa UI "Aniqlashtirish kerak" holatini ko'rsatadi.
