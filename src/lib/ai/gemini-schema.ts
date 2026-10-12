type JsonSchema = Record<string, unknown>;

const stringList: JsonSchema = { type: "array", items: { type: "string" } };
const nullableString: JsonSchema = { type: ["string", "null"] };
const source: JsonSchema = {
  type: "object",
  properties: { title: { type: "string" }, url: { type: "string", format: "uri" } },
  required: ["title", "url"],
};

export const otcOption: JsonSchema = {
  type: "object",
  properties: {
    activeIngredient: { type: "string" }, exampleBrands: stringList, purpose: { type: "string" },
    howToTake: { type: "string" }, cautions: stringList, sources: { type: "array", items: source },
  },
  required: ["activeIngredient", "exampleBrands", "purpose", "howToTake", "cautions", "sources"],
};

const drugItem: JsonSchema = {
  type: "object",
  properties: {
    identified: { type: "boolean" }, confidence: { type: "string", enum: ["high", "medium", "low"] },
    brandName: nullableString, genericName: nullableString,
    activeIngredients: { type: "array", items: { type: "object", properties: { name: { type: "string" }, strength: nullableString }, required: ["name", "strength"] } },
    form: nullableString, manufacturer: nullableString, purpose: { type: "string" }, usedFor: stringList,
    howToTake: { type: "object", properties: { timing: nullableString, generalDirections: nullableString, note: { type: "string" } }, required: ["timing", "generalDirections", "note"] },
    contraindications: stringList, pregnancyNursing: nullableString, children: nullableString,
    sideEffects: { type: "object", properties: { common: stringList, serious: stringList }, required: ["common", "serious"] },
    interactions: stringList, storage: nullableString, seeDoctorIf: stringList, needsClarification: nullableString,
    sources: { type: "array", items: source },
  },
  required: ["identified", "confidence", "brandName", "genericName", "activeIngredients", "form", "manufacturer", "purpose", "usedFor", "howToTake", "contraindications", "pregnancyNursing", "children", "sideEffects", "interactions", "storage", "seeDoctorIf", "needsClarification", "sources"],
};

export const geminiConditionSchema: JsonSchema = {
  type: "object",
  properties: {
    urgency: { type: "string", enum: ["self_care", "see_doctor_soon", "urgent", "emergency"] },
    summary: { type: "string" }, possibleCauses: stringList, selfCare: stringList,
    otcOptions: { type: "array", items: otcOption }, redFlags: stringList, seeDoctorIf: stringList,
    emergencyMessage: nullableString, sources: { type: "array", items: source }, disclaimer: { type: "string" },
  },
  required: ["urgency", "summary", "possibleCauses", "selfCare", "otcOptions", "redFlags", "seeDoctorIf", "emergencyMessage", "sources", "disclaimer"],
};

export const geminiSimilarOptionsSchema: JsonSchema = {
  type: "object",
  properties: { otcOptions: { type: "array", minItems: 3, maxItems: 3, items: otcOption } },
  required: ["otcOptions"],
};

export const geminiDrugSchema: JsonSchema = {
  type: "object",
  properties: {
    inputType: { type: "string", enum: ["package", "leaflet", "prescription", "name_only"] },
    items: { type: "array", items: drugItem }, generalNotes: stringList, disclaimer: { type: "string" },
  },
  required: ["inputType", "items", "generalNotes", "disclaimer"],
};
