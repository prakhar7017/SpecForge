# Tasks Generator

A production-ready web application for generating and managing product planning specs using AI.

## Features

- **Feature Input Form**: Accept goal, users, constraints, risks, and template type
- **AI-Powered Generation**: Uses OpenAI GPT-4o-mini to generate structured user stories and engineering tasks
- **Task Management**: Edit, reorder (drag & drop), group, and delete tasks
- **Scope Risk Analyzer**: Analyzes complexity, P0 task count, and risk density
- **Export**: Copy to clipboard or download as Markdown
- **Persistence**: Stores last 5 generated specs in PostgreSQL
- **Status Page**: Health checks for backend, database, and LLM connectivity

## Tech Stack

- **Frontend**: Next.js 16 (App Router), TypeScript, TailwindCSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **LLM**: OpenAI API (GPT-4o-mini)
- **Drag & Drop**: @dnd-kit
- **Validation**: Zod

## Setup

### Prerequisites

- Node.js 18+ 
- PostgreSQL database (local or cloud)
- OpenAI API key

### Installation

1. Clone the repository:
```bash
git clone <repo-url>
cd specforge
```

2. Install dependencies:
```bash
npm install
```

This will automatically generate Prisma client via the `postinstall` script.

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and add your:
- `DATABASE_URL`: PostgreSQL connection string
- `OPENAI_API_KEY`: Your OpenAI API key
- `OPENAI_MODEL`: Model to use (default: `gpt-4o-mini`)

4. Generate Prisma client (if not done automatically):
```bash
npx prisma generate
```

5. Set up the database:
```bash
npx prisma migrate dev --name init
```

6. Run the development server:
```bash
npm run dev
```

The dev script will automatically generate Prisma client if needed.

Open [http://localhost:3000](http://localhost:3000) in your browser.

**Note:** If you see TypeScript errors about `PrismaClient` not being found, run:
```bash
npx prisma generate
```

## Deployment

### Vercel

1. Push your code to GitHub/GitLab
2. Import project in Vercel
3. Add environment variables:
   - `DATABASE_URL`
   - `OPENAI_API_KEY`
   - `OPENAI_MODEL` (optional)
4. Deploy

### Database Options

- **Supabase**: Free PostgreSQL hosting
- **Neon**: Serverless PostgreSQL
- **Railway**: Easy PostgreSQL setup

Make sure to update `DATABASE_URL` in your deployment environment.

## Testing

Run tests:
```bash
npm test
```

Run tests with UI:
```bash
npm run test:ui
```

## Project Structure

```
/app
  /api          # API routes
  /status       # Status page
  page.tsx      # Home page
/components     # React components
/lib            # Utilities and services
  db.ts         # Database client
  llm.ts        # OpenAI integration
  validators.ts # Zod schemas
  scope-analyzer.ts
  export.ts
/prisma         # Database schema
```

## What's Done

✅ Feature input form with validation  
✅ AI-powered spec generation  
✅ Task editing with drag & drop  
✅ Scope risk analyzer  
✅ Export to Markdown  
✅ Spec persistence (last 5)  
✅ Status page with health checks  
✅ Basic tests  
✅ Clean, minimal UI  

## What's Not Done

- User authentication (intentionally omitted)
- Real-time collaboration
- Advanced filtering/search
- Multiple export formats
- Spec versioning
- Comments/notes on tasks

## License

MIT# SpecForge
