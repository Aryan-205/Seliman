"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const AUTH_COOKIE = "restaurant-staff-auth";
const COOKIE_MAX_AGE = 60 * 60 * 24; // 24 hours

export async function staffLoginAction(pin: string): Promise<{ error?: string }> {
  const expected = process.env.RESTAURANT_PIN;
  if (!expected) {
    return { error: "Auth not configured" };
  }
  if (pin !== expected) {
    return { error: "Invalid PIN" };
  }
  const store = await cookies();
  store.set(AUTH_COOKIE, "staff", {
    path: "/",
    maxAge: COOKIE_MAX_AGE,
    httpOnly: true,
    sameSite: "lax",
  });
  redirect("/staff");
}

export async function superadminLoginAction(pin: string): Promise<{ error?: string }> {
  const expected = process.env.RESTAURANT_PIN;
  if (!expected) {
    return { error: "Auth not configured" };
  }
  if (pin !== expected) {
    return { error: "Invalid PIN" };
  }
  const store = await cookies();
  store.set(AUTH_COOKIE, "superadmin", {
    path: "/",
    maxAge: COOKIE_MAX_AGE,
    httpOnly: true,
    sameSite: "lax",
  });
  redirect("/superadmin");
}
