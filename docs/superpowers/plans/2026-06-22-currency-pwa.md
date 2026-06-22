# Currency Preference & PWA Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add per-user currency preference stored in the database and enable PWA installability.

**Architecture:** Currency is stored as a `String` field on the `User` model (default `"USD"`), fetched once per page render via `getUserCurrency`, and passed as a prop down to every money-formatting component. Settings page gets a `CurrencyPicker` client component that auto-submits a form on `<select>` change. PWA is enabled by wrapping `next.config.ts` with `@ducanh2912/next-pwa` — icons and manifest are already in place.

**Tech Stack:** Next.js 16 (App Router, server actions, `"use cache"`), Prisma 7 + Turso/libsql, `@ducanh2912/next-pwa`

---

## File Map

| Action | Path | Responsibility |
|--------|------|----------------|
| Modify | `prisma/schema.prisma` | Add `currency` field to `User` |
| Modify | `migrate-turso.mjs` | Add `ALTER TABLE` for new column |
| Modify | `lib/constants.ts` | Add `CURRENCIES` list |
| Modify | `lib/utils.ts` | Make `formatCurrency` accept `currency` param |
| Modify | `lib/data.ts` | Add `getUserCurrency` helper |
| Create | `actions/settings.ts` | `updateCurrency` server action |
| Modify | `components/finance/BalanceCard.tsx` | Accept + use `currency` prop |
| Modify | `components/finance/BudgetCard.tsx` | Accept + use `currency` prop |
| Modify | `components/finance/CategoryBreakdown.tsx` | Accept + use `currency` prop |
| Modify | `components/finance/TransactionItem.tsx` | Accept + use `currency` prop |
| Modify | `components/finance/TransactionList.tsx` | Accept + pass `currency` prop |
| Modify | `components/finance/SpendingChart.tsx` | Accept + use `currency` in tooltip |
| Modify | `app/(dashboard)/page.tsx` | Fetch currency, pass to children |
| Modify | `app/(dashboard)/transactions/page.tsx` | Fetch currency, pass to children |
| Modify | `app/(dashboard)/analytics/page.tsx` | Fetch currency, pass to children |
| Modify | `app/(dashboard)/budget/page.tsx` | Fetch currency, pass to children |
| Create | `components/ui/CurrencyPicker.tsx` | Client component: select + auto-submit |
| Modify | `app/(dashboard)/settings/page.tsx` | Add CurrencyPicker section |
| Modify | `next.config.ts` | Wrap with `withPWA` |
| Modify | `.gitignore` | Ignore generated SW files |

---

## Task 1: Add `currency` to Prisma schema and push to DB

**Files:**
- Modify: `prisma/schema.prisma`
- Modify: `migrate-turso.mjs`

- [ ] **Step 1: Update schema**

In `prisma/schema.prisma`, add `currency` to the `User` model:

```prisma
model User {
  id            String        @id @default(cuid())
  email         String        @unique
  emailVerified DateTime?
  name          String?
  passwordHash  String?
  image         String?
  currency      String        @default("USD")
  createdAt     DateTime      @default(now())
  accounts      Account[]
  sessions      Session[]
  transactions  Transaction[]
  categories    Category[]
  budgets       Budget[]
}
```

- [ ] **Step 2: Add ALTER TABLE to migration script**

At the bottom of `migrate-turso.mjs`, before the final `console.log`, add:

```js
// Column migrations (ALTER TABLE — errors on duplicate column are safe to ignore)
console.log("\nRunning column migrations...");
try {
  await db.execute(`ALTER TABLE "User" ADD COLUMN "currency" TEXT NOT NULL DEFAULT 'USD'`);
  console.log("  ✓ User.currency");
} catch (e) {
  if (String(e.message).includes("duplicate column")) {
    console.log("  ~ User.currency (already exists)");
  } else {
    throw e;
  }
}
```

- [ ] **Step 3: Run migration against Turso**

```bash
cd "/Users/waiyan/Downloads/Code File/202606/financedashboard"
node migrate-turso.mjs
```

Expected output includes `✓ User.currency` or `~ User.currency (already exists)`.

- [ ] **Step 4: Regenerate Prisma client**

```bash
npx prisma generate
```

Expected: `✔ Generated Prisma Client` with no errors.

- [ ] **Step 5: Commit**

```bash
git add prisma/schema.prisma migrate-turso.mjs
git commit -m "feat: add currency field to User model"
```

---

## Task 2: Add CURRENCIES constant and `getUserCurrency` helper

**Files:**
- Modify: `lib/constants.ts`
- Modify: `lib/data.ts`

- [ ] **Step 1: Add CURRENCIES to constants**

Append to `lib/constants.ts`:

```ts
export const CURRENCIES = [
  { code: "USD", symbol: "$",   label: "US Dollar" },
  { code: "EUR", symbol: "€",   label: "Euro" },
  { code: "GBP", symbol: "£",   label: "British Pound" },
  { code: "JPY", symbol: "¥",   label: "Japanese Yen" },
  { code: "CNY", symbol: "¥",   label: "Chinese Yuan" },
  { code: "INR", symbol: "₹",   label: "Indian Rupee" },
  { code: "SGD", symbol: "S$",  label: "Singapore Dollar" },
  { code: "MYR", symbol: "RM",  label: "Malaysian Ringgit" },
  { code: "THB", symbol: "฿",   label: "Thai Baht" },
  { code: "AUD", symbol: "A$",  label: "Australian Dollar" },
  { code: "CAD", symbol: "C$",  label: "Canadian Dollar" },
  { code: "CHF", symbol: "Fr",  label: "Swiss Franc" },
  { code: "KRW", symbol: "₩",   label: "South Korean Won" },
  { code: "HKD", symbol: "HK$", label: "Hong Kong Dollar" },
  { code: "MMK", symbol: "K",   label: "Myanmar Kyat" },
] as const;
```

- [ ] **Step 2: Add `getUserCurrency` to `lib/data.ts`**

Append to `lib/data.ts` (the file already has `"use cache"` at the top — this function inherits it):

```ts
export async function getUserCurrency(userId: string): Promise<string> {
  cacheTag(`user-${userId}`);
  cacheLife("hours");
  const user = await db.user.findUnique({
    where: { id: userId },
    select: { currency: true },
  });
  return user?.currency ?? "USD";
}
```

- [ ] **Step 3: Commit**

```bash
git add lib/constants.ts lib/data.ts
git commit -m "feat: add CURRENCIES constant and getUserCurrency helper"
```

---

## Task 3: Update `formatCurrency` to accept a currency parameter

**Files:**
- Modify: `lib/utils.ts`

- [ ] **Step 1: Update the function**

Replace the existing `formatCurrency` in `lib/utils.ts`:

```ts
export function formatCurrency(amount: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd "/Users/waiyan/Downloads/Code File/202606/financedashboard"
npx tsc --noEmit 2>&1 | head -20
```

Expected: no errors (existing callers without a second arg still work due to the default).

- [ ] **Step 3: Commit**

```bash
git add lib/utils.ts
git commit -m "feat: make formatCurrency currency-aware with USD default"
```

---

## Task 4: Create `updateCurrency` server action

**Files:**
- Create: `actions/settings.ts`

- [ ] **Step 1: Create the file**

```ts
"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { CURRENCIES } from "@/lib/constants";
import { revalidateTag } from "next/cache";

const VALID_CODES = new Set(CURRENCIES.map((c) => c.code));

export async function updateCurrency(formData: FormData): Promise<void> {
  const session = await auth();
  if (!session?.user?.id) return;

  const currency = formData.get("currency");
  if (typeof currency !== "string" || !VALID_CODES.has(currency)) return;

  await db.user.update({
    where: { id: session.user.id },
    data: { currency },
  });

  revalidateTag(`user-${session.user.id}`);
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit 2>&1 | head -20
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add actions/settings.ts
git commit -m "feat: add updateCurrency server action"
```

---

## Task 5: Update money-formatting components to accept `currency` prop

**Files:**
- Modify: `components/finance/BalanceCard.tsx`
- Modify: `components/finance/BudgetCard.tsx`
- Modify: `components/finance/CategoryBreakdown.tsx`
- Modify: `components/finance/TransactionItem.tsx`
- Modify: `components/finance/TransactionList.tsx`
- Modify: `components/finance/SpendingChart.tsx`

- [ ] **Step 1: Update `BalanceCard`**

Replace full file content of `components/finance/BalanceCard.tsx`:

```tsx
import { IOSCard } from "@/components/ui/IOSCard";
import { formatCurrency } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";

interface BalanceCardProps {
  balance: number;
  income: number;
  expenses: number;
  month: string;
  currency: string;
}

export function BalanceCard({ balance, income, expenses, month, currency }: BalanceCardProps) {
  return (
    <div className="mx-4">
      <IOSCard className="bg-gradient-to-br from-[#007AFF] to-[#5856D6] text-white p-6 rounded-3xl border-0">
        <p className="text-sm font-medium text-white/70">{month} Balance</p>
        <p className="text-4xl font-bold mt-1 tracking-tight">
          {formatCurrency(balance, currency)}
        </p>
        <div className="flex gap-6 mt-5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-[10px] text-white/60 uppercase tracking-wider">Income</p>
              <p className="text-sm font-semibold">{formatCurrency(income, currency)}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <TrendingDown className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-[10px] text-white/60 uppercase tracking-wider">Expenses</p>
              <p className="text-sm font-semibold">{formatCurrency(expenses, currency)}</p>
            </div>
          </div>
        </div>
      </IOSCard>
    </div>
  );
}
```

- [ ] **Step 2: Update `BudgetCard`**

Replace full file content of `components/finance/BudgetCard.tsx`:

```tsx
import { IOSCard } from "@/components/ui/IOSCard";
import { formatCurrency } from "@/lib/utils";
import { CATEGORY_ICONS } from "@/lib/constants";

interface BudgetCardProps {
  budget: {
    id: string;
    amount: number;
    category: { name: string; color: string; icon: string };
  };
  spent: number;
  currency: string;
}

export function BudgetCard({ budget, spent, currency }: BudgetCardProps) {
  const percent = Math.min((spent / budget.amount) * 100, 100);
  const over = spent > budget.amount;
  const emoji = CATEGORY_ICONS[budget.category.icon] ?? "💰";

  return (
    <IOSCard>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-base"
            style={{ backgroundColor: budget.category.color + "20" }}
          >
            {emoji}
          </div>
          <div>
            <p className="text-sm font-semibold text-[#1C1C1E]">{budget.category.name}</p>
            <p className="text-xs text-[#8E8E93]">
              {formatCurrency(spent, currency)} of {formatCurrency(budget.amount, currency)}
            </p>
          </div>
        </div>
        <p
          className="text-sm font-bold"
          style={{ color: over ? "#FF3B30" : budget.category.color }}
        >
          {Math.round(percent)}%
        </p>
      </div>
      <div className="h-2 bg-[#F2F2F7] rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${percent}%`,
            backgroundColor: over ? "#FF3B30" : budget.category.color,
          }}
        />
      </div>
      {over && (
        <p className="text-xs text-[#FF3B30] mt-1.5 font-medium">
          Over budget by {formatCurrency(spent - budget.amount, currency)}
        </p>
      )}
    </IOSCard>
  );
}
```

- [ ] **Step 3: Update `CategoryBreakdown`**

Replace full file content of `components/finance/CategoryBreakdown.tsx`:

```tsx
import { IOSCard } from "@/components/ui/IOSCard";
import { formatCurrency } from "@/lib/utils";
import { CATEGORY_ICONS } from "@/lib/constants";

interface CategoryBreakdownProps {
  data: Record<string, { category: { name: string; color: string; icon: string }; total: number }>;
  totalExpenses: number;
  currency: string;
}

export function CategoryBreakdown({ data, totalExpenses, currency }: CategoryBreakdownProps) {
  const sorted = Object.values(data).sort((a, b) => b.total - a.total);

  if (sorted.length === 0) {
    return (
      <IOSCard className="py-8 text-center text-[#8E8E93] text-sm">
        No expense data for this period
      </IOSCard>
    );
  }

  return (
    <IOSCard>
      <p className="text-xs font-semibold text-[#3C3C43]/60 uppercase tracking-wider mb-4">
        By Category
      </p>
      <div className="space-y-3">
        {sorted.map(({ category, total }) => {
          const percent = totalExpenses > 0 ? (total / totalExpenses) * 100 : 0;
          const emoji = CATEGORY_ICONS[category.icon] ?? "💰";
          return (
            <div key={category.name}>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-sm">{emoji}</span>
                  <span className="text-sm font-medium text-[#1C1C1E]">{category.name}</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-semibold text-[#1C1C1E]">
                    {formatCurrency(total, currency)}
                  </span>
                  <span className="text-xs text-[#8E8E93] ml-1.5">
                    {Math.round(percent)}%
                  </span>
                </div>
              </div>
              <div className="h-1.5 bg-[#F2F2F7] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${percent}%`, backgroundColor: category.color }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </IOSCard>
  );
}
```

- [ ] **Step 4: Update `TransactionItem`**

Replace full file content of `components/finance/TransactionItem.tsx`:

```tsx
import { formatCurrency, formatShortDate } from "@/lib/utils";
import { CATEGORY_ICONS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Trash2 } from "lucide-react";
import { deleteTransaction } from "@/actions/transactions";

interface Transaction {
  id: string;
  amount: number;
  type: string;
  description: string | null;
  date: Date;
  category: { name: string; color: string; icon: string };
}

interface TransactionItemProps {
  transaction: Transaction;
  showDelete?: boolean;
  currency: string;
}

export function TransactionItem({ transaction, showDelete, currency }: TransactionItemProps) {
  const isExpense = transaction.type === "EXPENSE";
  const emoji = CATEGORY_ICONS[transaction.category.icon] ?? "💰";
  const deleteWithId = deleteTransaction.bind(null, transaction.id);

  return (
    <div className="flex items-center gap-3 py-3">
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
        style={{ backgroundColor: transaction.category.color + "20" }}
      >
        {emoji}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-[#1C1C1E] truncate">
          {transaction.description || transaction.category.name}
        </p>
        <p className="text-xs text-[#8E8E93] mt-0.5">
          {transaction.category.name} · {formatShortDate(transaction.date)}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <p
          className={cn(
            "text-sm font-semibold tabular-nums",
            isExpense ? "text-[#FF3B30]" : "text-[#34C759]"
          )}
        >
          {isExpense ? "-" : "+"}
          {formatCurrency(transaction.amount, currency)}
        </p>
        {showDelete && (
          <form action={deleteWithId}>
            <button
              type="submit"
              className="p-1.5 rounded-lg text-[#8E8E93] hover:text-[#FF3B30] hover:bg-[#FF3B30]/10 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 5: Update `TransactionList`**

Replace full file content of `components/finance/TransactionList.tsx`:

```tsx
import { TransactionItem } from "./TransactionItem";
import { IOSCard } from "@/components/ui/IOSCard";

interface Transaction {
  id: string;
  amount: number;
  type: string;
  description: string | null;
  date: Date;
  category: { name: string; color: string; icon: string };
}

interface TransactionListProps {
  transactions: Transaction[];
  showDelete?: boolean;
  emptyMessage?: string;
  currency: string;
}

export function TransactionList({
  transactions,
  showDelete,
  emptyMessage = "No transactions yet",
  currency,
}: TransactionListProps) {
  if (transactions.length === 0) {
    return (
      <IOSCard className="flex items-center justify-center py-12 text-[#8E8E93] text-sm">
        {emptyMessage}
      </IOSCard>
    );
  }

  return (
    <IOSCard padding={false}>
      {transactions.map((t, i) => (
        <div key={t.id}>
          <div className="px-4">
            <TransactionItem transaction={t} showDelete={showDelete} currency={currency} />
          </div>
          {i < transactions.length - 1 && (
            <div className="h-px bg-[#F2F2F7] ml-[68px]" />
          )}
        </div>
      ))}
    </IOSCard>
  );
}
```

- [ ] **Step 6: Update `SpendingChart`**

Replace full file content of `components/finance/SpendingChart.tsx`:

```tsx
"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { IOSCard } from "@/components/ui/IOSCard";

interface ChartData {
  month: string;
  income: number;
  expenses: number;
}

interface SpendingChartProps {
  data: ChartData[];
  currency: string;
}

export function SpendingChart({ data, currency }: SpendingChartProps) {
  return (
    <IOSCard>
      <p className="text-sm font-semibold text-[#3C3C43]/60 mb-4 uppercase tracking-wider text-xs">
        6-Month Overview
      </p>
      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={data} barGap={4} barSize={12}>
          <CartesianGrid strokeDasharray="3 3" stroke="#F2F2F7" vertical={false} />
          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fill: "#8E8E93" }}
          />
          <YAxis hide />
          <Tooltip
            cursor={{ fill: "#F2F2F7", radius: 4 }}
            contentStyle={{
              backgroundColor: "white",
              border: "none",
              borderRadius: 12,
              boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
              fontSize: 12,
            }}
            formatter={(value) =>
              new Intl.NumberFormat("en-US", {
                style: "currency",
                currency,
              }).format(Number(value))
            }
          />
          <Bar dataKey="income" fill="#34C759" radius={[4, 4, 0, 0]} name="Income" />
          <Bar dataKey="expenses" fill="#FF3B30" radius={[4, 4, 0, 0]} name="Expenses" />
        </BarChart>
      </ResponsiveContainer>
      <div className="flex gap-4 mt-3">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-[#34C759]" />
          <span className="text-xs text-[#8E8E93]">Income</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-[#FF3B30]" />
          <span className="text-xs text-[#8E8E93]">Expenses</span>
        </div>
      </div>
    </IOSCard>
  );
}
```

- [ ] **Step 7: Verify TypeScript compiles**

```bash
npx tsc --noEmit 2>&1 | head -30
```

Expected: errors only for the dashboard pages (they haven't been updated yet to pass `currency`). No errors inside the component files themselves.

- [ ] **Step 8: Commit**

```bash
git add components/finance/BalanceCard.tsx components/finance/BudgetCard.tsx \
  components/finance/CategoryBreakdown.tsx components/finance/TransactionItem.tsx \
  components/finance/TransactionList.tsx components/finance/SpendingChart.tsx
git commit -m "feat: propagate currency prop through all money-formatting components"
```

---

## Task 6: Update dashboard pages to fetch and pass currency

**Files:**
- Modify: `app/(dashboard)/page.tsx`
- Modify: `app/(dashboard)/transactions/page.tsx`
- Modify: `app/(dashboard)/analytics/page.tsx`
- Modify: `app/(dashboard)/budget/page.tsx`

- [ ] **Step 1: Update dashboard home page**

Replace full file content of `app/(dashboard)/page.tsx`:

```tsx
import { Suspense } from "react";
import { auth } from "@/lib/auth";
import { getMonthlyStats, getTransactions, getUserCurrency } from "@/lib/data";
import { BalanceCard } from "@/components/finance/BalanceCard";
import { TransactionList } from "@/components/finance/TransactionList";
import { DashboardSkeleton } from "@/components/finance/DashboardSkeleton";
import { IOSPageHeader } from "@/components/ui/IOSPageHeader";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

async function DashboardContent() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();

  const [stats, recent, currency] = await Promise.all([
    getMonthlyStats(session.user.id, month, year),
    getTransactions(session.user.id, 5),
    getUserCurrency(session.user.id),
  ]);

  const monthName = now.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  return (
    <div className="space-y-6">
      <BalanceCard
        balance={stats.balance}
        income={stats.income}
        expenses={stats.expenses}
        month={monthName}
        currency={currency}
      />

      <div className="px-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-[17px] font-bold text-[#1C1C1E]">Recent</p>
          <Link
            href="/transactions"
            className="flex items-center gap-0.5 text-sm text-[#007AFF]"
          >
            See all <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <TransactionList transactions={recent} currency={currency} />
      </div>
    </div>
  );
}

export default async function DashboardPage() {
  const session = await auth();
  const firstName = session?.user?.name?.split(" ")[0] ?? "there";

  return (
    <div className="pt-14">
      <IOSPageHeader
        title={`Hi, ${firstName} 👋`}
        subtitle="Here's your financial summary"
      />
      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardContent />
      </Suspense>
    </div>
  );
}
```

- [ ] **Step 2: Update transactions page**

Replace full file content of `app/(dashboard)/transactions/page.tsx`:

```tsx
import { Suspense } from "react";
import { auth } from "@/lib/auth";
import { getTransactions, getUserCurrency } from "@/lib/data";
import { TransactionList } from "@/components/finance/TransactionList";
import { TransactionsSkeleton } from "@/components/finance/TransactionsSkeleton";
import { IOSPageHeader } from "@/components/ui/IOSPageHeader";

async function TransactionContent() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const [transactions, currency] = await Promise.all([
    getTransactions(session.user.id, 50),
    getUserCurrency(session.user.id),
  ]);

  return (
    <TransactionList
      transactions={transactions}
      showDelete
      emptyMessage="No transactions yet. Add your first one!"
      currency={currency}
    />
  );
}

export default function TransactionsPage() {
  return (
    <div className="pt-14">
      <IOSPageHeader title="Transactions" />
      <Suspense fallback={<TransactionsSkeleton />}>
        <TransactionContent />
      </Suspense>
    </div>
  );
}
```

- [ ] **Step 3: Update analytics page**

Replace full file content of `app/(dashboard)/analytics/page.tsx`:

```tsx
import { Suspense } from "react";
import { auth } from "@/lib/auth";
import { getMonthlyStats, getLast6MonthsData, getUserCurrency } from "@/lib/data";
import { SpendingChart } from "@/components/finance/SpendingChart";
import { CategoryBreakdown } from "@/components/finance/CategoryBreakdown";
import { AnalyticsSkeleton } from "@/components/finance/AnalyticsSkeleton";
import { IOSPageHeader } from "@/components/ui/IOSPageHeader";

async function AnalyticsContent() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();
  const monthName = now.toLocaleDateString("en-US", { month: "long" });

  const [stats, chartData, currency] = await Promise.all([
    getMonthlyStats(session.user.id, month, year),
    getLast6MonthsData(session.user.id),
    getUserCurrency(session.user.id),
  ]);

  return (
    <div className="px-4 space-y-4">
      <p className="text-sm text-[#8E8E93] px-1">Spending breakdown for {monthName}</p>
      <SpendingChart data={chartData} currency={currency} />
      <CategoryBreakdown
        data={stats.byCategory}
        totalExpenses={stats.expenses}
        currency={currency}
      />
    </div>
  );
}

export default function AnalyticsPage() {
  return (
    <div className="pt-14">
      <IOSPageHeader title="Analytics" />
      <Suspense fallback={<AnalyticsSkeleton />}>
        <AnalyticsContent />
      </Suspense>
    </div>
  );
}
```

- [ ] **Step 4: Update budget page**

Replace full file content of `app/(dashboard)/budget/page.tsx`:

```tsx
import { Suspense } from "react";
import { auth } from "@/lib/auth";
import { getBudgets, getMonthlyStats, getCategories, getUserCurrency } from "@/lib/data";
import { BudgetCard } from "@/components/finance/BudgetCard";
import { BudgetSkeleton } from "@/components/finance/BudgetSkeleton";
import { IOSPageHeader } from "@/components/ui/IOSPageHeader";
import { SetBudgetModal } from "@/components/finance/SetBudgetModal";

async function BudgetContent() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();
  const monthName = now.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  const [budgets, stats, categories, currency] = await Promise.all([
    getBudgets(session.user.id, month, year),
    getMonthlyStats(session.user.id, month, year),
    getCategories(session.user.id),
    getUserCurrency(session.user.id),
  ]);

  const spentByCategory = stats.byCategory;

  return (
    <div className="px-4 space-y-3">
      <p className="text-sm text-[#8E8E93] px-1 mb-1">Tracking budgets for {monthName}</p>
      <SetBudgetModal categories={categories} month={month} year={year} />
      {budgets.length === 0 ? (
        <div className="text-center py-12 text-[#8E8E93] text-sm">
          No budgets set. Tap &quot;Set Budget&quot; to get started.
        </div>
      ) : (
        budgets.map((budget) => {
          const spent = spentByCategory[budget.categoryId]?.total ?? 0;
          return (
            <BudgetCard key={budget.id} budget={budget} spent={spent} currency={currency} />
          );
        })
      )}
    </div>
  );
}

export default function BudgetPage() {
  return (
    <div className="pt-14">
      <IOSPageHeader title="Budget" />
      <Suspense fallback={<BudgetSkeleton />}>
        <BudgetContent />
      </Suspense>
    </div>
  );
}
```

- [ ] **Step 5: Verify TypeScript compiles with no errors**

```bash
npx tsc --noEmit 2>&1 | head -30
```

Expected: no errors.

- [ ] **Step 6: Commit**

```bash
git add app/\(dashboard\)/page.tsx app/\(dashboard\)/transactions/page.tsx \
  app/\(dashboard\)/analytics/page.tsx app/\(dashboard\)/budget/page.tsx
git commit -m "feat: fetch and pass user currency through all dashboard pages"
```

---

## Task 7: CurrencyPicker component + Settings page

**Files:**
- Create: `components/ui/CurrencyPicker.tsx`
- Modify: `app/(dashboard)/settings/page.tsx`

- [ ] **Step 1: Create `CurrencyPicker` client component**

```tsx
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
```

- [ ] **Step 2: Update Settings page to fetch currency and render `CurrencyPicker`**

Replace full file content of `app/(dashboard)/settings/page.tsx`:

```tsx
import { Suspense } from "react";
import { auth, signOut } from "@/lib/auth";
import { getUserCurrency } from "@/lib/data";
import { IOSCard } from "@/components/ui/IOSCard";
import { IOSPageHeader } from "@/components/ui/IOSPageHeader";
import { Skeleton } from "@/components/ui/Skeleton";
import { CurrencyPicker } from "@/components/ui/CurrencyPicker";
import { ChevronRight, LogOut, User, Bell, Shield } from "lucide-react";

async function UserProfile() {
  const session = await auth();
  return (
    <IOSCard>
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-[#007AFF]/10 flex items-center justify-center">
          <User className="w-6 h-6 text-[#007AFF]" />
        </div>
        <div>
          <p className="font-semibold text-[#1C1C1E]">{session?.user?.name ?? "User"}</p>
          <p className="text-sm text-[#8E8E93]">{session?.user?.email ?? ""}</p>
        </div>
      </div>
    </IOSCard>
  );
}

function ProfileSkeleton() {
  return (
    <IOSCard>
      <div className="flex items-center gap-3">
        <Skeleton className="w-12 h-12 rounded-full" />
        <div>
          <Skeleton className="h-4 w-28 mb-1.5 rounded-lg" />
          <Skeleton className="h-3 w-40 rounded-lg" />
        </div>
      </div>
    </IOSCard>
  );
}

async function PreferencesSection() {
  const session = await auth();
  const currency = session?.user?.id
    ? await getUserCurrency(session.user.id)
    : "USD";

  return (
    <div>
      <p className="text-xs font-semibold text-[#8E8E93] uppercase tracking-wider px-1 mb-2">
        Preferences
      </p>
      <IOSCard padding={false}>
        <CurrencyPicker current={currency} />
        <div className="h-px bg-[#F2F2F7] ml-[60px]" />
        {[
          { icon: Bell, label: "Notifications", color: "#FF9500" },
          { icon: Shield, label: "Privacy & Security", color: "#34C759" },
        ].map(({ icon: Icon, label, color }, i, arr) => (
          <div key={label}>
            <div className="flex items-center gap-3 px-4 py-3.5">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: color + "20" }}
              >
                <Icon className="w-4 h-4" style={{ color }} />
              </div>
              <span className="flex-1 text-[#1C1C1E] text-sm font-medium">{label}</span>
              <ChevronRight className="w-4 h-4 text-[#C7C7CC]" />
            </div>
            {i < arr.length - 1 && <div className="h-px bg-[#F2F2F7] ml-[60px]" />}
          </div>
        ))}
      </IOSCard>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <div className="pt-14 px-4">
      <IOSPageHeader title="Settings" />

      <div className="space-y-5">
        <Suspense fallback={<ProfileSkeleton />}>
          <UserProfile />
        </Suspense>

        <Suspense fallback={<Skeleton className="h-40 rounded-2xl" />}>
          <PreferencesSection />
        </Suspense>

        <div>
          <IOSCard padding={false}>
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/sign-in" });
              }}
            >
              <button
                type="submit"
                className="flex items-center gap-3 px-4 py-3.5 w-full"
              >
                <div className="w-8 h-8 rounded-lg bg-[#FF3B30]/10 flex items-center justify-center">
                  <LogOut className="w-4 h-4 text-[#FF3B30]" />
                </div>
                <span className="text-[#FF3B30] text-sm font-medium">Sign Out</span>
              </button>
            </form>
          </IOSCard>
        </div>

        <p className="text-center text-xs text-[#8E8E93] pb-4">Finance Tracker v1.0</p>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Verify TypeScript compiles with no errors**

```bash
npx tsc --noEmit 2>&1 | head -30
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add components/ui/CurrencyPicker.tsx app/\(dashboard\)/settings/page.tsx
git commit -m "feat: add currency picker to Settings page"
```

---

## Task 8: Enable PWA

**Files:**
- Modify: `next.config.ts`
- Modify: `.gitignore`

- [ ] **Step 1: Update `next.config.ts`**

Replace full file content:

```ts
import withPWA from "@ducanh2912/next-pwa";

const nextConfig = {
  cacheComponents: true,
};

export default withPWA({
  dest: "public",
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  disable: process.env.NODE_ENV === "development",
})(nextConfig);
```

- [ ] **Step 2: Add generated SW files to `.gitignore`**

Append to `.gitignore`:

```
# PWA generated files
/public/sw.js
/public/sw.js.map
/public/workbox-*.js
/public/workbox-*.js.map
```

- [ ] **Step 3: Verify the dev server still starts**

```bash
cd "/Users/waiyan/Downloads/Code File/202606/financedashboard"
npm run dev 2>&1 &
sleep 8
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000
```

Expected: `200`

Kill the dev server after verifying:
```bash
kill %1 2>/dev/null; true
```

- [ ] **Step 4: Commit**

```bash
git add next.config.ts .gitignore
git commit -m "feat: enable PWA with @ducanh2912/next-pwa"
```

---

## Verification

After all tasks complete, do a final manual check:

1. Run `npm run dev` and open `http://localhost:3000`
2. Sign in → go to Settings → confirm the Currency picker row is visible
3. Change currency to EUR → confirm the dashboard home page now shows € amounts
4. Change back to USD → confirm $ returns
5. Run `npm run build` — confirm no TypeScript or build errors; `public/sw.js` should be generated
