import { IOSBottomNav } from "@/components/ui/IOSBottomNav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#F2F2F7]">
      <main className="pb-24">{children}</main>
      <IOSBottomNav />
    </div>
  );
}
