
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Users',
  description: 'Manage members of this headquarters',
};

export default function UsersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
