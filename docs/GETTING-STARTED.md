# Getting Started with Little Image Photography Portal

## Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account
- NextCloud server (for WebDAV storage)
- n8n instance (for automation)

## Installation

### 1. Clone and Install Dependencies

```bash
git clone <repository-url>
cd website-client-gallery
npm install
```

### 2. Environment Setup

Create a `.env.local` file:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# NextCloud (optional - for WebDAV integration)
NEXTCLOUD_BASE_URL=https://your-nextcloud.com
NEXTCLOUD_USERNAME=your-username
NEXTCLOUD_PASSWORD=your-password

# n8n Webhook (optional - for automation)
N8N_WEBHOOK_URL=https://your-n8n.com/webhook/your-webhook-id
```

### 3. Database Setup

The Supabase schema is already configured. To verify:

```bash
# Using Supabase CLI
supabase db diff

# Or check via MCP
# The projects table should exist with RLS enabled
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the landing page.

## Project Structure Overview

```
src/
├── app/           # Next.js App Router pages
├── components/    # React components
├── lib/           # Utilities and configurations
└── types/         # TypeScript type definitions
```

See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed structure.

## Key Routes

| Route | Description |
|-------|-------------|
| `/` | Public landing page |
| `/login` | Client authentication |
| `/dashboard` | Client portal home |
| `/project/[id]` | Project gallery (stages 1-3) |
| `/admin` | Admin overview |

## Authentication

Authentication is handled by Supabase Auth. The middleware protects:
- `/dashboard/*`
- `/project/*`
- `/admin/*`

Users are redirected to `/login` if not authenticated.

## Workflow Stages

### Stage 1: Selection
1. Client logs in and sees their project(s)
2. Opens project to view watermarked previews
3. Selects images (up to package limit)
4. Adds notes/face-swap requests per image
5. Submits selection

### Stage 2: Review
1. Editor uploads edited versions
2. Admin marks project "ready for review"
3. Client reviews and provides feedback
4. Loop continues until all approved

### Stage 3: Delivery
1. All images approved
2. Client can download high-res files
3. Project marked complete

## Testing Locally

### Create a Test User

1. Go to Supabase Dashboard > Authentication > Users
2. Create a new user with email/password
3. Verify the email (or disable email verification for testing)

### Create Test Project Data

```sql
-- Run in Supabase SQL Editor
INSERT INTO projects (
  user_id,
  title,
  child_name,
  occasion,
  package_limit,
  current_stage,
  status,
  assets
) VALUES (
  'your-user-uuid',
  'Test Session',
  'Baby Test',
  'Newborn',
  10,
  1,
  'active',
  '{"preview_url": "https://picsum.photos/seed/test"}'::jsonb
);
```

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import to Vercel
3. Add environment variables
4. Deploy

### Manual Deployment

```bash
npm run build
npm start
```

## Integration Setup

### NextCloud WebDAV

1. Create public shares for each folder type:
   - `/image-uploads` - Watermarked previews
   - `/selected` - Selected images for editing
   - `/review` - Edited versions
   - `/final` - High-res finals

2. Store share URLs in project's `assets` field

### n8n Automation

1. Import the existing workflow
2. Configure webhook trigger
3. Update NextCloud credentials
4. Test with sample data

See [n8n workflow documentation](./N8N-WORKFLOW.md) for details.

## Troubleshooting

### "Not authorized" errors
- Check RLS policies are enabled
- Verify user is authenticated
- Ensure user_id matches project owner

### Images not loading
- Check NextCloud share permissions
- Verify URLs in `assets` field
- Check `next.config.ts` image domains

### Supabase connection issues
- Verify environment variables
- Check API keys are correct
- Ensure project is not paused

## Support

For issues and feature requests, please open an issue on GitHub.
