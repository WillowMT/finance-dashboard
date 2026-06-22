import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import type { NextAuthRequest } from "next-auth";

export const proxy = auth((req: NextAuthRequest) => {
  const isLoggedIn = !!req.auth?.user;
  const path = req.nextUrl.pathname;
  const isAuthPage = path.startsWith("/sign-in") || path.startsWith("/sign-up");

  if (!isLoggedIn && !isAuthPage) {
    return NextResponse.redirect(new URL("/sign-in", req.nextUrl));
  }
  if (isLoggedIn && isAuthPage) {
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }
  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|icons|favicon.ico).*)"],
};
