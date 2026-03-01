'use client';

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { Database } from './schema';

export type SupabaseBrowserClient = SupabaseClient<Database>;

let browserClient: SupabaseBrowserClient | null = null;

function createBrowserClient(): SupabaseBrowserClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url) {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL environment variable is not set.');
  }

  if (!anonKey) {
    throw new Error('NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable is not set.');
  }

  return createClient<Database>(url, anonKey);
}

/**
 * Returns a singleton Supabase client for browser-side usage.
 *
 * This module is marked as a client module and should only be
 * imported from React Client Components.
 */
export function getSupabaseBrowserClient(): SupabaseBrowserClient {
  if (!browserClient) {
    browserClient = createBrowserClient();
  }

  return browserClient;
}

