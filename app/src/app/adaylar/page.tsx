import adaylarMarkup from "@/components/adaylarMarkup";

export default function AdaylarPage() {
  return (
    <>
      <link rel="stylesheet" href="/dashboard.css" />
      <div dangerouslySetInnerHTML={{ __html: adaylarMarkup }} suppressHydrationWarning />
    </>
  );
}
