"use client";

import { useEffect, useState, useImperativeHandle, forwardRef } from "react";

interface Spec {
  id: string;
  title: string;
  createdAt: string;
}

interface RecentSpecsProps {
  onSelectSpec: (id: string) => void;
}

export interface RecentSpecsRef {
  refresh: () => void;
}

const RecentSpecs = forwardRef<RecentSpecsRef, RecentSpecsProps>(
  ({ onSelectSpec }, ref) => {
    const [specs, setSpecs] = useState<Spec[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchSpecs = async () => {
      try {
        const res = await fetch("/api/specs");
        const data = await res.json();
        if (data.success) {
          setSpecs(data.specs);
        }
      } catch (error) {
        console.error("Failed to fetch specs:", error);
      } finally {
        setLoading(false);
      }
    };

    useEffect(() => {
      fetchSpecs();
    }, []);

    useImperativeHandle(ref, () => ({
      refresh: fetchSpecs,
    }));

  if (loading) {
    return (
      <div className="bg-slate-800/50 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-700/50 p-6 ring-1 ring-slate-700/50">
        <div className="flex items-center justify-center py-8">
          <div className="w-8 h-8 border-2 border-slate-700 border-t-cyan-500 rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (specs.length === 0) {
    return (
      <div className="bg-slate-800/50 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-700/50 p-6 ring-1 ring-slate-700/50">
        <h3 className="text-lg font-bold text-slate-200 mb-2">Recent Specs</h3>
        <p className="text-sm text-slate-400">No specs yet. Generate your first one!</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-800/50 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-700/50 p-6 ring-1 ring-slate-700/50">
      <div className="flex items-center gap-2 mb-4">
        <svg className="w-5 h-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 className="text-lg font-bold text-slate-200">Recent Specs</h3>
      </div>
      <div className="space-y-2">
        {specs.map((spec) => (
          <button
            key={spec.id}
            onClick={() => onSelectSpec(spec.id)}
            className="w-full text-left px-4 py-3 text-sm border-2 border-slate-700 rounded-xl hover:bg-gradient-to-r hover:from-cyan-900/30 hover:to-blue-900/30 hover:border-cyan-600/50 transition-all duration-200 shadow-sm hover:shadow-md group ring-1 ring-slate-700/30"
          >
            <div className="font-semibold text-slate-200 group-hover:text-cyan-300 transition-colors mb-1">
              {spec.title}
            </div>
            <div className="text-xs text-slate-400 flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {new Date(spec.createdAt).toLocaleDateString()}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
});

RecentSpecs.displayName = "RecentSpecs";

export default RecentSpecs;