"use server";

import { login } from "@/lib/auth/server";

export async function loginAction() {
  await login();
}
