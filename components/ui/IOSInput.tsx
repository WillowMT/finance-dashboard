import { cn } from "@/lib/utils";

interface IOSInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function IOSInput({ label, error, className, ...props }: IOSInputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-medium text-[#3C3C43]/60 px-1">
          {label}
        </label>
      )}
      <input
        className={cn(
          "w-full bg-white rounded-xl px-4 py-3 text-base text-[#1C1C1E] placeholder-[#8E8E93] border border-black/5 focus:outline-none focus:ring-2 focus:ring-[#007AFF] focus:border-transparent transition-shadow",
          error && "border-[#FF3B30] focus:ring-[#FF3B30]",
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-[#FF3B30] px-1">{error}</p>}
    </div>
  );
}
