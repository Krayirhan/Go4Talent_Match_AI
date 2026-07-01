import adaylarMarkup from "@/components/adaylarMarkup";

export default function AdaylarPage() {
  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: adaylarMarkup }} suppressHydrationWarning />
    </>
  );
}
