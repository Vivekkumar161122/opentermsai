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
  const clauseRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Deep-linking effect: when selectedClauseId changes, scroll the clause into view
  useEffect(() => {
    if (!selectedClauseId) return;

    const targetClause = clauses.find((c) => c.clauseId === selectedClauseId);
    if (targetClause) {
      // Switch to the clause's page if necessary
      const targetPageIndex = pages.findIndex(
        (p) => p.pageNumber === targetClause.pageNumber
      );
      if (targetPageIndex !== -1 && targetPageIndex !== activePageIndex) {
        setActivePageIndex(targetPageIndex);
      }

      // Smooth scroll to the highlighted clause
      setTimeout(() => {
        const el = clauseRefs.current[selectedClauseId];
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 100);
    }
  }, [selectedClauseId, clauses, pages, activePageIndex]);

  const currentPage = pages[activePageIndex] || { pageNumber: 1, text: "" };
  const totalPages = pages.length || 1;

  // Filter clauses that belong to the current page
  const pageClauses = clauses.filter(
    (c) => c.pageNumber === currentPage.pageNumber
  );

  const getRiskColor = (level: RiskLevel) => {
    switch (level) {
      case "RED":
        return {
          bg: "bg-rose-950/40",
          border: "border-rose-500",
          badgeBg: "bg-rose-500/20 text-rose-300 border-rose-500/50",
          glow: "ring-2 ring-rose-500 shadow-rose-900/30",
        };
      case "YELLOW":
        return {
          bg: "bg-amber-950/40",
          border: "border-amber-500",
          badgeBg: "bg-amber-500/20 text-amber-300 border-amber-500/50",
          glow: "ring-2 ring-amber-500 shadow-amber-900/30",
        };
      case "GREEN":
        return {
          bg: "bg-emerald-950/40",
          border: "border-emerald-500",
          badgeBg: "bg-emerald-500/20 text-emerald-300 border-emerald-500/50",
          glow: "ring-2 ring-emerald-500 shadow-emerald-900/30",
        };
      default:
        return {
          bg: "bg-slate-900/50",
          border: "border-slate-700",
          badgeBg: "bg-slate-700 text-slate-300 border-slate-600",
          glow: "",
        };
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-sm">
      {/* Top Document Bar */}
      <div className="bg-slate-950/80 px-4 py-3 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-2.5 min-w-0">
          <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400">
            <FileText className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <h2 className="text-sm font-bold text-white truncate max-w-[280px] sm:max-w-md">
              {title}
            </h2>
            <p className="text-[11px] text-slate-400 flex items-center gap-1.5">
              <span>{documentType}</span>
              <span>•</span>
              <span className="text-cyan-400 font-medium">
                {clauses.length} Analyzed Clauses
              </span>
            </p>
          </div>
        </div>

        {/* Search & Zoom Controls */}
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search contract..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-slate-900 border border-slate-700 text-xs text-white rounded-lg pl-8 pr-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 w-36 sm:w-44 placeholder-slate-500"
            />
          </div>

          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-slate-400">
            <button
              onClick={() => setZoomLevel((z) => Math.max(z - 10, 80))}
              className="p-1 hover:text-white rounded transition"
              title="Zoom out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[10px] px-1.5 font-mono text-slate-300">
              {zoomLevel}%
            </span>
            <button
              onClick={() => setZoomLevel((z) => Math.min(z + 10, 140))}
              className="p-1 hover:text-white rounded transition"
              title="Zoom in"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Page Tabs */}
      <div className="bg-slate-950/40 px-4 py-2 border-b border-slate-800/80 flex items-center justify-between text-xs">
        <div className="flex items-center space-x-1.5 overflow-x-auto py-0.5">
          {pages.map((p, idx) => {
            const hasSelected = clauses.some(
              (c) =>
                c.pageNumber === p.pageNumber && c.clauseId === selectedClauseId
            );
            return (
              <button
                key={p.pageNumber}
                onClick={() => setActivePageIndex(idx)}
                className={`px-3 py-1 rounded-md font-medium text-xs transition-all flex items-center space-x-1.5 ${
                  activePageIndex === idx
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                    : "bg-slate-800/70 text-slate-400 hover:text-white hover:bg-slate-800"
                } ${hasSelected ? "ring-2 ring-cyan-400" : ""}`}
              >
                <span>Page {p.pageNumber}</span>
                {clauses.filter((c) => c.pageNumber === p.pageNumber).length >
                  0 && (
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      clauses.some(
                        (c) =>
                          c.pageNumber === p.pageNumber &&
                          c.perspectiveRiskLevel === "RED"
                      )
                        ? "bg-rose-400 animate-ping"
                        : "bg-cyan-400"
                    }`}
                  />
                )}
              </button>
            );
          })}
        </div>

        <div className="flex items-center space-x-1 text-slate-400 text-xs">
          <button
            onClick={() => setActivePageIndex((i) => Math.max(i - 1, 0))}
            disabled={activePageIndex === 0}
            className="p-1 hover:text-white disabled:opacity-30 rounded transition"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="font-mono text-[11px]">
            {activePageIndex + 1} / {totalPages}
          </span>
          <button
            onClick={() =>
              setActivePageIndex((i) => Math.min(i + 1, totalPages - 1))
            }
            disabled={activePageIndex === totalPages - 1}
            className="p-1 hover:text-white disabled:opacity-30 rounded transition"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Document Content Viewport */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 custom-scrollbar">
        <div
          style={{ fontSize: `${zoomLevel}%` }}
          className="max-w-3xl mx-auto bg-slate-950/70 border border-slate-800/90 rounded-xl p-6 sm:p-8 shadow-inner text-slate-200 font-serif leading-relaxed"
        >
          {/* Header watermark */}
          <div className="border-b border-slate-800 pb-3 mb-6 flex justify-between items-center text-xs font-sans text-slate-500">
            <span>OpenTerms Grounded Document Buffer</span>
            <span>
              Page {currentPage.pageNumber} of {totalPages}
            </span>
          </div>

          {/* Render Sections with Dynamic Clause Highlights */}
          {pageClauses.length > 0 ? (
            <div className="space-y-6">
              {pageClauses.map((clause) => {
                const isSelected = selectedClauseId === clause.clauseId;
                const colors = getRiskColor(clause.perspectiveRiskLevel);

                return (
                  <div
                    key={clause.clauseId}
                    ref={(el) => {
                      clauseRefs.current[clause.clauseId] = el;
                    }}
                    onClick={() => onSelectClause(clause.clauseId)}
                    className={`relative p-4 rounded-xl border transition-all duration-300 cursor-pointer ${
                      colors.bg
                    } ${colors.border} ${
                      isSelected
                        ? `${colors.glow} scale-[1.01] shadow-xl`
                        : "hover:border-slate-500 hover:shadow-lg"
                    }`}
                  >
                    {/* Badge header */}
                    <div className="flex items-center justify-between gap-2 mb-2 font-sans">
                      <div className="flex items-center space-x-2">
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${colors.badgeBg}`}
                        >
                          {clause.perspectiveRiskLevel} RISK
                        </span>
                        <span className="text-xs font-bold text-white tracking-wide">
                          {clause.clauseTitle}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">
                        #{clause.clauseId}
                      </span>
                    </div>

                    {/* Verbatim quote */}
                    <div className="text-sm text-slate-200 italic border-l-2 border-slate-600 pl-3 py-1 my-2 font-serif whitespace-pre-wrap">
                      &ldquo;{clause.originalText}&rdquo;
                    </div>

                    {/* Quick action preview on click */}
                    <div className="mt-2 pt-2 border-t border-slate-800/80 font-sans text-xs flex items-center justify-between text-slate-400">
                      <span className="truncate max-w-[80%]">
                        💡 {clause.recommendedAction}
                      </span>
                      <span className="text-cyan-400 hover:underline text-[11px] font-medium shrink-0">
                        View Insight →
                      </span>
                    </div>
                  </div>
                );
              })}

              {/* Remainder of the page text if not captured in identified clauses */}
              <div className="pt-4 border-t border-slate-800/80 text-xs text-slate-400 font-sans">
                <p className="mb-2 font-semibold text-slate-300 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-indigo-400" />
                  Full Page Raw Context:
                </p>
                <div className="whitespace-pre-wrap font-mono text-[11px] leading-normal bg-slate-900/60 p-3 rounded-lg border border-slate-800 text-slate-300 max-h-48 overflow-y-auto">
                  {currentPage.text}
                </div>
              </div>
            </div>
          ) : (
            // Full Page Raw Text if no separate clauses matched
            <div className="whitespace-pre-wrap font-sans text-sm text-slate-300 leading-relaxed">
              {currentPage.text || "No text available for this page."}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
