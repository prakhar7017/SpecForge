"use client";

import { useEffect, useState } from "react";

interface ToastProps {
  message: string;
  type?: "success" | "error" | "info";
  duration?: number;
  onClose: () => void;
}

export default function Toast({ message, type = "info", duration = 3000, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const colors = {
    success: "bg-gradient-to-r from-emerald-500 to-teal-600 shadow-emerald-500/30",
    error: "bg-gradient-to-r from-red-500 to-rose-600 shadow-red-500/30",
    info: "bg-gradient-to-r from-cyan-500 to-blue-600 shadow-cyan-500/30",
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-fade-in">
      <div
        className={`${colors[type]} text-white px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3 min-w-[300px] ring-1 ring-white/10 backdrop-blur-sm`}
      >
        <span className="font-medium">{message}</span>
        <button
          onClick={onClose}
          className="ml-auto text-white hover:text-slate-200 font-bold transition-colors"
          type="button"
        >
          ×
        </button>
      </div>
    </div>
  );
}

export function useToast() {
  const [toast, setToast] = useState<{ message: string; type?: "success" | "error" | "info" } | null>(null);

  const showToast = (message: string, type?: "success" | "error" | "info") => {
    setToast({ message, type });
  };

  const ToastComponent = toast ? (
    <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
  ) : null;

  return { showToast, ToastComponent };
}