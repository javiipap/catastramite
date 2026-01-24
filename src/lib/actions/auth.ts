"use server";

import { login, logout } from "@/lib/auth/server";

export async function loginAction() {
  await login();
}

export async function logoutAction() {
  await logout();
}
