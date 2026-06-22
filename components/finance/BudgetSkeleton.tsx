import { Skeleton } from "@/components/ui/Skeleton";

export function BudgetSkeleton() {
  return (
    <div className="mx-4 space-y-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="bg-white rounded-2xl border border-black/5 p-4">
          <div className="flex items-center gap-2.5 mb-3">
            <Skeleton className="w-9 h-9 rounded-xl flex-shrink-0" />
            <div className="flex-1">
              <Skeleton className="h-4 w-28 mb-1 rounded-lg" />
              <Skeleton className="h-3 w-36 rounded-lg" />
            </div>
            <Skeleton className="h-4 w-10 rounded-lg" />
          </div>
          <Skeleton className="h-2 rounded-full" />
        </div>
      ))}
    </div>
  );
}
