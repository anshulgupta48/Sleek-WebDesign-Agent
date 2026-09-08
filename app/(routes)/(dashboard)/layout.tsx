import { redirect } from 'next/navigation';
import { getAuthServer } from '@/lib/insforgeServer';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = await getAuthServer();

  if (!user) {
    redirect('/sign-in');
  }

  return <>{children}</>;
}
