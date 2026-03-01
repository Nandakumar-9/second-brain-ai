import { GoogleGenerativeAI } from '@google/generative-ai';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
    console.log('No API key found in .env.local');
    process.exit(1);
}

const client = new GoogleGenerativeAI(apiKey);
const model = client.getGenerativeModel({ model: 'gemini-2.0-flash' });

async function run() {
    try {
        const prompt = 'You are an AI assistant for a personal knowledge management system called "Second Brain". Given the raw text content of a knowledge note, you must produce a concise summary, a set of tags, and one high-level insight.\n\nCRITICAL OUTPUT REQUIREMENTS:\n- Respond with VALID JSON only.\n- Do NOT include any markdown, code fences, or explanations.\n- Do NOT include any keys other than: "summary", "tags", "insight".\n- "tags" must be an array of lowercase strings.\n\nExpected JSON shape:\n{\n  "summary": "short summary of the note",\n  "tags": ["tag1", "tag2", "tag3"],\n  "insight": "one key insight that connects or interprets the content"\n}\n\nNow analyze the following note content and respond with JSON only.\n\nNOTE CONTENT START\ntest\nNOTE CONTENT END';

        const result = await model.generateContent(prompt);
        console.log((await result.response).text());
    } catch (e) {
        console.error('ERROR:', e);
    }
}

run();
