"use server";

import { revalidateTag } from "next/cache";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

export async function createTransaction(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  const amount = parseFloat(formData.get("amount") as string);
  const type = formData.get("type") as string;
  const categoryId = formData.get("categoryId") as string;
  const description = formData.get("description") as string;
  const date = new Date(formData.get("date") as string);

  if (!amount || !type || !categoryId) return { error: "Missing required fields" };
  if (type !== "INCOME" && type !== "EXPENSE") return { error: "Invalid type" };

  await db.transaction.create({
    data: {
      userId: session.user.id,
      amount,
      type,
      categoryId,
      description: description || null,
      date,
    },
  });

  revalidateTag(`transactions-${session.user.id}`, "max");
  revalidateTag(`stats-${session.user.id}`, "max");
  redirect("/transactions");
}

export async function deleteTransaction(id: string): Promise<void> {
  const session = await auth();
  if (!session?.user?.id) return;

  await db.transaction.deleteMany({
    where: { id, userId: session.user.id },
  });

  revalidateTag(`transactions-${session.user.id}`, "max");
  revalidateTag(`stats-${session.user.id}`, "max");
}
