// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const path = url.pathname;

  // Support both legacy admin cookie and new generic token/role
  const adminToken = req.cookies.get("admin_token")?.value;
  const token = req.cookies.get("token")?.value || adminToken;
  const role = req.cookies.get("role")?.value || (adminToken ? "admin" : undefined);

  const isAuthPage = path.startsWith("/login") || path.startsWith("/signup") || path.startsWith("/forgot-password");

  // Redirect root to appropriate location
  if (path === "/") {
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    if (role === "admin") {
      return NextResponse.redirect(new URL("/admin/dashboard", req.url));
    }
    return NextResponse.redirect(new URL("/client/products", req.url));
  }

  // If user is authenticated, keep them away from auth pages
  if (isAuthPage && token) {
    if (role === "admin") {
      return NextResponse.redirect(new URL("/admin/dashboard", req.url));
    }
    return NextResponse.redirect(new URL("/client/products", req.url));
  }

  // Protect admin routes by admin role only
  if (path.startsWith("/admin") && !path.startsWith("/admin/login")) {
    if (!token || role !== "admin") {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  // Protect client routes for authenticated users
  if (path.startsWith("/client")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    // Optional: if role is neither admin nor client, force login
    if (role && role !== "admin" && role !== "client") {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/login", "/signup", "/forgot-password", "/admin/:path*", "/client/:path*"],
};
