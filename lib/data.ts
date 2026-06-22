"use cache";

import { cacheTag, cacheLife } from "next/cache";
import { db } from "./db";

export async function getTransactions(userId: string, limit = 20) {
  cacheTag(`transactions-${userId}`);
  cacheLife("seconds");
  return db.transaction.findMany({
    where: { userId },
    take: limit,
    orderBy: { date: "desc" },
    include: { category: true },
  });
}

export async function getMonthlyTransactions(
  userId: string,
  month: number,
  year: number
) {
  cacheTag(`transactions-${userId}`);
  cacheTag(`stats-${userId}`);
  cacheLife("minutes");
  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 0, 23, 59, 59);
  return db.transaction.findMany({
    where: { userId, date: { gte: start, lte: end } },
    orderBy: { date: "desc" },
    include: { category: true },
  });
}

export async function getMonthlyStats(
  userId: string,
  month: number,
  year: number
) {
  cacheTag(`stats-${userId}`);
  cacheLife("minutes");
  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 0, 23, 59, 59);
  const transactions = await db.transaction.findMany({
    where: { userId, date: { gte: start, lte: end } },
    include: { category: true },
  });
  const income = transactions
    .filter((t) => t.type === "INCOME")
    .reduce((sum, t) => sum + t.amount, 0);
  const expenses = transactions
    .filter((t) => t.type === "EXPENSE")
    .reduce((sum, t) => sum + t.amount, 0);
  const byCategory = transactions
    .filter((t) => t.type === "EXPENSE")
    .reduce(
      (acc, t) => {
        const key = t.categoryId;
        if (!acc[key]) {
          acc[key] = { category: t.category, total: 0 };
        }
        acc[key].total += t.amount;
        return acc;
      },
      {} as Record<string, { category: { name: string; color: string; icon: string }; total: number }>
    );
  return { income, expenses, balance: income - expenses, byCategory };
}

export async function getBudgets(userId: string, month: number, year: number) {
  cacheTag(`budgets-${userId}`);
  cacheLife("minutes");
  return db.budget.findMany({
    where: { userId, month, year },
    include: { category: true },
  });
}

export async function getCategories(userId: string) {
  cacheTag(`categories-${userId}`);
  cacheLife("hours");
  return db.category.findMany({
    where: { OR: [{ isDefault: true }, { userId }] },
    orderBy: { name: "asc" },
  });
}

export async function getLast6MonthsData(userId: string) {
  cacheTag(`stats-${userId}`);
  cacheLife("minutes");
  const months = [];
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({ month: d.getMonth() + 1, year: d.getFullYear(), date: d });
  }
  const results = await Promise.all(
    months.map(async ({ month, year, date }) => {
      const start = new Date(year, month - 1, 1);
      const end = new Date(year, month, 0, 23, 59, 59);
      const transactions = await db.transaction.findMany({
        where: { userId, date: { gte: start, lte: end } },
      });
      const income = transactions
        .filter((t) => t.type === "INCOME")
        .reduce((s, t) => s + t.amount, 0);
      const expenses = transactions
        .filter((t) => t.type === "EXPENSE")
        .reduce((s, t) => s + t.amount, 0);
      return {
        month: date.toLocaleDateString("en-US", { month: "short" }),
        income,
        expenses,
      };
    })
  );
  return results;
}
