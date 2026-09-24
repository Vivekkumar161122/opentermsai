"use client";

import React, { useState, useRef } from "react";
import { UploadCloud, X, AlertCircle, CheckCircle2 } from "lucide-react";

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

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-indigo-500/10 border border-indigo-500/20 rounded-lg text-indigo-400">
              <UploadCloud className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Upload Legal Agreement</h3>
              <p className="text-xs text-slate-400">PDF or DOCX (up to 25MB)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
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
            className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition ${
              selectedFile
                ? "border-emerald-500/50 bg-emerald-950/20"
                : "border-slate-700 hover:border-indigo-500 bg-slate-950/50"
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
                <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                <div className="text-sm font-bold text-white">{selectedFile.name}</div>
                <div className="text-xs text-slate-400">
                  {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • Ready to analyze
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center space-y-2">
                <UploadCloud className="w-8 h-8 text-indigo-400 animate-bounce" />
                <div className="text-sm font-bold text-slate-200">
                  Click or drag and drop your document here
                </div>
                <div className="text-xs text-slate-400">
                  Supports Commercial Leases, Employment Contracts, MSAs, and NDAs
                </div>
              </div>
            )}
          </div>

          {/* Perspective Role Lens */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-300 block">
              Analyze As Lens (Your Role):
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "Tenant (Lease)", val: "Tenant" },
                { label: "Freelancer (Contractor)", val: "Freelancer" },
                { label: "Employee (Employment)", val: "Employee" },
                { label: "Client / Buyer", val: "Client" },
                { label: "Landlord (Property)", val: "Landlord" },
                { label: "Employer (Company)", val: "Employer" },
              ].map((r) => (
                <button
                  type="button"
                  key={r.val}
                  onClick={() => setPerspective(r.val)}
                  className={`p-2 rounded-lg text-left font-medium transition border ${
                    perspective === r.val
                      ? "bg-indigo-600 text-white border-indigo-400 shadow-sm"
                      : "bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700"
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-800/80 text-rose-300 flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Actions */}
          <div className="pt-2 flex items-center justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!selectedFile || isUploading}
              className="px-5 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold transition shadow disabled:opacity-50"
            >
              {isUploading ? "Ingesting & Analyzing..." : "Run AI Risk Analysis"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
