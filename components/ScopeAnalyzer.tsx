"use client";

import { analyzeScope, type ScopeAnalysis } from "@/lib/scope-analyzer";
import type { GeneratedSpec } from "@/lib/validators";
import { useEffect, useState } from "react";

interface ScopeAnalyzerProps {
  spec: GeneratedSpec;
}

export default function ScopeAnalyzer({ spec }: ScopeAnalyzerProps) {
  const [analysis, setAnalysis] = useState<ScopeAnalysis | null>(null);

  useEffect(() => {
    setAnalysis(analyzeScope(spec));
  }, [spec]);

  if (!analysis) return null;

  const scopeColor =
    analysis.estimatedScope === "Small"
      ? "text-green-600 bg-green-50"
      : analysis.estimatedScope === "Medium"
      ? "text-yellow-600 bg-yellow-50"
      : "text-red-600 bg-red-50";

  const scopeGradient =
    analysis.estimatedScope === "Small"
      ? "from-green-500 to-emerald-500"
      : analysis.estimatedScope === "Medium"
      ? "from-yellow-500 to-amber-500"
      : "from-red-500 to-rose-500";

  return (
    <div className="border-2 border-slate-700/50 rounded-3xl p-6 bg-gradient-to-br from-slate-800/80 to-slate-900/80 shadow-2xl ring-1 ring-slate-700/50">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 via-indigo-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20">
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-slate-100">Scope Risk Analyzer</h3>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center p-4 bg-slate-900/60 rounded-xl border border-slate-700 ring-1 ring-slate-700/50">
          <div className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-1">
            {analysis.totalComplexityScore}
          </div>
          <div className="text-xs font-medium text-slate-400 uppercase tracking-wide">Complexity Score</div>
        </div>
        <div className="text-center p-4 bg-slate-900/60 rounded-xl border border-slate-700 ring-1 ring-slate-700/50">
          <div className="text-3xl font-bold bg-gradient-to-r from-red-400 to-rose-400 bg-clip-text text-transparent mb-1">
            {analysis.p0Count}
          </div>
          <div className="text-xs font-medium text-slate-400 uppercase tracking-wide">P0 Tasks</div>
        </div>
        <div className="text-center p-4 bg-slate-900/60 rounded-xl border border-slate-700 ring-1 ring-slate-700/50">
          <div className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent mb-1">
            {analysis.riskDensityScore}
          </div>
          <div className="text-xs font-medium text-slate-400 uppercase tracking-wide">Risk Density</div>
        </div>
      </div>

      <div className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold bg-gradient-to-r ${scopeGradient} text-white shadow-lg shadow-${scopeGradient.split('-')[1]}-500/20 mb-6 ring-1 ring-white/10`}>
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Estimated Scope: {analysis.estimatedScope}
      </div>

      {analysis.warnings.length > 0 && (
        <div className="mt-4 space-y-3">
          {analysis.warnings.map((warning, idx) => (
            <div
              key={idx}
              className="flex items-start gap-3 text-sm text-amber-200 bg-gradient-to-r from-amber-900/40 to-yellow-900/40 p-4 rounded-xl border border-amber-700/50 shadow-sm ring-1 ring-amber-700/30"
            >
              <span className="text-xl flex-shrink-0">⚠️</span>
              <span className="font-medium">{warning}</span>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 p-4 bg-gradient-to-r from-cyan-900/30 to-blue-900/30 rounded-xl border border-cyan-700/30 shadow-sm ring-1 ring-cyan-700/20">
        <div className="flex items-start gap-3">
          <span className="text-2xl flex-shrink-0">💡</span>
          <div>
            <strong className="text-cyan-300 font-semibold">Suggestion:</strong>
            <p className="text-cyan-200 mt-1">{analysis.suggestion}</p>
          </div>
        </div>
      </div>
    </div>
  );
}