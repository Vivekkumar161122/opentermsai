import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "OpenTerms AI — Agentic Legal Document Navigation & Risk Analysis",
  description:
    "Democratize legal access by translating dense contracts into actionable, role-based insights and plain-English summaries powered by Google Gemini.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-slate-950 text-slate-100 min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}
