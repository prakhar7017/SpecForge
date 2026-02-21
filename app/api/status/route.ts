import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { testLLMConnection } from "@/lib/llm";

type HealthStatus = "healthy" | "unhealthy" | "unknown";

interface HealthCheck {
  status: HealthStatus;
  latency: number;
  error?: string;
}

export async function GET() {
  const checks: {
    backend: HealthCheck;
    database: HealthCheck;
    llm: HealthCheck;
  } = {
    backend: { status: "healthy", latency: 0 },
    database: { status: "unknown", latency: 0 },
    llm: { status: "unknown", latency: 0 },
  };

  // Backend check (always healthy if we reach here)
  checks.backend.latency = 0;

  // Database check
  const dbStart = Date.now();
  try {
    await prisma.$queryRaw`SELECT 1`;
    checks.database.status = "healthy";
    checks.database.latency = Date.now() - dbStart;
  } catch (error) {
    checks.database.status = "unhealthy";
    checks.database.latency = Date.now() - dbStart;
    checks.database.error = error instanceof Error ? error.message : "Unknown error";
  }

  // LLM check
  const llmResult = await testLLMConnection();
  checks.llm.status = llmResult.success ? "healthy" : "unhealthy";
  checks.llm.latency = llmResult.latency;
  if (!llmResult.success) {
    checks.llm.error = llmResult.error;
  }

  const allHealthy =
    checks.backend.status === "healthy" &&
    checks.database.status === "healthy" &&
    checks.llm.status === "healthy";

  return NextResponse.json({
    status: allHealthy ? "healthy" : "degraded",
    checks,
    timestamp: new Date().toISOString(),
  });
}