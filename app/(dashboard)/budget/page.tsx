import { Suspense } from "react";
import { auth } from "@/lib/auth";
import { getBudgets, getMonthlyStats, getCategories, getUserCurrency } from "@/lib/data";
import { BudgetCard } from "@/components/finance/BudgetCard";
import { BudgetSkeleton } from "@/components/finance/BudgetSkeleton";
import { IOSPageHeader } from "@/components/ui/IOSPageHeader";
import { SetBudgetModal } from "@/components/finance/SetBudgetModal";

async function BudgetContent() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();
  const monthName = now.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  const [budgets, stats, categories, currency] = await Promise.all([
    getBudgets(session.user.id, month, year),
    getMonthlyStats(session.user.id, month, year),
    getCategories(session.user.id),
    getUserCurrency(session.user.id),
  ]);

  const spentByCategory = stats.byCategory;

  return (
    <div className="px-4 space-y-3">
      <p className="text-sm text-[#8E8E93] px-1 mb-1">Tracking budgets for {monthName}</p>
      <SetBudgetModal categories={categories} month={month} year={year} />
      {budgets.length === 0 ? (
        <div className="text-center py-12 text-[#8E8E93] text-sm">
          No budgets set. Tap &quot;Set Budget&quot; to get started.
        </div>
      ) : (
        budgets.map((budget) => {
          const spent = spentByCategory[budget.categoryId]?.total ?? 0;
          return (
            <BudgetCard key={budget.id} budget={budget} spent={spent} currency={currency} />
          );
        })
      )}
    </div>
  );
}

export default function BudgetPage() {
  return (
    <div className="pt-14">
      <IOSPageHeader title="Budget" />
      <Suspense fallback={<BudgetSkeleton />}>
        <BudgetContent />
      </Suspense>
    </div>
  );
}
