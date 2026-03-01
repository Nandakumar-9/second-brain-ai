'use client';

import { motion } from 'framer-motion';
import { KnowledgeCard } from './KnowledgeCard';
import type { KnowledgeItem } from '@/types/brain';

export interface KnowledgeListProps {
  items: KnowledgeItem[];
  total: number;
  loading?: boolean;
}

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.04 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 },
};

export function KnowledgeList({
  items,
  total,
  loading = false,
}: KnowledgeListProps) {
  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-40 animate-pulse rounded-xl border border-zinc-200 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900"
          />
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="rounded-xl border border-dashed border-zinc-300 bg-zinc-50 py-16 text-center dark:border-zinc-700 dark:bg-zinc-900/50"
      >
        <p className="text-zinc-600 dark:text-zinc-400">
          No notes found. Try adjusting filters or capture a new note.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="visible"
      className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
    >
      {items.map((note) => (
        <motion.div key={note.id} variants={itemVariants}>
          <KnowledgeCard item={note} />
        </motion.div>
      ))}
    </motion.div>
  );
}
