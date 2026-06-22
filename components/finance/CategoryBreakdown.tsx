import { IOSCard } from "@/components/ui/IOSCard";
import { formatCurrency } from "@/lib/utils";
import { CATEGORY_ICONS } from "@/lib/constants";

interface CategoryBreakdownProps {
  data: Record<string, { category: { name: string; color: string; icon: string }; total: number }>;
  totalExpenses: number;
  currency: string;
}

export function CategoryBreakdown({ data, totalExpenses, currency }: CategoryBreakdownProps) {
  const sorted = Object.values(data).sort((a, b) => b.total - a.total);

  if (sorted.length === 0) {
    return (
      <IOSCard className="py-8 text-center text-[#8E8E93] text-sm">
        No expense data for this period
      </IOSCard>
    );
  }

  return (
    <IOSCard>
      <p className="text-xs font-semibold text-[#3C3C43]/60 uppercase tracking-wider mb-4">
        By Category
      </p>
      <div className="space-y-3">
        {sorted.map(({ category, total }) => {
          const percent = totalExpenses > 0 ? (total / totalExpenses) * 100 : 0;
          const emoji = CATEGORY_ICONS[category.icon] ?? "💰";
          return (
            <div key={category.name}>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-sm">{emoji}</span>
                  <span className="text-sm font-medium text-[#1C1C1E]">{category.name}</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-semibold text-[#1C1C1E]">
                    {formatCurrency(total, currency)}
                  </span>
                  <span className="text-xs text-[#8E8E93] ml-1.5">
                    {Math.round(percent)}%
                  </span>
                </div>
              </div>
              <div className="h-1.5 bg-[#F2F2F7] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${percent}%`, backgroundColor: category.color }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </IOSCard>
  );
}
