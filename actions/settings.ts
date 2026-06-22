"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { CURRENCIES } from "@/lib/constants";
import { revalidateTag } from "next/cache";

const VALID_CODES = new Set(CURRENCIES.map((c) => c.code as string));

export async function updateCurrency(formData: FormData): Promise<void> {
  const session = await auth();
  if (!session?.user?.id) return;

  const currency = formData.get("currency");
  if (typeof currency !== "string" || !VALID_CODES.has(currency)) return;

  await db.user.update({
    where: { id: session.user.id },
    data: { currency },
  });

  revalidateTag(`user-${session.user.id}`, "max");
}
