import * as React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

export interface ButtonProps extends HTMLMotionProps<"button"> {
  loading?: boolean;
  children?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  function Button({ className = '', loading = false, children, ...props }, ref) {
    return (
      <motion.button
        ref={ref}
        whileTap={{ scale: 0.97 }}
        whileHover={{ y: -1 }}
        transition={{ duration: 0.08 }}
        className={`inline-flex items-center justify-center rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-zinc-50 shadow-sm transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-70 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 ${className}`}
        {...props}
      >
        {loading && (
          <span className="mr-2 h-3 w-3 animate-spin rounded-full border-2 border-zinc-50 border-t-transparent dark:border-zinc-900 dark:border-t-transparent" />
        )}
        {children}
      </motion.button>
    );
  },
);

