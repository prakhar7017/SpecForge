"use client";

import { useEffect, useState } from "react";

interface HealthCheck {
  status: "healthy" | "unhealthy" | "unknown";
  latency: number;
  error?: string;
}

interface StatusResponse {
  status: "healthy" | "degraded";
  checks: {
    backend: HealthCheck;
    database: HealthCheck;
    llm: HealthCheck;
  };
  timestamp: string;
}

export default function StatusPage() {
  const [status, setStatus] = useState<StatusResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch("/api/status");
        const data = await res.json();
        setStatus(data);
      } catch (error) {
        console.error("Failed to fetch status:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    if (status === "healthy") return "text-green-600 bg-green-50";
    if (status === "unhealthy") return "text-red-600 bg-red-50";
    return "text-yellow-600 bg-yellow-50";
  };

  const getStatusIcon = (status: string) => {
    if (status === "healthy") return "✓";
    if (status === "unhealthy") return "✗";
    return "?";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-slate-700 border-t-cyan-500"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <svg className="w-8 h-8 text-cyan-400 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <header className="mb-10 text-center sm:text-left">
          <div className="inline-flex items-center gap-4 mb-3">
            <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-emerald-500/20 ring-1 ring-emerald-500/30">
              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-emerald-300 via-teal-300 to-cyan-300 bg-clip-text text-transparent">
                System Status
              </h1>
              <p className="text-slate-400 mt-1 text-lg">Health checks for backend services</p>
            </div>
          </div>
        </header>

        {status && (
          <div className="space-y-6">
            <div className="bg-slate-800/50 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-700/50 p-6 sm:p-8 ring-1 ring-slate-700/50">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <h2 className="text-2xl font-bold text-slate-100">Overall Status</h2>
                <div
                  className={`px-6 py-3 rounded-xl font-bold text-lg shadow-lg ring-1 ring-white/10 ${
                    status.status === "healthy"
                      ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-emerald-500/30"
                      : "bg-gradient-to-r from-yellow-500 to-amber-600 text-white shadow-yellow-500/30"
                  }`}
                >
                  {status.status.toUpperCase()}
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Last updated: {new Date(status.timestamp).toLocaleString()}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.entries(status.checks).map(([key, check]) => (
                <div
                  key={key}
                  className="bg-slate-800/50 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-700/50 p-6 hover:shadow-xl transition-all duration-200 ring-1 ring-slate-700/50"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-slate-200 capitalize text-lg">{key}</h3>
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-xl shadow-lg ring-1 ring-white/10 ${
                        check.status === "healthy"
                          ? "bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-emerald-500/30"
                          : check.status === "unhealthy"
                          ? "bg-gradient-to-br from-red-500 to-rose-600 text-white shadow-red-500/30"
                          : "bg-gradient-to-br from-yellow-500 to-amber-600 text-white shadow-yellow-500/30"
                      }`}
                    >
                      {getStatusIcon(check.status)}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 text-sm font-medium">Latency:</span>
                      <span className="font-bold text-slate-100">{check.latency}ms</span>
                    </div>
                    {check.error && (
                      <div className="mt-3 p-3 bg-red-900/30 border border-red-700/50 rounded-lg text-red-300 text-xs ring-1 ring-red-700/30">
                        {check.error}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-slate-800/50 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-700/50 p-6 sm:p-8 ring-1 ring-slate-700/50">
              <h3 className="font-bold text-xl text-slate-100 mb-6 flex items-center gap-2">
                <svg className="w-6 h-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Service Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-gradient-to-br from-cyan-900/30 to-blue-900/30 rounded-xl border border-cyan-700/30 ring-1 ring-cyan-700/20">
                  <div className="font-semibold text-cyan-300 mb-1">Backend</div>
                  <div className="text-sm text-cyan-200">Next.js API routes on Node.js</div>
                </div>
                <div className="p-4 bg-gradient-to-br from-purple-900/30 to-pink-900/30 rounded-xl border border-purple-700/30 ring-1 ring-purple-700/20">
                  <div className="font-semibold text-purple-300 mb-1">Database</div>
                  <div className="text-sm text-purple-200">PostgreSQL via Prisma ORM</div>
                </div>
                <div className="p-4 bg-gradient-to-br from-emerald-900/30 to-teal-900/30 rounded-xl border border-emerald-700/30 ring-1 ring-emerald-700/20">
                  <div className="font-semibold text-emerald-300 mb-1">LLM</div>
                  <div className="text-sm text-emerald-200">OpenAI API (GPT-4o-mini)</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}