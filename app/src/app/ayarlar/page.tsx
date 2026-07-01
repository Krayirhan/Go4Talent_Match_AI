import ayarlarMarkup from "@/components/ayarlarMarkup";

export default function AyarlarPage() {
  return (
    <>
      <link rel="stylesheet" href="/dashboard.css" />
      <div dangerouslySetInnerHTML={{ __html: ayarlarMarkup }} suppressHydrationWarning />
    </>
  );
}
