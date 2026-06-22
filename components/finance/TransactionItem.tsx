import { formatCurrency, formatShortDate } from "@/lib/utils";
import { CATEGORY_ICONS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Trash2 } from "lucide-react";
import { deleteTransaction } from "@/actions/transactions";

interface Transaction {
  id: string;
  amount: number;
  type: string;
  description: string | null;
  date: Date;
  category: { name: string; color: string; icon: string };
}

interface TransactionItemProps {
  transaction: Transaction;
  showDelete?: boolean;
  currency: string;
}

export function TransactionItem({ transaction, showDelete, currency }: TransactionItemProps) {
  const isExpense = transaction.type === "EXPENSE";
  const emoji = CATEGORY_ICONS[transaction.category.icon] ?? "💰";
  const deleteWithId = deleteTransaction.bind(null, transaction.id);

  return (
    <div className="flex items-center gap-3 py-3">
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
        style={{ backgroundColor: transaction.category.color + "20" }}
      >
        {emoji}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-[#1C1C1E] truncate">
          {transaction.description || transaction.category.name}
        </p>
        <p className="text-xs text-[#8E8E93] mt-0.5">
          {transaction.category.name} · {formatShortDate(transaction.date)}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <p
          className={cn(
            "text-sm font-semibold tabular-nums",
            isExpense ? "text-[#FF3B30]" : "text-[#34C759]"
          )}
        >
          {isExpense ? "-" : "+"}
          {formatCurrency(transaction.amount, currency)}
        </p>
        {showDelete && (
          <form action={deleteWithId}>
            <button
              type="submit"
              className="p-1.5 rounded-lg text-[#8E8E93] hover:text-[#FF3B30] hover:bg-[#FF3B30]/10 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
