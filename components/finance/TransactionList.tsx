import { TransactionItem } from "./TransactionItem";
import { IOSCard } from "@/components/ui/IOSCard";

interface Transaction {
  id: string;
  amount: number;
  type: string;
  description: string | null;
  date: Date;
  category: { name: string; color: string; icon: string };
}

interface TransactionListProps {
  transactions: Transaction[];
  showDelete?: boolean;
  emptyMessage?: string;
}

export function TransactionList({
  transactions,
  showDelete,
  emptyMessage = "No transactions yet",
}: TransactionListProps) {
  if (transactions.length === 0) {
    return (
      <IOSCard className="flex items-center justify-center py-12 text-[#8E8E93] text-sm">
        {emptyMessage}
      </IOSCard>
    );
  }

  return (
    <IOSCard padding={false}>
      {transactions.map((t, i) => (
        <div key={t.id}>
          <div className="px-4">
            <TransactionItem transaction={t} showDelete={showDelete} />
          </div>
          {i < transactions.length - 1 && (
            <div className="h-px bg-[#F2F2F7] ml-[68px]" />
          )}
        </div>
      ))}
    </IOSCard>
  );
}
