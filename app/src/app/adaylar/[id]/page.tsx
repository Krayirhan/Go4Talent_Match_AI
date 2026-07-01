import adayDetayMarkup from "@/components/adayDetayMarkup";

export default function AdayDetayPage() {
  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: adayDetayMarkup }} suppressHydrationWarning />
    </>
  );
}
