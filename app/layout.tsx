import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Analytics } from "@vercel/analytics/react";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#0A0D14",
};

export const metadata: Metadata = {
  title: "QQ - Nonton Anime Sub Indo Gratis",
  description:
    "Tempat nonton streaming anime sub indo terlengkap, tercepat, dan tanpa iklan mengganggu. Update setiap hari.",
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
    siteName: "QQ",
    title: "QQ - Nonton Anime Sub Indo Gratis",
    description: "Platform streaming anime Indonesia terlengkap.",
  },
  twitter: {
    card: "summary_large_image",
    title: "QQ",
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
      <body className={`${jakarta.variable} font-sans bg-bg-primary text-text-primary antialiased`}>
        <Providers>{children}</Providers>
        <Analytics />
      </body>
    </html>
  );
}
