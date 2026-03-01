'use client';

import { motion, Variants } from 'framer-motion';

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.1,
      duration: 0.5,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
};

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-zinc-100 px-4 py-12 dark:from-black dark:to-zinc-950">
      <div className="mx-auto max-w-3xl">
        <motion.header
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-12"
        >
          <h1 className="font-serif text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            Second Brain — Architecture & Design
          </h1>
          <p className="mt-2 text-lg text-zinc-600 dark:text-zinc-400">
            How the system is built and why it works the way it does.
          </p>
        </motion.header>

        <div className="space-y-16">
          {/* 1. Portable Architecture */}
          <motion.section
            custom={0}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
            variants={sectionVariants}
            className="scroll-mt-8"
          >
            <h2 className="mb-4 font-serif text-xl font-semibold text-zinc-900 dark:text-zinc-50">
              1. Portable Architecture
            </h2>
            <div className="space-y-4 text-zinc-700 dark:text-zinc-300">
              <p className="leading-relaxed">
                Second Brain is built as a layered system so each part can evolve
                or be replaced without rewriting the rest. Responsibilities are
                clearly separated across four areas.
              </p>
              <ul className="list-inside list-disc space-y-2 pl-2">
                <li>
                  <strong className="text-zinc-900 dark:text-zinc-100">
                    UI (Next.js App Router + React)
                  </strong>
                  — Pages and components only handle presentation and user
                  input. They call API routes or server utilities; they do not
                  talk to the database or AI directly.
                </li>
                <li>
                  <strong className="text-zinc-900 dark:text-zinc-100">
                    API routes
                  </strong>
                  — Route handlers in <code className="rounded bg-zinc-200 px-1.5 py-0.5 text-sm dark:bg-zinc-800">app/api</code> validate
                  requests, orchestrate workflows, and return JSON. They are the
                  only place that combines database and AI calls for the app.
                </li>
                <li>
                  <strong className="text-zinc-900 dark:text-zinc-100">
                    Database layer (Supabase)
                  </strong>
                  — All persistence goes through the Supabase client. Types in{' '}
                  <code className="rounded bg-zinc-200 px-1.5 py-0.5 text-sm dark:bg-zinc-800">lib/supabase</code> and{' '}
                  <code className="rounded bg-zinc-200 px-1.5 py-0.5 text-sm dark:bg-zinc-800">types/brain.ts</code> keep
                  the schema explicit and portable.
                </li>
                <li>
                  <strong className="text-zinc-900 dark:text-zinc-100">
                    AI services (Gemini)
                  </strong>
                  — AI logic lives in <code className="rounded bg-zinc-200 px-1.5 py-0.5 text-sm dark:bg-zinc-800">lib/ai</code> and is
                  used only on the server. The UI never sees API keys or raw
                  model responses; it only sees the structured data returned by
                  the API.
                </li>
              </ul>
              <p className="leading-relaxed">
                This separation makes it easier to add new frontends, swap
                providers, or run the same API from different clients (e.g.
                public API, CLI, or mobile app).
              </p>
            </div>
          </motion.section>

          {/* 2. UX Principles */}
          <motion.section
            custom={1}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
            variants={sectionVariants}
            className="scroll-mt-8"
          >
            <h2 className="mb-4 font-serif text-xl font-semibold text-zinc-900 dark:text-zinc-50">
              2. UX Principles
            </h2>
            <div className="space-y-4 text-zinc-700 dark:text-zinc-300">
              <p className="leading-relaxed">
                The interface is designed around a few principles so capturing
                and browsing knowledge stays quick and predictable.
              </p>
              <ul className="space-y-3 pl-0">
                <li className="flex gap-3">
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-zinc-400 dark:bg-zinc-500" />
                  <div>
                    <strong className="text-zinc-900 dark:text-zinc-100">
                      Fast capture workflow
                    </strong>
                    — The capture form asks only for content (required) and
                    optional title, type, and source URL. One action saves and
                    triggers AI enrichment so you can capture first and refine
                    later.
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-zinc-400 dark:bg-zinc-500" />
                  <div>
                    <strong className="text-zinc-900 dark:text-zinc-100">
                      Clear information hierarchy
                    </strong>
                    — Titles, summaries, and metadata are visually distinct. On
                    the dashboard, cards surface title, summary, tags, and date;
                    on the note page, content, summary, tags, and insight are
                    grouped into clear sections.
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-zinc-400 dark:bg-zinc-500" />
                  <div>
                    <strong className="text-zinc-900 dark:text-zinc-100">
                      Minimal friction when creating notes
                    </strong>
                    — No sign-up gate on capture; only content is required.
                    Loading and success/error states are explicit, and the form
                    resets after a successful save so you can add another note
                    immediately.
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-zinc-400 dark:bg-zinc-500" />
                  <div>
                    <strong className="text-zinc-900 dark:text-zinc-100">
                      Responsive design
                    </strong>
                    — Layouts and grids adapt to small and large screens so
                    capture and dashboard are usable on phones and desktops
                    without a separate mobile UI.
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-zinc-400 dark:bg-zinc-500" />
                  <div>
                    <strong className="text-zinc-900 dark:text-zinc-100">
                      Consistent feedback
                    </strong>
                    — Buttons and cards use subtle motion (e.g. Framer Motion)
                    to signal interactivity; alerts and loading states confirm
                    that actions were received and completed.
                  </div>
                </li>
              </ul>
            </div>
          </motion.section>

          {/* 3. Agent Thinking */}
          <motion.section
            custom={2}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
            variants={sectionVariants}
            className="scroll-mt-8"
          >
            <h2 className="mb-4 font-serif text-xl font-semibold text-zinc-900 dark:text-zinc-50">
              3. Agent Thinking
            </h2>
            <div className="space-y-4 text-zinc-700 dark:text-zinc-300">
              <p className="leading-relaxed">
                Stored knowledge is automatically improved by an AI layer that
                runs at ingest time. When you submit a note, the system sends
                the raw content to a single Gemini call that returns structured
                metadata.
              </p>
              <p className="leading-relaxed">
                The model is prompted to produce three things in one response:
              </p>
              <ul className="list-inside list-disc space-y-1 pl-2">
                <li>
                  <strong className="text-zinc-900 dark:text-zinc-100">Summary</strong> — A short
                  digest of the note so you can scan without opening it.
                </li>
                <li>
                  <strong className="text-zinc-900 dark:text-zinc-100">Tags</strong> — Lowercase
                  labels that support filtering and discovery on the dashboard.
                </li>
                <li>
                  <strong className="text-zinc-900 dark:text-zinc-100">Insight</strong> — One
                  higher-level takeaway or connection that makes the note more
                  useful in context.
                </li>
              </ul>
              <p className="leading-relaxed">
                All of this is persisted with the note in Supabase. The UI
                never calls the AI directly; the API route handles the
                request, calls the Gemini utility, then writes the enriched
                record. That keeps the “agent” behavior server-side and
                consistent, and lets the front end stay a thin layer over
                already-enriched data.
              </p>
            </div>
          </motion.section>

          {/* 4. Infrastructure Mindset */}
          <motion.section
            custom={3}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
            variants={sectionVariants}
            className="scroll-mt-8"
          >
            <h2 className="mb-4 font-serif text-xl font-semibold text-zinc-900 dark:text-zinc-50">
              4. Infrastructure Mindset
            </h2>
            <div className="space-y-4 text-zinc-700 dark:text-zinc-300">
              <p className="leading-relaxed">
                Second Brain exposes a public API so external tools and users
                can query the knowledge base without using the main app UI.
              </p>
              <p className="leading-relaxed">
                The endpoint{' '}
                <code className="rounded bg-zinc-200 px-1.5 py-0.5 font-mono text-sm dark:bg-zinc-800">
                  GET /api/public/brain/query
                </code>{' '}
                accepts a required query parameter <code className="rounded bg-zinc-200 px-1.5 py-0.5 text-sm dark:bg-zinc-800">q</code> (max 300
                characters). The server:
              </p>
              <ol className="list-inside list-decimal space-y-2 pl-2">
                <li>
                  Searches <code className="rounded bg-zinc-200 px-1.5 py-0.5 text-sm dark:bg-zinc-800">knowledge_items</code> by
                  title, content, and summary (up to 5 matches).
                </li>
                <li>
                  Sends those notes plus the question to Gemini and asks it to
                  answer using only the provided context.
                </li>
                <li>
                  Returns JSON with an <code className="rounded bg-zinc-200 px-1.5 py-0.5 text-sm dark:bg-zinc-800">answer</code> and a{' '}
                  <code className="rounded bg-zinc-200 px-1.5 py-0.5 text-sm dark:bg-zinc-800">sources</code> array
                  (id, title, summary) so callers can attribute and link back.
                </li>
              </ol>
              <p className="leading-relaxed">
                This design treats the knowledge base as infrastructure: the same
                data that powers the dashboard can power chatbots, search
                widgets, or other apps. The public API is read-only and
                question-answering only; write operations stay internal to the
                app and authenticated flows.
              </p>
            </div>
          </motion.section>
        </div>
      </div>
    </div>
  );
}
