import type { Locale } from "@/lib/schemas/common";

const text: Record<Locale, string> = {
  uz: "Bu ma'lumot faqat tanishuv uchun va shifokor maslahatini almashtirmaydi. Dori ichishdan oldin shifokor yoki farmatsevt bilan maslahatlashing. Sog'lig'ingiz yomonlashsa yoki xavfli belgilar bo'lsa, darhol 103 ga qo'ng'iroq qiling.",
  ru: "Информация носит справочный характер и не заменяет консультацию врача. Перед приемом лекарства проконсультируйтесь с врачом или фармацевтом. При ухудшении или опасных симптомах звоните 103.",
  tg: "Ин маълумот танҳо барои шиносоӣ аст ва маслиҳати духтурро иваз намекунад. Пеш аз қабули дору бо духтур ё дорусоз маслиҳат кунед. Ҳангоми бадшавӣ ё аломатҳои хатарнок фавран ба 103 занг занед.",
  en: "This information is for general education and does not replace medical advice. Consult a doctor or pharmacist before taking medicine. If symptoms worsen or are dangerous, call emergency services.",
};

const emergency: Record<Locale, string> = {
  uz: "Darhol 103 ga qo'ng'iroq qiling yoki eng yaqin shifoxonaga boring.",
  ru: "Немедленно позвоните 103 или обратитесь в ближайшую больницу.",
  tg: "Фавран ба 103 занг занед ё ба беморхонаи наздиктарин равед.",
  en: "Call 103 immediately or go to the nearest hospital.",
};

export const disclaimer = (locale: Locale) => text[locale];
export const emergencyMessage = (locale: Locale) => emergency[locale];
