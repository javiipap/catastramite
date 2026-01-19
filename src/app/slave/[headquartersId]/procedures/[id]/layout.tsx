
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Procedure',
  description: 'Submit a new request for this procedure.',
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
