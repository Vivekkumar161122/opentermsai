"use client";

import React from "react";
import {
  Scale,
  Users,
  UploadCloud,
  ChevronDown,
  Sparkles,
  RefreshCw,
} from "lucide-react";
import { SampleDocumentMeta } from "@/types";

interface HeaderProps {
  currentPerspective: string;
  availablePerspectives: string[];
  onPerspectiveChange: (newRole: string) => void;
  sampleDocuments: SampleDocumentMeta[];
  currentSampleId: string | null;
  onSelectSample: (sampleId: string) => void;
  onOpenUpload: () => void;
  isAnalyzing: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentPerspective,
  availablePerspectives,
  onPerspectiveChange,
  sampleDocuments,
  currentSampleId,
  onSelectSample,
  onOpenUpload,
  isAnalyzing,
}) => {
  return (
    <header className="bg-slate-950 border-b border-slate-800 sticky top-0 z-40 backdrop-blur-md bg-opacity-95 text-white">
      <div className="max-w-[1720px] mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-blue-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Scale className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                OpenTerms AI
              </span>
              <span className="px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded-full bg-indigo-950 border border-indigo-700/60 text-indigo-300 flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5 text-cyan-400 animate-pulse" />
                Gemini Multi-Agent
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Agentic Legal Document Navigation & Asymmetric Risk Analysis
            </p>
          </div>
        </div>

        {/* Global Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Sample Selector */}
          <div className="relative">
            <label className="text-[11px] text-slate-400 block mb-0.5 font-medium">
              Contract Preset
            </label>
            <div className="relative inline-block">
              <select
                value={currentSampleId || ""}
                onChange={(e) => onSelectSample(e.target.value)}
                disabled={isAnalyzing}
                className="bg-slate-900 border border-slate-700 hover:border-slate-600 text-slate-200 text-xs rounded-lg px-3 py-2 pr-8 appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer disabled:opacity-50"
              >
                {sampleDocuments.map((s) => (
                  <option key={s.id} value={s.id}>
                    📄 {s.title}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Role Lens Selector Dropdown */}
          <div className="relative">
            <label className="text-[11px] text-slate-400 block mb-0.5 font-medium flex items-center gap-1">
              <Users className="w-3 h-3 text-cyan-400" />
              Analyze As Lens
            </label>
            <div className="relative inline-block">
              <select
                value={currentPerspective}
                onChange={(e) => onPerspectiveChange(e.target.value)}
                disabled={isAnalyzing}
                className="bg-indigo-950/80 border border-indigo-700/80 hover:border-indigo-500 text-cyan-200 font-semibold text-xs rounded-lg px-3 py-2 pr-8 appearance-none focus:outline-none focus:ring-2 focus:ring-cyan-400 cursor-pointer disabled:opacity-50 shadow-inner"
              >
                {availablePerspectives.map((role) => (
                  <option key={role} value={role} className="bg-slate-900 text-white">
                    🎯 {role}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-cyan-300 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Re-analyze status or button */}
          {isAnalyzing && (
            <div className="flex items-center space-x-1.5 px-3 py-2 bg-indigo-900/40 border border-indigo-600/40 rounded-lg text-indigo-300 text-xs">
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>Analyzing lens...</span>
            </div>
          )}

          {/* Upload Button */}
          <button
            onClick={onOpenUpload}
            disabled={isAnalyzing}
            className="flex items-center space-x-1.5 px-3.5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium text-xs rounded-lg shadow-md transition-all duration-150 disabled:opacity-50"
          >
            <UploadCloud className="w-4 h-4" />
            <span>Upload Contract</span>
          </button>
        </div>
      </div>
    </header>
  );
};
