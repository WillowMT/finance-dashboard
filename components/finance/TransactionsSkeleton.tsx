import { Skeleton } from "@/components/ui/Skeleton";

export function TransactionsSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-black/5 overflow-hidden mx-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 px-4 py-3">
          <Skeleton className="w-10 h-10 flex-shrink-0" />
          <div className="flex-1">
            <Skeleton className="h-4 w-40 mb-1.5 rounded-lg" />
            <Skeleton className="h-3 w-24 rounded-lg" />
          </div>
          <Skeleton className="h-4 w-16 rounded-lg" />
        </div>
      ))}
    </div>
  );
}
