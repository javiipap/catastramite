"use server";

import { login, logout } from "@/lib/auth/server";

export async function loginAction(redirectUrl?: string) {
  await login(redirectUrl);
}

export async function logoutAction() {
  await logout();
}
