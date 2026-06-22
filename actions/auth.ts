"use server";

import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { signIn } from "@/lib/auth";
import { redirect } from "next/navigation";
import { DEFAULT_CATEGORIES } from "@/lib/constants";

export async function registerUser(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const name = formData.get("name") as string;

  if (!email || !password || !name) {
    return { error: "All fields are required" };
  }
  if (password.length < 8) {
    return { error: "Password must be at least 8 characters" };
  }

  const existing = await db.user.findUnique({ where: { email } });
  if (existing) return { error: "Email already registered" };

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await db.user.create({
    data: { email, name, passwordHash },
  });

  await db.category.createMany({
    data: DEFAULT_CATEGORIES.map((c) => ({ ...c, userId: user.id })),
  });

  await signIn("credentials", { email, password, redirectTo: "/" });
}

export async function loginUser(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  try {
    await signIn("credentials", { email, password, redirectTo: "/" });
  } catch {
    return { error: "Invalid email or password" };
  }
}
