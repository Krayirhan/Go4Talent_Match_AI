import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Render'da npm run build → npm start ile çalışır
  // NEXT_PUBLIC_* değişkenleri build time'da embed edilir, Render env vars'dan okunur
};

export default nextConfig;
