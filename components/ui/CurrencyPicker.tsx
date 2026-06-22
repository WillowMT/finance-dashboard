"use client";

import { useRef } from "react";
import { DollarSign } from "lucide-react";
import { CURRENCIES } from "@/lib/constants";
import { updateCurrency } from "@/actions/settings";

export function CurrencyPicker({ current }: { current: string }) {
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <div className="px-4 py-3.5">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-8 h-8 rounded-lg bg-[#34C759]/10 flex items-center justify-center">
          <DollarSign className="w-4 h-4 text-[#34C759]" />
        </div>
        <span className="flex-1 text-[#1C1C1E] text-sm font-medium">Currency</span>
        <span className="text-sm text-[#8E8E93]">{current}</span>
      </div>
      <form ref={formRef} action={updateCurrency}>
        <select
          name="currency"
          defaultValue={current}
          onChange={() => formRef.current?.requestSubmit()}
          className="w-full bg-[#F2F2F7] rounded-xl px-3 py-2.5 text-sm text-[#1C1C1E] border-0 focus:outline-none focus:ring-2 focus:ring-[#007AFF] appearance-none"
        >
          {CURRENCIES.map((c) => (
            <option key={c.code} value={c.code}>
              {c.symbol} {c.label} ({c.code})
            </option>
          ))}
        </select>
      </form>
    </div>
  );
}
