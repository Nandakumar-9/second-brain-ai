'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import {
  DashboardFilters,
  type NoteTypeFilter,
  type SortOption,
} from '@/components/brain/dashboard/DashboardFilters';
import { KnowledgeList } from '@/components/brain/dashboard/KnowledgeList';
import type { KnowledgeItem } from '@/types/brain';

const SEARCH_DEBOUNCE_MS = 300;

export default function DashboardPage() {
  const [query, setQuery] = React.useState('');
  const [tag, setTag] = React.useState('');
  const [type, setType] = React.useState<NoteTypeFilter>('');
  const [sort, setSort] = React.useState<SortOption>('created_at_desc');

  const [items, setItems] = React.useState<KnowledgeItem[]>([]);
  const [total, setTotal] = React.useState(0);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const debouncedQuery = useDebounce(query, SEARCH_DEBOUNCE_MS);
  const debouncedTag = useDebounce(tag, SEARCH_DEBOUNCE_MS);

  const fetchNotes = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    const params = new URLSearchParams();
    if (debouncedQuery) params.set('q', debouncedQuery);
    if (debouncedTag) params.set('tag', debouncedTag);
    if (type) params.set('type', type);
    params.set('sort', sort);
    try {
      const res = await fetch(`/api/brain/search?${params.toString()}`);
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? 'Failed to load notes');
      }
      const data = await res.json();
      setItems(data.items ?? []);
      setTotal(typeof data.total === 'number' ? data.total : data.items?.length ?? 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setItems([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [debouncedQuery, debouncedTag, type, sort]);

  React.useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-zinc-100 px-4 py-10 dark:from-black dark:to-zinc-950">
      <div className="mx-auto max-w-6xl">
        <motion.header
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="mb-8"
        >
          <h1 className="font-serif text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-3xl">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Search and browse your knowledge base.
          </p>
        </motion.header>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: 0.05 }}
          className="mb-6"
        >
          <DashboardFilters
            query={query}
            onQueryChange={setQuery}
            tag={tag}
            onTagChange={setTag}
            type={type}
            onTypeChange={setType}
            sort={sort}
            onSortChange={setSort}
            disabled={loading}
          />
        </motion.div>

        {error && (
          <div className="mb-4 rounded-lg border border-rose-200 bg-rose-50 px-4 py-2 text-sm text-rose-800 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-200">
            {error}
          </div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2, delay: 0.1 }}
        >
          {!loading && items.length > 0 && (
            <p className="mb-4 text-sm text-zinc-500 dark:text-zinc-500">
              {total} {total === 1 ? 'note' : 'notes'}
            </p>
          )}
          <KnowledgeList items={items} total={total} loading={loading} />
        </motion.div>
      </div>
    </div>
  );
}

function useDebounce<T>(value: T, delayMs: number): T {
  const [debouncedValue, setDebouncedValue] = React.useState(value);

  React.useEffect(() => {
    const id = window.setTimeout(() => setDebouncedValue(value), delayMs);
    return () => window.clearTimeout(id);
  }, [value, delayMs]);

  return debouncedValue;
}
