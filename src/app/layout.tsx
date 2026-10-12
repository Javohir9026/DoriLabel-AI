import type { Metadata, Viewport } from "next";
import { Quicksand } from "next/font/google";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://dorilabel.ai";
const quicksand = Quicksand({ subsets: ["latin"], variable: "--font-quicksand", display: "swap" });

export const viewport: Viewport = { themeColor: "#0c9b85", colorScheme: "light dark" };
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "DoriLabel AI — dori va alomatlar haqida ma’lumot", template: "%s | DoriLabel AI" },
  description: "Dori qutisi rasmini tahlil qiling yoki alomatlaringiz haqida umumiy, tushunarli ma’lumot oling.",
  keywords: ["dori", "dori haqida ma'lumot", "dori qutisi", "alomatlar", "sog'liq", "O'zbekiston"],
  alternates: { canonical: "/", languages: { uz: "/", ru: "/?lang=ru", tg: "/?lang=tg", en: "/?lang=en" } },
  icons: {
    icon: [
      { url: "/favicon.ico?v=3", sizes: "any", type: "image/x-icon" },
      { url: "/icon.png?v=3", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-icon.png?v=3", sizes: "512x512", type: "image/png" }],
  },
  manifest: "/manifest.webmanifest",
  openGraph: { type: "website", locale: "uz_UZ", url: "/", siteName: "DoriLabel AI", title: "DoriLabel AI — dori haqida tushunarli ma’lumot", description: "Dori rasmini yoki alomatlaringizni yuboring va umumiy ma’lumot oling." },
  twitter: { card: "summary", title: "DoriLabel AI", description: "Dori va alomatlar haqida umumiy, xavfsiz ma’lumot." },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const schema = { "@context": "https://schema.org", "@type": "WebApplication", name: "DoriLabel AI", applicationCategory: "HealthApplication", operatingSystem: "Web", inLanguage: ["uz", "ru", "tg", "en"], description: "Dori va sog'liq bo'yicha umumiy ma'lumot beruvchi web ilova.", url: siteUrl, isAccessibleForFree: true };
  return <html lang="uz" suppressHydrationWarning><body className={quicksand.variable}>{children}<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} /></body></html>;
}
