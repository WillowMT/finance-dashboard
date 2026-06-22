"use client";

import { useState, useEffect } from "react";
import { createTransaction } from "@/actions/transactions";
import { IOSButton } from "@/components/ui/IOSButton";
import { IOSInput } from "@/components/ui/IOSInput";
import { IOSSelect } from "@/components/ui/IOSSelect";
import { IOSCard } from "@/components/ui/IOSCard";
import { IOSPageHeader } from "@/components/ui/IOSPageHeader";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export default function NewTransactionPage() {
  const [type, setType] = useState<"EXPENSE" | "INCOME">("EXPENSE");
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [today, setToday] = useState("");

  useEffect(() => {
    setToday(new Date().toISOString().split("T")[0]);
    fetch("/api/categories")
      .then((r) => r.json())
      .then(setCategories)
      .catch(console.error);
  }, []);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);
    formData.set("type", type);
    const result = await createTransaction(formData);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  return (
    <div className="pt-14">
      <IOSPageHeader
        title="Add Transaction"
        action={
          <Link href="/transactions" className="flex items-center text-[#007AFF]">
            <ChevronLeft className="w-5 h-5 -ml-1" />
            Back
          </Link>
        }
      />

      <div className="px-4 space-y-4">
        <div className="flex bg-white rounded-2xl border border-black/5 p-1">
          {(["EXPENSE", "INCOME"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setType(t)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                type === t
                  ? t === "EXPENSE"
                    ? "bg-[#FF3B30] text-white shadow-sm"
                    : "bg-[#34C759] text-white shadow-sm"
                  : "text-[#8E8E93]"
              }`}
            >
              {t === "EXPENSE" ? "Expense" : "Income"}
            </button>
          ))}
        </div>

        <form action={handleSubmit} className="space-y-3">
          <IOSCard>
            <div className="space-y-3">
              <IOSInput
                name="amount"
                type="number"
                label="Amount"
                placeholder="0.00"
                step="0.01"
                min="0.01"
                required
              />
              <IOSSelect
                name="categoryId"
                label="Category"
                options={categories.map((c) => ({ value: c.id, label: c.name }))}
                required
              />
              <IOSInput
                name="description"
                type="text"
                label="Description (optional)"
                placeholder="What was this for?"
              />
              <IOSInput
                name="date"
                type="date"
                label="Date"
                defaultValue={today}
                required
              />
            </div>
          </IOSCard>

          {error && (
            <div className="bg-[#FF3B30]/10 border border-[#FF3B30]/20 rounded-xl px-4 py-3">
              <p className="text-sm text-[#FF3B30]">{error}</p>
            </div>
          )}

          <IOSButton type="submit" fullWidth size="lg" disabled={loading}>
            {loading ? "Saving…" : "Save Transaction"}
          </IOSButton>
        </form>
      </div>
    </div>
  );
}
