import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Request } from "@/lib/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isValidRedirect(url: string | undefined | null): boolean {
  if (!url) return false;
  // Check if it's a relative URL starting with / but not // (protocol-relative)
  // Also optionally check if it contains actual characters to avoid just "/" if needed, but "/" is safe.
  return url.startsWith("/") && !url.startsWith("//");
}

export function getStatusBadge(status: Request["status"]) {
  const styles = {
    pending: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
    in_review: "bg-orange-100 text-orange-800 hover:bg-orange-200",
    approved: "bg-green-100 text-green-800 hover:bg-green-200",
    rejected: "bg-red-100 text-red-800 hover:bg-red-200",
  };
  return styles[status];
}

export function stringifyDate(date: Date) {
  return new Date(date).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
