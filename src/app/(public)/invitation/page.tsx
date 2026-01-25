
import { auth } from "@/lib/auth/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { acceptInvitationAction } from "@/lib/actions/invitations";
import { verifyToken } from "@/services/jwt";
import type { InvitationPayload } from "@/use-cases/invitations";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { Metadata } from "next";
import { db } from "@/lib/db";
import { useCases } from "@/use-cases";

export const metadata: Metadata = {
  title: "Invitation",
  description: "Accept your invitation to join a headquarters.",
};

interface InvitationPageProps {
  searchParams: Promise<{ token?: string }>;
}

export default async function InvitationPage({ searchParams }: InvitationPageProps) {
  const { token } = await searchParams;

  if (!token) {
    return (
      <>
        <CardHeader>
          <CardTitle className="text-destructive flex items-center gap-2">
            <AlertCircle /> Invalid Link
          </CardTitle>
          <CardDescription>
            This invitation link is missing a token. Please check the link and try again.
          </CardDescription>
        </CardHeader>
      </>
    );
  }

  const session = await auth();

  if (!session.authorized) {
    // Redirect to login with callback URL
    const redirectUrl = `/invitation?token=${token}`;
    redirect(`/login?redirect=${encodeURIComponent(redirectUrl)}`);
  }

  // Verify token content serverside to show details
  const payload = await verifyToken<InvitationPayload>(token);

  if (!payload) {
    return (
      <>
        <CardHeader>
          <CardTitle className="text-destructive flex items-center gap-2">
            <AlertCircle /> Invalid or Expired Token
          </CardTitle>
          <CardDescription>
            This invitation link is invalid or has expired. Please ask for a new link.
          </CardDescription>
        </CardHeader>
      </>
    );
  }

  const { headquartersId, role, iss: inviterId } = payload;

  const headquarters = await db.getHeadquartersById(headquartersId);
  const inviter = inviterId ? await useCases.users.getUser(inviterId) : undefined;
  const hqName = headquarters?.name || headquartersId;
  const inviterName = inviter?.name || "a user";

  return (
    <>
      <CardHeader className="text-center">
        <CardTitle>You have been invited!</CardTitle>
        <CardDescription>
          <strong>{inviterName}</strong> has invited you to join <strong>{hqName}</strong> as a{" "}
          <strong>{role}</strong>.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center">
        <form action={async () => {
          "use server";
          await acceptInvitationAction({ token });
        }}>
          <Button size="lg" className="w-full">
            <CheckCircle2 className="mr-2 h-4 w-4" />
            Join Headquarters
          </Button>
        </form>
      </CardContent>
    </>
  );
}
