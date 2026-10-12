import { z } from "zod";
export const localeSchema = z.enum(["uz", "ru", "tg", "en"]); export type Locale = z.infer<typeof localeSchema>;
export const sourceSchema = z.object({ title:z.string().min(1), url:z.string().url().refine((url)=>url.startsWith("https://")) });
export const confidenceSchema = z.enum(["high","medium","low"]);
