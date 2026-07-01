import loginMarkup from "@/components/loginMarkup";

export default function LoginPage() {
  return (
    <>
      <link rel="stylesheet" href="/auth.css" />
      <div dangerouslySetInnerHTML={{ __html: loginMarkup }} suppressHydrationWarning />
    </>
  );
}
