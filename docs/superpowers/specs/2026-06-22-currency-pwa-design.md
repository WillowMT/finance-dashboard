# Currency Preference & PWA — Design Spec
**Date:** 2026-06-22

---

## 1. Currency Preference

### Goal
Users can pick their display currency in Settings. All money values across the app render in that currency.

### Data Layer
Add a `currency` field to the `User` model in `prisma/schema.prisma`:

```prisma
model User {
  ...
  currency String @default("USD")
}
```

Push this change to the Turso database using the existing `migrate-turso.mjs` pattern (run `ALTER TABLE "User" ADD COLUMN "currency" TEXT NOT NULL DEFAULT 'USD'`).

### `formatCurrency` Signature
`lib/utils.ts` — change to:
```ts
export function formatCurrency(amount: number, currency = "USD"): string
```
The default value keeps all existing call sites valid; they'll pass currency explicitly once updated.

### Currency Constant
Add to `lib/constants.ts`:
```ts
export const CURRENCIES = [
  { code: "USD", symbol: "$",  label: "US Dollar" },
  { code: "EUR", symbol: "€",  label: "Euro" },
  { code: "GBP", symbol: "£",  label: "British Pound" },
  { code: "JPY", symbol: "¥",  label: "Japanese Yen" },
  { code: "CNY", symbol: "¥",  label: "Chinese Yuan" },
  { code: "INR", symbol: "₹",  label: "Indian Rupee" },
  { code: "SGD", symbol: "S$", label: "Singapore Dollar" },
  { code: "MYR", symbol: "RM", label: "Malaysian Ringgit" },
  { code: "THB", symbol: "฿",  label: "Thai Baht" },
  { code: "AUD", symbol: "A$", label: "Australian Dollar" },
  { code: "CAD", symbol: "C$", label: "Canadian Dollar" },
  { code: "CHF", symbol: "Fr", label: "Swiss Franc" },
  { code: "KRW", symbol: "₩",  label: "South Korean Won" },
  { code: "HKD", symbol: "HK$","label": "Hong Kong Dollar" },
  { code: "MMK", symbol: "K",  label: "Myanmar Kyat" },
];
```

### Server Action
New file `actions/settings.ts`:
```ts
"use server"
export async function updateCurrency(currency: string): Promise<void>
```
- Validates `currency` is in the CURRENCIES list
- Calls `db.user.update({ where: { id: session.user.id }, data: { currency } })`
- Calls `revalidatePath("/")` and `revalidatePath("/transactions")`, `/analytics`, `/budget`

### Data Flow in Pages
Each dashboard page (server component) fetches `user.currency` and passes it down:

1. **`app/(dashboard)/page.tsx`** — fetch `db.user.findUnique` for currency, pass to `BalanceCard` and `TransactionList` → `TransactionItem`
2. **`app/(dashboard)/transactions/page.tsx`** — same, pass to `TransactionItem`
3. **`app/(dashboard)/analytics/page.tsx`** — pass to `SpendingChart`, `CategoryBreakdown`
4. **`app/(dashboard)/budget/page.tsx`** — pass to `BudgetCard`

All child components gain a `currency: string` prop. `formatCurrency(amount, currency)` is called with the explicit value.

### Settings UI
In `app/(dashboard)/settings/page.tsx`, add a "Currency" row to the Preferences `IOSCard`:
- Icon: `DollarSign` (color `#34C759`)
- Label: "Currency"  
- Right side: current currency code (e.g. "USD") in `#8E8E93` + chevron
- Tapping reveals an inline `IOSSelect` with all 15 currencies
- On change, calls `updateCurrency` server action via a `<form>` with hidden input + `onChange` submit, or a dedicated submit button

---

## 2. PWA Support

### Goal
App is installable as a PWA on iOS and Android. Offline shell works; assets are cached.

### What's Already in Place
- `@ducanh2912/next-pwa` installed
- `app/manifest.ts` complete (name, icons, display: standalone)
- `public/icons/icon-192.png` and `public/icons/icon-512.png` exist

### `next.config.ts` Change
```ts
import withPWA from "@ducanh2912/next-pwa";

const nextConfig = { cacheComponents: true };

export default withPWA({
  dest: "public",
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  disable: process.env.NODE_ENV === "development",
})(nextConfig);
```

### `app/layout.tsx` Meta Tags
Add to `<head>` (via Next.js `metadata` export or direct tags):
```html
<meta name="theme-color" content="#007AFF" />
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="default" />
<meta name="apple-mobile-web-app-title" content="Finance" />
```

### `.gitignore`
Add `/public/sw.js`, `/public/workbox-*.js` — these are generated at build time.

---

## Out of Scope
- Offline data entry (service worker caches shell only)
- Push notifications
- Dark mode currency symbol override
