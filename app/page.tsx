"use client";

import { useState, useRef } from "react";
import FeatureForm from "@/components/FeatureForm";
import TaskEditor, { type TaskEditorRef } from "@/components/TaskEditor";
import ScopeAnalyzer from "@/components/ScopeAnalyzer";
import ExportButtons from "@/components/ExportButtons";
import RecentSpecs, { type RecentSpecsRef } from "@/components/RecentSpecs";
import { useToast } from "@/components/Toast";
import type { FeatureInput, GeneratedSpec } from "@/lib/validators";

type Step = "form" | "generating" | "editing";

export default function Home() {
  const [step, setStep] = useState<Step>("form");
  const [currentSpec, setCurrentSpec] = useState<GeneratedSpec | null>(null);
  const [currentInput, setCurrentInput] = useState<FeatureInput | null>(null);
  const [specId, setSpecId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const { showToast, ToastComponent } = useToast();
  const recentSpecsRef = useRef<RecentSpecsRef>(null);
  const taskEditorRef = useRef<TaskEditorRef>(null);

  const handleGenerate = async (input: FeatureInput) => {
    setStep("generating");
    setCurrentInput(input);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });

      const data = await res.json();

      if (!data.success) {
        showToast(`Error: ${data.error}`, "error");
        setStep("form");
        return;
      }

      setCurrentSpec(data.spec);
      setStep("editing");
      showToast("Spec generated successfully!", "success");
    } catch (error) {
      showToast("Failed to generate spec. Please try again.", "error");
      setStep("form");
    }
  };

  const handleSave = async () => {
    if (!currentInput) return;

    // Get the latest spec from TaskEditor if available (includes any unsaved changes)
    const specToSave = taskEditorRef.current?.getCurrentSpec() || currentSpec;
    
    if (!specToSave) return;

    setSaving(true);
    try {
      const res = await fetch(specId ? `/api/specs/${specId}` : "/api/specs", {
        method: specId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          input: currentInput,
          spec: specToSave,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSpecId(data.spec.id);
        // Update currentSpec with the saved version to ensure sync
        setCurrentSpec(specToSave);
        showToast("Spec saved successfully!", "success");
        // Refresh recent specs list
        if (recentSpecsRef.current) {
          recentSpecsRef.current.refresh();
        }
      } else {
        showToast(`Error saving: ${data.error}`, "error");
      }
    } catch (error) {
      showToast("Failed to save spec.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleLoadSpec = async (id: string) => {
    try {
      const res = await fetch(`/api/specs/${id}`);
      const data = await res.json();

      if (data.success) {
        setCurrentSpec(data.spec.generatedJson as GeneratedSpec);
        setCurrentInput({
          goal: data.spec.inputGoal,
          users: data.spec.inputUsers,
          constraints: data.spec.inputConstraints || "",
          risks: "",
          templateType: data.spec.templateType as FeatureInput["templateType"],
        });
        setSpecId(data.spec.id);
        setStep("editing");
        showToast("Spec loaded successfully!", "success");
      }
    } catch (error) {
      showToast("Failed to load spec.", "error");
    }
  };

  return (
    <div>
      {ToastComponent}
      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <header className="mb-10 text-center sm:text-left">
            <div className="inline-flex items-center gap-4 mb-3">
              <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 via-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-cyan-500/20 ring-1 ring-cyan-500/30">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div>
                <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Tasks Generator
                </h1>
                <p className="text-slate-400 mt-1 text-lg">AI-powered product planning tool</p>
              </div>
            </div>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1">
              <RecentSpecs ref={recentSpecsRef} onSelectSpec={handleLoadSpec} />
            </div>

            <div className="lg:col-span-3">
            {step === "form" && (
              <div className="bg-slate-800/50 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-700/50 p-8 sm:p-10 ring-1 ring-slate-700/50">
                <div className="mb-8">
                  <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
                    <div className="flex items-center gap-3 flex-1 w-full sm:w-auto">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 text-white flex items-center justify-center font-bold shadow-lg shadow-cyan-500/30">
                        1
                      </div>
                      <span className="font-semibold text-slate-200">Fill Feature Idea</span>
                    </div>
                    <div className="hidden sm:block flex-1 h-px bg-gradient-to-r from-cyan-500/30 via-blue-500/30 to-purple-500/30"></div>
                    <div className="flex items-center gap-3 flex-1 w-full sm:w-auto">
                      <div className="w-10 h-10 rounded-full bg-slate-700/50 border border-slate-600 flex items-center justify-center font-bold text-slate-400">
                        2
                      </div>
                      <span className="text-slate-400">Generate Spec</span>
                    </div>
                    <div className="hidden sm:block flex-1 h-px bg-gradient-to-r from-purple-500/30 via-blue-500/30 to-cyan-500/30"></div>
                    <div className="flex items-center gap-3 flex-1 w-full sm:w-auto">
                      <div className="w-10 h-10 rounded-full bg-slate-700/50 border border-slate-600 flex items-center justify-center font-bold text-slate-400">
                        3
                      </div>
                      <span className="text-slate-400">Edit & Export</span>
                    </div>
                  </div>
                </div>
                <FeatureForm onSubmit={handleGenerate} isLoading={false} />
              </div>
            )}

            {step === "generating" && (
              <div className="bg-slate-800/50 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-700/50 p-16 text-center ring-1 ring-slate-700/50">
                <div className="relative inline-block">
                  <div className="animate-spin rounded-full h-16 w-16 border-4 border-slate-700 border-t-cyan-500 mx-auto mb-6 shadow-lg shadow-cyan-500/20"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg className="w-8 h-8 text-cyan-400 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                </div>
                <p className="text-slate-200 text-lg font-medium">Generating your spec...</p>
                <p className="text-slate-400 mt-2 text-sm">This may take a few moments</p>
              </div>
            )}

            {step === "editing" && currentSpec && (
              <div className="space-y-6">
                <div className="bg-slate-800/50 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-700/50 p-6 sm:p-8 ring-1 ring-slate-700/50">
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
                    <div className="flex-1">
                      <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-300 via-blue-300 to-purple-300 bg-clip-text text-transparent mb-3">
                        {currentSpec.title}
                      </h2>
                      <p className="text-slate-300 text-lg leading-relaxed">{currentSpec.summary}</p>
                    </div>
                    <ExportButtons spec={currentSpec} />
                  </div>

                  <ScopeAnalyzer spec={currentSpec} />
                </div>

                <div className="bg-slate-800/50 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-700/50 p-6 sm:p-8 ring-1 ring-slate-700/50">
                  <TaskEditor ref={taskEditorRef} spec={currentSpec} onChange={setCurrentSpec} />
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl hover:from-emerald-600 hover:to-teal-700 disabled:opacity-50 font-semibold shadow-lg shadow-emerald-500/20 hover:shadow-xl hover:shadow-emerald-500/30 transition-all duration-200 flex items-center justify-center gap-2 ring-1 ring-emerald-500/30"
                    type="button"
                  >
                    {saving ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Save Spec
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => {
                      setStep("form");
                      setCurrentSpec(null);
                      setSpecId(null);
                    }}
                    className="px-6 py-3 border-2 border-slate-600 rounded-xl hover:bg-slate-700/50 font-semibold text-slate-300 transition-all duration-200 shadow-md hover:shadow-lg ring-1 ring-slate-700/50"
                    type="button"
                  >
                    New Spec
                  </button>
                </div>
              </div>
            )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}