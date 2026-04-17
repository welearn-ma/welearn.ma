import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  getAdminSessionCookieName,
  isAdminAuthConfigured,
  verifyAdminSessionToken,
} from "@/lib/admin-auth";

export async function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  const isAdminPath = pathname.startsWith("/admin");
  const isAdminLogin = pathname === "/admin/login";
  const isAdminLogout = pathname === "/admin/logout";

  if (!isAdminAuthConfigured()) {
    if (!isAdminPath) {
      return NextResponse.next();
    }

    if (isAdminLogin || isAdminLogout) {
      return NextResponse.next();
    }

    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/admin/login";
    loginUrl.searchParams.set("error", "config");
    return NextResponse.redirect(loginUrl);
  }

  const sessionToken = request.cookies.get(getAdminSessionCookieName())?.value;

  if (sessionToken) {
    const payload = await verifyAdminSessionToken(sessionToken);

    if (payload) {
      if (!isAdminPath) {
        const dashboardUrl = request.nextUrl.clone();
        dashboardUrl.pathname = "/admin";
        dashboardUrl.search = "";
        return NextResponse.redirect(dashboardUrl);
      }

      return NextResponse.next();
    }
  }

  if (!isAdminPath) {
    return NextResponse.next();
  }

  if (isAdminLogin || isAdminLogout) {
    return NextResponse.next();
  }

  if (!sessionToken) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/admin/login";
    loginUrl.searchParams.set(
      "next",
      pathname + (searchParams.toString() ? `?${searchParams.toString()}` : ""),
    );
    return NextResponse.redirect(loginUrl);
  }

  const loginUrl = request.nextUrl.clone();
  loginUrl.pathname = "/admin/login";
  loginUrl.searchParams.set("error", "session");
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
