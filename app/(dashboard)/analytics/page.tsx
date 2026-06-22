import { Suspense } from "react";
import { auth } from "@/lib/auth";
import { getMonthlyStats, getLast6MonthsData } from "@/lib/data";
import { SpendingChart } from "@/components/finance/SpendingChart";
import { CategoryBreakdown } from "@/components/finance/CategoryBreakdown";
import { AnalyticsSkeleton } from "@/components/finance/AnalyticsSkeleton";
import { IOSPageHeader } from "@/components/ui/IOSPageHeader";

async function AnalyticsContent() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();
  const monthName = now.toLocaleDateString("en-US", { month: "long" });

  const [stats, chartData] = await Promise.all([
    getMonthlyStats(session.user.id, month, year),
    getLast6MonthsData(session.user.id),
  ]);

  return (
    <div className="px-4 space-y-4">
      <p className="text-sm text-[#8E8E93] px-1">Spending breakdown for {monthName}</p>
      <SpendingChart data={chartData} />
      <CategoryBreakdown
        data={stats.byCategory}
        totalExpenses={stats.expenses}
      />
    </div>
  );
}

export default function AnalyticsPage() {
  return (
    <div className="pt-14">
      <IOSPageHeader title="Analytics" />
      <Suspense fallback={<AnalyticsSkeleton />}>
        <AnalyticsContent />
      </Suspense>
    </div>
  );
}
