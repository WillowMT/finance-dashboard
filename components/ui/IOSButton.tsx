"use client";

import { cn } from "@/lib/utils";

interface IOSButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
}

export function IOSButton({
  variant = "primary",
  size = "md",
  fullWidth = false,
  className,
  children,
  ...props
}: IOSButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-xl font-semibold transition-all active:scale-95 disabled:opacity-50",
        {
          "bg-[#007AFF] text-white hover:bg-[#0066CC]": variant === "primary",
          "bg-[#F2F2F7] text-[#007AFF] hover:bg-[#E5E5EA]": variant === "secondary",
          "text-[#007AFF] hover:bg-[#F2F2F7]": variant === "ghost",
          "bg-[#FF3B30] text-white hover:bg-[#D32F27]": variant === "danger",
        },
        {
          "px-3 py-1.5 text-sm": size === "sm",
          "px-5 py-3 text-base": size === "md",
          "px-6 py-4 text-lg": size === "lg",
        },
        fullWidth && "w-full",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
