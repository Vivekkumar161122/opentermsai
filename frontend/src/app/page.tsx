"use client";

import React, { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { DocumentViewer } from "@/components/DocumentViewer";
import { AiInsightsDrawer } from "@/components/AiInsightsDrawer";
import { UploadModal } from "@/components/UploadModal";
import { ArchitectureModal } from "@/components/ArchitectureModal";
import { SettingsModal } from "@/components/SettingsModal";
import { FooterDisclaimer } from "@/components/FooterDisclaimer";
import {
  FullAnalysisOutput,
  SampleDocumentMeta,
  PageText,
} from "@/types";
import {
  fetchSampleDocuments,
  analyzeSampleDocument,
  analyzeUploadedFile,
  reanalyzePerspective,
  checkBackendHealth,
  getDemoPages,
} from "@/lib/api";
import { Loader2, AlertCircle } from "lucide-react";

export default function OpenTermsDashboard() {
  const [samples, setSamples] = useState<SampleDocumentMeta[]>([]);
  const [currentSampleId, setCurrentSampleId] = useState<string | null>("commercial-lease");
  const [currentPerspective, setCurrentPerspective] = useState<string>("Tenant");
  const [availablePerspectives, setAvailablePerspectives] = useState<string[]>([
    "Tenant",
    "Landlord",
  ]);

  const [analysis, setAnalysis] = useState<FullAnalysisOutput | null>(null);
  const [pages, setPages] = useState<PageText[]>([]);
  const [selectedClauseId, setSelectedClauseId] = useState<string | null>(null);

  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(true);
  const [isUploadOpen, setIsUploadOpen] = useState<boolean>(false);
  const [isArchitectureOpen, setIsArchitectureOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isBackendConnected, setIsBackendConnected] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Initialize dashboard
  const initDashboard = async () => {
    try {
      setIsAnalyzing(true);
      setErrorMessage(null);

      // Check backend health asynchronously
      const health = await checkBackendHealth();
      setIsBackendConnected(health.ok);

      // Fetch samples (or instant local fallback)
      const sampleList = await fetchSampleDocuments();
      setSamples(sampleList);

      const defaultSample =
        sampleList.find((s) => s.id === "commercial-lease") || sampleList[0];
      if (defaultSample) {
        setCurrentSampleId(defaultSample.id);
        setCurrentPerspective(defaultSample.defaultPerspective);
        setAvailablePerspectives(defaultSample.availablePerspectives);

        // Fetch or get pre-computed grounded analysis
        const result = await analyzeSampleDocument(
          defaultSample.id,
          defaultSample.defaultPerspective
        );
        setAnalysis(result);
        setPages(getDemoPages(defaultSample.id));
      }
    } catch (err) {
      console.error("Dashboard initialization error:", err);
      setErrorMessage(
        err instanceof Error
          ? err.message
          : "Failed to initialize OpenTerms AI."
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  useEffect(() => {
    initDashboard();
  }, []);

  // Handle switching sample contracts
  const handleSelectSample = async (sampleId: string) => {
    const target = samples.find((s) => s.id === sampleId);
    if (!target) return;

    setCurrentSampleId(sampleId);
    setCurrentPerspective(target.defaultPerspective);
    setAvailablePerspectives(target.availablePerspectives);
    setIsAnalyzing(true);
    setErrorMessage(null);

    try {
      const result = await analyzeSampleDocument(sampleId, target.defaultPerspective);
      setAnalysis(result);
      setSelectedClauseId(null);
      setPages(getDemoPages(sampleId));
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : "Failed to switch contract."
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Handle perspective change (e.g. from Tenant to Landlord)
  const handlePerspectiveChange = async (newRole: string) => {
    if (newRole === currentPerspective) return;

    setCurrentPerspective(newRole);
    setIsAnalyzing(true);
    setErrorMessage(null);

    try {
      if (currentSampleId) {
        const result = await analyzeSampleDocument(currentSampleId, newRole);
        setAnalysis(result);
      } else {
        const rawText = pages.map((p) => p.text).join("\n\n");
        const result = await reanalyzePerspective(
          newRole,
          undefined,
          pages,
          analysis?.documentContext.title,
          rawText
        );
        setAnalysis(result);
      }
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : "Failed to recalculate perspective risk."
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Toggle to the opposing role in availablePerspectives
  const handleFlipPerspective = () => {
    if (availablePerspectives.length > 1) {
      const otherRole =
        availablePerspectives.find((r) => r !== currentPerspective) ||
        availablePerspectives[0];
      handlePerspectiveChange(otherRole);
    } else {
      const flipMap: Record<string, string> = {
        Tenant: "Landlord",
        Landlord: "Tenant",
        Freelancer: "Client",
        Client: "Freelancer",
        Employee: "Employer",
        Employer: "Employee",
      };
      const flipped = flipMap[currentPerspective] || "Opposing Party";
      handlePerspectiveChange(flipped);
    }
  };

  // Handle file upload
  const handleUploadFile = async (file: File, role: string) => {
    setIsAnalyzing(true);
    setCurrentSampleId(null);
    setCurrentPerspective(role);
    setAvailablePerspectives([
      role,
      role === "Tenant"
        ? "Landlord"
        : role === "Freelancer"
        ? "Client"
        : role === "Employee"
        ? "Employer"
        : "Counterparty",
    ]);
    setErrorMessage(null);

    try {
      const result = await analyzeUploadedFile(file, role);
      setAnalysis(result);
      setSelectedClauseId(null);

      // Create structured page representation
      const simulatedPages: PageText[] = [
        {
          pageNumber: 1,
          text:
            `DOCUMENT INGESTED: ${file.name}\n\nIngested and structured by OpenTerms AI IngestAgent.\n\n` +
            result.analyzedClauses
              .map(
                (c) =>
                  `[Page ${c.pageNumber}] ${c.clauseTitle}:\n${c.originalText}`
              )
              .join("\n\n"),
        },
      ];
      setPages(simulatedPages);
    } catch (err) {
      setErrorMessage(
        err instanceof Error
          ? err.message
          : "Failed to analyze uploaded contract."
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#030712] text-slate-100 font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Global Navigation Header */}
      <Header
        currentPerspective={currentPerspective}
        availablePerspectives={availablePerspectives}
        onPerspectiveChange={handlePerspectiveChange}
        onFlipPerspective={handleFlipPerspective}
        sampleDocuments={samples}
        currentSampleId={currentSampleId}
        onSelectSample={handleSelectSample}
        onOpenUpload={() => setIsUploadOpen(true)}
        onOpenArchitecture={() => setIsArchitectureOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        isBackendConnected={isBackendConnected}
        isAnalyzing={isAnalyzing}
      />

      {/* Main Split-Screen Dashboard Workspace */}
      <main className="flex-1 max-w-[1780px] w-full mx-auto p-3 sm:p-5 flex flex-col gap-4">
        {/* Error notification if any */}
        {errorMessage && (
          <div className="p-3.5 rounded-2xl bg-rose-950/70 border border-rose-800 text-rose-200 text-xs flex items-center justify-between shadow-lg">
            <div className="flex items-center space-x-2.5">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-xs font-bold text-rose-300 hover:text-white px-2 py-1 rounded-lg hover:bg-rose-900/50 transition"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Split Screen Grid (Left: Document Viewer 7 Cols, Right: AI Insights 5 Cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1 min-h-[calc(100vh-140px)]">
          {/* Left Pane (Document Viewer): 7 Columns on Desktop */}
          <div className="lg:col-span-7 h-[650px] lg:h-full">
            <DocumentViewer
              title={analysis?.documentContext.title || "Loading Legal Agreement..."}
              documentType={analysis?.documentContext.documentType || "Contract Document"}
              pages={pages}
              clauses={analysis?.analyzedClauses || []}
              selectedClauseId={selectedClauseId}
              onSelectClause={(cid) => setSelectedClauseId(cid)}
            />
          </div>

          {/* Right Pane (AI Insights Drawer): 5 Columns on Desktop */}
          <div className="lg:col-span-5 h-[650px] lg:h-full">
            {analysis ? (
              <AiInsightsDrawer
                analysis={analysis}
                selectedClauseId={selectedClauseId}
                onSelectClause={(cid) => setSelectedClauseId(cid)}
                currentPerspective={currentPerspective}
                onFlipPerspective={handleFlipPerspective}
                isAnalyzing={isAnalyzing}
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full glass-panel rounded-2xl p-8 text-center text-slate-400 border border-white/[0.08]">
                <div className="relative mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center">
                    <Loader2 className="w-6 h-6 text-indigo-400 animate-spin" />
                  </div>
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-cyan-400 rounded-full animate-ping" />
                </div>
                <h3 className="text-sm font-bold text-white tracking-wide">
                  Synthesizing Multi-Agent Analysis...
                </h3>
                <p className="text-xs text-slate-400 mt-1 max-w-sm">
                  Parsing structural clauses, checking statutory protections, and evaluating asymmetric leverage for{" "}
                  <strong className="text-cyan-300 font-semibold">{currentPerspective}</strong>.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Mandatory Legal Compliance Footer */}
      <FooterDisclaimer disclaimer={analysis?.disclaimer} />

      {/* Interactive Modals */}
      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onUpload={handleUploadFile}
        isUploading={isAnalyzing}
      />

      <ArchitectureModal
        isOpen={isArchitectureOpen}
        onClose={() => setIsArchitectureOpen(false)}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onConnectionChange={() => initDashboard()}
      />
    </div>
  );
}
