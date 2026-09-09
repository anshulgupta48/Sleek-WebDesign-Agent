# High-Level Design (HLD)

## 1. Overview

Sleek Web-Design Agent is an AI-powered web design workspace that transforms natural-language briefs into responsive, multi-page web concepts. The product helps users achieve three core goals:

- Generate structured website designs (HTML and CSS custom property design tokens) directly from conversational briefs.
- Display rendered pages side-by-side on an interactive, pannable, zoomable infinite canvas.
- Support iterative conversational updates, targeted single-page regenerations, and persistent project history.

The platform is built on Next.js 16 with protected workspace flows, streaming server-side AI execution, and persistent storage in an InsForge Postgres database.

## 2. Business Goals

- Convert brief text or image references into coherent, multi-page responsive web layouts fast.
- Enable real-time, fine-grained control via a targeted single-page edit/regeneration pipeline.
- Persist design tokens, chat history, and generated page code to allow seamless session resumption.
- Ensure visual preview safety by rendering untrusted AI code inside isolated sandboxed environments.
- Maintain high UI responsiveness through progressive message streams and background streaming tokens.

## 3. High-Level Architecture

### 3.1 Presentation Layer

The frontend is built with:

- Next.js App Router
- React 19
- TypeScript
- Tailwind CSS 4 & shadcn-inspired UI primitives
- Canvas engine (`react-zoom-pan-pinch`, `react-rnd`, `nuqs`)

This layer includes:

- public landing page
- authentication dialogs and protected dashboard layouts
- conversational chat panel and prompt inputs
- interactive workspace canvas with sandboxed preview frames (`iframe srcDoc`)

### 3.2 API and Server Layer

The server exposes route handlers under the App Router for:

- authentication delegation (`/api/auth/*`)
- project listing and retrieval (`/api/project`, `/api/project/[slugId]`)
- prompt processing, title generation, intent classification, and streaming output (`/api/project`)
- server actions for specific item modifications (e.g., `deletePageAction`)

These routes authenticate incoming sessions, enforce authorization policies, coordinate AI prompt sequences, and handle database persistence.

### 3.3 AI Processing & Streaming Layer

Handled via the Vercel AI SDK integrating with Google Gemini.

AI tasks include:

- project title synthesis
- intent classification (`chat`, `generate`, `regenerate`)
- page architecture planning and CSS token extraction
- sequential raw responsive HTML generation
- surgical single-page modification

Operations run synchronously via streaming responses (`text-delta` and custom `data-*` events), feeding live progress back to the workspace canvas.

### 3.4 Data Layer

The application utilizes InsForge Postgres database tables for:

- `projects`: owner binding, URL slugs, title, and timestamps
- `messages`: chat history, message roles, and rich UI content payloads
- `pages`: generated names, root CSS token declarations, and raw HTML markup

Row Level Security (RLS) policies are active to ensure full record-level data isolation across users.

### 3.5 External Integrations Layer

The application integrates with:

- InsForge Auth for identity management, session tokens, and middleware integration.
- Google Gemini AI API via the Vercel AI SDK for model inference and multi-modal support.
- Public CDNs (Tailwind CSS, Iconify, Google Fonts) injected at runtime into the sandboxed frame documents.

## 4. Core User Flows

### 4.1 Project Creation & Initial Design Flow

1. User submits a design brief on the home page or workspace prompt bar.
2. Application checks authentication; unauthenticated users are directed to sign in.
3. Client generates a browser-side `slugId` and navigates to `/project/[slugId]`.
4. Request POSTs to `/api/project`; the server lazily creates the project record and synthesizes a title.
5. Server classifies prompt intent as `generate`.
6. Gemini produces a structured design architecture plan with root CSS variables and page definitions.
7. Pages are sequentially generated, persisted to InsForge, and streamed to the UI as skeleton transitions and live frame instances.

### 4.2 Targeted Single-Page Regeneration Flow

1. User clicks a page frame on the visual canvas, setting `page_id` in the URL parameter.
2. User enters a targeted refinement prompt (e.g., "Add a dark mode toggle to the navbar").
3. Request POSTs to `/api/project` with `selectedPageId` attached.
4. Intent classifier identifies request as `regenerate`.
5. System loads existing HTML content and root CSS tokens for the selected page.
6. Gemini re-evaluates the page HTML, applies requested modifications, and streams the updated page document.
7. Database row updates, and the frame on the canvas re-renders instantly.

## 5. Data Model Summary

### Main Entities

- User (InsForge Auth Entity)
  - identity record
  - session authentication state
  - owner relation to projects

- Project
  - unique `id` (UUID) and `slugId` (URL-friendly string)
  - `userId` linkage
  - `title` metadata
  - relations to `messages` and `pages`

- Message
  - `id` and `projectId` linkage
  - `role` (`user` or `assistant`)
  - JSON `parts` payload storing message history, streaming deltas, or generation cards

- Page
  - `id` and `projectId` linkage
  - `name` metadata
  - `rootStyles` (CSS custom property variable definitions)
  - `htmlContent` (raw responsive body markup)

## 6. Security and Access Controls

- Dashboard layouts and API routes verify server-side InsForge auth headers.
- Database access is strictly bounded by Postgres Row Level Security (RLS) rules matching `auth.uid()`.
- Google Gemini API key is isolated strictly within server environments (`GOOGLE_GENERATIVE_AI_API_KEY`).
- Canvas iframe rendering enforces `sandbox="allow-scripts"` without same-origin privileges, isolating generated code execution from application state.

## 7. Failure Handling

The platform treats complex design creation as progressive, streamable steps.

When errors occur:

- Intent classification defaults safely to standard `chat` mode if model outputs are ambiguous.
- Malformed JSON outputs from planning prompts trigger stream error states rather than committing invalid pages.
- Stream abort signals are caught between generation steps to prevent partial database writes.
- UI toast components notify users of transport issues while maintaining already rendered canvas elements.

## 8. Operational Considerations

### Scalability

- Page rendering is offloaded entirely to browser-side sandboxed iframes.
- Continuous progress updates prevent HTTP timeout issues during long model calls.
- React Query manages smart caching on project lookups to reduce backend requests.

### Maintainability

- Clear separation between server AI orchestrators (`lib/prompt.ts`, `lib/gemini.ts`) and client workspace state.
- Centralized type contracts (`types/`) ensure uniformity across streaming and DB entities.
- Reusable UI primitives isolated from canvas manipulation logic.

### Reliability

- Strict validation of model responses ensures fallback handling before rendering markup.
- Automatic height post-messaging prevents rendering loops inside dynamic iframe frames.
- Database transaction steps protect message and page state consistency.

## 9. Risks and Constraints

- Heavy dependency on external Google Gemini availability and execution latency.
- Dynamic model generation requires continuous sanitization to maintain wrapper compatibility.
- Canvas visual layout coordinates (pan/zoom/frame position) are local state and do not persist across device refreshes.

## 10. Conclusion

This architecture provides a secure, highly responsive foundation for AI-assisted web development. By decoupling prompt orchestration, streaming response processing, and sandboxed preview execution, Sleek achieves an optimal balance between rich creative capability and robust application stability.
