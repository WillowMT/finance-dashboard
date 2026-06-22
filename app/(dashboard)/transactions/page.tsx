import { Suspense } from "react";
import { auth } from "@/lib/auth";
import { getTransactions } from "@/lib/data";
import { TransactionList } from "@/components/finance/TransactionList";
import { TransactionsSkeleton } from "@/components/finance/TransactionsSkeleton";
import { IOSPageHeader } from "@/components/ui/IOSPageHeader";

async function TransactionContent() {
  const session = await auth();
  if (!session?.user?.id) return null;
  const transactions = await getTransactions(session.user.id, 50);
  return (
    <TransactionList
      transactions={transactions}
      showDelete
      emptyMessage="No transactions yet. Add your first one!"
    />
  );
}

export default function TransactionsPage() {
  return (
    <div className="pt-14">
      <IOSPageHeader title="Transactions" />
      <Suspense fallback={<TransactionsSkeleton />}>
        <TransactionContent />
      </Suspense>
    </div>
  );
}
