import registerMarkup from "@/components/registerMarkup";

export default function RegisterPage() {
  return (
    <>
      <link rel="stylesheet" href="/auth.css" />
      <div dangerouslySetInnerHTML={{ __html: registerMarkup }} suppressHydrationWarning />
    </>
  );
}
