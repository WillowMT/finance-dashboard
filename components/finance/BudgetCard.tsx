import { IOSCard } from "@/components/ui/IOSCard";
import { formatCurrency } from "@/lib/utils";
import { CATEGORY_ICONS } from "@/lib/constants";

interface BudgetCardProps {
  budget: {
    id: string;
    amount: number;
    category: { name: string; color: string; icon: string };
  };
  spent: number;
  currency: string;
}

export function BudgetCard({ budget, spent, currency }: BudgetCardProps) {
  const percent = Math.min((spent / budget.amount) * 100, 100);
  const over = spent > budget.amount;
  const emoji = CATEGORY_ICONS[budget.category.icon] ?? "💰";

  return (
    <IOSCard>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-base"
            style={{ backgroundColor: budget.category.color + "20" }}
          >
            {emoji}
          </div>
          <div>
            <p className="text-sm font-semibold text-[#1C1C1E]">{budget.category.name}</p>
            <p className="text-xs text-[#8E8E93]">
              {formatCurrency(spent, currency)} of {formatCurrency(budget.amount, currency)}
            </p>
          </div>
        </div>
        <p
          className="text-sm font-bold"
          style={{ color: over ? "#FF3B30" : budget.category.color }}
        >
          {Math.round(percent)}%
        </p>
      </div>
      <div className="h-2 bg-[#F2F2F7] rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${percent}%`,
            backgroundColor: over ? "#FF3B30" : budget.category.color,
          }}
        />
      </div>
      {over && (
        <p className="text-xs text-[#FF3B30] mt-1.5 font-medium">
          Over budget by {formatCurrency(spent - budget.amount, currency)}
        </p>
      )}
    </IOSCard>
  );
}
