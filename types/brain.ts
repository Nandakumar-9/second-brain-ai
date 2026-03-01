import type { Database } from '../lib/supabase/schema';

export type KnowledgeItemRow = Database['public']['Tables']['knowledge_items']['Row'];
export type KnowledgeItemInsert = Database['public']['Tables']['knowledge_items']['Insert'];
export type KnowledgeItemUpdate = Database['public']['Tables']['knowledge_items']['Update'];

/**
 * Domain-level representation of a single knowledge item.
 *
 * This currently mirrors the database row shape exactly, but is defined
 * as a separate type to allow future evolution (e.g. richer runtime types,
 * denormalised fields, or transformed dates) without changing persistence.
 */
export type KnowledgeItem = KnowledgeItemRow;

