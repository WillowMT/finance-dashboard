import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const categories = await db.category.findMany({
    where: { OR: [{ isDefault: true }, { userId: session.user.id }] },
    orderBy: { name: "asc" },
  });

  return NextResponse.json(categories);
}
