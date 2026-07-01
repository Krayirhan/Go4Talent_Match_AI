import dashboardMarkup from "@/components/dashboardMarkup";

export default function DashboardPage() {
  return (
    <>
      <link rel="stylesheet" href="/dashboard.css" />
      <div dangerouslySetInnerHTML={{ __html: dashboardMarkup }} suppressHydrationWarning />
    </>
  );
}
