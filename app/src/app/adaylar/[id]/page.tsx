import adayDetayMarkup from "@/components/adayDetayMarkup";

export default function AdayDetayPage() {
  return (
    <>
      <link rel="stylesheet" href="/dashboard.css" />
      <div dangerouslySetInnerHTML={{ __html: adayDetayMarkup }} suppressHydrationWarning />
    </>
  );
}
