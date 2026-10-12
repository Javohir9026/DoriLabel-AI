import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "DoriLabel AI",
    short_name: "DoriLabel",
    description: "Dori va alomatlar haqida umumiy, tushunarli ma'lumot.",
    start_url: "/",
    display: "standalone",
    background_color: "#f4f8f7",
    theme_color: "#0c9b85",
    lang: "uz",
    icons: [{ src: "/icon.png?v=3", sizes: "512x512", type: "image/png", purpose: "any" }],
  };
}
