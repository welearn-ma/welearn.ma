import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  getAdminConfig,
  getAdminSessionCookieName,
  verifyAdminSessionToken,
} from "@/lib/admin-auth";

export async function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  if (pathname === "/admin/login" || pathname === "/admin/logout") {
    return NextResponse.next();
  }

  const { sessionSecret } = getAdminConfig();
  if (!sessionSecret) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/admin/login";
    loginUrl.searchParams.set("error", "config");
    return NextResponse.redirect(loginUrl);
  }

  const sessionToken = request.cookies.get(getAdminSessionCookieName())?.value;
  if (!sessionToken) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/admin/login";
    loginUrl.searchParams.set(
      "next",
      pathname + (searchParams.toString() ? `?${searchParams.toString()}` : ""),
    );
    return NextResponse.redirect(loginUrl);
  }

  const payload = await verifyAdminSessionToken(sessionToken, sessionSecret);
  if (!payload) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/admin/login";
    loginUrl.searchParams.set("error", "session");
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
