import mulakatMarkup from "@/components/mulakatMarkup";

export default function MulakatPage() {
  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: mulakatMarkup }} suppressHydrationWarning />
    </>
  );
}
