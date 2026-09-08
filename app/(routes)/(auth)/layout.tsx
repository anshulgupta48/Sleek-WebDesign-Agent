import { redirect } from 'next/navigation';
import { getAuthServer } from '@/lib/insforgeServer';

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = await getAuthServer();

  if (user) {
    redirect('/');
  }

  return <>{children}</>;
}
