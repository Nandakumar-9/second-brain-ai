import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabase/client-server';
import { generateNoteInsights } from '@/lib/ai/gemini-client';

const MAX_CONTENT_LENGTH = 100000;
const DEFAULT_TITLE_MAX_LENGTH = 100;

interface IngestBody {
  content: string;
  title?: string;
  type?: string;
  source_url?: string;
}

function parseBody(body: unknown): IngestBody {
  if (body === null || typeof body !== 'object' || !('content' in body)) {
    throw new Error('Request body must be JSON with a "content" string field.');
  }

  const { content, title, type, source_url } = body as Record<string, unknown>;

  if (typeof content !== 'string') {
    throw new Error('"content" must be a string.');
  }

  const trimmed = content.trim();
  if (!trimmed) {
    throw new Error('"content" cannot be empty.');
  }

  if (trimmed.length > MAX_CONTENT_LENGTH) {
    throw new Error(`"content" exceeds maximum length of ${MAX_CONTENT_LENGTH} characters.`);
  }

  const result: IngestBody = { content: trimmed };

  if (title !== undefined) {
    if (typeof title !== 'string') throw new Error('"title" must be a string.');
    result.title = title.trim() || undefined;
  }

  if (type !== undefined) {
    if (typeof type !== 'string') throw new Error('"type" must be a string.');
    result.type = type.trim() || 'note';
  } else {
    result.type = 'note';
  }

  if (source_url !== undefined) {
    if (typeof source_url !== 'string') throw new Error('"source_url" must be a string.');
    result.source_url = source_url.trim() || undefined;
  }

  return result;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { content, title, type, source_url } = parseBody(body);

    let insights;
    try {
      insights = await generateNoteInsights(content);
    } catch (error) {
      console.error('Gemini AI Enrichment failed:', error);
      insights = {
        summary: content.slice(0, 120),
        tags: ['note'],
        insight: 'AI enrichment unavailable',
      };
    }

    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
      .from('knowledge_items')
      .insert({
        title: title ?? (content.slice(0, DEFAULT_TITLE_MAX_LENGTH).trim() || 'Untitled'),
        content,
        summary: insights.summary,
        insight: insights.insight,
        tags: insights.tags.length > 0 ? insights.tags : null,
        type: type ?? 'note',
        source_url: source_url ?? null,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: 'Failed to store note.', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'An unexpected error occurred.';
    const status =
      message.includes('content') || message.includes('Request body')
        ? 400
        : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
