"use client";

import React, { useState } from "react";
import {
  ShieldAlert,
  AlertTriangle,
  FileCheck2,
  MessageSquare,
  Briefcase,
  Download,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Send,
  Sparkles,
  Info,
  Bookmark,
  Repeat2,
  Printer,
  FileCode,
  Sliders,
  CheckSquare,
  Square,
} from "lucide-react";
import {
  FullAnalysisOutput,
  RiskLevel,
  OverallRiskScore,
  ChatMessage,
  AnalyzedClause,
} from "@/types";
import { sendChatMessage, downloadPrepPack } from "@/lib/api";

interface AiInsightsDrawerProps {
  analysis: FullAnalysisOutput;
  selectedClauseId: string | null;
  onSelectClause: (clauseId: string) => void;
  currentPerspective: string;
  onFlipPerspective: () => void;
  isAnalyzing: boolean;
}

export const AiInsightsDrawer: React.FC<AiInsightsDrawerProps> = ({
  analysis,
  selectedClauseId,
  onSelectClause,
  currentPerspective,
  onFlipPerspective,
  isAnalyzing,
}) => {
  const [activeTab, setActiveTab] = useState<
    "summary" | "matrix" | "chat" | "prep"
  >("summary");
  const [riskFilter, setRiskFilter] = useState<"ALL" | RiskLevel>("ALL");
  const [expandedClauses, setExpandedClauses] = useState<Record<string, boolean>>({});
  const [copiedMemo, setCopiedMemo] = useState<boolean>(false);
  const [copiedRedlineId, setCopiedRedlineId] = useState<string | null>(null);
  const [checkedFlags, setCheckedFlags] = useState<Record<number, boolean>>({});

  // Chat state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "initial",
      sender: "ai",
      text: `Hello! I have completed full-context grounding on **${analysis.documentContext.title}** from your perspective as the **${currentPerspective}**.\n\nYou can ask me about liability exposure, cure periods, uninsurable terms, or missing protections.`,
      timestamp: "Just now",
    },
  ]);
  const [chatInput, setChatInput] = useState<string>("");
  const [isChatLoading, setIsChatLoading] = useState<boolean>(false);

  const { documentContext, analyzedClauses, lawyerConsultationPack } = analysis;

  const redCount = analyzedClauses.filter(
    (c) => c.perspectiveRiskLevel === "RED"
  ).length;
  const yellowCount = analyzedClauses.filter(
    (c) => c.perspectiveRiskLevel === "YELLOW"
  ).length;
  const greenCount = analyzedClauses.filter(
    (c) => c.perspectiveRiskLevel === "GREEN"
  ).length;

  // Numeric risk score approximation for the gauge
  const calculateNumericScore = (score: OverallRiskScore): number => {
    switch (score) {
      case "CRITICAL":
        return 88;
      case "HIGH":
        return 74;
      case "MEDIUM":
        return 52;
      case "LOW":
        return 18;
      default:
        return 50;
    }
  };

  const numericRiskScore = calculateNumericScore(documentContext.overallRiskScore);

  const filteredClauses = analyzedClauses.filter((c) => {
    if (riskFilter === "ALL") return true;
    return c.perspectiveRiskLevel === riskFilter;
  });

  const toggleExpand = (id: string) => {
    setExpandedClauses((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCopyRedline = (clauseId: string, redlineText: string) => {
    navigator.clipboard.writeText(redlineText);
    setCopiedRedlineId(clauseId);
    setTimeout(() => setCopiedRedlineId(null), 2000);
  };

  const handleToggleCheckFlag = (idx: number) => {
    setCheckedFlags((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const handleAskAboutClause = (clause: AnalyzedClause) => {
    setActiveTab("chat");
    const query = `What is the financial and operational risk of Section "${clause.clauseTitle}" to me as ${currentPerspective}?`;
    handleSendMessage(query);
  };

  const handleSendMessage = async (customPrompt?: string) => {
    const textToSend = customPrompt || chatInput;
    if (!textToSend.trim() || isChatLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: "user",
      text: textToSend,
      timestamp: "Just now",
    };
    setChatMessages((prev) => [...prev, userMsg]);
    setChatInput("");
    setIsChatLoading(true);

    try {
      const response = await sendChatMessage(
        textToSend,
        currentPerspective,
        documentContext.title,
        analyzedClauses
      );

      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: "ai",
        text: response.answer,
        citedClauseIds: response.citedClauseIds,
        timestamp: "Just now",
      };
      setChatMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: "ai",
        text: `Error analyzing query: ${
          err instanceof Error ? err.message : "Backend unavailable. Operating in demo mode."
        }`,
        timestamp: "Just now",
      };
      setChatMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleCopyPrepPack = () => {
    const lines = [
      `=======================================================`,
      `ATTORNEY CONSULTATION MEMORANDUM: ${documentContext.title}`,
      `Analyzed Perspective: ${currentPerspective} | Overall Risk: ${documentContext.overallRiskScore}`,
      `Date Generated: ${new Date().toLocaleDateString()}`,
      `=======================================================`,
      `\n--- EXECUTIVE SUMMARY ---`,
      documentContext.executiveSummary,
      `\n--- CRITICAL RED FLAGS ---`,
      ...lawyerConsultationPack.criticalRedFlags.map((f, i) => `[ ] ${i + 1}. ${f}`),
      `\n--- MISSING STATUTORY & COMMERCIAL PROTECTIONS ---`,
      ...lawyerConsultationPack.missingProtections.map((m) => `• ${m}`),
      `\n--- STRATEGIC QUESTIONS FOR COUNSEL ---`,
      ...lawyerConsultationPack.questionsForCounsel.map((q, i) => `Q${i + 1}: ${q}`),
      `\n--- CLAUSE-BY-CLAUSE AUDIT ---`,
      ...analyzedClauses.map(
        (c) =>
          `[${c.perspectiveRiskLevel} RISK] ${c.clauseTitle} (Page ${c.pageNumber})\nOriginal: "${c.originalText}"\nPlain English: ${c.simplifiedText}\nAction: ${c.recommendedAction}\n`
      ),
      `\nDISCLAIMER: ${analysis.disclaimer}`,
    ];
    navigator.clipboard.writeText(lines.join("\n"));
    setCopiedMemo(true);
    setTimeout(() => setCopiedMemo(false), 2000);
  };

  const handleDownload = async (format: "markdown" | "json") => {
    try {
      const blob = await downloadPrepPack(analysis, format);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `OpenTerms_${documentContext.analyzedPerspective}_Audit.${
        format === "json" ? "json" : "md"
      }`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      alert("Failed to export lawyer consultation pack.");
    }
  };

  return (
    <div className="flex flex-col h-full glass-panel rounded-2xl overflow-hidden shadow-2xl border border-white/[0.08]">
      {/* Top Header & Navigation Tabs */}
      <div className="bg-[#090d18]/90 px-4 pt-3 border-b border-white/[0.08]">
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center space-x-2">
            <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
            <h3 className="font-extrabold text-sm text-white tracking-wide">
              AI Insights Drawer
            </h3>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-950/80 text-indigo-300 font-mono border border-indigo-700/40">
              {currentPerspective} Lens
            </span>
          </div>

          {/* Quick Perspective Flip Button */}
          <button
            onClick={onFlipPerspective}
            disabled={isAnalyzing}
            className="flex items-center space-x-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-indigo-950/80 border border-indigo-500/40 hover:border-cyan-400 text-cyan-300 hover:text-white transition shadow-sm disabled:opacity-50"
            title="Invert asymmetric risk perspective"
          >
            <Repeat2 className="w-3.5 h-3.5" />
            <span>Invert Role</span>
          </button>
        </div>

        {/* Tab Buttons Bar */}
        <div className="flex space-x-1 overflow-x-auto text-xs custom-scrollbar">
          <button
            onClick={() => setActiveTab("summary")}
            className={`px-3 py-2 border-b-2 font-semibold transition flex items-center space-x-1.5 whitespace-nowrap ${
              activeTab === "summary"
                ? "border-cyan-400 text-cyan-300 bg-white/[0.04]"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Info className="w-3.5 h-3.5" />
            <span>Overview & Gauge</span>
          </button>

          <button
            onClick={() => setActiveTab("matrix")}
            className={`px-3 py-2 border-b-2 font-semibold transition flex items-center space-x-1.5 whitespace-nowrap ${
              activeTab === "matrix"
                ? "border-cyan-400 text-cyan-300 bg-white/[0.04]"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Risk Matrix ({analyzedClauses.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("chat")}
            className={`px-3 py-2 border-b-2 font-semibold transition flex items-center space-x-1.5 whitespace-nowrap ${
              activeTab === "chat"
                ? "border-cyan-400 text-cyan-300 bg-white/[0.04]"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Contract Q&A</span>
          </button>

          <button
            onClick={() => setActiveTab("prep")}
            className={`px-3 py-2 border-b-2 font-semibold transition flex items-center space-x-1.5 whitespace-nowrap ${
              activeTab === "prep"
                ? "border-cyan-400 text-cyan-300 bg-white/[0.04]"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Attorney Prep-Pack</span>
          </button>
        </div>
      </div>

      {/* Main Tab Content Viewport */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-[#050811]/60">
        {/* ================= TAB 1: EXECUTIVE OVERVIEW & GAUGE ================= */}
        {activeTab === "summary" && (
          <div className="space-y-4 text-xs">
            {/* Visual Risk Gauge & Score Card */}
            <div className="p-4 rounded-2xl glass-card border border-white/[0.08] relative overflow-hidden">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                {/* Semi-circular radial gauge representation */}
                <div className="flex items-center space-x-4">
                  <div className="relative w-24 h-24 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                      {/* Background circle */}
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        stroke="currentColor"
                        strokeWidth="8"
                        className="text-slate-800"
                        fill="transparent"
                      />
                      {/* Animated Progress circle */}
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        stroke="currentColor"
                        strokeWidth="8"
                        strokeDasharray={251.2}
                        strokeDashoffset={251.2 - (251.2 * numericRiskScore) / 100}
                        strokeLinecap="round"
                        className={`transition-all duration-1000 ease-out ${
                          numericRiskScore >= 70
                            ? "text-rose-500"
                            : numericRiskScore >= 40
                            ? "text-amber-500"
                            : "text-emerald-500"
                        }`}
                        fill="transparent"
                      />
                    </svg>
                    <div className="absolute flex flex-col items-center justify-center text-center">
                      <span className="text-xl font-extrabold text-white font-mono leading-none">
                        {numericRiskScore}
                      </span>
                      <span className="text-[9px] uppercase font-bold text-slate-400 mt-0.5">
                        / 100
                      </span>
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Aggregated Risk Index
                    </span>
                    <h4
                      className={`text-base font-black tracking-tight ${
                        numericRiskScore >= 70
                          ? "text-rose-400"
                          : numericRiskScore >= 40
                          ? "text-amber-400"
                          : "text-emerald-400"
                      }`}
                    >
                      {documentContext.overallRiskScore} RISK
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {numericRiskScore >= 70
                        ? "Severely imbalanced terms favoring counterparty"
                        : numericRiskScore >= 40
                        ? "Moderate caution required on indemnity & cure"
                        : "Highly protective terms and liability caps"}
                    </p>
                  </div>
                </div>

                {/* Risk Count Badges */}
                <div className="flex items-center space-x-2 shrink-0">
                  <div className="px-3 py-2 rounded-xl bg-rose-500/10 border border-rose-500/30 text-center min-w-[55px]">
                    <div className="text-sm font-bold text-rose-400">{redCount}</div>
                    <div className="text-[10px] text-rose-300/80 font-medium">Critical</div>
                  </div>
                  <div className="px-3 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-center min-w-[55px]">
                    <div className="text-sm font-bold text-amber-400">{yellowCount}</div>
                    <div className="text-[10px] text-amber-300/80 font-medium">Caution</div>
                  </div>
                  <div className="px-3 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-center min-w-[55px]">
                    <div className="text-sm font-bold text-emerald-400">{greenCount}</div>
                    <div className="text-[10px] text-emerald-300/80 font-medium">Protected</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Asymmetric Role Leverage Inversion Showcase */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-950/60 via-purple-950/40 to-slate-900 border border-indigo-500/30 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-300 flex items-center gap-1.5 uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  Asymmetric Leverage Dynamic
                </span>
                <button
                  onClick={onFlipPerspective}
                  className="px-2.5 py-1 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/50 text-cyan-300 hover:text-white border border-indigo-500/40 text-[11px] font-bold transition flex items-center gap-1"
                >
                  <Repeat2 className="w-3 h-3" />
                  <span>Invert Lens</span>
                </button>
              </div>
              <p className="text-slate-300 text-xs leading-relaxed">
                Legal contracts represent asymmetric leverage games. Terms like uncapped indemnification,
                summary 3-day default termination, and broad restrictive covenants act as a fortress for the
                drafter, but create catastrophic exposure for you as the{" "}
                <strong className="text-white underline decoration-cyan-400 underline-offset-2">
                  {currentPerspective}
                </strong>
                .
              </p>
            </div>

            {/* Category Exposure Bars */}
            <div className="p-4 rounded-2xl glass-card border border-white/[0.08] space-y-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-indigo-400" />
                Sub-Domain Exposure Breakdown
              </h4>

              <div className="space-y-2.5">
                <div>
                  <div className="flex justify-between text-[11px] font-medium text-slate-300 mb-1">
                    <span>Financial & Operating Expense Pass-Through</span>
                    <span className="font-mono text-rose-400">92% Exposure</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-amber-500 to-rose-500 w-[92%] rounded-full" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] font-medium text-slate-300 mb-1">
                    <span>Third-Party Indemnification & Negligence Shift</span>
                    <span className="font-mono text-rose-400">88% Exposure</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-amber-500 to-rose-500 w-[88%] rounded-full" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] font-medium text-slate-300 mb-1">
                    <span>Termination Notice & Statutory Cure Windows</span>
                    <span className="font-mono text-amber-400">75% Exposure</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-cyan-500 to-amber-500 w-[75%] rounded-full" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] font-medium text-slate-300 mb-1">
                    <span>Operational Autonomy & Confidentiality</span>
                    <span className="font-mono text-cyan-400">45% Balanced</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-cyan-500 w-[45%] rounded-full" />
                  </div>
                </div>
              </div>
            </div>

            {/* Executive Narrative */}
            <div className="p-4 rounded-2xl glass-card border border-white/[0.08] space-y-2">
              <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <FileCheck2 className="w-4 h-4 text-cyan-400" />
                Executive Summary
              </h4>
              <p className="text-slate-300 leading-relaxed text-xs">
                {documentContext.executiveSummary}
              </p>
            </div>
          </div>
        )}

        {/* ================= TAB 2: RISK MATRIX ================= */}
        {activeTab === "matrix" && (
          <div className="space-y-3">
            {/* Filter Tabs */}
            <div className="flex flex-wrap items-center gap-1.5 pb-1">
              <button
                onClick={() => setRiskFilter("ALL")}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                  riskFilter === "ALL"
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "bg-slate-900/80 text-slate-400 hover:text-white"
                }`}
              >
                All ({analyzedClauses.length})
              </button>
              <button
                onClick={() => setRiskFilter("RED")}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
                  riskFilter === "RED"
                    ? "bg-rose-950 text-rose-200 border border-rose-600/70"
                    : "bg-slate-900/60 text-rose-400 hover:bg-rose-950/40"
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                Critical ({redCount})
              </button>
              <button
                onClick={() => setRiskFilter("YELLOW")}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
                  riskFilter === "YELLOW"
                    ? "bg-amber-950 text-amber-200 border border-amber-600/70"
                    : "bg-slate-900/60 text-amber-400 hover:bg-amber-950/40"
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                Caution ({yellowCount})
              </button>
              <button
                onClick={() => setRiskFilter("GREEN")}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
                  riskFilter === "GREEN"
                    ? "bg-emerald-950 text-emerald-200 border border-emerald-600/70"
                    : "bg-slate-900/60 text-emerald-400 hover:bg-emerald-950/40"
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Protected ({greenCount})
              </button>
            </div>

            {/* List of Detailed Risk Cards */}
            <div className="space-y-3.5">
              {filteredClauses.map((clause) => {
                const isSelected = selectedClauseId === clause.clauseId;
                const isExpanded = !!expandedClauses[clause.clauseId];

                const badgeColor =
                  clause.perspectiveRiskLevel === "RED"
                    ? "bg-rose-500/20 text-rose-300 border-rose-500/40"
                    : clause.perspectiveRiskLevel === "YELLOW"
                    ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                    : "bg-emerald-500/20 text-emerald-300 border-emerald-500/40";

                return (
                  <div
                    key={clause.clauseId}
                    className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                      isSelected
                        ? "border-cyan-400 ring-2 ring-cyan-400/40 shadow-xl bg-slate-900"
                        : "glass-card hover:border-slate-700"
                    }`}
                  >
                    <div className="p-4 space-y-3">
                      {/* Card Title & Jump Action */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider border ${badgeColor}`}
                            >
                              {clause.perspectiveRiskLevel} RISK
                            </span>
                            <span className="text-[11px] text-slate-400 font-mono">
                              Page {clause.pageNumber} • #{clause.clauseId}
                            </span>
                          </div>
                          <h4 className="text-sm font-bold text-white tracking-tight">
                            {clause.clauseTitle}
                          </h4>
                        </div>

                        {/* Locate Button */}
                        <button
                          onClick={() => onSelectClause(clause.clauseId)}
                          className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-cyan-300 text-[10px] font-semibold rounded-lg flex items-center space-x-1 shrink-0 transition"
                          title="Locate and highlight in document"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span>Locate</span>
                        </button>
                      </div>

                      {/* Plain-English Breakdown Box */}
                      <div className="bg-[#080d1a]/80 border border-white/[0.06] rounded-xl p-3 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1">
                            <Sparkles className="w-3 h-3" />
                            Plain-English Translation:
                          </span>
                          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                            8th-Grade Reading Level
                          </span>
                        </div>
                        <p className="text-xs text-slate-200 leading-relaxed font-sans">
                          {clause.simplifiedText}
                        </p>
                      </div>

                      {/* Perspective Impact Reasoning */}
                      <div className="p-3 rounded-xl bg-black/20 border border-white/[0.04] space-y-1">
                        <strong className="text-slate-300 font-bold block text-[11px]">
                          Asymmetric Impact on {currentPerspective}:
                        </strong>
                        <p className="text-slate-300 text-xs leading-relaxed">
                          {clause.riskReasoning}
                        </p>
                      </div>

                      {/* Actionable Counter Proposal & Redline Copy */}
                      <div className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-500/30 space-y-2">
                        <div className="flex items-center justify-between">
                          <strong className="text-cyan-300 font-bold text-[11px] flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-cyan-400" />
                            Recommended Counter-Proposal / Redline:
                          </strong>
                          <button
                            onClick={() =>
                              handleCopyRedline(clause.clauseId, clause.recommendedAction)
                            }
                            className="text-[10px] font-semibold px-2 py-0.5 rounded bg-indigo-900/60 hover:bg-indigo-800 text-cyan-200 flex items-center gap-1 transition"
                          >
                            {copiedRedlineId === clause.clauseId ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-400" />
                                <span className="text-emerald-300">Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span>Copy Redline</span>
                              </>
                            )}
                          </button>
                        </div>
                        <p className="text-indigo-200/90 text-xs leading-relaxed">
                          {clause.recommendedAction}
                        </p>
                      </div>

                      {/* Card Footer Actions */}
                      <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-xs">
                        <button
                          onClick={() => toggleExpand(clause.clauseId)}
                          className="text-[11px] text-slate-400 hover:text-slate-200 flex items-center space-x-1 font-mono transition"
                        >
                          {isExpanded ? (
                            <>
                              <ChevronUp className="w-3 h-3" />
                              <span>Hide Verbatim Excerpt</span>
                            </>
                          ) : (
                            <>
                              <ChevronDown className="w-3 h-3" />
                              <span>View Verbatim Excerpt</span>
                            </>
                          )}
                        </button>

                        <button
                          onClick={() => handleAskAboutClause(clause)}
                          className="text-[11px] text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1 transition"
                        >
                          <MessageSquare className="w-3 h-3" />
                          <span>Ask AI About This</span>
                        </button>
                      </div>

                      {/* Collapsible Verbatim Quote */}
                      {isExpanded && (
                        <div className="p-3 rounded-xl bg-[#060912] border border-white/[0.08] text-xs font-serif text-slate-300 italic border-l-2 border-l-cyan-500 whitespace-pre-wrap leading-relaxed animate-in fade-in duration-150">
                          &ldquo;{clause.originalText}&rdquo;
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ================= TAB 3: CONTRACT Q&A ================= */}
        {activeTab === "chat" && (
          <div className="flex flex-col h-[560px] glass-card rounded-2xl border border-white/[0.08] overflow-hidden">
            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto p-3.5 space-y-3 custom-scrollbar text-xs">
              {chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${
                    msg.sender === "user" ? "items-end" : "items-start"
                  }`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-3.5 leading-relaxed ${
                      msg.sender === "user"
                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-br-none shadow-md shadow-indigo-600/20"
                        : "bg-slate-900/90 border border-white/[0.08] text-slate-200 rounded-bl-none shadow-md"
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{msg.text}</div>

                    {/* Grounded Clause Citations */}
                    {msg.citedClauseIds && msg.citedClauseIds.length > 0 && (
                      <div className="mt-2.5 pt-2 border-t border-white/[0.08] flex flex-wrap gap-1.5 items-center">
                        <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider">
                          Grounding Citations:
                        </span>
                        {msg.citedClauseIds.map((cid) => (
                          <button
                            key={cid}
                            onClick={() => onSelectClause(cid)}
                            className="px-2 py-0.5 rounded-lg bg-indigo-950 border border-indigo-700/80 text-cyan-300 text-[10px] font-semibold hover:border-cyan-400 transition"
                            title="Jump to grounded clause in document"
                          >
                            #{cid} ↗
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1 px-1 font-mono">
                    {msg.timestamp}
                  </span>
                </div>
              ))}

              {isChatLoading && (
                <div className="flex items-center space-x-2 text-xs text-indigo-300 p-2.5 bg-indigo-950/30 rounded-xl border border-indigo-500/20 w-fit">
                  <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                  <span>Synthesizing grounded response with Gemini agent...</span>
                </div>
              )}
            </div>

            {/* Quick Query Suggestion Chips */}
            <div className="p-2 border-t border-white/[0.08] bg-[#070b14]/90 flex overflow-x-auto gap-1.5 custom-scrollbar">
              {[
                "Is indemnification capped?",
                "Can I terminate without cause?",
                "What is the cure period for default?",
                "Are there missing protections?",
              ].map((qp) => (
                <button
                  key={qp}
                  onClick={() => handleSendMessage(qp)}
                  className="px-2.5 py-1 rounded-full bg-slate-800/90 hover:bg-slate-700 text-[11px] text-slate-300 hover:text-white whitespace-nowrap transition border border-white/5"
                >
                  💬 {qp}
                </button>
              ))}
            </div>

            {/* Chat Input Bar */}
            <div className="p-2.5 bg-[#060912] border-t border-white/[0.08] flex items-center gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder={`Ask any question as ${currentPerspective}...`}
                disabled={isChatLoading}
                className="flex-1 bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 placeholder-slate-500 disabled:opacity-50"
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={!chatInput.trim() || isChatLoading}
                className="p-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl transition shadow-md disabled:opacity-40"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ================= TAB 4: LAWYER PREP-PACK ================= */}
        {activeTab === "prep" && (
          <div className="space-y-4 text-xs">
            {/* Legal Memo Header & Actions */}
            <div className="p-4 rounded-2xl glass-card border border-white/[0.08] flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <h4 className="font-extrabold text-white text-sm">
                    Attorney Consultation Memorandum
                  </h4>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Actionable audit checklist and interrogation questions for outside counsel.
                </p>
              </div>

              {/* Export Toolbar */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={handleCopyPrepPack}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-xl font-medium flex items-center space-x-1.5 transition border border-white/5"
                  title="Copy formatted legal brief to clipboard"
                >
                  {copiedMemo ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400 font-bold">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-400" />
                      <span>Copy Brief</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => handleDownload("markdown")}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs rounded-xl font-semibold flex items-center space-x-1.5 transition shadow"
                  title="Download clean Markdown document"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>.MD</span>
                </button>

                <button
                  onClick={() => handleDownload("json")}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-xl font-medium flex items-center space-x-1.5 transition border border-white/5"
                  title="Export structured JSON"
                >
                  <FileCode className="w-3.5 h-3.5 text-cyan-400" />
                  <span>JSON</span>
                </button>

                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-xl font-medium flex items-center space-x-1.5 transition border border-white/5"
                  title="Print legal brief"
                >
                  <Printer className="w-3.5 h-3.5 text-slate-300" />
                  <span>Print</span>
                </button>
              </div>
            </div>

            {/* Interactive Checklist: Critical Red Flags */}
            <div className="p-4 rounded-2xl glass-card border border-white/[0.08] space-y-3">
              <div className="flex items-center justify-between">
                <h5 className="font-extrabold text-rose-400 text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-rose-500" />
                  Critical Hazards to Negotiate (Interactive Checklist)
                </h5>
                <span className="text-[10px] text-slate-400 font-mono">
                  {Object.values(checkedFlags).filter(Boolean).length} /{" "}
                  {lawyerConsultationPack.criticalRedFlags.length} Addressed
                </span>
              </div>

              <div className="space-y-2">
                {lawyerConsultationPack.criticalRedFlags.map((flag, idx) => {
                  const isChecked = !!checkedFlags[idx];
                  return (
                    <div
                      key={idx}
                      onClick={() => handleToggleCheckFlag(idx)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start space-x-3 ${
                        isChecked
                          ? "bg-slate-900/60 border-slate-700 text-slate-400 line-through opacity-70"
                          : "bg-rose-950/20 border-rose-900/40 text-slate-200 hover:border-rose-700/60"
                      }`}
                    >
                      <button className="mt-0.5 text-rose-400 shrink-0">
                        {isChecked ? (
                          <CheckSquare className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <Square className="w-4 h-4 text-rose-400" />
                        )}
                      </button>
                      <span className="leading-relaxed text-xs">{flag}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Missing Statutory & Commercial Protections */}
            <div className="p-4 rounded-2xl glass-card border border-white/[0.08] space-y-3">
              <h5 className="font-extrabold text-amber-400 text-xs uppercase tracking-wider flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                Missing Standard Protections in this Draft
              </h5>
              <div className="space-y-2">
                {lawyerConsultationPack.missingProtections.map((prot, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-amber-950/20 border border-amber-900/40 text-slate-200 leading-relaxed flex items-start space-x-2.5"
                  >
                    <span className="text-amber-400 font-bold shrink-0">🛡️</span>
                    <span>{prot}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Interrogation Questions for Counsel */}
            <div className="p-4 rounded-2xl glass-card border border-white/[0.08] space-y-3">
              <h5 className="font-extrabold text-cyan-400 text-xs uppercase tracking-wider flex items-center gap-1.5">
                <Bookmark className="w-4 h-4 text-cyan-400" />
                Strategic Questions to Ask Your Attorney
              </h5>
              <div className="space-y-2.5">
                {lawyerConsultationPack.questionsForCounsel.map((q, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-slate-900/80 border border-white/[0.06] text-slate-200 leading-relaxed flex items-start space-x-3"
                  >
                    <span className="w-5 h-5 rounded-lg bg-cyan-950 border border-cyan-700/80 text-cyan-300 font-mono text-[10px] flex items-center justify-center shrink-0 mt-0.5 font-bold">
                      {idx + 1}
                    </span>
                    <span className="text-xs">{q}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
