'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import type { KnowledgeItem } from '@/types/brain';

export interface KnowledgeCardProps {
  item: KnowledgeItem;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    dateStyle: 'medium',
  });
}

export function KnowledgeCard({ item }: KnowledgeCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4, transition: { duration: 0.15 } }}
      transition={{ duration: 0.2 }}
    >
      <Link
        href={`/notes/${item.id}`}
        className="block rounded-xl border border-zinc-200 bg-white p-5 shadow-sm transition-all duration-200 hover:border-zinc-600 hover:shadow-lg hover:shadow-zinc-900 dark:border-zinc-800 dark:bg-zinc-950"
      >
        <h3 className="font-semibold text-zinc-900 dark:text-zinc-50 line-clamp-2">
          {item.title || 'Untitled'}
        </h3>
        {item.summary && (
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400 line-clamp-3">
            {item.summary}
          </p>
        )}
        {item.tags && item.tags.length > 0 && (
          <ul className="mt-3 flex flex-wrap gap-1.5">
            {item.tags.slice(0, 5).map((tag) => (
              <li
                key={tag}
                className="bg-zinc-800 text-zinc-300 border border-zinc-700 rounded-full px-2 py-0.5 text-xs"
              >
                {tag}
              </li>
            ))}
          </ul>
        )}
        <time
          dateTime={item.created_at}
          className="mt-3 block text-xs text-zinc-500 dark:text-zinc-500"
        >
          {formatDate(item.created_at)}
        </time>
      </Link>
    </motion.div>
  );
}
