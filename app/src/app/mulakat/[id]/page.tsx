import mulakatFormMarkup from "@/components/mulakatFormMarkup";

export default function MulakatFormPage() {
  return (
    <div dangerouslySetInnerHTML={{ __html: mulakatFormMarkup }} suppressHydrationWarning />
  );
}
