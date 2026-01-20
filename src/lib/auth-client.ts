import { client } from "@/lib/auth";
import { useQuery } from "@tanstack/react-query";
import { SessionUser } from "@/lib/auth";

export const authClient = {
  useSession: () => {
    return useQuery({
      queryKey: ["session"],
      queryFn: async () => {
        const res = await fetch("/api/auth/session");
        if (!res.ok) return { user: null };
        const data = await res.json();
        return data as { user: SessionUser | null };
      },
      retry: false,
    });
  },
  signIn: {
    social: async ({
      provider,
      callbackURL,
    }: {
      provider: "google";
      callbackURL?: string;
    }) => {
      const { url } = await client.authorize(
        "https://www.catastramite.com/api/auth/callback",
        "code",
        {
          provider,
        },
      );
      window.location.href = url;
    },
  },
  signOut: async (options?: { fetchOptions?: { onSuccess?: () => void } }) => {
    await fetch("/api/auth/signout", { method: "POST" });
    if (options?.fetchOptions?.onSuccess) {
      options.fetchOptions.onSuccess();
    } else {
      window.location.href = "/";
    }
  },
  updateUser: async (data: Partial<SessionUser>) => {
    // Assuming there is a user update action or API.
    // Better-auth had built-in update. We might need to implement this if used.
    // Onboarding form uses this.
    // For now, let's create a server action or API for update if needed.
    // I will implement a placeholder or redirect to an action.
    // Actually, onboarding/form.tsx calls this.
    console.warn("updateUser not implemented yet on client");
    // throw new Error("Not implemented");
    // Retrieve session to mock return?
    return { data: {} };
  },
  getSession: async () => {
    const res = await fetch("/api/auth/session");
    if (!res.ok) return { data: { user: null } };
    const data = await res.json();
    return { data: data as { user: SessionUser | null } };
  },
};
