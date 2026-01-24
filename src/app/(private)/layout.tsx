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
      {children}
    </AuthProvider>
  );
}
