import { GoogleGenerativeAI } from '@google/generative-ai';
import type { KnowledgeItem } from '@/types/brain';

export interface NoteInsights {
  summary: string;
  tags: string[];
  insight: string;
}

export interface PublicQuerySource {
  id: string;
  title: string;
  summary: string | null;
}

export interface PublicQueryAnswer {
  answer: string;
  sources: PublicQuerySource[];
}

let geminiClient: GoogleGenerativeAI | null = null;

function getGeminiClient(): GoogleGenerativeAI {
  if (geminiClient) return geminiClient;

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is not set.');
  }

  geminiClient = new GoogleGenerativeAI(apiKey);
  return geminiClient;
}

/**
 * Generate AI-powered summary, tags, and insight for a note.
 *
 * This function is intended for server-side usage only.
 */
export async function generateNoteInsights(content: string): Promise<NoteInsights> {
  if (!content?.trim()) {
    throw new Error('generateNoteInsights: content must be a non-empty string.');
  }

  const client = getGeminiClient();

  const model = client.getGenerativeModel({
    model: 'gemini-2.0-flash',
  });

  const prompt = [
    'You are an AI assistant for a personal knowledge management system called "Second Brain".',
    'Given the raw text content of a knowledge note, you must produce a concise summary, a set of tags, and one high-level insight.',
    '',
    'CRITICAL OUTPUT REQUIREMENTS:',
    '- Respond with VALID JSON only.',
    '- Do NOT include any markdown, code fences, or explanations.',
    '- Do NOT include any keys other than: "summary", "tags", "insight".',
    '- "tags" must be an array of lowercase strings.',
    '',
    'Expected JSON shape:',
    '{',
    '  "summary": "short summary of the note",',
    '  "tags": ["tag1", "tag2", "tag3"],',
    '  "insight": "one key insight that connects or interprets the content"',
    '}',
    '',
    'Now analyze the following note content and respond with JSON only.',
    '',
    'NOTE CONTENT START',
    content,
    'NOTE CONTENT END',
  ].join('\n');

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text().trim();

  let parsed: unknown;

  try {
    parsed = JSON.parse(text);
  } catch (error) {
    throw new Error(
      `Failed to parse JSON from Gemini response. Raw response was: ${text}`,
    );
  }

  if (
    typeof parsed !== 'object' ||
    parsed === null ||
    !('summary' in parsed) ||
    !('tags' in parsed) ||
    !('insight' in parsed)
  ) {
    throw new Error(
      'Gemini response JSON is missing required fields: summary, tags, insight.',
    );
  }

  const { summary, tags, insight } = parsed as {
    summary: unknown;
    tags: unknown;
    insight: unknown;
  };

  if (typeof summary !== 'string') {
    throw new Error('Gemini response "summary" must be a string.');
  }

  if (!Array.isArray(tags) || !tags.every((t) => typeof t === 'string')) {
    throw new Error('Gemini response "tags" must be an array of strings.');
  }

  if (typeof insight !== 'string') {
    throw new Error('Gemini response "insight" must be a string.');
  }

  return {
    summary: summary.trim(),
    tags: tags.map((t) => t.trim()).filter((t) => t.length > 0),
    insight: insight.trim(),
  };
}

/**
 * Answer a public user question using a set of retrieved knowledge items.
 *
 * This is intended for the public `/api/public/brain/query` endpoint.
 */
export async function answerQuestionFromNotes(
  question: string,
  notes: KnowledgeItem[],
): Promise<PublicQueryAnswer> {
  if (!question?.trim()) {
    throw new Error('answerQuestionFromNotes: question must be a non-empty string.');
  }

  const client = getGeminiClient();

  const model = client.getGenerativeModel({
    model: 'gemini-2.0-flash',
  });

  const notesBlock =
    notes.length === 0
      ? 'No notes were found for this query.'
      : notes
          .map((note, index) => {
            return [
              `Note #${index + 1}`,
              `id: ${note.id}`,
              `title: ${note.title}`,
              `summary: ${note.summary ?? ''}`,
              `content: ${note.content}`,
            ].join('\n');
          })
          .join('\n\n');

  const prompt = [
    'You are an AI assistant for a personal knowledge system called "Second Brain".',
    'You are given a user question and a set of notes from the knowledge base.',
    'Use ONLY the information in the provided notes to answer the question.',
    'If the notes do not contain enough information, say that the answer cannot be determined from the notes.',
    '',
    'CRITICAL OUTPUT REQUIREMENTS:',
    '- Respond with VALID JSON only.',
    '- Do NOT include markdown, code fences, or explanations.',
    '- Use exactly these keys: "answer", "sources".',
    '- "answer" must be a string.',
    '- "sources" must be an array of objects with keys: "id", "title", "summary".',
    '- Each source you include MUST correspond to one of the provided notes by id.',
    '',
    'Expected JSON shape:',
    '{',
    '  "answer": "short answer to the question",',
    '  "sources": [',
    '    { "id": "uuid", "title": "Note title", "summary": "Short summary or empty string" }',
    '  ]',
    '}',
    '',
    `USER QUESTION: ${question.trim()}`,
    '',
    'NOTES:',
    notesBlock,
  ].join('\n');

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text().trim();

  let parsed: unknown;

  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error(
      `Failed to parse JSON from Gemini public query response. Raw response was: ${text}`,
    );
  }

  if (typeof parsed !== 'object' || parsed === null) {
    throw new Error('Gemini public query response is not a JSON object.');
  }

  const { answer, sources } = parsed as {
    answer: unknown;
    sources: unknown;
  };

  if (typeof answer !== 'string') {
    throw new Error('Gemini public query response "answer" must be a string.');
  }

  if (!Array.isArray(sources)) {
    throw new Error('Gemini public query response "sources" must be an array.');
  }

  const normalizedSources: PublicQuerySource[] = sources.map((src) => {
    if (typeof src !== 'object' || src === null) {
      throw new Error('Each source must be an object.');
    }

    const { id, title, summary } = src as {
      id: unknown;
      title: unknown;
      summary: unknown;
    };

    if (typeof id !== 'string') {
      throw new Error('Source "id" must be a string.');
    }

    if (typeof title !== 'string') {
      throw new Error('Source "title" must be a string.');
    }

    if (summary !== null && typeof summary !== 'string') {
      throw new Error('Source "summary" must be a string or null.');
    }

    return {
      id,
      title,
      summary: summary === null ? null : (summary ?? '').toString(),
    };
  });

  return {
    answer: answer.trim(),
    sources: normalizedSources,
  };
}


