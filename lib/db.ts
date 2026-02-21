import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not set");
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// Keep only the latest 5 specs
export async function maintainSpecLimit() {
  const count = await prisma.spec.count();
  if (count > 5) {
    const oldestSpecs = await prisma.spec.findMany({
      orderBy: { createdAt: "asc" },
      take: count - 5,
      select: { id: true },
    });
    await prisma.spec.deleteMany({
      where: { id: { in: oldestSpecs.map((s) => s.id) } },
    });
  }
}