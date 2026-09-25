"use client";

import React from "react";
import {
  Scale,
  UploadCloud,
  ChevronDown,
  Cpu,
  Repeat2,
  Server,
  Zap,
} from "lucide-react";
import { SampleDocumentMeta } from "@/types";

interface HeaderProps {
  currentPerspective: string;
  availablePerspectives: string[];
  onPerspectiveChange: (newRole: string) => void;
  onFlipPerspective: () => void;
  sampleDocuments: SampleDocumentMeta[];
  currentSampleId: string | null;
  onSelectSample: (sampleId: string) => void;
  onOpenUpload: () => void;
  onOpenArchitecture: () => void;
  onOpenSettings: () => void;
  isBackendConnected: boolean;
  isAnalyzing: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentPerspective,
  availablePerspectives,
  onPerspectiveChange,
  onFlipPerspective,
  sampleDocuments,
  currentSampleId,
  onSelectSample,
  onOpenUpload,
  onOpenArchitecture,
  onOpenSettings,
  isBackendConnected,
  isAnalyzing,
}) => {
  const getPersonaIcon = (role: string) => {
    switch (role.toLowerCase()) {
      case "tenant":
        return "🏢";
      case "landlord":
        return "🔑";
      case "freelancer":
        return "💻";
      case "client":
        return "🏛️";
      case "employee":
        return "💼";
      case "employer":
        return "🏢";
      default:
        return "🎯";
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#070b14]/85 backdrop-blur-xl border-b border-white/[0.08] text-white">
      <div className="max-w-[1780px] mx-auto px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3">
        {/* Brand & AI Pipeline Tag */}
        <div className="flex items-center space-x-3.5">
          <div className="relative group cursor-pointer" onClick={onOpenArchitecture}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-blue-600 to-cyan-400 p-[1px] shadow-lg shadow-indigo-500/25 transition-transform duration-300 group-hover:scale-105">
              <div className="w-full h-full bg-[#080d1a] rounded-[11px] flex items-center justify-center">
                <Scale className="w-5 h-5 text-cyan-300" />
              </div>
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#070b14] animate-pulse" />
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                OpenTerms AI
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded-full bg-indigo-950/80 border border-indigo-700/50 text-indigo-300">
                <Zap className="w-2.5 h-2.5 text-cyan-400" />
                Gemini Multi-Agent
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden md:block">
              Agentic Legal Grounding & Asymmetric Risk Inversion
            </p>
          </div>
        </div>

        {/* Center / Right Controls */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* Preset Contract Dropdown */}
          <div className="relative">
            <div className="relative inline-block">
              <select
                value={currentSampleId || ""}
                onChange={(e) => onSelectSample(e.target.value)}
                disabled={isAnalyzing}
                className="bg-slate-900/90 hover:bg-slate-900 border border-white/10 hover:border-indigo-500/50 text-slate-200 text-xs font-medium rounded-xl px-3 py-2 pr-8 appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition cursor-pointer disabled:opacity-50 shadow-inner"
              >
                {sampleDocuments.map((s) => (
                  <option key={s.id} value={s.id} className="bg-slate-900 text-slate-200">
                    📜 {s.title}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Perspective Role Lens Selector + Flip Trigger */}
          <div className="flex items-center bg-indigo-950/40 border border-indigo-500/30 rounded-xl p-0.5 shadow-sm">
            <div className="relative inline-block">
              <select
                value={currentPerspective}
                onChange={(e) => onPerspectiveChange(e.target.value)}
                disabled={isAnalyzing}
                className="bg-transparent text-cyan-200 font-bold text-xs rounded-lg px-2.5 py-1.5 pr-7 appearance-none focus:outline-none cursor-pointer disabled:opacity-50"
              >
                {availablePerspectives.map((role) => (
                  <option key={role} value={role} className="bg-slate-900 text-white font-medium">
                    {getPersonaIcon(role)} Lens: {role}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3 h-3 text-cyan-300 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Quick Flip Button */}
            <button
              onClick={onFlipPerspective}
              disabled={isAnalyzing}
              title="Flip to opposing perspective to see asymmetric leverage reverse"
              className="px-2 py-1 bg-indigo-600/30 hover:bg-indigo-600/50 text-cyan-300 hover:text-white rounded-lg text-[11px] font-semibold flex items-center gap-1 transition duration-150 disabled:opacity-50"
            >
              <Repeat2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Flip</span>
            </button>
          </div>

          {/* Status Indicator Pill / Settings Trigger */}
          <button
            onClick={onOpenSettings}
            className={`px-2.5 py-1.5 rounded-xl border text-[11px] font-medium flex items-center space-x-1.5 transition ${
              isBackendConnected
                ? "bg-emerald-950/40 border-emerald-500/40 text-emerald-300 hover:bg-emerald-950/60"
                : "bg-indigo-950/40 border-indigo-500/30 text-indigo-300 hover:bg-indigo-950/60"
            }`}
            title="Click to check backend status or configure custom API URL"
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isBackendConnected ? "bg-emerald-400" : "bg-cyan-400 animate-pulse"
              }`}
            />
            <span className="hidden sm:inline">
              {isBackendConnected ? "Live Backend" : "Demo Mode"}
            </span>
            <Server className="w-3 h-3 opacity-60 ml-0.5" />
          </button>

          {/* Architecture / How It Works Button */}
          <button
            onClick={onOpenArchitecture}
            className="hidden lg:flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-white/10 text-slate-300 hover:text-white text-xs font-medium transition"
          >
            <Cpu className="w-3.5 h-3.5 text-indigo-400" />
            <span>Architecture</span>
          </button>

          {/* Upload Contract CTA */}
          <button
            onClick={onOpenUpload}
            disabled={isAnalyzing}
            className="flex items-center space-x-1.5 px-3.5 py-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold text-xs rounded-xl shadow-md shadow-indigo-600/25 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
          >
            <UploadCloud className="w-4 h-4" />
            <span>Upload Contract</span>
          </button>
        </div>
      </div>
    </header>
  );
};
