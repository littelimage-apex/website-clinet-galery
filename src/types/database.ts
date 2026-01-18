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
      clients: {
        Row: {
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      occasions: {
        Row: {
          active: boolean | null
          created_at: string | null
          description: string | null
          id: string
          image_url: string | null
          name: string
          updated_at: string | null
        }
        Insert: {
          active?: boolean | null
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          name: string
          updated_at?: string | null
        }
        Update: {
          active?: boolean | null
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      sessions: {
        Row: {
          assets: Json | null
          child_name: string | null
          client_data: Json | null
          client_id: string
          created_at: string | null
          current_stage: number | null
          id: string
          occasion_id: string | null
          package_limit: number | null
          session_date: string | null
          status: string | null
          title: string | null
          updated_at: string | null
        }
        Insert: {
          assets?: Json | null
          child_name?: string | null
          client_data?: Json | null
          client_id: string
          created_at?: string | null
          current_stage?: number | null
          id?: string
          occasion_id?: string | null
          package_limit?: number | null
          session_date?: string | null
          status?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          assets?: Json | null
          child_name?: string | null
          client_data?: Json | null
          client_id?: string
          created_at?: string | null
          current_stage?: number | null
          id?: string
          occasion_id?: string | null
          package_limit?: number | null
          session_date?: string | null
          status?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sessions_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sessions_occasion_id_fkey"
            columns: ["occasion_id"]
            isOneToOne: false
            referencedRelation: "occasions"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
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
export type Client = Database['public']['Tables']['clients']['Row']
export type Occasion = Database['public']['Tables']['occasions']['Row']
export type Session = Database['public']['Tables']['sessions']['Row']
export type SessionInsert = Database['public']['Tables']['sessions']['Insert']
export type SessionUpdate = Database['public']['Tables']['sessions']['Update']

// Extend Session with joined data if needed
export interface SessionWithDetails extends Session {
  clients?: Client | null
  occasions?: Occasion | null
}

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
