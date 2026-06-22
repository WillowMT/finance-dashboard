"use client";

import { useState } from "react";
import { upsertBudget } from "@/actions/budgets";
import { IOSButton } from "@/components/ui/IOSButton";
import { IOSInput } from "@/components/ui/IOSInput";
import { IOSSelect } from "@/components/ui/IOSSelect";
import { CATEGORY_ICONS } from "@/lib/constants";
import { X } from "lucide-react";

interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}

interface SetBudgetModalProps {
  categories: Category[];
  month: number;
  year: number;
}

export function SetBudgetModal({ categories, month, year }: SetBudgetModalProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    formData.set("month", String(month));
    formData.set("year", String(year));
    await upsertBudget(formData);
    setLoading(false);
    setOpen(false);
  }

  return (
    <>
      <IOSButton
        variant="secondary"
        fullWidth
        onClick={() => setOpen(true)}
        className="mb-1"
      >
        + Set Budget
      </IOSButton>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div className="relative w-full max-w-lg bg-white rounded-t-3xl p-6 pb-10 shadow-xl">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-[17px] font-bold text-[#1C1C1E]">Set Budget</h2>
              <button
                onClick={() => setOpen(false)}
                className="w-8 h-8 bg-[#F2F2F7] rounded-full flex items-center justify-center"
              >
                <X className="w-4 h-4 text-[#8E8E93]" />
              </button>
            </div>
            <form action={handleSubmit} className="space-y-3">
              <IOSSelect
                name="categoryId"
                label="Category"
                options={categories.map((c) => ({
                  value: c.id,
                  label: `${CATEGORY_ICONS[c.icon] ?? "•"} ${c.name}`,
                }))}
                required
              />
              <IOSInput
                name="amount"
                type="number"
                label="Monthly Budget"
                placeholder="0.00"
                step="0.01"
                min="1"
                required
              />
              <IOSButton
                type="submit"
                fullWidth
                size="lg"
                disabled={loading}
              >
                {loading ? "Saving…" : "Save Budget"}
              </IOSButton>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
