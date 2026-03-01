'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';

type NoteType = 'note' | 'link' | 'insight';

export default function CapturePage() {
  const [title, setTitle] = React.useState('');
  const [content, setContent] = React.useState('');
  const [type, setType] = React.useState<NoteType>('note');
  const [sourceUrl, setSourceUrl] = React.useState('');

  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    setSuccess(null);
    setError(null);

    if (!content.trim()) {
      setError('Content is required.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/brain/ingest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title.trim() || undefined,
          content: content.trim(),
          type,
          source_url: sourceUrl.trim() || undefined,
        }),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as
          | { error?: string; details?: string }
          | null;

        const message =
          payload?.error ??
          payload?.details ??
          'Failed to save note. Please try again.';

        throw new Error(message);
      }

      setSuccess('Note captured successfully.');
      setTitle('');
      setContent('');
      setSourceUrl('');
      setType('note');
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Something went wrong.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen justify-center bg-gradient-to-b from-zinc-50 to-zinc-100 px-4 py-10 dark:from-black dark:to-zinc-950">
      <motion.main
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.22, ease: 'easeOut' }}
        className="w-full max-w-3xl rounded-2xl border border-zinc-200 bg-white/80 p-8 shadow-lg shadow-zinc-200/60 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-950/80 dark:shadow-black/40"
      >
        <div className="flex flex-col gap-2 pb-6">
          <motion.h1
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05, duration: 0.18 }}
            className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-2xl"
          >
            Capture knowledge into your Second Brain
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.18 }}
            className="text-sm text-zinc-600 dark:text-zinc-400"
          >
            Drop raw thoughts, links, or insights here. We&apos;ll enrich them
            with AI-generated summaries, tags, and deeper insights.
          </motion.p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label
              htmlFor="title"
              className="text-sm font-medium text-zinc-800 dark:text-zinc-200"
            >
              Title{' '}
              <span className="text-xs font-normal text-zinc-500">
                (optional)
              </span>
            </label>
            <Input
              id="title"
              name="title"
              placeholder="Quick label for this note"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              disabled={loading}
            />
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="content"
              className="text-sm font-medium text-zinc-800 dark:text-zinc-200"
            >
              Content
              <span className="ml-1 text-xs font-semibold text-rose-500">*</span>
            </label>
            <Textarea
              id="content"
              name="content"
              rows={8}
              placeholder="Paste meeting notes, research, or ideas…"
              value={content}
              onChange={(event) => setContent(event.target.value)}
              disabled={loading}
            />
            <p className="text-xs text-zinc-500 dark:text-zinc-500">
              This is the raw note that will be summarized and analyzed by AI.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
            <div className="space-y-1.5">
              <label
                htmlFor="type"
                className="text-sm font-medium text-zinc-800 dark:text-zinc-200"
              >
                Type
              </label>
              <Select
                id="type"
                name="type"
                value={type}
                onChange={(event) => setType(event.target.value as NoteType)}
                disabled={loading}
              >
                <option value="note">Note</option>
                <option value="link">Link</option>
                <option value="insight">Insight</option>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="source_url"
                className="text-sm font-medium text-zinc-800 dark:text-zinc-200"
              >
                Source URL{' '}
                <span className="text-xs font-normal text-zinc-500">
                  (optional)
                </span>
              </label>
              <Input
                id="source_url"
                name="source_url"
                type="url"
                placeholder="https://…"
                value={sourceUrl}
                onChange={(event) => setSourceUrl(event.target.value)}
                disabled={loading}
              />
            </div>
          </div>

          {error && <Alert kind="error">{error}</Alert>}
          {success && <Alert kind="success">{success}</Alert>}

          <div className="flex items-center justify-between pt-2">
            <p className="text-xs text-zinc-500 dark:text-zinc-500">
              AI enrichment runs on the server via Gemini and Supabase.
            </p>
            <Button type="submit" loading={loading}>
              {loading ? 'Capturing…' : 'Capture note'}
            </Button>
          </div>
        </form>
      </motion.main>
    </div>
  );
}

