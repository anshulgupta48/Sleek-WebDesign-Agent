import { createClient } from '@insforge/sdk';
import { insforgeBaseUrl } from '@/lib/insforgeConfig';

export const insforge = createClient({
  baseUrl: insforgeBaseUrl,
  anonKey: process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY!,
});
