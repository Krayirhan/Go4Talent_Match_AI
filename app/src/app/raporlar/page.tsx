import raporlarMarkup from "@/components/raporlarMarkup";

export default function RaporlarPage() {
  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: raporlarMarkup }} suppressHydrationWarning />
    </>
  );
}
