import { auth } from '@insforge/nextjs';
import { createClient } from '@insforge/sdk';
import { insforgeBaseUrl } from '@/lib/insforgeConfig';
import { headers } from 'next/headers';

export async function getAuthServer() {
  let { token, user } = await auth();
  if (!token) {
    const reqHeaders = await headers();
    const authHeader = reqHeaders.get('authorization');
    const tokenFromHeader = authHeader?.startsWith('Bearer ')
      ? authHeader.split(' ')[1]
      : undefined;

    token = tokenFromHeader || '';
  }

  const insforge = createClient({
    baseUrl: insforgeBaseUrl,
    anonKey: process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY!,
    accessToken: token || undefined,
  });

  if (!user && token) {
    try {
      const { data } = await insforge.auth.getCurrentUser();
      user = data?.user || null;
    } catch (err) {
      console.error('Failed to resolve user from token:', err);
    }
  }

  return { insforge, user };
}
