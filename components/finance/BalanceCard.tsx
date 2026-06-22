import { IOSCard } from "@/components/ui/IOSCard";
import { formatCurrency } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";

interface BalanceCardProps {
  balance: number;
  income: number;
  expenses: number;
  month: string;
  currency: string;
}

export function BalanceCard({ balance, income, expenses, month, currency }: BalanceCardProps) {
  return (
    <div className="mx-4">
      <IOSCard className="bg-gradient-to-br from-[#007AFF] to-[#5856D6] text-white p-6 rounded-3xl border-0">
        <p className="text-sm font-medium text-white/70">{month} Balance</p>
        <p className="text-4xl font-bold mt-1 tracking-tight">
          {formatCurrency(balance, currency)}
        </p>
        <div className="flex gap-6 mt-5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-[10px] text-white/60 uppercase tracking-wider">Income</p>
              <p className="text-sm font-semibold">{formatCurrency(income, currency)}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <TrendingDown className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-[10px] text-white/60 uppercase tracking-wider">Expenses</p>
              <p className="text-sm font-semibold">{formatCurrency(expenses, currency)}</p>
            </div>
          </div>
        </div>
      </IOSCard>
    </div>
  );
}
