import { InsforgeMiddleware } from '@insforge/nextjs/middleware';
import { insforgeBaseUrl } from '@/lib/insforgeConfig';

export default InsforgeMiddleware({
  baseUrl: insforgeBaseUrl,
  publicRoutes: ['/', '/sign-in', '/sign-up'],
  useBuiltInAuth: false,
});

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
