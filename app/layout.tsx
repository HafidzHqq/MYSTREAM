import type { Metadata } from "next";
import { Outfit, Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "QQ.stream - Nonton Anime Sub Indo Gratis",
  description:
    "Tempat nonton streaming anime sub indo terlengkap, tercepat, dan tanpa iklan mengganggu. Update setiap hari.",
  themeColor: "#8b5cf6",
  keywords: [
    "anime indo",
    "nonton anime",
    "anime sub indo",
    "streaming anime",
    "otakudesu",
    "samehadaku",
    "donghua",
    "anime gratis",
  ],
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: process.env.NEXT_PUBLIC_APP_URL,
    siteName: "QQ.stream",
    title: "QQ.stream - Nonton Anime Sub Indo Gratis",
    description: "Platform streaming anime Indonesia terlengkap.",
  },
  twitter: {
    card: "summary_large_image",
    title: "QQ.stream",
    description: "Platform streaming anime Indonesia terlengkap.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={`${outfit.variable} ${inter.variable} font-sans bg-bg-primary text-text-primary antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
