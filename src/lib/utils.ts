import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isValidRedirect(url: string | undefined | null): boolean {
  if (!url) return false;
  // Check if it's a relative URL starting with / but not // (protocol-relative)
  // Also optionally check if it contains actual characters to avoid just "/" if needed, but "/" is safe.
  return url.startsWith("/") && !url.startsWith("//");
}
