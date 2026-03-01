# AI Powered Second Brain Knowledge System

A full-stack knowledge management system that captures ideas, links, and insights and enriches them with AI-generated summaries, tags, and insights.

Built with modern full-stack architecture using Next.js, Supabase, and AI integration.

---

## Features

- Capture notes, links, and insights
- AI-powered enrichment (summary, tags, insight)
- Search and filter knowledge
- Dashboard with responsive card layout
- Note detail page
- Public AI query endpoint
- Clean minimal UI with animations

---

## Tech Stack

Frontend
- Next.js (App Router)
- React
- Tailwind CSS
- Framer Motion

Backend
- Next.js API Routes

Database
- Supabase (PostgreSQL)

AI Integration
- Gemini API (server-side)

---

## Architecture

Frontend UI  
↓  
Next.js API Routes  
↓  
AI Service Layer  
↓  
Supabase Database  

Key APIs:

POST /api/brain/ingest  
GET /api/brain/search  
GET /api/public/brain/query  

---

## Database Schema

Table: knowledge_items

id  
title  
content  
summary  
insight  
tags  
type  
source_url  
created_at  

---

## Running Locally

Install dependencies:

npm install

Run development server:

npm run dev

Open:

http://localhost:3000

---

## Environment Variables

Create `.env.local`

GEMINI_API_KEY=your_api_key

SUPABASE_URL=your_project_url  
SUPABASE_SERVICE_ROLE_KEY=your_service_key  

NEXT_PUBLIC_SUPABASE_URL=your_project_url  
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key  

---

## AI Integration

Notes are enriched using an AI model which generates:

- Summary
- Tags
- Insight

If the AI API is unavailable or quota is exceeded, the system gracefully stores the note without enrichment.

---

## Pages

/capture → Capture knowledge  
/dashboard → Browse notes  
/notes/[id] → View note details  
/docs → System documentation  

---

## Deployment

Recommended deployment:

- Vercel
- Supabase cloud database

---

## Author

Nandakumar  
B.Tech Computer Science