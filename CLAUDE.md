# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server (http://localhost:3000)
npm run build    # Production build with TypeScript check
npm run lint     # Run ESLint
npm start        # Start production server
```

## Architecture

This is **Proofing Engine**, a photography proofing portal for "Little Image Photography". Clients progress through a three-stage workflow: Selection → Review → Delivery.

### Tech Stack
- **Framework**: Next.js 16 (App Router, React 19)
- **Database**: Supabase (PostgreSQL with RLS)
- **Styling**: Tailwind CSS v4 with "Lavender Keepsake" theme
- **Auth**: Supabase Auth with magic link/email
- **Storage**: NextCloud WebDAV for images (external)
- **Automation**: n8n workflows (workflow ID: `Gn9eYRDIrBaGMtpz`)

### Route Groups
- `(public)/` - Landing page, unauthenticated
- `(auth)/` - Login page
- `(portal)/` - Protected client portal (dashboard, project pages)
- `admin/` - Admin overview panel

### Three-Stage Workflow
| Stage | Status Values | Description |
|-------|---------------|-------------|
| 1 | `active` → `submitted` | Client selects favorite images (up to `package_limit`) |
| 2 | `editing` → `ready_for_review` | Client reviews edits, approves or requests revisions |
| 3 | `completed` | Client downloads final high-res images |

### Key Data Structures

The `projects` table uses JSONB fields for flexibility:

- **`client_data`**: Contains `selection_manifest[]` (selected images with notes) and `revision_history[]` (feedback loop)
- **`assets`**: Contains `preview_url`, `review_url`, `final_url` (NextCloud WebDAV share URLs)

When working with JSONB fields from Supabase, cast through `unknown` first:
```typescript
const clientData = project.client_data as unknown as ClientData
```

### Server Actions
- `src/lib/actions/projects.ts` - Selection submission, manifest updates
- `src/lib/actions/reviews.ts` - Revision comments, image approvals

### Supabase Clients
- `src/lib/supabase/client.ts` - Browser client (use in client components)
- `src/lib/supabase/server.ts` - Server client (use in server components/actions)
- `src/lib/supabase/middleware.ts` - Auth session handling

### Environment Variables
```
NEXT_PUBLIC_SUPABASE_URL=<supabase-project-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<supabase-anon-key>
```

## Component Organization

- `components/gallery/` - Stage-specific galleries (SelectionGallery, ReviewGallery, DeliveryView)
- `components/portal/` - Dashboard components (Sidebar, ProjectCard, StageBadge)
- `components/admin/` - Admin panel components
- `components/ui/` - Shared UI primitives (Button, Card, Input)

## Database

See `docs/DATABASE.md` for full schema. Key points:
- RLS enabled - users can only access their own projects
- Status changes trigger n8n webhooks for file operations
- Database functions `append_to_selection_manifest` and `append_to_revision_history` for atomic JSONB updates
