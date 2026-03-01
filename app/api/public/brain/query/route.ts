import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabase/client-server';
import type { KnowledgeItem } from '@/types/brain';
import { answerQuestionFromNotes } from '@/lib/ai/gemini-client';

const MAX_QUERY_LENGTH = 300;

function escapeIlike(value: string): string {
  return value.replace(/[%_]/g, (match) => `\\${match}`);
}

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const searchParams = url.searchParams;

    const qRaw = searchParams.get('q');

    if (qRaw == null) {
      return NextResponse.json(
        { error: 'Missing required query parameter "q".' },
        { status: 400 },
      );
    }

    const q = qRaw.trim();

    if (!q) {
      return NextResponse.json(
        { error: 'Query parameter "q" must be a non-empty string.' },
        { status: 400 },
      );
    }

    if (q.length > MAX_QUERY_LENGTH) {
      return NextResponse.json(
        {
          error: `Query parameter "q" must be at most ${MAX_QUERY_LENGTH} characters.`,
        },
        { status: 400 },
      );
    }

    const supabase = getSupabaseServerClient();

    const pattern = `%${escapeIlike(q)}%`;

    const { data, error } = await supabase
      .from('knowledge_items')
      .select('*')
      .or(
        `title.ilike.${pattern},content.ilike.${pattern},summary.ilike.${pattern}`,
      )
      .order('created_at', { ascending: false })
      .limit(5);

    if (error) {
      return NextResponse.json(
        {
          error: 'Failed to retrieve notes from knowledge base.',
          details: error.message,
        },
        { status: 500 },
      );
    }

    const items = (data ?? []) as KnowledgeItem[];

    if (items.length === 0) {
      return NextResponse.json({
        answer:
          'No relevant notes were found in the knowledge base for this query.',
        sources: [],
      });
    }

    const aiResult = await answerQuestionFromNotes(q, items);

    return NextResponse.json(aiResult);
  } catch (err) {
    const message =
      err instanceof Error ? err.message : 'Unexpected error while handling query.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

