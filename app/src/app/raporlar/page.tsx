import raporlarMarkup from "@/components/raporlarMarkup";

export default function RaporlarPage() {
  return (
    <>
      <link rel="stylesheet" href="/dashboard.css" />
      <div dangerouslySetInnerHTML={{ __html: raporlarMarkup }} suppressHydrationWarning />
    </>
  );
}
