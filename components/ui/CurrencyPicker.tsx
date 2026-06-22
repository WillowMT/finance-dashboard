"use client";

import { useActionState, useRef } from "react";
import { Check, ChevronDown, DollarSign, LoaderCircle } from "lucide-react";
import { CURRENCIES } from "@/lib/constants";
import {
  updateCurrency,
  type CurrencyActionState,
} from "@/actions/settings";

export function CurrencyPicker({ current }: { current: string }) {
  const formRef = useRef<HTMLFormElement>(null);
  const initialState: CurrencyActionState = {
    status: "idle",
    currency: current,
    message: "Saved",
  };
  const [state, formAction, pending] = useActionState(
    updateCurrency,
    initialState
  );

  return (
    <div className="px-4 py-3.5">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-[#34C759]/10 flex items-center justify-center">
          <DollarSign className="w-4 h-4 text-[#34C759]" />
        </div>
        <label
          htmlFor="currency-picker"
          className="flex-1 text-[#1C1C1E] text-sm font-medium"
        >
          Currency
        </label>
        <span className="text-sm font-medium text-[#8E8E93]">
          {state.currency}
        </span>
      </div>
      <form ref={formRef} action={formAction} className="mt-3">
        <div className="relative">
          <select
            id="currency-picker"
            name="currency"
            aria-label="Currency"
            aria-describedby="currency-status"
            defaultValue={state.currency}
            disabled={pending}
            onChange={() => formRef.current?.requestSubmit()}
            className="w-full min-h-11 bg-[#F2F2F7] rounded-xl pl-3 pr-10 py-2.5 text-sm text-[#1C1C1E] border-0 focus:outline-none focus:ring-2 focus:ring-[#007AFF] appearance-none disabled:opacity-60"
          >
            {CURRENCIES.map((currency) => (
              <option key={currency.code} value={currency.code}>
                {currency.symbol} {currency.label} ({currency.code})
              </option>
            ))}
          </select>
          <ChevronDown
            aria-hidden="true"
            className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8E8E93]"
          />
        </div>
        <button type="submit" className="sr-only">
          Save currency
        </button>
        <p
          id="currency-status"
          aria-live="polite"
          className={
            state.status === "error"
              ? "mt-2 flex items-center gap-1.5 text-xs text-[#FF3B30]"
              : "mt-2 flex items-center gap-1.5 text-xs text-[#8E8E93]"
          }
        >
          {pending ? (
            <LoaderCircle aria-hidden="true" className="h-3.5 w-3.5 animate-spin" />
          ) : state.status === "error" ? null : (
            <Check aria-hidden="true" className="h-3.5 w-3.5 text-[#34C759]" />
          )}
          {pending ? "Saving…" : state.message}
        </p>
      </form>
    </div>
  );
}
