import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabase/client-server';
import type { KnowledgeItem } from '@/types/brain';

const MAX_QUERY_LENGTH = 300;

type SortParam = 'created_at_desc' | 'created_at_asc';

const ALLOWED_TYPES = new Set(['note', 'link', 'insight'] as const);

function escapeIlike(value: string): string {
  return value.replace(/[%_]/g, (match) => `\\${match}`);
}

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const searchParams = url.searchParams;

    const rawQ = (searchParams.get('q') ?? '').trim();
    const q =
      rawQ.length > MAX_QUERY_LENGTH ? rawQ.slice(0, MAX_QUERY_LENGTH) : rawQ;

    const tag = (searchParams.get('tag') ?? '').trim();
    const typeParam = (searchParams.get('type') ?? '').trim();
    const sortParam = (searchParams.get('sort') ?? 'created_at_desc').trim() as
      | SortParam
      | string;

    let sort: SortParam;
    switch (sortParam) {
      case 'created_at_asc':
        sort = 'created_at_asc';
        break;
      case 'created_at_desc':
      default:
        sort = 'created_at_desc';
        break;
    }

    if (typeParam && !ALLOWED_TYPES.has(typeParam as typeof ALLOWED_TYPES extends Set<infer T> ? T : never)) {
      return NextResponse.json(
        { error: 'Invalid type filter. Allowed values: note | link | insight.' },
        { status: 400 },
      );
    }

    const supabase = getSupabaseServerClient();

    let query = supabase
      .from('knowledge_items')
      .select('*', { count: 'exact' });

    if (q) {
      const pattern = `%${escapeIlike(q)}%`;
      query = query.or(
        `title.ilike.${pattern},content.ilike.${pattern},summary.ilike.${pattern}`,
      );
    }

    if (tag) {
      query = query.contains('tags', [tag.toLowerCase()]);
    }

    if (typeParam) {
      query = query.eq('type', typeParam);
    }

    query = query.order('created_at', {
      ascending: sort === 'created_at_asc',
    });

    const { data, error, count } = await query;

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch knowledge items.', details: error.message },
        { status: 500 },
      );
    }

    const items = (data ?? []) as KnowledgeItem[];

    return NextResponse.json({
      items,
      total: typeof count === 'number' ? count : items.length,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unexpected error.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

