import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { Database } from './schema';

export type SupabaseServerClient = SupabaseClient<Database>;

let singletonClient: SupabaseServerClient | null = null;

function createServerClient(): SupabaseServerClient {
  const url = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url) {
    throw new Error('SUPABASE_URL environment variable is not set.');
  }

  if (!serviceRoleKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY environment variable is not set.');
  }

  return createClient<Database>(url, serviceRoleKey, {
    auth: {
      persistSession: false,
    },
  });
}

/**
 * Returns a singleton Supabase client configured for server-side usage.
 *
 * This should only be imported and used in server contexts
 * (e.g. Route Handlers, Server Components, server utilities).
 */
export function getSupabaseServerClient(): SupabaseServerClient {
  if (!singletonClient) {
    singletonClient = createServerClient();
  }

  return singletonClient;
}

