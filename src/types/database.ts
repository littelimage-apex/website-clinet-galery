export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      projects: {
        Row: {
          assets: Json
          child_name: string | null
          client_data: Json
          created_at: string
          current_stage: number
          id: string
          occasion: string | null
          package_limit: number
          session_date: string | null
          status: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          assets?: Json
          child_name?: string | null
          client_data?: Json
          created_at?: string
          current_stage?: number
          id?: string
          occasion?: string | null
          package_limit?: number
          session_date?: string | null
          status?: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          assets?: Json
          child_name?: string | null
          client_data?: Json
          created_at?: string
          current_stage?: number
          id?: string
          occasion?: string | null
          package_limit?: number
          session_date?: string | null
          status?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      append_to_revision_history: {
        Args: { new_revision: Json; project_id: string }
        Returns: undefined
      }
      append_to_selection_manifest: {
        Args: { new_selection: Json; project_id: string }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// Helper types for the application
export type Project = Database['public']['Tables']['projects']['Row']
export type ProjectInsert = Database['public']['Tables']['projects']['Insert']
export type ProjectUpdate = Database['public']['Tables']['projects']['Update']

// Selection manifest item type
export interface SelectionItem {
  filename: string
  face_swap?: boolean
  note?: string
  selected_at?: string
}

// Revision history item type
export interface RevisionItem {
  version: number
  filename: string
  client_comment?: string
  status: 'pending' | 'approved' | 'rejected'
  created_at?: string
}

// Client data structure
export interface ClientData {
  selection_manifest: SelectionItem[]
  revision_history: RevisionItem[]
}

// Assets structure
export interface ProjectAssets {
  preview_url?: string
  review_url?: string
  final_url?: string
}

// Stage labels for UI
export const STAGE_LABELS = {
  1: 'Choosing your favorites',
  2: 'In the darkroom',
  3: 'Ready to cherish'
} as const

// Status types
export type ProjectStatus = 'active' | 'submitted' | 'editing' | 'ready_for_review' | 'completed'
