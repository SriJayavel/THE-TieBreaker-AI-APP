/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { 
  Scale, 
  Sliders, 
  Grid, 
  CheckCircle2, 
  AlertTriangle,
  Lightbulb,
  ArrowRight,
  TrendingUp,
  Bookmark,
  Calendar,
  Layers,
  ChevronRight,
  HelpCircle,
  Zap,
  Tag
} from "lucide-react";
import { 
  Decision, 
  ProsConsResult, 
  ComparisonResult, 
  SwotResult,
  ProConFactor,
  ComparisonCriterion
} from "../types";

interface DecisionResultViewProps {
  decision: Decision;
  onDelete: (id: string) => void;
  onNewDecision: () => void;
}

export default function DecisionResultView({
  decision,
  onDelete,
  onNewDecision
}: DecisionResultViewProps) {
  const { title, description, analysisType, category, createdAt, analysisResult } = decision;

  const formattedDate = new Date(createdAt).toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  });

  // Calculate high, medium, low colors for weights
  const getWeightBadge = (weight: "high" | "medium" | "low" | string) => {
    switch (weight?.toLowerCase()) {
      case "high":
        return "text-rose-300 bg-rose-500/20 border-rose-500/30";
      case "medium":
        return "text-[#c5a059] bg-[#c5a059]/15 border-[#c5a059]/30";
      case "low":
        return "text-emerald-300 bg-emerald-500/15 border-emerald-500/30";
      default:
        return "text-slate-300 bg-slate-500/15 border-slate-500/30";
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn" id="analysis-workspace-view">
      {/* Decisional Workspace Banner */}
      <div className="p-6 sm:p-8 gemini-glass-card rounded-3xl relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
          <Scale className="w-40 h-40 text-[#c5a059]" />
        </div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-mono tracking-[0.25em] text-[#c5a059] uppercase border-b border-[#c5a059] pb-0.5 font-bold">
                Active Analysis Grid
              </span>
              <span className="text-white/30">•</span>
              <span className="text-xs uppercase font-mono tracking-wider text-white/70 font-semibold">
                {category}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-serif text-white hover:text-[#c5a059] transition-all leading-snug">
              {title}
            </h1>
            {description && (
              <div className="bg-white/5 border border-white/5 rounded-xl p-4 mt-3 max-w-3xl">
                <p className="text-sm text-white/95 italic font-sans leading-relaxed">
                  "{description}"
                </p>
              </div>
            )}
            <div className="flex items-center gap-4 mt-4 text-xs text-[#c5a059] font-mono">
              <span className="flex items-center gap-1.5 text-white/70">
                <Calendar className="w-4 h-4 text-[#c5a059]" />
                {formattedDate}
              </span>
              <span className="text-white/30">•</span>
              <span className="flex items-center gap-1.5 font-bold">
                <Layers className="w-4 h-4" />
                {analysisType === "pros_cons" ? "Pros & Cons Model" : analysisType === "comparison" ? "Side-by-Side matrix" : "SWOT Quadrant framework"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => {
                if (window.confirm("Are you sure you want to discard this decision analysis?")) {
                  onDelete(decision.decisionId);
                }
              }}
              id="delete-decision-btn"
              className="px-4 py-2.5 bg-rose-500/15 text-rose-300 hover:bg-rose-600 hover:text-white rounded border border-rose-500/30 text-xs uppercase tracking-widest transition-colors font-semibold font-mono cursor-pointer"
            >
              Discard
            </button>
            <button
              onClick={onNewDecision}
              id="start-fresh-btn"
              className="px-4 py-2.5 bg-[#c5a059] hover:bg-[#b48e47] text-black rounded border border-transparent text-xs uppercase tracking-widest transition-colors font-semibold font-mono cursor-pointer"
            >
              + New Dilemma
            </button>
          </div>
        </div>
      </div>

      {/* Main Analysis Results Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Render Pros & Cons */}
        {analysisType === "pros_cons" && (
          <>
            {/* Left Hand: Pros and Cons Lists */}
            <div className="lg:col-span-7 flex flex-col gap-6" id="pros-cons-grid-column">
              {/* Pros List */}
              <div className="gemini-glass-card rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                  <CheckCircle2 className="w-16 h-16 text-emerald-500" />
                </div>
                <h3 className="font-serif text-xl text-emerald-400 mb-6 flex items-center gap-2 border-b border-white/5 pb-3 font-semibold">
                  <span className="text-emerald-500 font-bold text-2xl">+</span> Pros (Favorable Capital)
                </h3>
                
                <div className="space-y-6">
                  {((analysisResult as ProsConsResult).pros || []).map((pro, index) => (
                    <div key={index} className="border-b border-white/5 pb-5 last:border-b-0 last:pb-0" id={`pro-item-${index}`}>
                      <div className="flex items-start justify-between gap-4">
                        <h4 className="text-base text-white/95 font-semibold font-sans">{pro.text}</h4>
                        <span className={`text-[10px] uppercase font-mono tracking-widest px-2.5 py-1 border rounded shrink-0 font-bold ${getWeightBadge(pro.weight)}`}>
                          Weight: {pro.weight}
                        </span>
                      </div>
                      <p className="text-sm text-white/80 mt-2 font-sans leading-relaxed">{pro.explanation}</p>
                    </div>
                  ))}
                  {((analysisResult as ProsConsResult).pros || []).length === 0 && (
                    <p className="text-sm text-white/50 italic">No significant positive vectors registered.</p>
                  )}
                </div>
              </div>

              {/* Cons List */}
              <div className="gemini-glass-card rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                  <AlertTriangle className="w-16 h-16 text-rose-500" />
                </div>
                <h3 className="font-serif text-xl text-rose-400 mb-6 flex items-center gap-2 border-b border-white/5 pb-3 font-semibold">
                  <span className="text-rose-500 font-bold text-2xl">−</span> Cons (Risks & Compromises)
                </h3>
                
                <div className="space-y-6">
                  {((analysisResult as ProsConsResult).cons || []).map((con, index) => (
                    <div key={index} className="border-b border-white/5 pb-5 last:border-b-0 last:pb-0" id={`con-item-${index}`}>
                      <div className="flex items-start justify-between gap-4">
                        <h4 className="text-base text-white/95 font-semibold font-sans">{con.text}</h4>
                        <span className={`text-[10px] uppercase font-mono tracking-widest px-2.5 py-1 border rounded shrink-0 font-bold ${getWeightBadge(con.weight)}`}>
                          Weight: {con.weight}
                        </span>
                      </div>
                      <p className="text-sm text-white/80 mt-2 font-sans leading-relaxed">{con.explanation}</p>
                    </div>
                  ))}
                  {((analysisResult as ProsConsResult).cons || []).length === 0 && (
                    <p className="text-sm text-white/50 italic">No major risks identified.</p>
                  )}
                </div>
              </div>
            </div>

            {/* Right Hand: Verdict, Overall Score Indicator & Summaries */}
            <div className="lg:col-span-5 space-y-6" id="pros-cons-sidebar-column">
              {/* Comprehensive Viability Score Card */}
              <div className="gemini-glass-card rounded-3xl p-6 shadow-2xl flex flex-col justify-between relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                  <TrendingUp className="w-20 h-20 text-[#c5a059]" />
                </div>
                <div>
                  <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-white/70 font-bold mb-4">Calculated Viability</h3>
                  
                  {/* Round Gauge Meter representation with standard Tailwind */}
                  <div className="flex items-center gap-6 py-2">
                    <div className="relative w-28 h-28 flex items-center justify-center shrink-0">
                      {/* Circular border track */}
                      <svg className="w-full h-full transform -rotate-90">
                        <circle
                          cx="56"
                          cy="56"
                          r="46"
                          stroke="rgba(255, 255, 255, 0.05)"
                          strokeWidth="9"
                          fill="transparent"
                        />
                        <circle
                          cx="56"
                          cy="56"
                          r="46"
                          stroke="#c5a059"
                          strokeWidth="9"
                          fill="transparent"
                          strokeDasharray={289.0}
                          strokeDashoffset={289.0 - (289.0 * ((analysisResult as ProsConsResult).score || 0)) / 100}
                          className="transition-all duration-1000 ease-out"
                        />
                      </svg>
                      <div className="absolute flex flex-col items-center">
                        <span className="text-3xl font-serif font-bold text-white">{(analysisResult as ProsConsResult).score || 0}%</span>
                        <span className="text-[10px] font-mono uppercase text-[#c5a059] tracking-wider font-semibold">Score</span>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white/95">Viability Calculus Rating</h4>
                      <p className="text-xs text-white/75 font-mono mt-1.5 leading-relaxed">
                        Evaluated from 0% (highly detrimental route) to 100% (ideal path forward with minimal downsides).
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-white/5">
                  <div className="bg-white/5 p-3.5 border border-white/5 rounded-xl font-sans text-xs text-white/90 leading-relaxed shadow-inner">
                    {(analysisResult as ProsConsResult).summary}
                  </div>
                </div>
              </div>

              {/* Majestic Tiebreaker Recommendation Callout */}
              <div className="p-6 rounded-3xl bg-gradient-to-br from-[#1c1917]/95 to-[#0c0a09]/98 border border-[#c5a059]/40 relative shadow-xl gold-glow">
                <div className="absolute top-2 right-3">
                  <span className="text-[8px] font-mono uppercase tracking-widest text-[#c5a059]/75 font-bold">DECISION SHIELD</span>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full border border-[#c5a059]/40 flex items-center justify-center bg-[#0a0a0a] shrink-0">
                    <span className="text-[#c5a059] font-serif text-2xl italic">🎯</span>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-widest text-[#c5a059] mb-1.5 font-bold">The Tiebreaker Verdict</p>
                    <p className="text-base text-white/100 font-serif italic leading-relaxed text-yellow-100">
                      "{(analysisResult as ProsConsResult).verdict}"
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Render SWOT Matrix */}
        {analysisType === "swot" && (
          <div className="lg:col-span-12 space-y-8" id="swot-grid-matrix-container">
            {/* SWOT Introductory Summary */}
            <div className="p-6 gemini-glass-card rounded-3xl shadow-md">
              <h3 className="text-xs font-mono uppercase tracking-widest text-[#c5a059] mb-1.5 font-bold">Situational Assessment Layout</h3>
              <p className="text-sm text-white/90 font-sans leading-relaxed">{(analysisResult as SwotResult).summary}</p>
            </div>

            {/* SWOT 2x2 Matrix */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Strengths */}
              <div className="gemini-glass-card rounded-3xl p-6 shadow-2xl relative overflow-hidden border-l-4 border-l-emerald-500/50 hover:border-emerald-500/30 transition-all">
                <div className="absolute top-3 right-4 text-xs font-mono text-emerald-400 font-bold tracking-wider bg-emerald-500/10 px-2 py-0.5 rounded">STRENGTHS</div>
                <h3 className="font-serif text-lg text-emerald-400 mb-5 flex items-center gap-1.5 font-bold pt-1">
                  Strengths (Internal Positives)
                </h3>
                <ul className="space-y-4">
                  {((analysisResult as SwotResult).strengths || []).map((st, idx) => (
                    <li key={idx} className="border-b border-white/5 pb-4 last:border-b-0 last:pb-0" id={`swot-strength-${idx}`}>
                      <h4 className="text-sm font-semibold text-white/95 italic">"{st.text}"</h4>
                      <p className="text-xs text-white/80 mt-1.5 pl-3 border-l border-[#c5a059]/40 font-sans leading-relaxed">{st.explanation}</p>
                    </li>
                  ))}
                  {((analysisResult as SwotResult).strengths || []).length === 0 && (
                    <p className="text-sm text-white/50 italic">No parameters registered.</p>
                  )}
                </ul>
              </div>

              {/* Weaknesses */}
              <div className="gemini-glass-card rounded-3xl p-6 shadow-2xl relative overflow-hidden border-l-4 border-l-amber-500/50 hover:border-amber-500/30 transition-all">
                <div className="absolute top-3 right-4 text-xs font-mono text-amber-500 font-bold tracking-wider bg-amber-500/10 px-2 py-0.5 rounded">WEAKNESSES</div>
                <h3 className="font-serif text-lg text-amber-500 mb-5 flex items-center gap-1.5 font-bold pt-1">
                  Weaknesses (Internal Risks)
                </h3>
                <ul className="space-y-4">
                  {((analysisResult as SwotResult).weaknesses || []).map((wk, idx) => (
                    <li key={idx} className="border-b border-white/5 pb-4 last:border-b-0 last:pb-0" id={`swot-weakness-${idx}`}>
                      <h4 className="text-sm font-semibold text-white/95 italic">"{wk.text}"</h4>
                      <p className="text-xs text-white/80 mt-1.5 pl-3 border-l border-[#c5a059]/40 font-sans leading-relaxed">{wk.explanation}</p>
                    </li>
                  ))}
                  {((analysisResult as SwotResult).weaknesses || []).length === 0 && (
                    <p className="text-sm text-white/50 italic">No limitations found.</p>
                  )}
                </ul>
              </div>

              {/* Opportunities */}
              <div className="gemini-glass-card rounded-3xl p-6 shadow-2xl relative overflow-hidden border-l-4 border-l-indigo-500/50 hover:border-indigo-500/30 transition-all">
                <div className="absolute top-3 right-4 text-xs font-mono text-indigo-400 font-bold tracking-wider bg-indigo-500/10 px-2 py-0.5 rounded">OPPORTUNITIES</div>
                <h3 className="font-serif text-lg text-indigo-400 mb-5 flex items-center gap-1.5 font-bold pt-1">
                  Opportunities (External Upsides)
                </h3>
                <ul className="space-y-4">
                  {((analysisResult as SwotResult).opportunities || []).map((op, idx) => (
                    <li key={idx} className="border-b border-white/5 pb-4 last:border-b-0 last:pb-0" id={`swot-opportunity-${idx}`}>
                      <h4 className="text-sm font-semibold text-white/95 italic">"{op.text}"</h4>
                      <p className="text-xs text-white/80 mt-1.5 pl-3 border-l border-[#c5a059]/40 font-sans leading-relaxed">{op.explanation}</p>
                    </li>
                  ))}
                  {((analysisResult as SwotResult).opportunities || []).length === 0 && (
                    <p className="text-sm text-white/50 italic">No external market factors found.</p>
                  )}
                </ul>
              </div>

              {/* Threats */}
              <div className="gemini-glass-card rounded-3xl p-6 shadow-2xl relative overflow-hidden border-l-4 border-l-rose-500/50 hover:border-rose-500/30 transition-all">
                <div className="absolute top-3 right-4 text-xs font-mono text-rose-400 font-bold tracking-wider bg-rose-500/10 px-2 py-0.5 rounded">THREATS</div>
                <h3 className="font-serif text-lg text-rose-400 mb-5 flex items-center gap-1.5 font-bold pt-1">
                  Threats (External Dangers)
                </h3>
                <ul className="space-y-4">
                  {((analysisResult as SwotResult).threats || []).map((th, idx) => (
                    <li key={idx} className="border-b border-white/5 pb-4 last:border-b-0 last:pb-0" id={`swot-threats-${idx}`}>
                      <h4 className="text-sm font-semibold text-white/95 italic">"{th.text}"</h4>
                      <p className="text-xs text-white/80 mt-1.5 pl-3 border-l border-[#c5a059]/40 font-sans leading-relaxed">{th.explanation}</p>
                    </li>
                  ))}
                  {((analysisResult as SwotResult).threats || []).length === 0 && (
                    <p className="text-sm text-white/50 italic">No external disruption risks noted.</p>
                  )}
                </ul>
              </div>
            </div>

            {/* Strategic Synthesis Callout */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-[#1c1917]/95 to-[#0c0a09]/98 border border-[#c5a059]/40 relative shadow-xl gold-glow animate-fadeIn">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full border border-[#c5a059]/40 flex items-center justify-center bg-[#0a0a0a] shrink-0 font-serif italic text-[#c5a059] text-2xl">
                  📜
                </div>
                <div>
                  <h4 className="text-xs font-mono uppercase tracking-widest text-[#c5a059] mb-1.5 font-bold">SWOT Strategic Action Plan</h4>
                  <p className="text-base font-serif italic leading-relaxed text-yellow-100">
                    "{(analysisResult as SwotResult).verdict}"
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Render Comparison Side-by-Side Grid */}
        {analysisType === "comparison" && (
          <div className="lg:col-span-12 space-y-8" id="comparison-side-by-side-layout">
            <div className="p-6 gemini-glass-card rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-xs font-mono uppercase tracking-widest text-[#c5a059] mb-1.5 font-bold">Comparative Analysis Outline</h3>
                <p className="text-sm text-white/90 leading-relaxed font-sans">{(analysisResult as ComparisonResult).summary}</p>
              </div>
              <div className="px-5 py-3 bg-[#c5a059]/10 rounded-xl border border-[#c5a059]/30 inline-flex items-center gap-3 shrink-0 shadow-lg">
                <span className="text-xs uppercase font-mono tracking-wider text-white/70 font-semibold">Winner Target:</span>
                <span className="text-sm font-serif font-bold text-[#c5a059] uppercase tracking-wide">
                  {(analysisResult as ComparisonResult).bestOption}
                </span>
              </div>
            </div>

            {/* Side-by-Side Comparison Grid Table */}
            <div className="gemini-glass-card rounded-3xl overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse font-sans text-xs">
                  <thead>
                    <tr className="bg-[#0c0c0c] border-b border-white/10">
                      <th className="p-5 text-sm font-serif text-[#c5a059] italic tracking-wider font-semibold w-72">Scoring Criteria & Explanation</th>
                      {/* Gather options directly from first criteria item */}
                      {(((analysisResult as ComparisonResult).criteria || [])[0]?.options || []).map((optDef, index) => {
                        const isWinner = optDef.optionName.trim().toLowerCase() === (analysisResult as ComparisonResult).bestOption?.trim().toLowerCase();
                        return (
                          <th key={index} className={`p-5 text-center font-serif text-base font-bold tracking-wide ${isWinner ? "bg-[#c5a059]/5 border-x border-[#c5a059]/10 text-[#c5a059]" : "text-white"}`}>
                            <div className="flex flex-col items-center justify-center gap-2">
                              <span>{optDef.optionName}</span>
                              {isWinner && (
                                <span className="text-[9px] uppercase tracking-widest font-mono font-bold bg-[#c5a059] text-black px-2 py-0.5 rounded shadow">
                                  BEST ROUTE
                                </span>
                              )}
                            </div>
                          </th>
                        );
                      })}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {((analysisResult as ComparisonResult).criteria || []).map((cri: ComparisonCriterion, criIdx: number) => (
                      <tr key={criIdx} className="hover:bg-[#151515]/30 transition-colors">
                        <td className="p-5">
                          <h4 className="font-bold text-white text-base font-serif">{cri.name}</h4>
                          <p className="text-xs text-white/80 mt-1.5 font-sans leading-relaxed">{cri.explanation}</p>
                        </td>
                        {(cri.options || []).map((optValue, optIdx) => {
                          const isWinner = optValue.optionName.trim().toLowerCase() === (analysisResult as ComparisonResult).bestOption?.trim().toLowerCase();
                          return (
                            <td key={optIdx} className={`p-5 text-center ${isWinner ? "bg-[#c5a059]/5 border-x border-[#c5a059]/5" : ""}`}>
                              <div className="flex flex-col items-center justify-center space-y-3">
                                {/* Elegant rating score pill */}
                                <span className={`inline-flex items-center justify-center w-10 h-10 rounded-full font-serif font-bold text-base border shadow ${
                                  optValue.score >= 8 
                                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/25" 
                                    : optValue.score >= 5 
                                      ? "bg-[#c5a059]/10 text-[#c5a059] border-[#c5a059]/20" 
                                      : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                                }`}>
                                  {optValue.score}
                                </span>
                                <p className="text-xs text-white/90 max-w-[170px] leading-relaxed mx-auto italic">
                                  "{optValue.text}"
                                </p>
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Verdict Box */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-[#1c1917]/95 to-[#0c0a09]/98 border border-[#c5a059]/40 relative shadow-xl gold-glow animate-fadeIn">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full border border-[#c5a059]/40 flex items-center justify-center bg-[#0a0a0a] shrink-0 font-serif italic text-[#c5a059] text-2xl">
                  ⚖️
                </div>
                <div>
                  <h4 className="text-xs font-mono uppercase tracking-widest text-[#c5a059] mb-1.5 font-bold">Comparison synthesis & verdict</h4>
                  <p className="text-base font-serif italic leading-relaxed text-yellow-100">
                    "{(analysisResult as ComparisonResult).verdict}"
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
