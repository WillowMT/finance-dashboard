import { Skeleton } from "@/components/ui/Skeleton";

export function AnalyticsSkeleton() {
  return (
    <div className="mx-4 space-y-4">
      <Skeleton className="h-56 rounded-2xl" />
      <div className="bg-white rounded-2xl border border-black/5 p-4">
        <Skeleton className="h-5 w-40 mb-4 rounded-lg" />
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 mb-3">
            <Skeleton className="w-8 h-8 rounded-lg flex-shrink-0" />
            <div className="flex-1">
              <Skeleton className="h-3 w-24 mb-1.5 rounded-lg" />
              <Skeleton className="h-2 rounded-full" style={{ width: `${60 + i * 10}%` }} />
            </div>
            <Skeleton className="h-4 w-14 rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  );
}
