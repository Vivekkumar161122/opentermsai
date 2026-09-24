"use client";

import React, { useState } from "react";
import {
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
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
} from "lucide-react";
import {
  FullAnalysisOutput,
  RiskLevel,
  OverallRiskScore,
  ChatMessage,
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
  >("matrix");
  const [riskFilter, setRiskFilter] = useState<"ALL" | RiskLevel>("ALL");
  const [expandedClauses, setExpandedClauses] = useState<Record<string, boolean>>({});
  const [copied, setCopied] = useState<boolean>(false);

  // Chat state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "initial",
      sender: "ai",
      text: `Hello! I have completed full-context grounding on **${analysis.documentContext.title}** from your perspective as the **${currentPerspective}**. You can ask me any question about liability, termination, or hidden risks.`,
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

  const filteredClauses = analyzedClauses.filter((c) => {
    if (riskFilter === "ALL") return true;
    return c.perspectiveRiskLevel === riskFilter;
  });

  const toggleExpand = (id: string) => {
    setExpandedClauses((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const getOverallRiskBadge = (score: OverallRiskScore) => {
    switch (score) {
      case "CRITICAL":
        return {
          text: "CRITICAL RISK",
          bg: "bg-rose-500/20 text-rose-300 border-rose-500/50",
          icon: <ShieldAlert className="w-4 h-4 text-rose-400" />,
        };
      case "HIGH":
        return {
          text: "HIGH RISK",
          bg: "bg-red-500/20 text-red-300 border-red-500/50",
          icon: <AlertTriangle className="w-4 h-4 text-red-400" />,
        };
      case "MEDIUM":
        return {
          text: "MEDIUM RISK",
          bg: "bg-amber-500/20 text-amber-300 border-amber-500/50",
          icon: <AlertTriangle className="w-4 h-4 text-amber-400" />,
        };
      case "LOW":
        return {
          text: "LOW RISK",
          bg: "bg-emerald-500/20 text-emerald-300 border-emerald-500/50",
          icon: <CheckCircle2 className="w-4 h-4 text-emerald-400" />,
        };
    }
  };

  const riskBadge = getOverallRiskBadge(documentContext.overallRiskScore);

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
        text: `Error analyzing query: ${err instanceof Error ? err.message : "Please check backend connection."}`,
        timestamp: "Just now",
      };
      setChatMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleCopyPrepPack = () => {
    const lines = [
      `ATTORNEY CONSULTATION PACK: ${documentContext.title}`,
      `Perspective: ${currentPerspective} | Overall Risk: ${documentContext.overallRiskScore}`,
      "\n--- CRITICAL RED FLAGS ---",
      ...lawyerConsultationPack.criticalRedFlags.map((f) => `• ${f}`),
      "\n--- MISSING PROTECTIONS ---",
      ...lawyerConsultationPack.missingProtections.map((m) => `• ${m}`),
      "\n--- QUESTIONS FOR COUNSEL ---",
      ...lawyerConsultationPack.questionsForCounsel.map((q, i) => `${i + 1}. ${q}`),
    ];
    navigator.clipboard.writeText(lines.join("\n"));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = async (format: "markdown" | "json") => {
    try {
      const blob = await downloadPrepPack(analysis, format);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `OpenTerms_${documentContext.analyzedPerspective}_PrepPack.${
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
    <div className="flex flex-col h-full bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-sm">
      {/* Navigation Tabs Header */}
      <div className="bg-slate-950/90 px-4 pt-3 border-b border-slate-800">
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center space-x-2">
            <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
            <h3 className="font-bold text-sm text-white">AI Insights Drawer</h3>
          </div>

          {/* Quick Perspective Flip Button */}
          <button
            onClick={onFlipPerspective}
            disabled={isAnalyzing}
            className="flex items-center space-x-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-indigo-950/70 border border-indigo-700/60 hover:border-indigo-400 text-indigo-300 hover:text-white transition shadow-sm disabled:opacity-50"
            title="Flip to opposing perspective to see asymmetric risk reversal"
          >
            <Sparkles className="w-3 h-3 text-cyan-400" />
            <span>Flip Role Perspective</span>
          </button>
        </div>

        {/* Tab Buttons */}
        <div className="flex space-x-1 overflow-x-auto text-xs">
          <button
            onClick={() => setActiveTab("summary")}
            className={`px-3 py-2 border-b-2 font-medium transition flex items-center space-x-1.5 whitespace-nowrap ${
              activeTab === "summary"
                ? "border-cyan-400 text-cyan-300 bg-slate-900/60"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Info className="w-3.5 h-3.5" />
            <span>Summary</span>
          </button>

          <button
            onClick={() => setActiveTab("matrix")}
            className={`px-3 py-2 border-b-2 font-medium transition flex items-center space-x-1.5 whitespace-nowrap ${
              activeTab === "matrix"
                ? "border-cyan-400 text-cyan-300 bg-slate-900/60"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Risk Matrix ({analyzedClauses.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("chat")}
            className={`px-3 py-2 border-b-2 font-medium transition flex items-center space-x-1.5 whitespace-nowrap ${
              activeTab === "chat"
                ? "border-cyan-400 text-cyan-300 bg-slate-900/60"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Contract Q&A</span>
          </button>

          <button
            onClick={() => setActiveTab("prep")}
            className={`px-3 py-2 border-b-2 font-medium transition flex items-center space-x-1.5 whitespace-nowrap ${
              activeTab === "prep"
                ? "border-cyan-400 text-cyan-300 bg-slate-900/60"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Lawyer Prep-Pack</span>
          </button>
        </div>
      </div>

      {/* Tab Content Viewport */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {/* ================= TAB 1: EXECUTIVE SUMMARY ================= */}
        {activeTab === "summary" && (
          <div className="space-y-4 text-xs">
            {/* Top Score Banner */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md">
              <div>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Aggregated Risk Profile ({currentPerspective})
                </span>
                <div className="flex items-center space-x-2 mt-1">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border ${riskBadge.bg}`}
                  >
                    {riskBadge.icon}
                    {riskBadge.text}
                  </span>
                </div>
              </div>

              {/* Tally Counts */}
              <div className="flex items-center space-x-2">
                <div className="px-2.5 py-1 rounded-lg bg-rose-500/10 border border-rose-500/20 text-center">
                  <div className="text-xs font-bold text-rose-400">{redCount}</div>
                  <div className="text-[10px] text-rose-300/80">Critical</div>
                </div>
                <div className="px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-center">
                  <div className="text-xs font-bold text-amber-400">{yellowCount}</div>
                  <div className="text-[10px] text-amber-300/80">Caution</div>
                </div>
                <div className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-center">
                  <div className="text-xs font-bold text-emerald-400">{greenCount}</div>
                  <div className="text-[10px] text-emerald-300/80">Protected</div>
                </div>
              </div>
            </div>

            {/* Narrative Summary */}
            <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-2">
              <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <FileCheck2 className="w-4 h-4 text-cyan-400" />
                Executive Breakdown
              </h4>
              <p className="text-slate-300 leading-relaxed text-xs">
                {documentContext.executiveSummary}
              </p>
            </div>

            {/* Asymmetric Role Insight Box */}
            <div className="bg-indigo-950/40 border border-indigo-800/60 rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  Asymmetric Leverage Dynamic
                </h4>
                <button
                  onClick={onFlipPerspective}
                  className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 underline"
                >
                  Switch Perspective →
                </button>
              </div>
              <p className="text-indigo-200/90 text-xs leading-relaxed">
                Legal terms are inherently asymmetric. A clause that provides complete
                indemnity or restraint of trade acts as a protective shield (GREEN)
                for the contracting enterprise, while exposing the individual counterparty
                to existential liability (RED).
              </p>
            </div>
          </div>
        )}

        {/* ================= TAB 2: RISK MATRIX ================= */}
        {activeTab === "matrix" && (
          <div className="space-y-3">
            {/* Filter Chips */}
            <div className="flex flex-wrap items-center gap-1.5 pb-1">
              <button
                onClick={() => setRiskFilter("ALL")}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                  riskFilter === "ALL"
                    ? "bg-slate-800 text-white border border-slate-600"
                    : "bg-slate-950/60 text-slate-400 hover:text-white"
                }`}
              >
                All ({analyzedClauses.length})
              </button>
              <button
                onClick={() => setRiskFilter("RED")}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition flex items-center gap-1 ${
                  riskFilter === "RED"
                    ? "bg-rose-950 text-rose-200 border border-rose-600"
                    : "bg-slate-950/60 text-rose-400 hover:bg-rose-950/40"
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                Critical ({redCount})
              </button>
              <button
                onClick={() => setRiskFilter("YELLOW")}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition flex items-center gap-1 ${
                  riskFilter === "YELLOW"
                    ? "bg-amber-950 text-amber-200 border border-amber-600"
                    : "bg-slate-950/60 text-amber-400 hover:bg-amber-950/40"
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                Caution ({yellowCount})
              </button>
              <button
                onClick={() => setRiskFilter("GREEN")}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition flex items-center gap-1 ${
                  riskFilter === "GREEN"
                    ? "bg-emerald-950 text-emerald-200 border border-emerald-600"
                    : "bg-slate-950/60 text-emerald-400 hover:bg-emerald-950/40"
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Protected ({greenCount})
              </button>
            </div>

            {/* List of Risk Cards */}
            <div className="space-y-3">
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
                    className={`bg-slate-950/80 border rounded-xl p-3.5 transition-all duration-200 ${
                      isSelected
                        ? "border-cyan-400 ring-1 ring-cyan-400 shadow-lg shadow-cyan-950/50 bg-slate-950"
                        : "border-slate-800 hover:border-slate-700"
                    }`}
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider border ${badgeColor}`}
                          >
                            {clause.perspectiveRiskLevel}
                          </span>
                          <span className="text-[11px] text-slate-400 font-mono">
                            Page {clause.pageNumber}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-white">
                          {clause.clauseTitle}
                        </h4>
                      </div>

                      {/* Deep-link jump button */}
                      <button
                        onClick={() => onSelectClause(clause.clauseId)}
                        className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-cyan-300 text-[10px] font-semibold rounded flex items-center space-x-1 shrink-0 transition"
                        title="Scroll directly to this clause in the left document viewer"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>Locate</span>
                      </button>
                    </div>

                    {/* 8th-Grade Simplified Explanation */}
                    <div className="bg-slate-900/70 border border-slate-800 rounded-lg p-2.5 my-2">
                      <span className="text-[10px] font-bold uppercase text-cyan-400 block mb-0.5">
                        Plain-English Breakdown (8th Grade Level):
                      </span>
                      <p className="text-xs text-slate-200 leading-normal">
                        {clause.simplifiedText}
                      </p>
                    </div>

                    {/* Perspective Risk Reasoning */}
                    <div className="text-xs text-slate-300 my-2">
                      <strong className="text-slate-200 font-semibold block text-[11px] mb-0.5">
                        Why this matters to the {currentPerspective}:
                      </strong>
                      <p className="text-slate-300 text-xs leading-normal">
                        {clause.riskReasoning}
                      </p>
                    </div>

                    {/* Actionable Counter Proposal */}
                    <div className="bg-indigo-950/30 border border-indigo-900/60 rounded-lg p-2.5 my-2 text-xs">
                      <strong className="text-indigo-300 font-semibold block text-[11px] mb-0.5 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-cyan-400" />
                        Recommended Action & Counter-Proposal:
                      </strong>
                      <p className="text-indigo-200/90 leading-normal">
                        {clause.recommendedAction}
                      </p>
                    </div>

                    {/* Collapsible Verbatim Original Quote */}
                    <div className="pt-2 border-t border-slate-800/80">
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
                            <span>View Verbatim Original Excerpt</span>
                          </>
                        )}
                      </button>

                      {isExpanded && (
                        <div className="mt-2 p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] font-serif text-slate-300 italic border-l-2 border-l-slate-500 whitespace-pre-wrap">
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
          <div className="flex flex-col h-[520px] bg-slate-950/60 border border-slate-800 rounded-xl overflow-hidden">
            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar text-xs">
              {chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${
                    msg.sender === "user" ? "items-end" : "items-start"
                  }`}
                >
                  <div
                    className={`max-w-[85%] rounded-xl p-3 leading-relaxed ${
                      msg.sender === "user"
                        ? "bg-indigo-600 text-white rounded-br-none"
                        : "bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-none shadow-md"
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{msg.text}</div>

                    {/* Clickable Citations */}
                    {msg.citedClauseIds && msg.citedClauseIds.length > 0 && (
                      <div className="mt-2 pt-2 border-t border-slate-800 flex flex-wrap gap-1.5 items-center">
                        <span className="text-[10px] text-cyan-400 font-bold uppercase">
                          Cited Clauses:
                        </span>
                        {msg.citedClauseIds.map((cid) => (
                          <button
                            key={cid}
                            onClick={() => onSelectClause(cid)}
                            className="px-2 py-0.5 rounded bg-indigo-950 border border-indigo-700 text-indigo-300 text-[10px] font-semibold hover:border-cyan-400 transition"
                          >
                            #{cid}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1 px-1">
                    {msg.timestamp}
                  </span>
                </div>
              ))}
              {isChatLoading && (
                <div className="flex items-center space-x-2 text-xs text-indigo-400 p-2">
                  <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                  <span>Synthesizing grounded response...</span>
                </div>
              )}
            </div>

            {/* Quick Prompts */}
            <div className="p-2 border-t border-slate-800/80 bg-slate-900/50 flex overflow-x-auto gap-1.5">
              {[
                "Is indemnification capped?",
                "Can I terminate without cause?",
                "What happens on default?",
                "Are there missing protections?",
              ].map((qp) => (
                <button
                  key={qp}
                  onClick={() => handleSendMessage(qp)}
                  className="px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-[11px] text-slate-300 hover:text-white whitespace-nowrap transition border border-slate-700"
                >
                  💬 {qp}
                </button>
              ))}
            </div>

            {/* Input Box */}
            <div className="p-2.5 bg-slate-950 border-t border-slate-800 flex items-center gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder={`Ask any question as ${currentPerspective}...`}
                disabled={isChatLoading}
                className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 placeholder-slate-500 disabled:opacity-50"
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={!chatInput.trim() || isChatLoading}
                className="p-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition disabled:opacity-40"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ================= TAB 4: LAWYER PREP-PACK ================= */}
        {activeTab === "prep" && (
          <div className="space-y-4 text-xs">
            {/* Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-slate-950/80 border border-slate-800 rounded-xl">
              <div>
                <h4 className="font-bold text-white text-xs">
                  Attorney Consultation Pack
                </h4>
                <p className="text-[11px] text-slate-400">
                  Ready-to-use checklist and strategic questions for legal counsel.
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={handleCopyPrepPack}
                  className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-lg font-medium flex items-center space-x-1.5 transition"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-400" />
                      <span>Copy</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => handleDownload("markdown")}
                  className="px-2.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs rounded-lg font-medium flex items-center space-x-1.5 transition shadow"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download .MD</span>
                </button>
              </div>
            </div>

            {/* Critical Red Flags */}
            <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 space-y-2">
              <h5 className="font-bold text-rose-400 text-xs uppercase tracking-wider flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-rose-500" />
                Critical Red Flags to Negotiate
              </h5>
              <div className="space-y-2">
                {lawyerConsultationPack.criticalRedFlags.map((flag, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-lg bg-rose-950/20 border border-rose-900/40 text-slate-200 leading-normal flex items-start space-x-2"
                  >
                    <span className="text-rose-400 font-bold shrink-0">⚠️</span>
                    <span>{flag}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Missing Standard Protections */}
            <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 space-y-2">
              <h5 className="font-bold text-amber-400 text-xs uppercase tracking-wider flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                Missing Protections in this Draft
              </h5>
              <div className="space-y-2">
                {lawyerConsultationPack.missingProtections.map((prot, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-lg bg-amber-950/20 border border-amber-900/40 text-slate-200 leading-normal flex items-start space-x-2"
                  >
                    <span className="text-amber-400 font-bold shrink-0">🛡️</span>
                    <span>{prot}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Questions for Counsel */}
            <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 space-y-2">
              <h5 className="font-bold text-cyan-400 text-xs uppercase tracking-wider flex items-center gap-1.5">
                <Bookmark className="w-4 h-4 text-cyan-400" />
                Strategic Questions for Counsel
              </h5>
              <div className="space-y-2">
                {lawyerConsultationPack.questionsForCounsel.map((q, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 leading-normal flex items-start space-x-2"
                  >
                    <span className="w-5 h-5 rounded-full bg-cyan-950 border border-cyan-700 text-cyan-300 font-mono text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span>{q}</span>
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
