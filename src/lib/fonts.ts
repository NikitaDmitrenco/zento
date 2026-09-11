import { IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";

// Both fonts cover Latin, Romanian diacritics and Cyrillic, which the three locales need.
export const plexSans = IBM_Plex_Sans({
  subsets: ["latin", "latin-ext", "cyrillic", "cyrillic-ext"],
  weight: "variable",
  variable: "--font-plex-sans",
  display: "swap",
});

export const plexMono = IBM_Plex_Mono({
  subsets: ["latin", "latin-ext", "cyrillic", "cyrillic-ext"],
  weight: ["400", "500", "600"],
  variable: "--font-plex-mono",
  display: "swap",
});

export const fontClassName = `${plexSans.variable} ${plexMono.variable}`;
