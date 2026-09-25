"use client";

import React from "react";
import { Scale, ShieldCheck } from "lucide-react";

export const FooterDisclaimer: React.FC<{ disclaimer?: string }> = ({
  disclaimer = "OpenTerms AI provides automated document structure breakdown and informational analysis only. It does not constitute legal advice or formal representation. Always consult a qualified attorney for legal decisions.",
}) => {
  return (
    <footer className="bg-[#050811]/95 border-t border-white/[0.06] py-3 px-4 text-xs text-slate-400">
      <div className="max-w-[1780px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-2.5 text-[11px] leading-relaxed">
        <div className="flex items-center space-x-2 text-slate-400 text-center sm:text-left">
          <Scale className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span className="text-slate-300 font-bold uppercase tracking-wider">
            Legal Disclaimer:
          </span>
          <span className="text-slate-400 italic">{disclaimer}</span>
        </div>

        <div className="flex items-center space-x-3 shrink-0 text-slate-500 font-mono text-[10px]">
          <span className="flex items-center gap-1 text-slate-400">
            <ShieldCheck className="w-3 h-3 text-cyan-400" />
            Gemini 2.5 Flash Grounded
          </span>
          <span>•</span>
          <span>v2.0 Production</span>
        </div>
      </div>
    </footer>
  );
};
