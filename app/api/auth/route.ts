import { createAuthRouteHandlers } from '@insforge/nextjs/api';
import { insforgeBaseUrl } from '@/lib/insforgeConfig';

const handlers = createAuthRouteHandlers({
  baseUrl: insforgeBaseUrl,
});

export const POST = handlers.POST;
export const GET = handlers.GET;
export const DELETE = handlers.DELETE;
