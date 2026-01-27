import { AuthProvider } from '@/lib/auth/context';
import { requireAuth } from '@/lib/auth/server';

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await requireAuth();

  return (
    <AuthProvider session={session}>
      <div className="min-h-screen bg-muted/30">
        {children}
      </div>
    </AuthProvider>
  );
}
