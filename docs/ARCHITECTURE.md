# Little Image Photography - Proofing Engine Architecture

## System Overview

The Proofing Engine is a distributed asset pipeline that bridges a cloud-based management layer with local-server storage. It provides a seamless experience for photography clients to select, review, and receive their final images.

## Core Components

```
┌─────────────────────────────────────────────────────────────────────┐
│                         CLIENT BROWSER                               │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                 │
│  │   Landing   │  │   Portal    │  │    Admin    │                 │
│  │    Page     │  │  Dashboard  │  │   Overview  │                 │
│  └─────────────┘  └─────────────┘  └─────────────┘                 │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      NEXT.JS APP ROUTER                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                 │
│  │   Server    │  │   Client    │  │    API      │                 │
│  │ Components  │  │ Components  │  │   Routes    │                 │
│  └─────────────┘  └─────────────┘  └─────────────┘                 │
└─────────────────────────────────────────────────────────────────────┘
                              │
              ┌───────────────┼───────────────┐
              ▼               ▼               ▼
┌──────────────────┐  ┌──────────────┐  ┌──────────────┐
│    SUPABASE      │  │     N8N      │  │  NEXTCLOUD   │
│   (PostgreSQL)   │  │  (Automation)│  │   (WebDAV)   │
│                  │  │              │  │              │
│  - Auth          │  │  - Webhooks  │  │  - Previews  │
│  - Projects      │  │  - File Ops  │  │  - Reviews   │
│  - RLS Policies  │  │  - Watermark │  │  - Finals    │
└──────────────────┘  └──────────────┘  └──────────────┘
```

## Data Flow

### Stage 1: Selection
1. Client logs into portal
2. Next.js fetches project data from Supabase
3. Preview images loaded from NextCloud via WebDAV share URL
4. Client selects images (up to `package_limit`)
5. Selection manifest saved to Supabase `client_data` JSONB
6. Status update triggers n8n webhook → moves files to `/selected`

### Stage 2: Review
1. Editor uploads edited versions to NextCloud `/review` folder
2. Admin updates project status to `ready_for_review`
3. Client views edited images from `review_url`
4. Client provides feedback via revision history
5. Feedback stored in `client_data.revision_history`
6. Loop continues until all images approved

### Stage 3: Delivery
1. All images approved → `current_stage` set to 3
2. Final high-res images accessible via `final_url`
3. Client can download individual or all images
4. Watermarks removed from display

## Directory Structure

```
src/
├── app/
│   ├── (public)/           # Public landing page
│   │   ├── page.tsx        # Landing page
│   │   └── layout.tsx      # Public layout with nav
│   │
│   ├── (portal)/           # Client portal (protected)
│   │   ├── dashboard/      # Dashboard home
│   │   │   └── page.tsx
│   │   ├── project/
│   │   │   └── [id]/       # Dynamic project page
│   │   │       └── page.tsx
│   │   └── layout.tsx      # Portal layout with sidebar
│   │
│   ├── (auth)/             # Authentication
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── layout.tsx
│   │
│   ├── admin/              # Admin overview
│   │   ├── page.tsx
│   │   └── layout.tsx
│   │
│   ├── api/
│   │   └── auth/
│   │       └── callback/   # Supabase auth callback
│   │           └── route.ts
│   │
│   ├── layout.tsx          # Root layout
│   └── globals.css         # Global styles & theme
│
├── components/
│   ├── landing/            # Landing page components
│   │   ├── Hero.tsx
│   │   ├── PortfolioGrid.tsx
│   │   ├── PricingCards.tsx
│   │   └── ContactForm.tsx
│   │
│   ├── portal/             # Portal components
│   │   ├── Sidebar.tsx
│   │   ├── ProjectCard.tsx
│   │   └── StageBadge.tsx
│   │
│   ├── gallery/            # Gallery components
│   │   ├── SelectionGallery.tsx  # Stage 1
│   │   ├── ReviewGallery.tsx     # Stage 2
│   │   ├── DeliveryView.tsx      # Stage 3
│   │   ├── ImageCard.tsx
│   │   ├── ImageModal.tsx
│   │   ├── SelectionCounter.tsx
│   │   └── RevisionThread.tsx
│   │
│   ├── admin/              # Admin components
│   │   ├── ProjectsTable.tsx
│   │   ├── ProgressBar.tsx
│   │   └── StatsCards.tsx
│   │
│   ├── auth/               # Auth components
│   │   └── LoginForm.tsx
│   │
│   └── ui/                 # Shared UI components
│       ├── Button.tsx
│       ├── Input.tsx
│       ├── Textarea.tsx
│       ├── Card.tsx
│       └── index.ts
│
├── lib/
│   ├── supabase/
│   │   ├── client.ts       # Browser client
│   │   ├── server.ts       # Server client
│   │   └── middleware.ts   # Auth middleware
│   │
│   ├── actions/
│   │   ├── projects.ts     # Project server actions
│   │   └── reviews.ts      # Review server actions
│   │
│   └── imageLoader.ts      # WebDAV image loader
│
├── types/
│   └── database.ts         # Supabase types
│
└── middleware.ts           # Next.js middleware
```

## Security Model

### Row Level Security (RLS)
All database operations are protected by RLS policies:

```sql
-- Users can only access their own projects
CREATE POLICY "Users can view own projects"
ON projects FOR SELECT
USING (auth.uid() = user_id);

-- Users can only update their own projects
CREATE POLICY "Users can update own projects"
ON projects FOR UPDATE
USING (auth.uid() = user_id);
```

### Route Protection
- `/dashboard/*` - Requires authentication
- `/project/*` - Requires authentication + project ownership
- `/admin/*` - Requires admin role (future implementation)

### State Immutability
When `status` is `submitted` or `editing`:
- Selection manifest is read-only
- UI shows locked state (grayed out)
- Prevents data desynchronization with local server

## Integration Points

### Supabase Webhooks
Configured to trigger on `projects` table updates:

```
Trigger: UPDATE on projects
Condition: status OR current_stage changes
Action: POST to n8n webhook URL
Payload: Entire row including client_data
```

### n8n Workflow
The existing workflow (`Gn9eYRDIrBaGMtpz`) handles:
1. Receiving webhook from Supabase
2. Creating NextCloud shares
3. Moving files between folders
4. Updating Baserow (if applicable)

### NextCloud WebDAV
Images are served via public share URLs:
- `preview_url`: Watermarked previews for selection
- `review_url`: Edited versions for review
- `final_url`: High-resolution finals for download
