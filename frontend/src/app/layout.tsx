import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "OpenTerms AI — Agentic Legal Document Navigation & Risk Analysis",
  description:
    "Democratize legal access by translating dense contracts into actionable, role-based insights and plain-English summaries powered by Google Gemini Multi-Agent architecture.",
  keywords: [
    "legal ai",
    "contract analysis",
    "gemini agent",
    "asymmetric risk",
    "legal tech",
    "contract review",
  ],
  authors: [{ name: "OpenTerms AI Team" }],
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: "#030712",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className="bg-[#030712] text-slate-100 min-h-screen antialiased selection:bg-indigo-500/30 selection:text-indigo-200">
        {children}
      </body>
    </html>
  );
}
