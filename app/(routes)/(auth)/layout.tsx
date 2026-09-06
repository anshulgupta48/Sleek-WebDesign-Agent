'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useInsforge } from '@insforge/nextjs';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, isLoaded } = useInsforge();

  useEffect(() => {
    if (isLoaded && user) {
      router.replace('/');
    }
  }, [user, isLoaded, router]);

  if (!isLoaded || user) {
    return null;
  }

  return <>{children}</>;
}
