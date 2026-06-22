import { Suspense } from "react";
import { auth } from "@/lib/auth";
import { getMonthlyStats, getTransactions } from "@/lib/data";
import { BalanceCard } from "@/components/finance/BalanceCard";
import { TransactionList } from "@/components/finance/TransactionList";
import { DashboardSkeleton } from "@/components/finance/DashboardSkeleton";
import { IOSPageHeader } from "@/components/ui/IOSPageHeader";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

async function DashboardContent() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();

  const [stats, recent] = await Promise.all([
    getMonthlyStats(session.user.id, month, year),
    getTransactions(session.user.id, 5),
  ]);

  const monthName = now.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  return (
    <div className="space-y-6">
      <BalanceCard
        balance={stats.balance}
        income={stats.income}
        expenses={stats.expenses}
        month={monthName}
      />

      <div className="px-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-[17px] font-bold text-[#1C1C1E]">Recent</p>
          <Link
            href="/transactions"
            className="flex items-center gap-0.5 text-sm text-[#007AFF]"
          >
            See all <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <TransactionList transactions={recent} />
      </div>
    </div>
  );
}

export default async function DashboardPage() {
  const session = await auth();
  const firstName = session?.user?.name?.split(" ")[0] ?? "there";

  return (
    <div className="pt-14">
      <IOSPageHeader
        title={`Hi, ${firstName} 👋`}
        subtitle="Here's your financial summary"
      />
      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardContent />
      </Suspense>
    </div>
  );
}
