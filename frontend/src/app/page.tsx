"use client";

import React, { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { DocumentViewer } from "@/components/DocumentViewer";
import { AiInsightsDrawer } from "@/components/AiInsightsDrawer";
import { UploadModal } from "@/components/UploadModal";
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
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Initialize and load default document on mount
  useEffect(() => {
    async function initDashboard() {
      try {
        setIsAnalyzing(true);
        const sampleList = await fetchSampleDocuments();
        setSamples(sampleList);

        const defaultSample = sampleList.find((s) => s.id === "commercial-lease") || sampleList[0];
        if (defaultSample) {
          setCurrentSampleId(defaultSample.id);
          setCurrentPerspective(defaultSample.defaultPerspective);
          setAvailablePerspectives(defaultSample.availablePerspectives);

          const result = await analyzeSampleDocument(
            defaultSample.id,
            defaultSample.defaultPerspective
          );
          setAnalysis(result);

          // Construct default pages representation
          // (In a full production setup with binary PDFs, PDF.js renders canvases; here we render structured page text)
          const fallbackPages: PageText[] = [
            {
              pageNumber: 1,
              text: `COMMERCIAL REAL ESTATE LEASE AGREEMENT\nBetween APEX COMMERCIAL HOLDINGS LLC ("Landlord") and METRO INNOVATIONS INC. ("Tenant").\n\n1. PREMISES & LEASE TERM\nUnit 402, 850 Market Street, San Francisco, CA. Five (5) year term.\n\n2. BASE RENT & PASS-THROUGH OPERATING EXPENSES\n$12,500.00 monthly base rent plus 100% of all CAM, insurance increases, and taxes without cap.\n\n3. SECURITY DEPOSIT & FORFEITURE\nTenant shall deposit $37,500.00 as a Security Deposit. In the event of any minor default or rent delay exceeding 48 hours, Landlord reserves the absolute right to forfeit the entire security deposit as liquidated damages without itemized accounting.`,
            },
            {
              pageNumber: 2,
              text: `4. INDEMNIFICATION & THIRD-PARTY LIABILITY\nTenant covenants and agrees to defend, indemnify, and hold harmless Landlord, its agents, contractors, and affiliates from and against any and all claims, damages, liabilities, costs, and expenses (including attorneys' fees) arising out of or related to any occurrence in or about the Premises, regardless of whether caused in part by Landlord's ordinary negligence. Tenant's liability under this section shall be uncapped and unconditional.\n\n5. LANDLORD ENTRY & INSPECTION\nLandlord, its agents, and prospective buyers or mortgagees may enter the Premises at any hour of the day or night, with or without prior notice to Tenant, to inspect the premises or exhibit the same, without abatement of rent or liability for disruption to Tenant's business operations.\n\n6. TERMINATION, DEFAULT & CURE PERIOD\nIf Tenant fails to pay rent when due or breaches any covenant herein, Landlord may terminate this Lease immediately upon three (3) days written notice. Tenant expressly waives any statutory right to notice or redemption under state law. Upon termination, all remaining rent due for the balance of the 5-year term shall accelerate and become immediately payable.`,
            },
          ];
          setPages(fallbackPages);
        }
      } catch (err) {
        console.error("Dashboard initialization error:", err);
        setErrorMessage(
          err instanceof Error
            ? err.message
            : "Failed to initialize OpenTerms AI. Ensure backend is running."
        );
      } finally {
        setIsAnalyzing(false);
      }
    }

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

      // Set corresponding pages for the chosen sample
      if (sampleId === "freelance-msa") {
        setPages([
          {
            pageNumber: 1,
            text: `MASTER SERVICES AGREEMENT (INDEPENDENT CONTRACTOR)\nClient: NEXUS GLOBAL VENTURES INC. | Contractor: JANE DOE CONSULTING\n\n1. SCOPE OF SERVICES & PAYMENT TERMS\nCloud architecture and development services at $135.00/hr. Payment terms: Net 90 calendar days following Client's receipt of funds ("Pay-When-Paid"). No interest on late disbursements.\n\n2. INTELLECTUAL PROPERTY & WORK MADE FOR HIRE\nAll code, artifacts, and inventions shall constitute Work Made for Hire owned exclusively by Client without reservation of Contractor's pre-existing developer tooling.`,
          },
          {
            pageNumber: 2,
            text: `3. INDEMNIFICATION & THIRD-PARTY LIABILITY\nContractor shall defend, indemnify, and hold harmless Client from any third-party claims, code defects, or liabilities without any limitation of liability or fee cap.\n\n4. NON-COMPETE & RESTRICTIVE COVENANTS\nFor twenty-four (24) months post-termination, Contractor shall not directly or indirectly provide consulting or software development to any competitor in enterprise cloud or fintech worldwide.\n\n5. TERMINATION FOR CONVENIENCE\nClient may terminate at any time without cause, effective immediately upon electronic notice. Contractor must provide 60 days notice.`,
          },
        ]);
      } else if (sampleId === "employment-agreement") {
        setPages([
          {
            pageNumber: 1,
            text: `EXECUTIVE EMPLOYMENT AGREEMENT\nEmployer: STRATOS AI CORP. | Executive: ALEX MERCER\n\n1. POSITION, DUTIES & AT-WILL STATUS\nVice President of Engineering. Strictly at-will employment, terminable at any time without cause or severance.\n\n2. INVENTIONS ASSIGNMENT & INTELLECTUAL PROPERTY\nExecutive assigns all inventions, algorithms, and code developed during tenure, including outside business hours.`,
          },
          {
            pageNumber: 2,
            text: `3. NON-COMPETITION & NON-SOLICITATION\n18-month non-compete within continental US and 2-year non-solicitation of employees and clients.\n\n4. GOVERNING LAW & MANDATORY ARBITRATION WAIVER\nBinding arbitration under Delaware law. Executive expressly waives jury trial and class-action participation.`,
          },
        ]);
      } else {
        // default lease
        setPages([
          {
            pageNumber: 1,
            text: `COMMERCIAL REAL ESTATE LEASE AGREEMENT\nBetween APEX COMMERCIAL HOLDINGS LLC ("Landlord") and METRO INNOVATIONS INC. ("Tenant").\n\n1. PREMISES & LEASE TERM\nUnit 402, 850 Market Street, San Francisco, CA. Five (5) year term.\n\n2. BASE RENT & PASS-THROUGH OPERATING EXPENSES\n$12,500.00 monthly base rent plus 100% of all CAM, insurance increases, and taxes without cap.\n\n3. SECURITY DEPOSIT & FORFEITURE\nTenant shall deposit $37,500.00 as a Security Deposit. In the event of any minor default or rent delay exceeding 48 hours, Landlord reserves the absolute right to forfeit the entire security deposit as liquidated damages without itemized accounting.`,
          },
          {
            pageNumber: 2,
            text: `4. INDEMNIFICATION & THIRD-PARTY LIABILITY\nTenant covenants and agrees to defend, indemnify, and hold harmless Landlord, its agents, contractors, and affiliates from and against any and all claims, damages, liabilities, costs, and expenses (including attorneys' fees) arising out of or related to any occurrence in or about the Premises, regardless of whether caused in part by Landlord's ordinary negligence. Tenant's liability under this section shall be uncapped and unconditional.\n\n5. LANDLORD ENTRY & INSPECTION\nLandlord, its agents, and prospective buyers or mortgagees may enter the Premises at any hour of the day or night, with or without prior notice to Tenant, to inspect the premises or exhibit the same, without abatement of rent or liability for disruption to Tenant's business operations.\n\n6. TERMINATION, DEFAULT & CURE PERIOD\nIf Tenant fails to pay rent when due or breaches any covenant herein, Landlord may terminate this Lease immediately upon three (3) days written notice. Tenant expressly waives any statutory right to notice or redemption under state law. Upon termination, all remaining rent due for the balance of the 5-year term shall accelerate and become immediately payable.`,
          },
        ]);
      }
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : "Failed to switch sample contract."
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
      // Toggle generic opposing pair
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
    setAvailablePerspectives([role, role === "Tenant" ? "Landlord" : role === "Freelancer" ? "Client" : "Employer"]);
    setErrorMessage(null);

    try {
      const result = await analyzeUploadedFile(file, role);
      setAnalysis(result);
      setSelectedClauseId(null);

      // Create page objects for viewer
      const simulatedPages: PageText[] = [
        {
          pageNumber: 1,
          text: `DOCUMENT: ${file.name}\n\nIngested and structured by OpenTerms AI IngestAgent.\n\n` +
            result.analyzedClauses.map((c) => `[Page ${c.pageNumber}] ${c.clauseTitle}:\n${c.originalText}`).join("\n\n"),
        },
      ];
      setPages(simulatedPages);
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : "Failed to analyze uploaded contract."
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white">
      {/* Global Header */}
      <Header
        currentPerspective={currentPerspective}
        availablePerspectives={availablePerspectives}
        onPerspectiveChange={handlePerspectiveChange}
        sampleDocuments={samples}
        currentSampleId={currentSampleId}
        onSelectSample={handleSelectSample}
        onOpenUpload={() => setIsUploadOpen(true)}
        isAnalyzing={isAnalyzing}
      />

      {/* Main Split-Screen Dashboard Content */}
      <main className="flex-1 max-w-[1720px] w-full mx-auto p-3 sm:p-5 flex flex-col gap-4">
        {/* Error notification if backend unavailable */}
        {errorMessage && (
          <div className="p-3 rounded-xl bg-rose-950/70 border border-rose-800 text-rose-200 text-xs flex items-center justify-between shadow-lg">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-xs font-bold text-rose-300 hover:text-white"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Split Screen Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1 min-h-[calc(100vh-160px)]">
          {/* Left Pane (Document Viewer): 7 Columns on Desktop */}
          <div className="lg:col-span-7 h-[600px] lg:h-full">
            <DocumentViewer
              title={analysis?.documentContext.title || "Loading Contract..."}
              documentType={analysis?.documentContext.documentType || "Contract Document"}
              pages={pages}
              clauses={analysis?.analyzedClauses || []}
              selectedClauseId={selectedClauseId}
              onSelectClause={(cid) => setSelectedClauseId(cid)}
            />
          </div>

          {/* Right Pane (AI Insights Drawer): 5 Columns on Desktop */}
          <div className="lg:col-span-5 h-[600px] lg:h-full">
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
              <div className="flex flex-col items-center justify-center h-full bg-slate-900/60 border border-slate-800 rounded-2xl p-8 text-center text-slate-400">
                <Loader2 className="w-8 h-8 text-indigo-400 animate-spin mb-3" />
                <p className="text-sm font-semibold text-slate-200">
                  Synthesizing Role-Based Risk Analysis...
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Parsing structural clauses and applying asymmetric leverage evaluation.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Mandatory Legal Disclaimer Footer */}
      <FooterDisclaimer disclaimer={analysis?.disclaimer} />

      {/* File Upload Modal */}
      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onUpload={handleUploadFile}
        isUploading={isAnalyzing}
      />
    </div>
  );
}
