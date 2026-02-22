import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const AUTH_COOKIE = "restaurant-staff-auth";
const STAFF_LOGIN = "/staff/login";
const SUPERADMIN_LOGIN = "/superadmin/login";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Optional: only protect when RESTAURANT_PIN is set
  const pin = process.env.RESTAURANT_PIN;
  if (!pin) {
    return NextResponse.next();
  }

  const auth = request.cookies.get(AUTH_COOKIE)?.value;

  if (pathname.startsWith("/staff")) {
    if (pathname === STAFF_LOGIN) {
      if (auth === "staff" || auth === "superadmin") {
        return NextResponse.redirect(new URL("/staff", request.url));
      }
      return NextResponse.next();
    }
    if (!auth) {
      return NextResponse.redirect(new URL(STAFF_LOGIN, request.url));
    }
    return NextResponse.next();
  }

  if (pathname.startsWith("/superadmin")) {
    if (pathname === SUPERADMIN_LOGIN) {
      if (auth === "superadmin") {
        return NextResponse.redirect(new URL("/superadmin", request.url));
      }
      return NextResponse.next();
    }
    if (auth !== "superadmin") {
      return NextResponse.redirect(new URL(SUPERADMIN_LOGIN, request.url));
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/staff/:path*", "/superadmin/:path*"],
};
