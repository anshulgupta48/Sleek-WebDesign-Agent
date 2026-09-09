export const insforgeBaseUrl = (
  process.env.NEXT_PUBLIC_INSFORGE_BASE_URL ?? ''
).replace(/\/+$/, '');