import mulakatMarkup from "@/components/mulakatMarkup";

export default function MulakatPage() {
  return (
    <>
      <link rel="stylesheet" href="/dashboard.css" />
      <div dangerouslySetInnerHTML={{ __html: mulakatMarkup }} suppressHydrationWarning />
    </>
  );
}
