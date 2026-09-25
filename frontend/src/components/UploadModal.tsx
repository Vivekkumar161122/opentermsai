"use client";

import React, { useState, useRef } from "react";
import { UploadCloud, X, AlertCircle, CheckCircle2, Sparkles } from "lucide-react";

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (file: File, perspective: string) => Promise<void>;
  isUploading: boolean;
}

export const UploadModal: React.FC<UploadModalProps> = ({
  isOpen,
  onClose,
  onUpload,
  isUploading,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [perspective, setPerspective] = useState<string>("Tenant");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMsg(null);
    const files = e.target.files;
    if (files && files.length > 0) {
      validateAndSetFile(files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setErrorMsg(null);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const validateAndSetFile = (file: File) => {
    // 25MB limit check
    if (file.size > 25 * 1024 * 1024) {
      setErrorMsg("File size exceeds 25MB limit. Please upload a smaller document.");
      return;
    }

    const ext = file.name.split(".").pop()?.toLowerCase();
    if (!ext || !["pdf", "docx", "txt"].includes(ext)) {
      setErrorMsg("Invalid format. Please upload a .PDF, .DOCX, or .TXT file.");
      return;
    }

    setSelectedFile(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setErrorMsg("Please select a contract file to upload.");
      return;
    }

    if (!perspective) {
      setErrorMsg("Please select a perspective role lens.");
      return;
    }

    await onUpload(selectedFile, perspective);
    onClose();
  };

  const roleOptions = [
    { label: "Tenant (Commercial / Residential)", val: "Tenant", icon: "🏢" },
    { label: "Freelancer (Contractor / Vendor)", val: "Freelancer", icon: "💻" },
    { label: "Employee (Executive / Individual)", val: "Employee", icon: "💼" },
    { label: "Client / Corporate Buyer", val: "Client", icon: "🏛️" },
    { label: "Landlord / Property Owner", val: "Landlord", icon: "🔑" },
    { label: "Employer / Company Entity", val: "Employer", icon: "🏢" },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="glass-panel border border-white/10 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-950/90 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <UploadCloud className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-wide">
                Ingest & Ground Legal Agreement
              </h3>
              <p className="text-xs text-slate-400">
                PDF, DOCX, or TXT up to 25MB • Grounded by IngestAgent
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {/* Dropzone */}
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
              selectedFile
                ? "border-emerald-500/60 bg-emerald-950/20"
                : "border-white/15 hover:border-indigo-500/60 bg-slate-950/50 hover:bg-slate-950/80"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx,.txt"
              onChange={handleFileChange}
              className="hidden"
            />

            {selectedFile ? (
              <div className="flex flex-col items-center space-y-2">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div className="text-sm font-bold text-white">{selectedFile.name}</div>
                <div className="text-xs text-slate-400 font-mono">
                  {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • Ready for agentic pipeline
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center space-y-2.5">
                <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                  <UploadCloud className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-200">
                    Click to select or drag and drop contract here
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    Leases, Contractor MSAs, NDAs, and Employment Agreements
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Perspective Role Lens */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-300 block flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              Select Your Role Lens (Asymmetric Risk Evaluation):
            </label>
            <div className="grid grid-cols-2 gap-2">
              {roleOptions.map((r) => (
                <button
                  type="button"
                  key={r.val}
                  onClick={() => setPerspective(r.val)}
                  className={`p-2.5 rounded-xl text-left font-medium transition border flex items-center space-x-2 ${
                    perspective === r.val
                      ? "bg-gradient-to-r from-blue-600/30 to-indigo-600/30 border-cyan-400 text-white shadow-sm ring-1 ring-cyan-400/40"
                      : "bg-slate-950/60 border-white/5 text-slate-300 hover:border-white/20 hover:bg-slate-900"
                  }`}
                >
                  <span className="text-base">{r.icon}</span>
                  <span className="truncate text-xs">{r.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Error Banner */}
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800 text-rose-300 flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!selectedFile || isUploading}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold text-xs transition shadow-md shadow-indigo-600/20 disabled:opacity-50"
            >
              {isUploading ? "Ingesting & Analyzing..." : "Run AI Risk Audit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
