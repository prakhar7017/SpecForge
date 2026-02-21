"use client";

import { useState } from "react";
import type { FeatureInput } from "@/lib/validators";

interface FeatureFormProps {
  onSubmit: (input: FeatureInput) => void;
  isLoading: boolean;
}

export default function FeatureForm({ onSubmit, isLoading }: FeatureFormProps) {
  const [formData, setFormData] = useState<FeatureInput>({
    goal: "",
    users: "",
    constraints: "",
    risks: "",
    templateType: "web",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FeatureInput, string>>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Partial<Record<keyof FeatureInput, string>> = {};

    if (formData.goal.length < 10) {
      newErrors.goal = "Goal must be at least 10 characters";
    }
    if (formData.users.length < 5) {
      newErrors.users = "Users must be at least 5 characters";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="goal" className="block text-sm font-semibold text-slate-200 mb-2">
          Goal <span className="text-red-400">*</span>
        </label>
        <textarea
          id="goal"
          value={formData.goal}
          onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
          className="w-full px-4 py-3 border-2 border-slate-600 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-200 bg-slate-900/50 backdrop-blur-sm placeholder:text-slate-500 text-slate-200"
          rows={3}
          placeholder="Describe the feature goal..."
        />
        {errors.goal && (
          <p className="mt-2 text-sm text-red-400 flex items-center gap-1">
            <span>⚠</span> {errors.goal}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="users" className="block text-sm font-semibold text-slate-200 mb-2">
          Target Users <span className="text-red-400">*</span>
        </label>
        <textarea
          id="users"
          value={formData.users}
          onChange={(e) => setFormData({ ...formData, users: e.target.value })}
          className="w-full px-4 py-3 border-2 border-slate-600 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-200 bg-slate-900/50 backdrop-blur-sm placeholder:text-slate-500 text-slate-200"
          rows={2}
          placeholder="Who will use this feature?"
        />
        {errors.users && (
          <p className="mt-2 text-sm text-red-400 flex items-center gap-1">
            <span>⚠</span> {errors.users}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="constraints" className="block text-sm font-semibold text-slate-200 mb-2">
          Constraints <span className="text-slate-500 text-xs font-normal">(Optional)</span>
        </label>
        <textarea
          id="constraints"
          value={formData.constraints}
          onChange={(e) => setFormData({ ...formData, constraints: e.target.value })}
          className="w-full px-4 py-3 border-2 border-slate-600 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-200 bg-slate-900/50 backdrop-blur-sm placeholder:text-slate-500 text-slate-200"
          rows={2}
          placeholder="Technical or business constraints..."
        />
      </div>

      <div>
        <label htmlFor="risks" className="block text-sm font-semibold text-slate-200 mb-2">
          Risks / Unknowns <span className="text-slate-500 text-xs font-normal">(Optional)</span>
        </label>
        <textarea
          id="risks"
          value={formData.risks}
          onChange={(e) => setFormData({ ...formData, risks: e.target.value })}
          className="w-full px-4 py-3 border-2 border-slate-600 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-200 bg-slate-900/50 backdrop-blur-sm placeholder:text-slate-500 text-slate-200"
          rows={2}
          placeholder="Known risks or unknowns..."
        />
      </div>

      <div>
        <label htmlFor="templateType" className="block text-sm font-semibold text-slate-200 mb-2">
          Template Type
        </label>
        <select
          id="templateType"
          value={formData.templateType}
          onChange={(e) =>
            setFormData({ ...formData, templateType: e.target.value as FeatureInput["templateType"] })
          }
          className="w-full px-4 py-3 border-2 border-slate-600 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-200 bg-slate-900/50 backdrop-blur-sm cursor-pointer text-slate-200"
        >
          <option value="web" className="bg-slate-800">🌐 Web App</option>
          <option value="mobile" className="bg-slate-800">📱 Mobile App</option>
          <option value="internal" className="bg-slate-800">🔧 Internal Tool</option>
          <option value="api" className="bg-slate-800">🔌 API Only</option>
        </select>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-cyan-600 hover:via-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-cyan-500/20 hover:shadow-xl hover:shadow-cyan-500/30 transform hover:-translate-y-0.5 flex items-center justify-center gap-2 ring-1 ring-cyan-500/30"
      >
        {isLoading ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            Generating...
          </>
        ) : (
          <>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Generate Spec
          </>
        )}
      </button>
    </form>
  );
}