import pozisyonlarMarkup from "@/components/pozisyonlarMarkup";

export default function PozisyonlarPage() {
  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: pozisyonlarMarkup }} suppressHydrationWarning />
    </>
  );
}
