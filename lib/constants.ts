export const DEFAULT_CATEGORIES = [
  { name: "Food & Dining", icon: "UtensilsCrossed", color: "#FF9500", isDefault: false },
  { name: "Transport", icon: "Car", color: "#007AFF", isDefault: false },
  { name: "Shopping", icon: "ShoppingBag", color: "#AF52DE", isDefault: false },
  { name: "Entertainment", icon: "Film", color: "#FF2D55", isDefault: false },
  { name: "Health", icon: "Heart", color: "#34C759", isDefault: false },
  { name: "Housing", icon: "Home", color: "#5856D6", isDefault: false },
  { name: "Education", icon: "BookOpen", color: "#FF9500", isDefault: false },
  { name: "Savings", icon: "PiggyBank", color: "#30B0C7", isDefault: false },
  { name: "Salary", icon: "Banknote", color: "#34C759", isDefault: false },
  { name: "Other", icon: "MoreHorizontal", color: "#8E8E93", isDefault: false },
];

export const CATEGORY_ICONS: Record<string, string> = {
  UtensilsCrossed: "🍽️",
  Car: "🚗",
  ShoppingBag: "🛍️",
  Film: "🎬",
  Heart: "❤️",
  Home: "🏠",
  BookOpen: "📖",
  PiggyBank: "🐷",
  Banknote: "💵",
  MoreHorizontal: "•••",
};

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
