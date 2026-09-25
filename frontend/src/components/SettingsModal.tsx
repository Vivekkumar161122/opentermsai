"use client";

import React, { useState, useEffect } from "react";
import { X, Server, CheckCircle2, AlertCircle, RefreshCw, Globe, HelpCircle } from "lucide-react";
import { getApiBaseUrl } from "@/lib/api";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnectionChange: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  onConnectionChange,
}) => {
  const [apiUrl, setApiUrl] = useState<string>("");
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const [status, setStatus] = useState<"idle" | "connected" | "offline">("idle");
  const [statusMsg, setStatusMsg] = useState<string>("");

  useEffect(() => {
    if (isOpen) {
      setApiUrl(getApiBaseUrl());
      testConnection(getApiBaseUrl());
    }
  }, [isOpen]);

  const testConnection = async (urlToTest: string) => {
    setIsChecking(true);
    setStatus("idle");
    setStatusMsg("");
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);
      const res = await fetch(`${urlToTest.replace(/\/+$/, "")}/api/samples`, {
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      if (res.ok) {
        setStatus("connected");
        setStatusMsg("Successfully connected to live FastAPI backend!");
      } else {
        setStatus("offline");
        setStatusMsg(`Backend responded with HTTP status ${res.status}. Falling back to Standalone Mode.`);
      }
    } catch {
      setStatus("offline");
      setStatusMsg("Unable to reach backend at this address. Operating in Interactive Standalone Mode.");
    } finally {
      setIsChecking(false);
    }
  };

  const handleSave = () => {
    if (typeof window !== "undefined") {
      if (apiUrl.trim()) {
        localStorage.setItem("openterms_custom_api_url", apiUrl.trim());
      } else {
        localStorage.removeItem("openterms_custom_api_url");
      }
    }
    onConnectionChange();
    onClose();
  };

  const handleReset = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("openterms_custom_api_url");
    }
    setApiUrl(process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000");
    testConnection(process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000");
    onConnectionChange();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="glass-panel border border-white/10 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-950/90 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Server className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Backend Connection & Deployment</h3>
              <p className="text-xs text-slate-400">Configure FastAPI host or use Standalone Mode</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-bold mb-1.5 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-cyan-400" />
              API Server URL:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={apiUrl}
                onChange={(e) => setApiUrl(e.target.value)}
                placeholder="e.g. https://your-backend.up.railway.app or http://localhost:8000"
                className="flex-1 bg-slate-950/80 border border-white/10 rounded-lg px-3 py-2 text-white font-mono text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <button
                type="button"
                onClick={() => testConnection(apiUrl)}
                disabled={isChecking}
                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg font-medium transition flex items-center gap-1 shrink-0 disabled:opacity-50"
              >
                {isChecking ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : "Test"}
              </button>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              On Vercel, leave empty or point to your deployed FastAPI backend (e.g. on Railway, Render, or GCP Cloud Run).
            </p>
          </div>

          {/* Connection Status Box */}
          <div
            className={`p-3.5 rounded-xl border flex items-start space-x-2.5 ${
              status === "connected"
                ? "bg-emerald-950/30 border-emerald-500/40 text-emerald-200"
                : status === "offline"
                ? "bg-amber-950/30 border-amber-500/40 text-amber-200"
                : "bg-slate-900 border-slate-800 text-slate-300"
            }`}
          >
            {status === "connected" ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            ) : status === "offline" ? (
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            ) : (
              <HelpCircle className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            )}
            <div>
              <div className="font-bold text-xs">
                {status === "connected"
                  ? "Live Backend Connected"
                  : status === "offline"
                  ? "Interactive Standalone Showcase Mode"
                  : "Checking Server..."}
              </div>
              <p className="text-[11px] mt-0.5 opacity-90">
                {statusMsg || "Verifying connection to the OpenTerms AI backend..."}
              </p>
            </div>
          </div>

          <div className="p-3 bg-slate-950/50 rounded-xl border border-white/5 space-y-1 text-slate-400 text-[11px]">
            <span className="font-semibold text-slate-300 block">Vercel Deployment Guarantee:</span>
            <p>
              When deployed to Vercel without a live backend URL, OpenTerms AI automatically serves high-fidelity
              full-length pre-computed analysis for all 3 agreements across both perspectives, allowing complete
              role flipping, Q&A reasoning, and Attorney Pack exports without any errors.
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={handleReset}
              className="text-slate-400 hover:text-slate-200 text-xs underline"
            >
              Reset to Default
            </button>
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition shadow"
              >
                Save Settings
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
