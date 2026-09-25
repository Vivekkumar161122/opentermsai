"use client";

import React from "react";
import { X, Cpu, FileSearch, Scale, BookOpen, ShieldCheck, Sparkles } from "lucide-react";

interface ArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ArchitectureModal: React.FC<ArchitectureModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const agents = [
    {
      name: "IngestAgent",
      role: "Parser & Document Grounding",
      icon: <FileSearch className="w-5 h-5 text-blue-400" />,
      color: "from-blue-500/20 to-indigo-500/10 border-blue-500/30 text-blue-300",
      description:
        "Ingests PDF, DOCX, and TXT files up to 25MB. Preserves authentic pagination, paragraph boundaries, and clause indices for citation tracing.",
    },
    {
      name: "RiskAgent",
      role: "Asymmetric Leverage Evaluator",
      icon: <Scale className="w-5 h-5 text-rose-400" />,
      color: "from-rose-500/20 to-pink-500/10 border-rose-500/30 text-rose-300",
      description:
        "Analyzes legal covenants through the user's role lens (e.g. Tenant vs. Landlord). Dynamically flips risk severity (RED ↔ GREEN) based on balance of leverage.",
    },
    {
      name: "SimplifyAgent",
      role: "8th-Grade Plain English",
      icon: <BookOpen className="w-5 h-5 text-amber-400" />,
      color: "from-amber-500/20 to-yellow-500/10 border-amber-500/30 text-amber-300",
      description:
        "Democratizes dense legalese by translating archaic Latin phrasing and predatory boilerplate into clear 8th-grade reading level summaries.",
    },
    {
      name: "PrepAgent",
      role: "Counsel Consultation Synthesis",
      icon: <ShieldCheck className="w-5 h-5 text-emerald-400" />,
      color: "from-emerald-500/20 to-teal-500/10 border-emerald-500/30 text-emerald-300",
      description:
        "Synthesizes negotiation checklists, detects missing statutory protections, and writes targeted interrogation questions for your attorney.",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="glass-panel border border-white/10 rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-950/90 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-sm font-bold text-white tracking-wide">
                  Gemini Multi-Agent Pipeline
                </h3>
                <span className="px-2 py-0.5 text-[10px] font-semibold bg-indigo-950 text-cyan-300 rounded-full border border-indigo-700/60">
                  v2.0 Orchestrator
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Four specialized agents collaborating via strict Pydantic structured outputs
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto custom-scrollbar">
          {/* Visual Architecture Flow */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {agents.map((agent, i) => (
              <div
                key={agent.name}
                className={`p-4 rounded-xl border bg-gradient-to-br ${agent.color} relative overflow-hidden`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2.5">
                    <div className="p-2 rounded-lg bg-black/40 border border-white/10">
                      {agent.icon}
                    </div>
                    <div>
                      <span className="text-[10px] font-mono text-slate-400 block uppercase">
                        Stage {i + 1}
                      </span>
                      <h4 className="text-sm font-bold text-white font-mono">{agent.name}</h4>
                    </div>
                  </div>
                  <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-black/30 border border-white/10 text-slate-300">
                    {agent.role}
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed mt-2">{agent.description}</p>
              </div>
            ))}
          </div>

          {/* Core Innovation Callout */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-indigo-500/30 space-y-2">
            <div className="flex items-center space-x-2 text-indigo-300 font-bold text-xs uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
              <span>Core Innovation: Asymmetric Risk Inversion</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Unlike generic legal summarizers that provide static overviews, OpenTerms AI models contracts as
              <strong> zero-sum leverage dynamics</strong>. An uncapped indemnification or non-compete clause is
              <span className="text-emerald-400 font-semibold"> GREEN (Protected)</span> for the corporate client,
              but <span className="text-rose-400 font-semibold"> RED (Critical Danger)</span> for the contractor.
              Switching perspectives instantly recalculates every risk rating and suggested counter-proposal.
            </p>
          </div>

          {/* Technology Stack Footer */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-[11px] text-slate-400 border-t border-white/10">
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-slate-300">LLM Foundation:</span>
              <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-200 border border-slate-700">
                Google Gemini 2.5 Flash
              </span>
              <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-200 border border-slate-700">
                Structured JSON Schema
              </span>
            </div>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition"
            >
              Close Guide
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
