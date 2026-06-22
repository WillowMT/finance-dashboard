"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  ArrowLeftRight,
  PlusCircle,
  BarChart2,
  Target,
} from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/transactions", icon: ArrowLeftRight, label: "Transactions" },
  { href: "/transactions/new", icon: PlusCircle, label: "Add", primary: true },
  { href: "/analytics", icon: BarChart2, label: "Analytics" },
  { href: "/budget", icon: Target, label: "Budget" },
];

export function IOSBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-black/10 bg-white/80 backdrop-blur-xl">
      <div className="flex items-center justify-around px-2 pb-safe">
        {tabs.map(({ href, icon: Icon, label, primary }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-col items-center gap-0.5 px-3 py-2 min-w-[60px] transition-all",
                primary && "relative -top-2"
              )}
            >
              {primary ? (
                <div className="w-12 h-12 rounded-full bg-[#007AFF] flex items-center justify-center shadow-lg shadow-[#007AFF]/30 active:scale-95 transition-transform">
                  <Icon className="w-6 h-6 text-white" strokeWidth={2} />
                </div>
              ) : (
                <>
                  <Icon
                    className={cn(
                      "w-6 h-6 transition-colors",
                      active ? "text-[#007AFF]" : "text-[#8E8E93]"
                    )}
                    strokeWidth={active ? 2.5 : 1.5}
                  />
                  <span
                    className={cn(
                      "text-[10px] font-medium transition-colors",
                      active ? "text-[#007AFF]" : "text-[#8E8E93]"
                    )}
                  >
                    {label}
                  </span>
                </>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
