This is a [Next.js](https://nextjs.org) web-design agent. Users describe a site in chat, review generated pages on the canvas, iterate on a selected page, and persist the resulting HTML in InsForge.

Gemini powers title generation, intent classification, chat, design analysis, HTML generation, and regeneration through the Vercel AI SDK. InsForge remains responsible for authentication and project data.

## Environment

Create `.env.local` with the existing InsForge values and a Google AI Studio key:

```bash
GOOGLE_GENERATIVE_AI_API_KEY=your-google-ai-studio-key
```

The Gemini integration uses `gemini-3.6-flash` by default. Never expose this key with a `NEXT_PUBLIC_` prefix.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
