import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getSupabaseServerClient } from '@/lib/supabase/client-server';
import type { KnowledgeItem } from '@/types/brain';

interface PageProps {
  params: Promise<{ id: string }>;
}

async function getNoteById(id: string): Promise<KnowledgeItem | null> {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from('knowledge_items')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) return null;
  return data as KnowledgeItem;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

export default async function NoteDetailPage({ params }: PageProps) {
  const { id } = await params;
  const note = await getNoteById(id);

  if (!note) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-zinc-100 px-4 py-10 dark:from-black dark:to-zinc-950">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/dashboard"
          className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-zinc-600 transition hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
        >
          ← Back to dashboard
        </Link>

        <article className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-lg shadow-zinc-200/40 dark:border-zinc-800 dark:bg-zinc-950 dark:shadow-black/30">
          {/* Title */}
          <header className="mb-6">
            <h1 className="font-serif text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-3xl">
              {note.title || 'Untitled'}
            </h1>
          </header>

          {/* Metadata */}
          <div className="mb-6 flex flex-wrap items-center gap-3 border-b border-zinc-200 pb-4 dark:border-zinc-800">
            <span className="rounded-md bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
              {note.type}
            </span>
            <time
              dateTime={note.created_at}
              className="text-sm text-zinc-500 dark:text-zinc-500"
            >
              {formatDate(note.created_at)}
            </time>
            {note.source_url && (
              <a
                href={note.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-zinc-700 underline decoration-zinc-300 underline-offset-2 transition hover:decoration-zinc-500 dark:text-zinc-300 dark:decoration-zinc-700 dark:hover:decoration-zinc-500"
              >
                Source
              </a>
            )}
          </div>

          {/* Summary */}
          {note.summary && (
            <section className="mb-6">
              <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-500">
                Summary
              </h2>
              <p className="text-base leading-relaxed text-zinc-700 dark:text-zinc-300">
                {note.summary}
              </p>
            </section>
          )}

          {/* Content */}
          <section className="mb-6">
            <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-500">
              Content
            </h2>
            <div className="whitespace-pre-wrap text-base leading-relaxed text-zinc-800 dark:text-zinc-200">
              {note.content}
            </div>
          </section>

          {/* Tags */}
          {note.tags && note.tags.length > 0 && (
            <section className="mb-6">
              <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-500">
                Tags
              </h2>
              <ul className="flex flex-wrap gap-2">
                {note.tags.map((tag) => (
                  <li
                    key={tag}
                    className="rounded-full bg-zinc-100 px-3 py-0.5 text-sm text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                  >
                    {tag}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Insight */}
          {note.insight && (
            <section className="rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-900/50 dark:bg-amber-950/30">
              <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-amber-800 dark:text-amber-200">
                Insight
              </h2>
              <p className="text-base leading-relaxed text-amber-900 dark:text-amber-100">
                {note.insight}
              </p>
            </section>
          )}
        </article>
      </div>
    </div>
  );
}
