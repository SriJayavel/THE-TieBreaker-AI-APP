/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  Search, 
  Trash2, 
  ChevronRight, 
  Plus, 
  Brain, 
  Calendar, 
  Sliders,
  Scale,
  Grid
} from "lucide-react";
import { Decision } from "../types";

interface SavedDecisionsListProps {
  decisions: Decision[];
  selectedDecisionId: string | null;
  onSelectDecision: (id: string | null) => void;
  onDeleteDecision: (id: string) => void;
  onClearAll: () => void;
  onNewDecision: () => void;
  categories: string[];
}

export default function SavedDecisionsList({
  decisions,
  selectedDecisionId,
  onSelectDecision,
  onDeleteDecision,
  onClearAll,
  onNewDecision,
  categories
}: SavedDecisionsListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterType, setFilterType] = useState<string>("all");

  const filteredDecisions = decisions.filter((dec) => {
    const matchesSearch = 
      dec.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (dec.description && dec.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = filterCategory === "all" || dec.category === filterCategory;
    const matchesType = filterType === "all" || dec.analysisType === filterType;

    return matchesSearch && matchesCategory && matchesType;
  });

  const getAnalysisTypeIcon = (type: string, active: boolean) => {
    switch (type) {
      case "pros_cons":
        return <Scale className={`w-3.5 h-3.5 ${active ? "text-[#c5a059]" : "text-emerald-500"}`} />;
      case "comparison":
        return <Sliders className={`w-3.5 h-3.5 ${active ? "text-[#c5a059]" : "text-blue-400"}`} />;
      case "swot":
        return <Grid className={`w-3.5 h-3.5 ${active ? "text-[#c5a059]" : "text-violet-400"}`} />;
      default:
        return <Brain className="w-3.5 h-3.5 text-slate-400" />;
    }
  };

  const getAnalysisTypeLabel = (type: string) => {
    switch (type) {
      case "pros_cons":
        return "Pros & Cons";
      case "comparison":
        return "Comparison";
      case "swot":
        return "SWOT Matrix";
      default:
        return type;
    }
  };

  return (
    <div id="decision-archive" className="flex flex-col h-full bg-[#0d0d0d] border-r border-white/10 overflow-hidden">
      {/* Brand Header & General Actions */}
      <div className="p-6 pr-24 md:pr-6 border-b border-white/10 flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-serif italic text-[#c5a059] tracking-tight">The Tiebreaker</h1>
            <span className="text-[9px] font-mono border border-[#c5a059]/30 text-[#c5a059] px-1 rounded uppercase">v2.0</span>
          </div>
          {decisions.length > 0 && (
            <button
              onClick={() => {
                if (window.confirm("Are you sure you want to permanently erase your decision-making history? This action cannot be undone.")) {
                  onClearAll();
                }
              }}
              id="clear-all-decisions"
              className="p-1 px-2.5 rounded text-xs text-white/40 hover:text-rose-400 hover:bg-rose-500/10 transition-all border border-transparent hover:border-rose-500/20 font-mono"
              title="Purge Decisional Archive"
            >
              Purge
            </button>
          )}
        </div>
        <p className="text-[9px] uppercase tracking-[0.25em] text-white/40">Precision Decisional System</p>
      </div>

      {/* Control Tools Container */}
      <div className="p-4 border-b border-white/5 space-y-3 bg-[#0a0a0a]/60">
        <div id="search-container" className="relative">
          <Search className="w-3.5 h-3.5 text-white/30 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search decisions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            id="search-decisions-input"
            className="w-full pl-9 pr-3 py-1.5 text-xs text-[#e0e0e0] placeholder-white/30 bg-[#121212] border border-white/10 rounded focus:outline-none focus:border-[#c5a059] transition-all"
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-[10px] font-mono uppercase tracking-widest text-[#c5a059] mb-1.5 font-bold">Category</label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              id="filter-category-select"
              className="w-full text-xs py-1.5 px-2 border border-white/10 rounded focus:outline-none focus:border-[#c5a059] bg-[#121212] text-[#e0e0e0] font-sans"
            >
              <option value="all">All Arenas</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-mono uppercase tracking-widest text-[#c5a059] mb-1.5 font-bold">Model</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              id="filter-type-select"
              className="w-full text-xs py-1.5 px-2 border border-white/10 rounded focus:outline-none focus:border-[#c5a059] bg-[#121212] text-[#e0e0e0] font-sans"
            >
              <option value="all">All Models</option>
              <option value="pros_cons">Pros & Cons</option>
              <option value="comparison">Comparison Grid</option>
              <option value="swot">SWOT Matrix</option>
            </select>
          </div>
        </div>
      </div>

      {/* Decisions List Container */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-[#090909]">
        <div className="text-[10px] uppercase tracking-widest text-white/30 px-2 my-2 font-mono">Dilemmas Stored ({filteredDecisions.length})</div>
        {filteredDecisions.length === 0 ? (
          <div className="h-44 flex flex-col justify-center items-center text-center p-6 bg-[#111111]/40 rounded-xl border border-white/5">
            <span className="text-xl mb-2 opacity-50">⚖️</span>
            <p className="text-xs font-serif text-white/80">Decisional Void</p>
            <p className="text-[10px] text-white/40 max-w-[180px] mt-1 font-mono">Initialize a custom analytics track to populate the register.</p>
            <button
              onClick={onNewDecision}
              id="create-new-decision-empty"
              className="mt-3 inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-semibold bg-[#c5a059] text-black rounded hover:bg-[#b48e47] transition-all"
            >
              <Plus className="w-3 h-3" />
              New Dilemma
            </button>
          </div>
        ) : (
          <div className="space-y-1.5">
            {filteredDecisions.map((dec) => {
              const isActive = selectedDecisionId === dec.decisionId;
              const formattedDate = new Date(dec.createdAt).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
                year: "numeric"
              });

              return (
                <div
                  key={dec.decisionId}
                  id={`decision-tab-${dec.decisionId}`}
                  className={`group relative p-3 rounded transition-all cursor-pointer flex flex-col justify-between border ${
                    isActive 
                      ? "bg-white/5 text-white border-l-2 border-l-[#c5a059] border-t-white/10 border-b-white/10 border-r-white/10" 
                      : "bg-[#111111]/30 hover:bg-white/5 text-white/70 border-white/5 hover:border-white/10"
                  }`}
                  onClick={() => onSelectDecision(dec.decisionId)}
                >
                  <div className="flex items-start justify-between gap-2.5">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
                        {/* Type Icon */}
                        <div className={`p-1 rounded ${
                          isActive ? "bg-[#c5a059]/20 text-[#c5a059]" : "bg-white/5 text-white/40"
                        }`}>
                          {getAnalysisTypeIcon(dec.analysisType, isActive)}
                        </div>
                        <span className={`text-[9px] font-mono tracking-wider px-1.5 py-0.5 rounded ${
                          isActive 
                            ? "bg-[#c5a059]/10 text-[#c5a059]" 
                            : "bg-white/5 text-white/50 border border-white/5"
                        }`}>
                          {dec.category}
                        </span>
                      </div>
                      
                      <h3 className={`font-serif text-sm leading-snug truncate font-bold ${
                        isActive ? "text-[#c5a059]" : "text-white/95"
                      }`}>
                        {dec.title}
                      </h3>
                      
                      {dec.description && (
                        <p className={`text-[11px] mt-1 line-clamp-1 italic ${
                          isActive ? "text-white/80" : "text-white/60"
                        }`}>
                          {dec.description}
                        </p>
                      )}
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteDecision(dec.decisionId);
                        if (isActive) onSelectDecision(null);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1 rounded transition-all text-white/30 hover:text-rose-400 hover:bg-red-500/10"
                      title="Erase item"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-white/5">
                    <span className="text-[9px] font-mono flex items-center gap-1 text-white/30">
                      <Calendar className="w-2.5 h-2.5" />
                      {formattedDate}
                    </span>
                    <span className={`text-[9px] flex items-center font-semibold font-mono gap-0.5 ${
                      isActive ? "text-[#c5a059]" : "text-white/50"
                    }`}>
                      {getAnalysisTypeLabel(dec.analysisType)}
                      <ChevronRight className="w-2.5 h-2.5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Primary Trigger Tab */}
      <div className="p-4 border-t border-white/10 bg-[#0d0d0d]">
        <button
          onClick={onNewDecision}
          id="trigger-new-decision-form"
          className="w-full py-2.5 px-4 font-serif italic text-xs font-medium text-black bg-[#c5a059] hover:bg-[#b48e47] active:scale-95 rounded transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-lg"
        >
          <Plus className="w-3.5 h-3.5" />
          Initialize New Matrix
        </button>
      </div>
    </div>
  );
}
