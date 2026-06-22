import { cn } from "@/lib/utils";

interface IOSSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

export function IOSSelect({ label, error, options, className, ...props }: IOSSelectProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-medium text-[#3C3C43]/60 px-1">
          {label}
        </label>
      )}
      <select
        className={cn(
          "w-full bg-white rounded-xl px-4 py-3 text-base text-[#1C1C1E] border border-black/5 focus:outline-none focus:ring-2 focus:ring-[#007AFF] focus:border-transparent appearance-none transition-shadow",
          error && "border-[#FF3B30] focus:ring-[#FF3B30]",
          className
        )}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-[#FF3B30] px-1">{error}</p>}
    </div>
  );
}
