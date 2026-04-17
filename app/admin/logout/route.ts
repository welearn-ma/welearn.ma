import { NextResponse } from "next/server";
import { getAdminSessionCookieName } from "@/lib/admin-auth";

export async function GET(request: Request) {
  const redirectUrl = new URL("/", request.url);
  const response = NextResponse.redirect(redirectUrl);

  response.cookies.set({
    name: getAdminSessionCookieName(),
    value: "",
    expires: new Date(0),
    path: "/",
  });

  return response;
}
