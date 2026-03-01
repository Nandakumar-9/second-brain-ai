export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

/**
 * Canonical Supabase database types for this project.
 *
 * Mirrors the `knowledge_items` table in the `public` schema.
 */
export interface Database {
  public: {
    Tables: {
      knowledge_items: {
        Row: {
          id: string;
          title: string;
          content: string;
          summary: string | null;
          insight: string | null;
          type: string;
          tags: string[] | null;
          source_url: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          content: string;
          summary?: string | null;
          insight?: string | null;
          type: string;
          tags?: string[] | null;
          source_url?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          content?: string;
          summary?: string | null;
          insight?: string | null;
          type?: string;
          tags?: string[] | null;
          source_url?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}

