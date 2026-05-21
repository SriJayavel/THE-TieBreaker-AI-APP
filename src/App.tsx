/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  Brain, 
  Sparkles, 
  Sliders, 
  Scale, 
  Grid, 
  FileText, 
  Bookmark, 
  Plus, 
  FolderPlus,
  Compass,
  Zap,
  Info,
  Menu,
  X
} from "lucide-react";
import { Decision, AnalysisType } from "./types";
import SavedDecisionsList from "./components/SavedDecisionsList";
import DecisionForm from "./components/DecisionForm";
import DecisionResultView from "./components/DecisionResultView";

export default function App() {
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [selectedDecisionId, setSelectedDecisionId] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>([
    "Professional", 
    "Personal Growth", 
    "Financial Stakes", 
    "Lifestyle & Health"
  ]);

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [prefilledData, setPrefilledData] = useState<{
    title: string;
    description: string;
    analysisType: AnalysisType;
    options: string[];
    category: string;
  } | null>(null);

  // Load stored decisions on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("tiebreaker_decisions_v2");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setDecisions(parsed);
          // Auto-select the first one if it exists
          if (parsed.length > 0) {
            setSelectedDecisionId(parsed[0].decisionId);
          }
        }
      }

      const storedCats = localStorage.getItem("tiebreaker_categories_v2");
      if (storedCats) {
        const parsedCats = JSON.parse(storedCats);
        if (Array.isArray(parsedCats)) {
          setCategories(parsedCats);
        }
      }
    } catch (e) {
      console.error("Failed to restore decimal memory archive ledger state:", e);
    }
  }, []);

  // Update categories and state persistence
  const handleAddCategory = (newCat: string) => {
    if (!newCat || categories.includes(newCat)) return;
    const updated = [...categories, newCat];
    setCategories(updated);
    localStorage.setItem("tiebreaker_categories_v2", JSON.stringify(updated));
  };

  const handleSelectDecision = (id: string | null) => {
    setSelectedDecisionId(id);
    setMobileSidebarOpen(false);
  };

  const handleDeleteDecision = (id: string) => {
    const updated = decisions.filter((dec) => dec.decisionId !== id);
    setDecisions(updated);
    localStorage.setItem("tiebreaker_decisions_v2", JSON.stringify(updated));

    if (selectedDecisionId === id) {
      setSelectedDecisionId(updated.length > 0 ? updated[0].decisionId : null);
    }
  };

  const handleClearAllDecisions = () => {
    setDecisions([]);
    setSelectedDecisionId(null);
    localStorage.removeItem("tiebreaker_decisions_v2");
  };

  // Submit and query server-side proxy endpoint
  const handleAnalyzeDecision = async (formData: {
    title: string;
    description: string;
    analysisType: AnalysisType;
    options: string[];
    category: string;
  }) => {
    setIsAnalyzing(true);
    setErrorText(null);

    try {
      const response = await fetch("/api/analyze-decision", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.details || errData.error || "Server rejected matrix equations.");
      }

      const analyzedResult: Decision = await response.json();

      // Save to React list and local storage ledger
      const newlyCreatedList = [analyzedResult, ...decisions];
      setDecisions(newlyCreatedList);
      setSelectedDecisionId(analyzedResult.decisionId);
      localStorage.setItem("tiebreaker_decisions_v2", JSON.stringify(newlyCreatedList));

    } catch (err: any) {
      console.error("Decision matrix consulting error:", err);
      setErrorText(err.message || "The Tiebreaker's logic gate failed to respond. Pls check key initialization state.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Active viewing item
  const activeDecision = decisions.find(d => d.decisionId === selectedDecisionId);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#e0e0e0] font-sans flex flex-col md:flex-row overflow-hidden" id="applet-viewport-root">
      
      {/* Mobile Header */}
      <header className="md:hidden h-16 bg-[#0d0d0d] border-b border-white/10 flex items-center justify-between px-4 z-40 shrink-0">
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-serif italic text-[#c5a059]">The Tiebreaker</h1>
          <span className="text-[8px] font-mono border border-[#c5a059]/40 text-[#c5a059] px-1 rounded uppercase">PRO</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSelectedDecisionId(null)}
            className="p-2 rounded bg-white/5 text-white/80 active:scale-95"
            title="Create New"
          >
            <Plus className="w-4 h-4 text-[#c5a059]" />
          </button>
          <button
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="p-2 rounded bg-[#111111] text-white/50 hover:text-white"
            id="mobile-sidebar-toggle"
          >
            {mobileSidebarOpen ? <X className="w-5 h-5 text-[#c5a059]" /> : <Menu className="w-5 h-5 text-[#c5a059]" />}
          </button>
        </div>
      </header>

      {/* Sidebar: Mobile overlay state and Desktop sidebar panel */}
      <aside className={`
        fixed inset-y-0 left-0 w-80 bg-[#0d0d0d] border-r border-white/10 flex flex-col z-50 transform transition-transform duration-300 md:relative md:translate-x-0
        ${mobileSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `} id="sidebar-layout-panel">
        
        {/* Mobile close rail handler */}
        <div className="md:hidden absolute top-4 right-4 z-50">
          <button 
            onClick={() => setMobileSidebarOpen(false)}
            className="p-1.5 bg-[#121212] border border-white/10 rounded text-white/50 hover:text-[#c5a059] hover:border-[#c5a059]/40 transition-all active:scale-95 flex items-center justify-center cursor-pointer"
            title="Close sidebar"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex-1 overflow-hidden">
          <SavedDecisionsList
            decisions={decisions}
            selectedDecisionId={selectedDecisionId}
            onSelectDecision={handleSelectDecision}
            onDeleteDecision={handleDeleteDecision}
            onClearAll={handleClearAllDecisions}
            onNewDecision={() => {
              setSelectedDecisionId(null);
              setMobileSidebarOpen(false);
            }}
            categories={categories}
          />
        </div>
      </aside>

      {/* Main Workspace Frame */}
      <main className="flex-1 flex flex-col overflow-y-auto relative h-full bg-[#09090b]">
        {/* Gemini-themed Ambient Radiant Auroras */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
          <div className="absolute top-0 left-1/4 w-[600px] h-[400px] gemini-aurora-glow-1 rounded-full blur-[130px]" />
          <div className="absolute bottom-5 right-5 w-[500px] h-[400px] gemini-aurora-glow-2 rounded-full blur-[140px]" />
          <div className="absolute top-0 right-1/4 w-[700px] h-[350px] gemini-aurora-glow-3 rounded-full blur-[120px]" />
        </div>

        {/* Global Error Alert Banner */}
        {errorText && (
          <div className="m-6 p-4 bg-rose-950/60 text-rose-200 rounded-2xl border border-rose-900/60 text-xs flex items-start gap-3 shadow-lg relative z-10" id="app-error-banner">
            <Info className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <h5 className="font-semibold font-mono">Dilemma analysis failed</h5>
              <p className="mt-1 font-sans text-rose-200/80 leading-relaxed">{errorText}</p>
              <p className="mt-2 text-rose-400/50 font-mono text-[10px]">Verify your GEMINI_API_KEY environment credentials in Settings &rarr; Secrets. No API inputs should fail when fully configured.</p>
            </div>
            <button
              onClick={() => setErrorText(null)}
              className="p-1 text-[#e0e0e0]/50 hover:text-[#e0e0e0] font-sans"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Main Workspace Content deck */}
        <div className="p-4 sm:p-6 md:p-10 max-w-7xl w-full mx-auto space-y-12 flex-1 relative z-10">
          {activeDecision ? (
            /* Render active analyzed results with matching glassy rounded layout */
            <DecisionResultView
              decision={activeDecision}
              onDelete={handleDeleteDecision}
              onNewDecision={() => {
                setPrefilledData(null);
                setSelectedDecisionId(null);
              }}
            />
          ) : (
            /* Gemini-style Form mode when selected is null */
            <div className="max-w-3xl mx-auto space-y-10">
              
              {/* Informative Header welcoming for first-turn users */}
              <div className="animate-fadeIn space-y-6" id="decisional-welcome-card">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#c5a059] animate-ping" />
                    <span className="text-[10px] tracking-[0.25em] text-[#c5a059] uppercase font-mono font-bold">
                      THE TIEBREAKER NETWORK CORE
                    </span>
                  </div>
                  
                  <h1 className="text-3xl sm:text-5xl font-sans tracking-tight font-extrabold text-white">
                    Hello, <span className="gemini-text-stream font-black">Srijayavel</span>
                  </h1>
                  <h2 className="text-2xl sm:text-4xl font-sans font-medium text-white/50 tracking-tight leading-tight">
                    What can I help you decide today?
                  </h2>
                  <p className="text-sm text-white/60 max-w-xl font-sans leading-relaxed pt-1">
                    Defeat decisional paralysis. Instantly partition hard tradeoffs into analytical weight metrics, side-by-side criteria boards, or detailed SWOT matrix segments with Gemini.
                  </p>
                </div>

                {/* Gemini style quick-start template shortcuts to enable clicks preview */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-2" id="gemini-shortcuts-grid">
                  <button
                    type="button"
                    onClick={() => {
                      setPrefilledData({
                        title: "Should we learn Rust vs Go for backend cloud services?",
                        description: "Deeply analyze ecosystem libraries, performance metrics, concurrency models, hiring curves, and long-term tech stack stability.",
                        analysisType: "comparison",
                        options: ["Rust Engine", "Go Microservice", "Node.js Legacy"],
                        category: "Professional"
                      });
                    }}
                    className="p-4 hover:p-[17px] bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] hover:border-[#c5a059]/40 rounded-2xl text-left transition-all duration-300 group cursor-pointer active:scale-[0.98] shadow-md"
                  >
                    <div className="p-2 w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-400 group-hover:scale-115 transition-transform flex items-center justify-center">
                      <Sliders className="w-4 h-4" />
                    </div>
                    <h3 className="text-white font-serif font-bold text-sm mt-3 group-hover:text-[#c5a059] transition-colors leading-snug">
                      Compare Avenues
                    </h3>
                    <p className="text-xs text-white/50 mt-1 line-clamp-2 leading-relaxed">
                      "Rust vs Go backend architecture comparison"
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setPrefilledData({
                        title: "Transition to Principal Engineer track vs Management track",
                        description: "Meticulously evaluate tech focus freedom, organizational leadership hurdles, coding time trade-offs, and professional alignment goals.",
                        analysisType: "pros_cons",
                        options: [],
                        category: "Personal Growth"
                      });
                    }}
                    className="p-4 hover:p-[17px] bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] hover:border-[#c5a059]/40 rounded-2xl text-left transition-all duration-300 group cursor-pointer active:scale-[0.98] shadow-md"
                  >
                    <div className="p-2 w-8 h-8 rounded-xl bg-amber-500/10 text-[#c5a059] group-hover:scale-115 transition-transform flex items-center justify-center">
                      <Scale className="w-4 h-4" />
                    </div>
                    <h3 className="text-white font-serif font-bold text-sm mt-3 group-hover:text-[#c5a059] transition-colors leading-snug">
                      Weigh Tradeoffs
                    </h3>
                    <p className="text-xs text-white/50 mt-1 line-clamp-2 leading-relaxed">
                      "Principal Engineer track vs Engineering Manager"
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setPrefilledData({
                        title: "Transition software application to a pure subscription SaaS billing",
                        description: "Macro tactical overview of client retention, income predictability, server infrastructure cost margins, and consumer payment resistance.",
                        analysisType: "swot",
                        options: [],
                        category: "Financial Stakes"
                      });
                    }}
                    className="p-4 hover:p-[17px] bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] hover:border-[#c5a059]/40 rounded-2xl text-left transition-all duration-300 group cursor-pointer active:scale-[0.98] shadow-md"
                  >
                    <div className="p-2 w-8 h-8 rounded-xl bg-violet-500/10 text-violet-400 group-hover:scale-115 transition-transform flex items-center justify-center">
                      <Grid className="w-4 h-4" />
                    </div>
                    <h3 className="text-white font-serif font-bold text-sm mt-3 group-hover:text-[#c5a059] transition-colors leading-snug">
                      Assess Strategy
                    </h3>
                    <p className="text-xs text-white/50 mt-1 line-clamp-2 leading-relaxed">
                      "Subscription SaaS vs One-time pricing framework SWOT"
                    </p>
                  </button>
                </div>
              </div>

              {/* Glass container wrapping the form */}
              <div className="gemini-glass-card rounded-2xl shadow-2xl relative">
                <DecisionForm
                  onAnalyze={handleAnalyzeDecision}
                  categories={categories}
                  onAddCategory={handleAddCategory}
                  isAnalyzing={isAnalyzing}
                  prefilledData={prefilledData}
                />
              </div>
            </div>
          )}
        </div>

        {/* Humble and refined system credits */}
        <footer className="py-6 px-10 border-t border-white/5 text-center flex flex-col sm:flex-row items-center justify-between gap-3 text-[10px] font-mono text-white/20 mt-auto bg-[#0a0a0d]">
          <span>THE TIEBREAKER COGNITIVE CORE SYSTEM</span>
          <span>ESTABLISHED 2026 • GEMINI DECISION GRID PROXY v3.5-FLASH</span>
        </footer>
      </main>
    </div>
  );
}
