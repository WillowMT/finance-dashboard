import { cn } from "@/lib/utils";

interface IOSCardProps {
  children: React.ReactNode;
  className?: string;
  padding?: boolean;
}

export function IOSCard({ children, className, padding = true }: IOSCardProps) {
  return (
    <div
      className={cn(
        "bg-white rounded-2xl shadow-sm border border-black/5",
        padding && "p-4",
        className
      )}
    >
      {children}
    </div>
  );
}
