import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth;

  // Admin route protection
  const isAdminRoute =
    pathname.startsWith("/admin786") || pathname.startsWith("/api/admin");
  if (isAdminRoute) {
    // Always allow the admin login page itself through
    if (pathname === "/admin786/login") {
      // Already logged in as admin → skip login, go straight to panel
      if (isLoggedIn && req.auth?.user?.role === "ADMIN") {
        return NextResponse.redirect(new URL("/admin786", req.url));
      }
      return NextResponse.next();
    }

    // All other admin routes require auth + ADMIN role
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/admin786/login", req.url));
    }
    if (req.auth?.user?.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/admin786/login?error=unauthorized", req.url));
    }
    return NextResponse.next();
  }

  const protectedPrefixes = ["/dashboard", "/bots", "/settings"];
  const isProtected = protectedPrefixes.some((prefix) =>
    pathname.startsWith(prefix)
  );

  if (isProtected && !isLoggedIn) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isLoggedIn && (pathname === "/login" || pathname === "/signup")) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|embed.js).*)",
  ],
};
