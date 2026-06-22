"use server";

import { revalidateTag } from "next/cache";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function upsertBudget(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  const categoryId = formData.get("categoryId") as string;
  const amount = parseFloat(formData.get("amount") as string);
  const month = parseInt(formData.get("month") as string);
  const year = parseInt(formData.get("year") as string);

  if (!categoryId || !amount || !month || !year) return { error: "Missing fields" };

  await db.budget.upsert({
    where: {
      userId_categoryId_month_year: {
        userId: session.user.id,
        categoryId,
        month,
        year,
      },
    },
    update: { amount },
    create: {
      userId: session.user.id,
      categoryId,
      amount,
      month,
      year,
    },
  });

  revalidateTag(`budgets-${session.user.id}`, "max");
}

export async function deleteBudget(id: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  await db.budget.deleteMany({ where: { id, userId: session.user.id } });
  revalidateTag(`budgets-${session.user.id}`, "max");
}
