"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { CURRENCIES } from "@/lib/constants";
import { updateTag } from "next/cache";

const VALID_CODES = new Set<string>(CURRENCIES.map((c) => c.code));

export type CurrencyActionState = {
  status: "idle" | "success" | "error";
  currency: string;
  message: string;
};

export async function updateCurrency(
  previousState: CurrencyActionState,
  formData: FormData
): Promise<CurrencyActionState> {
  const session = await auth();
  if (!session?.user?.id) {
    return {
      ...previousState,
      status: "error",
      message: "Sign in again to change your currency.",
    };
  }

  const currency = formData.get("currency");
  if (typeof currency !== "string" || !VALID_CODES.has(currency)) {
    return {
      ...previousState,
      status: "error",
      message: "Choose a supported currency.",
    };
  }

  try {
    await db.user.update({
      where: { id: session.user.id },
      data: { currency },
    });

    updateTag(`user-${session.user.id}`);

    return {
      status: "success",
      currency,
      message: "Saved",
    };
  } catch {
    return {
      ...previousState,
      status: "error",
      message: "Could not save. Please try again.",
    };
  }
}
