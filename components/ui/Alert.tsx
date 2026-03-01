import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface AlertProps {
  kind?: 'success' | 'error';
  children: React.ReactNode;
}

export function Alert({ kind = 'success', children }: AlertProps) {
  const base =
    'mt-3 flex items-start gap-2 rounded-md border px-3 py-2 text-sm';
  const styles =
    kind === 'success'
      ? 'border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-100'
      : 'border-rose-200 bg-rose-50 text-rose-900 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-100';

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 4 }}
        transition={{ duration: 0.15 }}
        className={`${base} ${styles}`}
      >
        <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-current" />
        <div>{children}</div>
      </motion.div>
    </AnimatePresence>
  );
}

