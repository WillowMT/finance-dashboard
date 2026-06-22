import { Skeleton } from "@/components/ui/Skeleton";

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="mx-4">
        <Skeleton className="h-44 rounded-3xl" />
      </div>
      <div className="mx-4">
        <Skeleton className="h-5 w-36 mb-3 rounded-lg" />
        <div className="bg-white rounded-2xl border border-black/5 overflow-hidden">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 px-4 py-3">
              <Skeleton className="w-10 h-10 flex-shrink-0" />
              <div className="flex-1">
                <Skeleton className="h-4 w-32 mb-1.5 rounded-lg" />
                <Skeleton className="h-3 w-20 rounded-lg" />
              </div>
              <Skeleton className="h-4 w-16 rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
