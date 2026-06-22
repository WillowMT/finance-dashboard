import { cn } from "@/lib/utils";

interface IOSPageHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  className?: string;
}

export function IOSPageHeader({ title, subtitle, action, className }: IOSPageHeaderProps) {
  return (
    <div className={cn("flex items-end justify-between px-4 pt-2 pb-4", className)}>
      <div>
        <h1 className="text-[28px] font-bold tracking-tight text-[#1C1C1E] leading-none">
          {title}
        </h1>
        {subtitle && (
          <p className="text-sm text-[#8E8E93] mt-1">{subtitle}</p>
        )}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
