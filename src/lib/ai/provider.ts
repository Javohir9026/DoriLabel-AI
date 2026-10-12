export type ImageInput = { mimeType: string; base64: string };
export type AnalyzeInput = { locale: "uz" | "ru" | "tg" | "en"; text: string; images?: ImageInput[]; redFlag?: boolean; repairHint?: string };
export interface AiProvider {
  analyzeDrug(input: AnalyzeInput): Promise<string>;
  analyzeCondition(input: AnalyzeInput): Promise<string>;
  findSimilarOptions(input: AnalyzeInput): Promise<string>;
}

const source = { title: "MedlinePlus", url: "https://medlineplus.gov/druginformation.html" };
const options = [
  { activeIngredient: "Paracetamol", exampleBrands: [], purpose: "Og'riq va isitmani yengillashtirish uchun.", howToTake: "Qadoq yo'riqnomasiga amal qiling.", cautions: ["Jigar kasalligi yoki boshqa dorilar bo'lsa, farmatsevt bilan tekshiring."], sources: [source] },
  { activeIngredient: "Ibuprofen", exampleBrands: [], purpose: "Og'riq va yallig'lanish alomatlarini yengillashtirish uchun.", howToTake: "Qadoq yo'riqnomasiga amal qiling.", cautions: ["Oshqozon yarasi, buyrak muammosi yoki homiladorlikda shifokor bilan tekshiring."], sources: [source] },
  { activeIngredient: "Naproxen", exampleBrands: [], purpose: "Ayrim og'riq va yallig'lanish alomatlarini yengillashtirish uchun.", howToTake: "Qadoq yo'riqnomasiga amal qiling.", cautions: ["Boshqa yallig'lanishga qarshi dorilar bilan birga qabul qilmang."], sources: [source] },
];
const mock: AiProvider = {
  async analyzeDrug(input) {
    const name = input.text || "Aniqlanmagan dori";
    return JSON.stringify({ inputType: input.images?.length ? "package" : "name_only", items: [{ identified: true, confidence: input.images?.length ? "medium" : "low", brandName: name, genericName: null, activeIngredients: [], form: null, manufacturer: null, purpose: "Aniq ma'lumot uchun dori nomi va yo'riqnomani tekshiring.", usedFor: [], howToTake: { timing: null, generalDirections: null, note: "Aniq dozani shifokor yoki farmatsevt belgilaydi." }, contraindications: [], pregnancyNursing: null, children: null, sideEffects: { common: [], serious: [] }, interactions: [], storage: null, seeDoctorIf: ["Nojo'ya ta'sir yoki shubha bo'lsa."], needsClarification: input.images?.length ? "Rasmdagi yozuvni aniqlash uchun AI kaliti kerak." : null, sources: [source] }], generalNotes: ["Mock rejim: haqiqiy tahlil uchun AI_PROVIDER va API kalitini sozlang."], disclaimer: "" });
  },
  async analyzeCondition(input) {
    const emergency = Boolean(input.redFlag);
    return JSON.stringify({ urgency: emergency ? "emergency" : "see_doctor_soon", summary: emergency ? "Xavfli belgi aniqlanishi mumkin." : "Bu tashxis emas; simptomlar bir necha holatda uchrashi mumkin.", possibleCauses: emergency ? [] : ["Virusli infeksiya yoki boshqa holat"], selfCare: emergency ? [] : ["Dam oling va yetarli suyuqlik iching."], otcOptions: [], redFlags: ["Alomatlar kuchaysa"], seeDoctorIf: ["Alomatlar davom etsa yoki yomonlashsa"], emergencyMessage: emergency ? "Darhol 103 ga qo'ng'iroq qiling yoki eng yaqin shifoxonaga boring." : null, sources: [source], disclaimer: "" });
  },
  async findSimilarOptions() { return JSON.stringify({ otcOptions: options }); },
};

export async function getProvider(): Promise<AiProvider> {
  if ((process.env.AI_PROVIDER ?? "mock") === "mock") return mock;
  if (process.env.AI_PROVIDER === "gemini") return (await import("./gemini")).geminiProvider;
  if (process.env.AI_PROVIDER === "openai") return (await import("./openai")).openaiProvider;
  if (process.env.AI_PROVIDER === "anthropic") return (await import("./anthropic")).anthropicProvider;
  throw new Error("AI_FAILED");
}
