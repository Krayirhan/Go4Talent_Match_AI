import pozisyonDetayMarkup from "@/components/pozisyonDetayMarkup";

export default function PozisyonDetayPage() {
  return (
    <>
      <link rel="stylesheet" href="/dashboard.css" />
      <div dangerouslySetInnerHTML={{ __html: pozisyonDetayMarkup }} suppressHydrationWarning />
    </>
  );
}
