import ayarlarMarkup from "@/components/ayarlarMarkup";

export default function AyarlarPage() {
  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: ayarlarMarkup }} suppressHydrationWarning />
    </>
  );
}
