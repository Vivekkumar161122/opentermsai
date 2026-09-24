export type RiskLevel = "GREEN" | "YELLOW" | "RED";
export type OverallRiskScore = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export interface DocumentContext {
  title: string;
  documentType: string;
  analyzedPerspective: string;
  overallRiskScore: OverallRiskScore;
  executiveSummary: string;
}

export interface AnalyzedClause {
  clauseId: string;
  clauseTitle: string;
  originalText: string;
  simplifiedText: string;
  perspectiveRiskLevel: RiskLevel;
  riskReasoning: string;
  pageNumber: number;
  recommendedAction: string;
}

export interface LawyerConsultationPack {
  criticalRedFlags: string[];
  missingProtections: string[];
  questionsForCounsel: string[];
}

export interface FullAnalysisOutput {
  documentContext: DocumentContext;
  analyzedClauses: AnalyzedClause[];
  lawyerConsultationPack: LawyerConsultationPack;
  disclaimer: string;
}

export interface PageText {
  pageNumber: number;
  text: string;
}

export interface SampleDocumentMeta {
  id: string;
  title: string;
  documentType: string;
  defaultPerspective: string;
  availablePerspectives: string[];
  description: string;
}

export interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  citedClauseIds?: string[];
  timestamp: string;
}
