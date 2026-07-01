import Script from "next/script";
import landingMarkup from "@/components/landingMarkup";

export default function LandingPage() {
  return (
    <>
      <link rel="stylesheet" href="/styles.css" />
      <div dangerouslySetInnerHTML={{ __html: landingMarkup }} suppressHydrationWarning />
      <Script src="/script.js" strategy="afterInteractive" />
    </>
  );
}
