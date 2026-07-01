import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Go4Talent MatchAI - Yapay Zeka Destekli İşe Alım Karar Motoru",
  description:
    "Go4Talent MatchAI ile özgeçmiş elemelerini otomatikleştirin, aday yetkinliklerini pozisyon gereksinimleriyle eşleştirin ve en doğru kararları saniyeler içinde verin.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&family=Manrope:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col antialiased">{children}</body>
    </html>
  );
}
