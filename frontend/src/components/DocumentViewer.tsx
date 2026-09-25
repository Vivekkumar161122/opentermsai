"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  FileText,
  Search,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Layers,
  Copy,
  Check,
  ExternalLink,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  BookOpen,
} from "lucide-react";
import { PageText, AnalyzedClause, RiskLevel } from "@/types";

interface DocumentViewerProps {
  title: string;
  documentType: string;
  pages: PageText[];
  clauses: AnalyzedClause[];
  selectedClauseId: string | null;
  onSelectClause: (clauseId: string) => void;
}

export const DocumentViewer: React.FC<DocumentViewerProps> = ({
  title,
  documentType,
  pages,
  clauses,
  selectedClauseId,
  onSelectClause,
}) => {
  const [activePageIndex, setActivePageIndex] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [viewMode, setViewMode] = useState<"annotated" | "continuous">("annotated");
  const [copiedClauseId, setCopiedClauseId] = useState<string | null>(null);

  const clauseRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Deep-linking effect: when selectedClauseId changes, scroll the clause into view
  useEffect(() => {
    if (!selectedClauseId) return;

    const targetClause = clauses.find((c) => c.clauseId === selectedClauseId);
    if (targetClause) {
      const targetPageIndex = pages.findIndex(
        (p) => p.pageNumber === targetClause.pageNumber
      );
      if (targetPageIndex !== -1 && targetPageIndex !== activePageIndex) {
        setActivePageIndex(targetPageIndex);
      }

      setTimeout(() => {
        const el = clauseRefs.current[selectedClauseId];
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 120);
    }
  }, [selectedClauseId, clauses, pages, activePageIndex]);

  const currentPage = pages[activePageIndex] || { pageNumber: 1, text: "" };
  const totalPages = pages.length || 1;

  // Filter clauses that belong to the current page
  const pageClauses = clauses.filter(
    (c) => c.pageNumber === currentPage.pageNumber
  );

  const getRiskStyle = (level: RiskLevel) => {
    switch (level) {
      case "RED":
        return {
          border: "border-rose-500/50 hover:border-rose-400",
          bg: "bg-rose-950/25",
          accentBar: "bg-rose-500",
          badge: "bg-rose-500/20 text-rose-300 border-rose-500/50",
          glow: "ring-2 ring-rose-500 shadow-lg shadow-rose-950/50",
          icon: <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />,
        };
      case "YELLOW":
        return {
          border: "border-amber-500/50 hover:border-amber-400",
          bg: "bg-amber-950/25",
          accentBar: "bg-amber-500",
          badge: "bg-amber-500/20 text-amber-300 border-amber-500/50",
          glow: "ring-2 ring-amber-500 shadow-lg shadow-amber-950/50",
          icon: <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />,
        };
      case "GREEN":
        return {
          border: "border-emerald-500/50 hover:border-emerald-400",
          bg: "bg-emerald-950/25",
          accentBar: "bg-emerald-500",
          badge: "bg-emerald-500/20 text-emerald-300 border-emerald-500/50",
          glow: "ring-2 ring-emerald-500 shadow-lg shadow-emerald-950/50",
          icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />,
        };
      default:
        return {
          border: "border-slate-800 hover:border-slate-700",
          bg: "bg-slate-900/40",
          accentBar: "bg-slate-500",
          badge: "bg-slate-800 text-slate-300 border-slate-700",
          glow: "",
          icon: <FileText className="w-3.5 h-3.5 text-slate-400" />,
        };
    }
  };

  const handleCopyClause = (clauseId: string, text: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopiedClauseId(clauseId);
    setTimeout(() => setCopiedClauseId(null), 2000);
  };

  // Helper to highlight matching text query in rendered paragraphs
  const renderHighlightedText = (text: string) => {
    if (!searchQuery.trim()) return text;
    const parts = text.split(new RegExp(`(${searchQuery.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi"));
    return (
      <>
        {parts.map((part, i) =>
          part.toLowerCase() === searchQuery.toLowerCase() ? (
            <mark key={i} className="bg-amber-400/30 text-amber-200 px-0.5 rounded font-bold">
              {part}
            </mark>
          ) : (
            part
          )
        )}
      </>
    );
  };

  // Calculate search matches count
  const searchMatchesCount = searchQuery.trim()
    ? (currentPage.text.match(new RegExp(searchQuery.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi")) || []).length
    : 0;

  return (
    <div className="flex flex-col h-full glass-panel rounded-2xl overflow-hidden shadow-2xl border border-white/[0.08]">
      {/* Top Document Header Bar */}
      <div className="bg-[#090d18]/90 px-4 py-3 border-b border-white/[0.08] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-3 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shadow-sm">
            <FileText className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center space-x-2">
              <h2 className="text-sm font-bold text-white truncate max-w-[260px] sm:max-w-md tracking-tight">
                {title}
              </h2>
              <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-semibold bg-slate-800 text-slate-300 rounded border border-white/5">
                {documentType}
              </span>
            </div>
            <div className="flex items-center space-x-2 text-[11px] text-slate-400 mt-0.5">
              <span className="font-mono text-cyan-400">{clauses.length} Clauses Grounded</span>
              <span>•</span>
              <span className="text-rose-400 font-medium">
                {clauses.filter((c) => c.perspectiveRiskLevel === "RED").length} Red Flags
              </span>
              <span>•</span>
              <span className="text-emerald-400 font-medium">
                {clauses.filter((c) => c.perspectiveRiskLevel === "GREEN").length} Favorable
              </span>
            </div>
          </div>
        </div>

        {/* Search, Zoom & View Switcher */}
        <div className="flex items-center space-x-2">
          {/* Search box with match count */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search contract text..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-slate-950/80 border border-white/10 text-xs text-white rounded-xl pl-8 pr-14 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 w-36 sm:w-48 placeholder-slate-500 font-sans"
            />
            {searchQuery && (
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-mono text-slate-400 bg-slate-800/80 px-1.5 py-0.5 rounded">
                {searchMatchesCount}
              </span>
            )}
          </div>

          {/* View mode toggle */}
          <div className="hidden sm:flex items-center bg-slate-950/80 border border-white/10 rounded-xl p-0.5 text-xs text-slate-400">
            <button
              onClick={() => setViewMode("annotated")}
              className={`px-2.5 py-1 rounded-lg transition font-medium text-[11px] flex items-center gap-1 ${
                viewMode === "annotated"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "hover:text-slate-200"
              }`}
            >
              <Sparkles className="w-3 h-3" />
              <span>Clauses</span>
            </button>
            <button
              onClick={() => setViewMode("continuous")}
              className={`px-2.5 py-1 rounded-lg transition font-medium text-[11px] flex items-center gap-1 ${
                viewMode === "continuous"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "hover:text-slate-200"
              }`}
            >
              <BookOpen className="w-3 h-3" />
              <span>Parchment</span>
            </button>
          </div>

          {/* Zoom controls */}
          <div className="flex items-center bg-slate-950/80 border border-white/10 rounded-xl p-0.5 text-slate-400">
            <button
              onClick={() => setZoomLevel((z) => Math.max(z - 10, 80))}
              className="p-1 hover:text-white rounded-lg transition"
              title="Zoom out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[10px] px-1 font-mono text-slate-300 min-w-[34px] text-center">
              {zoomLevel}%
            </span>
            <button
              onClick={() => setZoomLevel((z) => Math.min(z + 10, 140))}
              className="p-1 hover:text-white rounded-lg transition"
              title="Zoom in"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Page Tabs Bar */}
      <div className="bg-[#060a12]/80 px-4 py-2 border-b border-white/[0.06] flex items-center justify-between text-xs">
        <div className="flex items-center space-x-1.5 overflow-x-auto py-0.5 custom-scrollbar">
          {pages.map((p, idx) => {
            const hasSelected = clauses.some(
              (c) => c.pageNumber === p.pageNumber && c.clauseId === selectedClauseId
            );
            const pageClausesCount = clauses.filter((c) => c.pageNumber === p.pageNumber).length;
            const hasCritical = clauses.some(
              (c) => c.pageNumber === p.pageNumber && c.perspectiveRiskLevel === "RED"
            );

            return (
              <button
                key={p.pageNumber}
                onClick={() => setActivePageIndex(idx)}
                className={`px-3 py-1 rounded-lg font-semibold text-xs transition-all flex items-center space-x-2 ${
                  activePageIndex === idx
                    ? "bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-md shadow-indigo-600/30"
                    : "bg-slate-900/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 border border-white/[0.04]"
                } ${hasSelected ? "ring-2 ring-cyan-400" : ""}`}
              >
                <span>Page {p.pageNumber}</span>
                {pageClausesCount > 0 && (
                  <span
                    className={`w-2 h-2 rounded-full ${
                      hasCritical ? "bg-rose-400 animate-pulse" : "bg-cyan-400"
                    }`}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Page Switcher */}
        <div className="flex items-center space-x-1 text-slate-400 text-xs shrink-0 pl-2">
          <button
            onClick={() => setActivePageIndex((i) => Math.max(i - 1, 0))}
            disabled={activePageIndex === 0}
            className="p-1 hover:text-white disabled:opacity-30 rounded-lg hover:bg-slate-800 transition"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="font-mono text-[11px] text-slate-300">
            {activePageIndex + 1} / {totalPages}
          </span>
          <button
            onClick={() => setActivePageIndex((i) => Math.min(i + 1, totalPages - 1))}
            disabled={activePageIndex === totalPages - 1}
            className="p-1 hover:text-white disabled:opacity-30 rounded-lg hover:bg-slate-800 transition"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Document Viewport */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 custom-scrollbar bg-[#050811]/60">
        <div
          style={{ fontSize: `${zoomLevel}%` }}
          className="max-w-3xl mx-auto legal-parchment rounded-2xl p-6 sm:p-8 border border-white/[0.08] shadow-2xl transition-all duration-150"
        >
          {/* Header watermark / authentication banner */}
          <div className="border-b border-white/[0.08] pb-3 mb-6 flex justify-between items-center text-xs font-mono text-slate-400">
            <span className="flex items-center gap-1.5 text-cyan-300">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              OPENTERMS VERIFIED CONTRACT STREAM
            </span>
            <span>
              PAGE {currentPage.pageNumber} OF {totalPages}
            </span>
          </div>

          {/* VIEW MODE 1: ANNOTATED CLAUSES */}
          {viewMode === "annotated" && (
            <div className="space-y-5">
              {pageClauses.length > 0 ? (
                pageClauses.map((clause) => {
                  const isSelected = selectedClauseId === clause.clauseId;
                  const style = getRiskStyle(clause.perspectiveRiskLevel);

                  return (
                    <div
                      key={clause.clauseId}
                      ref={(el) => {
                        clauseRefs.current[clause.clauseId] = el;
                      }}
                      onClick={() => onSelectClause(clause.clauseId)}
                      className={`relative rounded-xl border transition-all duration-300 cursor-pointer overflow-hidden ${
                        style.bg
                      } ${style.border} ${
                        isSelected
                          ? `${style.glow} scale-[1.01] shadow-2xl bg-slate-900/90`
                          : "hover:shadow-lg hover:bg-slate-900/50"
                      }`}
                    >
                      {/* Left Risk Severity Ribbon Bar */}
                      <div
                        className={`absolute left-0 top-0 bottom-0 w-1.5 ${style.accentBar}`}
                      />

                      <div className="p-4 pl-5">
                        {/* Header Badge & Action Icons */}
                        <div className="flex items-center justify-between gap-2 mb-2 font-sans">
                          <div className="flex items-center space-x-2">
                            <span
                              className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md border flex items-center gap-1 ${style.badge}`}
                            >
                              {style.icon}
                              {clause.perspectiveRiskLevel} RISK
                            </span>
                            <span className="text-xs font-bold text-white tracking-wide">
                              {clause.clauseTitle}
                            </span>
                          </div>

                          <div className="flex items-center space-x-1.5">
                            <button
                              onClick={(e) =>
                                handleCopyClause(clause.clauseId, clause.originalText, e)
                              }
                              className="p-1 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                              title="Copy verbatim clause"
                            >
                              {copiedClauseId === clause.clauseId ? (
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                            <span className="text-[10px] text-slate-400 font-mono">
                              #{clause.clauseId}
                            </span>
                          </div>
                        </div>

                        {/* Verbatim Quote */}
                        <div className="text-xs sm:text-sm text-slate-200 font-serif leading-relaxed italic border-l-2 border-slate-600/70 pl-3.5 py-1.5 my-2.5 bg-black/20 rounded-r-lg">
                          &ldquo;{renderHighlightedText(clause.originalText)}&rdquo;
                        </div>

                        {/* Plain English Highlight bar */}
                        <div className="mt-2.5 pt-2.5 border-t border-white/[0.06] font-sans text-xs flex items-center justify-between text-slate-300 gap-2">
                          <span className="truncate text-slate-300 text-[11px] leading-normal">
                            💡 <strong className="text-white">Recommendation:</strong>{" "}
                            {clause.recommendedAction}
                          </span>
                          <span className="text-cyan-400 hover:text-cyan-300 font-semibold text-[11px] flex items-center gap-1 shrink-0">
                            Deep Dive <ExternalLink className="w-3 h-3" />
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8 text-slate-400 text-xs font-sans">
                  No highlighted clauses detected on this page. View Raw Context below.
                </div>
              )}

              {/* Full Raw Page Text Context */}
              <div className="pt-4 border-t border-white/[0.08] text-xs text-slate-400 font-sans">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-indigo-400" />
                    Complete Page Transcript:
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {currentPage.text.length} characters
                  </span>
                </div>
                <div className="whitespace-pre-wrap font-mono text-[11px] leading-relaxed bg-[#060a14]/90 p-4 rounded-xl border border-white/[0.06] text-slate-300 max-h-56 overflow-y-auto custom-scrollbar">
                  {renderHighlightedText(currentPage.text)}
                </div>
              </div>
            </div>
          )}

          {/* VIEW MODE 2: CONTINUOUS PARCHMENT LEGAL DOCUMENT */}
          {viewMode === "continuous" && (
            <div className="whitespace-pre-wrap font-serif text-sm text-slate-200 leading-relaxed space-y-4">
              {currentPage.text.split("\n\n").map((para, i) => {
                // Find if any clause matches this paragraph
                const matchingClause = pageClauses.find((c) =>
                  para.includes(c.clauseTitle) || c.originalText.includes(para.slice(0, 40))
                );

                return (
                  <div
                    key={i}
                    onClick={() => matchingClause && onSelectClause(matchingClause.clauseId)}
                    className={`p-3 rounded-lg transition ${
                      matchingClause
                        ? "bg-indigo-950/20 border-l-2 border-indigo-400 cursor-pointer hover:bg-indigo-950/40"
                        : "hover:bg-white/[0.02]"
                    }`}
                  >
                    {matchingClause && (
                      <div className="flex items-center gap-2 mb-1 font-sans">
                        <span
                          className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                            matchingClause.perspectiveRiskLevel === "RED"
                              ? "bg-rose-950 text-rose-300 border border-rose-600/50"
                              : "bg-amber-950 text-amber-300 border border-amber-600/50"
                          }`}
                        >
                          {matchingClause.perspectiveRiskLevel} RISK
                        </span>
                        <span className="text-xs font-bold text-white font-sans">
                          {matchingClause.clauseTitle}
                        </span>
                      </div>
                    )}
                    <p>{renderHighlightedText(para)}</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
