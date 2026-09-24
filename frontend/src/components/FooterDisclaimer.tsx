"use client";

import React from "react";
import { Scale } from "lucide-react";

export const FooterDisclaimer: React.FC<{ disclaimer?: string }> = ({
  disclaimer = "OpenTerms AI provides automated document structure breakdown and informational analysis only. It does not constitute legal advice or formal representation. Always consult a qualified attorney for legal decisions.",
}) => {
  return (
    <footer className="bg-slate-950 border-t border-slate-800/80 py-3 px-4 text-center text-xs text-slate-400">
      <div className="max-w-6xl mx-auto flex items-center justify-center space-x-2 text-[11px] leading-relaxed">
        <Scale className="w-4 h-4 text-amber-400 shrink-0" />
        <span className="text-slate-300 font-medium">MANDATORY LEGAL DISCLAIMER:</span>
        <span className="text-slate-400 italic">{disclaimer}</span>
      </div>
    </footer>
  );
};
