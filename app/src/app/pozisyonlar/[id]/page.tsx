import pozisyonDetayMarkup from "@/components/pozisyonDetayMarkup";

export default function PozisyonDetayPage() {
  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: pozisyonDetayMarkup }} suppressHydrationWarning />
    </>
  );
}
