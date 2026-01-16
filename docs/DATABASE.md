# Database Schema Documentation

## Overview

The database is hosted on Supabase (PostgreSQL) and designed to be event-driven. The frontend only updates the database, which then triggers automation workflows.

## Tables

### projects

The primary table storing all photoshoot/session data.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key, auto-generated |
| `user_id` | UUID | Foreign key to `auth.users` |
| `title` | TEXT | Project title (e.g., "Newborn Session") |
| `child_name` | TEXT | Child's name for the session |
| `occasion` | TEXT | Type of session (Newborn, 6 Months, etc.) |
| `session_date` | DATE | Date of the photo session |
| `current_stage` | INT | Current workflow stage (1, 2, or 3) |
| `status` | TEXT | Current status within the stage |
| `package_limit` | INT | Maximum images for final selection |
| `client_data` | JSONB | Selection manifest and revision history |
| `assets` | JSONB | WebDAV share URLs |
| `created_at` | TIMESTAMP | Record creation time |
| `updated_at` | TIMESTAMP | Last modification time |

### Stages

| Stage | Name | Description |
|-------|------|-------------|
| 1 | Selection | Client views previews and selects favorites |
| 2 | Review | Client reviews edited versions and provides feedback |
| 3 | Delivery | Client downloads final high-resolution images |

### Status Values

| Status | Stage | Description |
|--------|-------|-------------|
| `active` | 1 | Client is actively selecting images |
| `submitted` | 1→2 | Selection submitted, awaiting editing |
| `editing` | 2 | Editor is working on images |
| `ready_for_review` | 2 | Edited images ready for client review |
| `completed` | 3 | All images approved, ready for download |

## JSONB Structures

### client_data

```json
{
  "selection_manifest": [
    {
      "filename": "DSC_001.jpg",
      "face_swap": true,
      "note": "Use face from DSC_005",
      "selected_at": "2024-01-15T10:30:00Z"
    },
    {
      "filename": "DSC_002.jpg",
      "face_swap": false,
      "note": "",
      "selected_at": "2024-01-15T10:31:00Z"
    }
  ],
  "revision_history": [
    {
      "version": 1,
      "filename": "DSC_001_v1.jpg",
      "client_comment": "Too bright, please darken",
      "status": "pending",
      "created_at": "2024-01-16T14:00:00Z"
    },
    {
      "version": 2,
      "filename": "DSC_001_v2.jpg",
      "client_comment": "Perfect!",
      "status": "approved",
      "created_at": "2024-01-17T09:00:00Z"
    }
  ]
}
```

### assets

```json
{
  "preview_url": "https://nextcloud.example.com/s/abc123",
  "review_url": "https://nextcloud.example.com/s/def456",
  "final_url": "https://nextcloud.example.com/s/ghi789"
}
```

## Database Functions

### append_to_selection_manifest

Appends a new selection item without overwriting existing data.

```sql
CREATE OR REPLACE FUNCTION append_to_selection_manifest(
  project_id UUID,
  new_selection JSONB
)
RETURNS VOID AS $$
BEGIN
  UPDATE projects
  SET client_data = jsonb_set(
    COALESCE(client_data, '{"selection_manifest": [], "revision_history": []}'::jsonb),
    '{selection_manifest}',
    COALESCE(client_data->'selection_manifest', '[]'::jsonb) || new_selection
  ),
  updated_at = NOW()
  WHERE id = project_id;
END;
$$ LANGUAGE plpgsql;
```

### append_to_revision_history

Appends a new revision item without overwriting existing data.

```sql
CREATE OR REPLACE FUNCTION append_to_revision_history(
  project_id UUID,
  new_revision JSONB
)
RETURNS VOID AS $$
BEGIN
  UPDATE projects
  SET client_data = jsonb_set(
    COALESCE(client_data, '{"selection_manifest": [], "revision_history": []}'::jsonb),
    '{revision_history}',
    COALESCE(client_data->'revision_history', '[]'::jsonb) || new_revision
  ),
  updated_at = NOW()
  WHERE id = project_id;
END;
$$ LANGUAGE plpgsql;
```

## Row Level Security (RLS)

### Policies

```sql
-- Enable RLS
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Users can only view their own projects
CREATE POLICY "Users view own projects"
ON projects FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Users can only update their own projects
CREATE POLICY "Users update own projects"
ON projects FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Users can insert their own projects
CREATE POLICY "Users insert own projects"
ON projects FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);
```

## Indexes

```sql
-- Index for user lookups
CREATE INDEX idx_projects_user_id ON projects(user_id);

-- Index for status filtering
CREATE INDEX idx_projects_status ON projects(status);

-- Index for stage filtering
CREATE INDEX idx_projects_stage ON projects(current_stage);

-- Composite index for common queries
CREATE INDEX idx_projects_user_status ON projects(user_id, status);
```

## Triggers

### updated_at Trigger

```sql
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();
```

## Migration

The schema was created via Supabase migrations:

```
20240115000000_create_projects_table.sql
```

To view current migrations:
```bash
# Via Supabase CLI
supabase migration list

# Or via MCP
mcp__supabase__list_migrations
```
