# Quick Start Guide

## Prerequisites

1. Node.js 18+ installed
2. PostgreSQL database (local or cloud)
3. OpenAI API key

## Setup Steps

1. **Install dependencies:**
```bash
npm install
```

2. **Set up environment variables:**
```bash
cp .env.example .env
```

Edit `.env` and add:
- `DATABASE_URL`: Your PostgreSQL connection string
- `OPENAI_API_KEY`: Your OpenAI API key
- `OPENAI_MODEL`: Optional (defaults to `gpt-4o-mini`)

3. **Set up database:**
```bash
npx prisma migrate dev --name init
```

This will:
- Create the database schema
- Generate the Prisma client

4. **Start development server:**
```bash
npm run dev
```

5. **Open your browser:**
Navigate to [http://localhost:3000](http://localhost:3000)

## First Use

1. Fill out the feature form:
   - Goal (min 10 characters)
   - Target Users (min 5 characters)
   - Optional: Constraints, Risks
   - Select template type

2. Click "Generate Spec"

3. Review and edit the generated tasks

4. Save your spec (auto-saves last 5)

5. Export as Markdown if needed

## Testing

Run tests:
```bash
npm test
```

## Deployment

See README.md for deployment instructions to Vercel.

## Troubleshooting

### Prisma Client Issues
If you see Prisma client errors, run:
```bash
npx prisma generate
```

### Database Connection Issues
- Verify `DATABASE_URL` is correct
- Ensure PostgreSQL is running
- Check firewall/network settings

### OpenAI API Issues
- Verify `OPENAI_API_KEY` is set
- Check API key has sufficient credits
- Verify model name is correct