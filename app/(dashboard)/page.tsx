import { Suspense } from "react";
import { auth } from "@/lib/auth";
import { getMonthlyStats, getTransactions, getUserCurrency } from "@/lib/data";
import { BalanceCard } from "@/components/finance/BalanceCard";
import { TransactionList } from "@/components/finance/TransactionList";
import { DashboardSkeleton } from "@/components/finance/DashboardSkeleton";
import { IOSPageHeader } from "@/components/ui/IOSPageHeader";
import Link from "next/link";
import { ChevronRight, Settings } from "lucide-react";

async function DashboardContent() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();
  const firstName = session.user.name?.split(" ")[0] ?? "there";

  const [stats, recent, currency] = await Promise.all([
    getMonthlyStats(session.user.id, month, year),
    getTransactions(session.user.id, 5),
    getUserCurrency(session.user.id),
  ]);

  const monthName = now.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  return (
    <div className="space-y-6">
      <IOSPageHeader
        title={`Hi, ${firstName} 👋`}
        subtitle="Here's your financial summary"
        action={
          <Link
            href="/settings"
            aria-label="Open settings"
            className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#007AFF] shadow-sm ring-1 ring-black/5 transition-transform active:scale-95"
          >
            <Settings aria-hidden="true" className="h-5 w-5" />
          </Link>
        }
      />
      <BalanceCard
        balance={stats.balance}
        income={stats.income}
        expenses={stats.expenses}
        month={monthName}
        currency={currency}
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
        <TransactionList transactions={recent} currency={currency} />
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <div className="pt-14">
      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardContent />
      </Suspense>
    </div>
  );
}
