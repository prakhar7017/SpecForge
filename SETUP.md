# Setup Instructions

## Prisma Client Generation Issue

If you're seeing the error:
```
Error: Cannot find module '.prisma/client/default'
```

This means Prisma client hasn't been generated. Run:

```bash
npx prisma generate
```

## Complete Setup Steps

1. **Install dependencies:**
```bash
npm install
```

2. **Generate Prisma client:**
```bash
npx prisma generate
```

3. **Set up your database:**
   - Make sure PostgreSQL is running
   - Update `.env` with your `DATABASE_URL`

4. **Run migrations:**
```bash
npx prisma migrate dev --name init
```

5. **Start the dev server:**
```bash
npm run dev
```

## Troubleshooting

### Prisma Client Not Found
- Run `npx prisma generate` manually
- Check that `node_modules/.prisma/client` exists
- Try deleting `node_modules` and `.next` folders, then reinstall:
  ```bash
  rm -rf node_modules .next
  npm install
  npx prisma generate
  ```

### Database Connection Issues
- Verify `DATABASE_URL` in `.env` is correct
- Ensure PostgreSQL is running
- Test connection: `psql $DATABASE_URL`