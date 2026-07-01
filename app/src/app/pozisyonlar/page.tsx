import pozisyonlarMarkup from "@/components/pozisyonlarMarkup";

export default function PozisyonlarPage() {
  return (
    <>
      <link rel="stylesheet" href="/dashboard.css" />
      <div dangerouslySetInnerHTML={{ __html: pozisyonlarMarkup }} suppressHydrationWarning />
    </>
  );
}
