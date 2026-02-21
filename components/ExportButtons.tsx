"use client";

import { specToMarkdown, downloadMarkdown } from "@/lib/export";
import type { GeneratedSpec } from "@/lib/validators";
import { useState } from "react";

interface ExportButtonsProps {
  spec: GeneratedSpec;
}

export default function ExportButtons({ spec }: ExportButtonsProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const markdown = specToMarkdown(spec);
    
    // Check if clipboard API is available
    if (navigator.clipboard && navigator.clipboard.writeText) {
      try {
        await navigator.clipboard.writeText(markdown);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        // Fallback to textarea method
        fallbackCopyToClipboard(markdown);
      }
    } else {
      // Fallback for browsers that don't support clipboard API
      fallbackCopyToClipboard(markdown);
    }
  };

  const fallbackCopyToClipboard = (text: string) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-999999px";
    textArea.style.top = "-999999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
      document.execCommand("copy");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text:", err);
      alert("Failed to copy to clipboard. Please copy manually.");
    } finally {
      document.body.removeChild(textArea);
    }
  };

  const handleDownload = () => {
    const markdown = specToMarkdown(spec);
    const filename = `${spec.title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}.md`;
    downloadMarkdown(markdown, filename);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <button
        onClick={handleCopy}
        className="px-5 py-2.5 border-2 border-slate-600 rounded-xl hover:bg-slate-700/50 text-sm font-semibold transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2 text-slate-200 ring-1 ring-slate-700/50"
        type="button"
      >
        {copied ? (
          <>
            <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Copied!
          </>
        ) : (
          <>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            Copy Markdown
          </>
        )}
      </button>
      <button
        onClick={handleDownload}
        className="px-5 py-2.5 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 text-white rounded-xl hover:from-cyan-600 hover:via-blue-600 hover:to-purple-700 text-sm font-semibold transition-all duration-200 shadow-lg shadow-cyan-500/20 hover:shadow-xl hover:shadow-cyan-500/30 flex items-center justify-center gap-2 ring-1 ring-cyan-500/30"
        type="button"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        Download .md
      </button>
    </div>
  );
}