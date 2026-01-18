
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { acceptInvitationAction } from "@/lib/actions/invitations";
import { verifyToken } from "@/services/jwt";
import { InvitationPayload } from "@/use-cases/invitations";
import { AlertCircle, CheckCircle2 } from "lucide-react";

interface InvitationPageProps {
  searchParams: Promise<{ token?: string }>;
}

export default async function InvitationPage({ searchParams }: InvitationPageProps) {
  const { token } = await searchParams;

  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-destructive flex items-center gap-2">
              <AlertCircle /> Invalid Link
            </CardTitle>
            <CardDescription>
              This invitation link is missing a token. Please check the link and try again.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    // Redirect to login with callback URL
    const callbackUrl = `/invitation?token=${token}`;
    redirect(`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`);
  }

  if (!session.user) {
    // Redirect to onboarding with callback URL
    const callbackUrl = `/invitation?token=${token}`;
    redirect(`/onboarding?callbackUrl=${encodeURIComponent(callbackUrl)}`);
  }

  // Verify token content serverside to show details
  const payload = await verifyToken<InvitationPayload>(token);

  if (!payload) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-destructive flex items-center gap-2">
              <AlertCircle /> Invalid or Expired Token
            </CardTitle>
            <CardDescription>
              This invitation link is invalid or has expired. Please ask for a new link.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const { headquartersId, role } = payload;

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>You have been invited!</CardTitle>
          <CardDescription>
            You have been invited to join headquarters <strong>{headquartersId}</strong> as a{" "}
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
      </Card>
    </div>
  );
}
