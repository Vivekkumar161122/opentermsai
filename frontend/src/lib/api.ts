import { FullAnalysisOutput, SampleDocumentMeta, PageText, AnalyzedClause } from "@/types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function fetchSampleDocuments(): Promise<SampleDocumentMeta[]> {
  const res = await fetch(`${API_BASE}/api/samples`);
  if (!res.ok) {
    throw new Error(`Failed to load sample documents: ${res.statusText}`);
  }
  return res.json();
}

export async function analyzeSampleDocument(
  sampleId: string,
  perspective: string
): Promise<FullAnalysisOutput> {
  const formData = new FormData();
  formData.append("sample_id", sampleId);
  formData.append("perspective", perspective);

  const res = await fetch(`${API_BASE}/api/analyze-sample`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail || "Analysis failed");
  }

  return res.json();
}

export async function analyzeUploadedFile(
  file: File,
  perspective: string
): Promise<FullAnalysisOutput> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("perspective", perspective);

  const res = await fetch(`${API_BASE}/api/analyze-upload`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail || "Failed to analyze uploaded file");
  }

  return res.json();
}

export async function reanalyzePerspective(
  perspective: string,
  sampleId?: string,
  pages?: PageText[],
  documentTitle?: string,
  rawText?: string
): Promise<FullAnalysisOutput> {
  const res = await fetch(`${API_BASE}/api/reanalyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      perspective,
      sampleId,
      pages,
      documentTitle,
      rawText,
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail || "Failed to recalculate perspective");
  }

  return res.json();
}

export async function sendChatMessage(
  question: string,
  perspective: string,
  contractTitle: string,
  clauses: AnalyzedClause[],
  rawText?: string
): Promise<{
  answer: string;
  citedClauseIds: string[];
  suggestedFollowUps: string[];
  disclaimer: string;
}> {
  const res = await fetch(`${API_BASE}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      question,
      perspective,
      contractTitle,
      clauses,
      rawText,
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail || "Chat request failed");
  }

  return res.json();
}

export async function downloadPrepPack(
  analysis: FullAnalysisOutput,
  format: "markdown" | "json" = "markdown"
): Promise<Blob> {
  const res = await fetch(`${API_BASE}/api/export-prep-pack`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ analysis, format }),
  });

  if (!res.ok) {
    throw new Error("Failed to export prep pack");
  }

  return res.blob();
}
