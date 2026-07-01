import dashboardMarkup from "@/components/dashboardMarkup";

export default function DashboardPage() {
  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: dashboardMarkup }} suppressHydrationWarning />
    </>
  );
}
