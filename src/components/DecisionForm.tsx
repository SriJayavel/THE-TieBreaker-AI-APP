/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  Sparkles, 
  Plus, 
  X, 
  Scale,
  Sliders,
  Grid,
  Tag,
  AlertTriangle,
  HelpCircle
} from "lucide-react";
import { AnalysisType } from "../types";

interface DecisionFormProps {
  onAnalyze: (data: {
    title: string;
    description: string;
    analysisType: AnalysisType;
    options: string[];
    category: string;
  }) => Promise<void>;
  categories: string[];
  onAddCategory: (category: string) => void;
  isAnalyzing: boolean;
  prefilledData?: {
    title: string;
    description: string;
    analysisType: AnalysisType;
    options: string[];
    category: string;
  } | null;
}

export default function DecisionForm({
  onAnalyze,
  categories,
  onAddCategory,
  isAnalyzing,
  prefilledData = null
}: DecisionFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [analysisType, setAnalysisType] = useState<AnalysisType>("pros_cons");
  const [category, setCategory] = useState("General");
  
  // Custom Category State
  const [showCustomCategoryInput, setShowCustomCategoryInput] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  // Dynamic Options for Comparison Table
  const [comparisonOptions, setComparisonOptions] = useState<string[]>(["Option A", "Option B"]);
  const [newOptionName, setNewOptionName] = useState("");

  const [validationError, setValidationError] = useState<string | null>(null);

  // Sync state with prefilledData
  React.useEffect(() => {
    if (prefilledData) {
      setTitle(prefilledData.title);
      setDescription(prefilledData.description);
      setAnalysisType(prefilledData.analysisType);
      setCategory(prefilledData.category);
      if (prefilledData.options && prefilledData.options.length > 0) {
        setComparisonOptions(prefilledData.options);
      } else {
        setComparisonOptions(["Option A", "Option B"]);
      }
    }
  }, [prefilledData]);

  // Loading ticker steps for premium UX
  const [loadingStep, setLoadingStep] = useState(0);
  const loadingSteps = [
    "Deconstructing decision variables...",
    "Consulting the Gemini Decision Science engine...",
    "Weighing short-term effects vs strategic growth pivot points...",
    "Formulating the ultimate Tiebreaker verdict..."
  ];

  React.useEffect(() => {
    let interval: any;
    if (isAnalyzing) {
      setLoadingStep(0);
      interval = setInterval(() => {
        setLoadingStep((prev) => (prev + 1) % loadingSteps.length);
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [isAnalyzing]);

  const handleAddComparisonOption = () => {
    let trimmed = newOptionName.trim();
    if (!trimmed) return;
    if (comparisonOptions.includes(trimmed)) {
      setValidationError("Option name already exists in current ledger.");
      return;
    }
    setComparisonOptions([...comparisonOptions, trimmed]);
    setNewOptionName("");
    setValidationError(null);
  };

  const handleRemoveComparisonOption = (indexToRemove: number) => {
    if (comparisonOptions.length <= 2) {
      setValidationError("A comparative table must contrast at least 2 distinct operational routes.");
      return;
    }
    setComparisonOptions(comparisonOptions.filter((_, idx) => idx !== indexToRemove));
    setValidationError(null);
  };

  const handleAddCustomCategory = () => {
    const trimmed = newCategoryName.trim();
    if (!trimmed) return;
    if (categories.includes(trimmed)) {
      setCategory(trimmed);
      setShowCustomCategoryInput(false);
      setNewCategoryName("");
      return;
    }
    onAddCategory(trimmed);
    setCategory(trimmed);
    setShowCustomCategoryInput(false);
    setNewCategoryName("");
    setValidationError(null);
  };

  const handleOptionChange = (index: number, val: string) => {
    const updated = [...comparisonOptions];
    updated[index] = val;
    setComparisonOptions(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setValidationError("A specific decision statement is required.");
      return;
    }

    if (analysisType === "comparison") {
      const validOptions = comparisonOptions.filter(o => o.trim().length > 0);
      if (validOptions.length < 2) {
        setValidationError("Please configure at least 2 valid options to contrast.");
        return;
      }
      onAnalyze({
        title: trimmedTitle,
        description: description.trim(),
        analysisType,
        options: validOptions,
        category
      });
    } else {
      onAnalyze({
        title: trimmedTitle,
        description: description.trim(),
        analysisType,
        options: [],
        category
      });
    }
  };

  return (
    <div className="p-6 sm:p-8 relative overflow-hidden">
      {/* Decorative Golden Light Streak */}
      <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#c5a059]/40 to-transparent"></div>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#c5a059] font-mono border border-[#c5a059]/40 px-2.5 py-1 rounded bg-[#c5a059]/5">
            Decisional Forge
          </span>
        </div>
        <h2 className="font-serif text-3xl text-white mt-4 italic font-normal">
          Forge a New Dilemma
        </h2>
        <p className="text-sm text-white/80 mt-2 max-w-xl font-sans leading-relaxed">
          Inject operational variables, constraints, and avenues into the analytical mainframe to structure your path forward with objective metrics.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Errors */}
        {validationError && (
          <div className="p-3.5 bg-rose-950/60 text-rose-200 rounded border border-rose-900 text-xs flex items-start gap-2.5 font-medium animate-fadeIn" id="form-error">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <span className="font-mono">{validationError}</span>
          </div>
        )}

        {/* Title Input */}
        <div className="space-y-2">
          <label className="block text-[11px] font-mono uppercase tracking-widest text-[#c5a059] font-semibold flex items-center justify-between">
            <span>Operational Objective or Question <span className="text-rose-500 font-bold">*</span></span>
            <span className="text-[10px] text-white/50 font-normal">Required</span>
          </label>
          <input
            type="text"
            placeholder="e.g., Accepting the Lead Architect offer vs remaining with Seniority at current firm"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={isAnalyzing}
            id="decision-title-input"
            className="w-full px-4 py-3.5 text-base bg-[#0a0a0a] border border-white/10 rounded text-white placeholder-white/30 focus:outline-none focus:border-[#c5a059] focus:ring-1 focus:ring-[#c5a059]/30 transition-all font-serif italic"
            required
          />
        </div>

        {/* Context Textarea */}
        <div className="space-y-2">
          <label className="block text-[11px] font-mono uppercase tracking-widest text-[#c5a059] font-semibold flex items-center justify-between">
            <span>Decisional Context & Constraints</span>
            <span className="text-[10px] text-white/50 font-normal">Optional</span>
          </label>
          <textarea
            rows={3}
            placeholder="Outline primary weights, financial requirements, temporal urgencies, or subjective preferences which the AI should factor into weight calculations."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={isAnalyzing}
            id="decision-description-input"
            className="w-full px-4 py-3 text-sm bg-[#0a0a0a] border border-white/10 rounded text-white/90 placeholder-white/30 focus:outline-none focus:border-[#c5a059] focus:ring-1 focus:ring-[#c5a059]/30 transition-all font-sans leading-relaxed"
          />
        </div>

        {/* Category Setup */}
        <div className="space-y-3">
          <label className="block text-[11px] font-mono uppercase tracking-widest text-[#c5a059] font-semibold">
            Strategic Category Arena
          </label>
          <div className="flex flex-wrap gap-2 items-center">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  setCategory(cat);
                  setShowCustomCategoryInput(false);
                }}
                disabled={isAnalyzing}
                id={`cat-button-${cat}`}
                className={`px-3 py-2 text-xs rounded border transition-all flex items-center gap-1.5 cursor-pointer ${
                  category === cat && !showCustomCategoryInput
                    ? "bg-[#c5a059] border-[#c5a059] text-[#0a0a0a] font-semibold shadow-md shadow-[#c5a059]/10"
                    : "bg-[#0d0d0d] border-white/10 text-white/80 hover:text-white hover:border-white/20"
                }`}
              >
                <Tag className="w-3.5 h-3.5" />
                {cat}
              </button>
            ))}
            
            {!showCustomCategoryInput ? (
              <button
                type="button"
                onClick={() => setShowCustomCategoryInput(true)}
                disabled={isAnalyzing}
                id="add-custom-category-trigger"
                className="px-3 py-2 text-xs rounded border border-dashed border-white/20 text-[#c5a059] hover:border-[#c5a059]/50 hover:bg-white/5 transition-all flex items-center gap-1 cursor-pointer font-medium"
              >
                <Plus className="w-3.5 h-3.5" />
                Custom Arena
              </button>
            ) : (
              <div id="custom-cat-input-container" className="flex items-center gap-1.5 animate-fadeIn bg-[#0d0d0d] p-1 rounded border border-[#c5a059]/40">
                <input
                  type="text"
                  placeholder="E.g., Logistics"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  className="px-2 py-1.5 text-xs text-white bg-[#0a0a0a] border border-white/10 rounded focus:outline-none focus:border-[#c5a059]"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={handleAddCustomCategory}
                  id="confirm-custom-category"
                  className="p-1 px-2 text-xs bg-[#c5a059] hover:bg-[#b48e47] text-black font-semibold rounded"
                >
                  Confirm
                </button>
                <button
                  type="button"
                  onClick={() => setShowCustomCategoryInput(false)}
                  id="cancel-custom-category"
                  className="p-1 text-white/50 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Methodology choices */}
        <div className="space-y-4">
          <label className="block text-[11px] font-mono uppercase tracking-widest text-[#c5a059] font-semibold">
            Analytical Output Methodology
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Pros & Cons Card */}
            <button
              type="button"
              onClick={() => setAnalysisType("pros_cons")}
              disabled={isAnalyzing}
              id="select-type-pros_cons"
              className={`p-5 rounded-xl border text-left cursor-pointer transition-all flex flex-col justify-between ${
                analysisType === "pros_cons"
                  ? "bg-[#c5a059]/10 border-[#c5a059] shadow-md ring-1 ring-[#c5a059]/30"
                  : "bg-[#0d0d0d]/40 border-white/5 hover:border-white/15 hover:bg-[#0d0d0d]/80"
              }`}
            >
              <div className="flex items-start justify-between w-full">
                <div className={`p-2 rounded ${
                  analysisType === "pros_cons" ? "bg-[#c5a059] text-black animate-pulse" : "bg-white/5 text-white/50"
                }`}>
                  <Scale className="w-4 h-4" />
                </div>
                {analysisType === "pros_cons" && (
                  <span className="w-2 h-2 rounded-full bg-[#c5a059]" />
                )}
              </div>
              <div className="mt-4">
                <h4 className="font-serif text-base text-white font-medium">Pros & Cons Matrix</h4>
                <p className="text-xs text-white/70 mt-1.5 leading-relaxed font-sans">
                  Deep analysis of logical pros and cons with calculated severity weightings. Ideal for binary, yes-or-no dilemmas.
                </p>
              </div>
            </button>

            {/* Comparison Side-by-side Table */}
            <button
              type="button"
              onClick={() => setAnalysisType("comparison")}
              disabled={isAnalyzing}
              id="select-type-comparison"
              className={`p-5 rounded-xl border text-left cursor-pointer transition-all flex flex-col justify-between ${
                analysisType === "comparison"
                  ? "bg-[#c5a059]/10 border-[#c5a059] shadow-md ring-1 ring-[#c5a059]/30"
                  : "bg-[#0d0d0d]/40 border-white/5 hover:border-white/15 hover:bg-[#0d0d0d]/80"
              }`}
            >
              <div className="flex items-start justify-between w-full">
                <div className={`p-2 rounded ${
                  analysisType === "comparison" ? "bg-[#c5a059] text-black" : "bg-white/5 text-white/50"
                }`}>
                  <Sliders className="w-4 h-4" />
                </div>
                {analysisType === "comparison" && (
                  <span className="w-2 h-2 rounded-full bg-[#c5a059]" />
                )}
              </div>
              <div className="mt-4">
                <h4 className="font-serif text-base text-white font-medium">Side-by-Side Grid</h4>
                <p className="text-xs text-white/70 mt-1.5 leading-relaxed font-sans">
                  Contrast up to 5 custom routes side-by-side. evaluates tailored scoring criteria (Joy, Cost, Time) with clear scoring.
                </p>
              </div>
            </button>

            {/* SWOT Matrix Card */}
            <button
              type="button"
              onClick={() => setAnalysisType("swot")}
              disabled={isAnalyzing}
              id="select-type-swot"
              className={`p-5 rounded-xl border text-left cursor-pointer transition-all flex flex-col justify-between ${
                analysisType === "swot"
                  ? "bg-[#c5a059]/10 border-[#c5a059] shadow-md ring-1 ring-[#c5a059]/30"
                  : "bg-[#0d0d0d]/40 border-white/5 hover:border-white/15 hover:bg-[#0d0d0d]/80"
              }`}
            >
              <div className="flex items-start justify-between w-full">
                <div className={`p-2 rounded ${
                  analysisType === "swot" ? "bg-[#c5a059] text-black" : "bg-white/5 text-white/50"
                }`}>
                  <Grid className="w-4 h-4" />
                </div>
                {analysisType === "swot" && (
                  <span className="w-2 h-2 rounded-full bg-[#c5a059]" />
                )}
              </div>
              <div className="mt-4">
                <h4 className="font-serif text-base text-white font-medium">SWOT Analysis</h4>
                <p className="text-xs text-white/70 mt-1.5 leading-relaxed font-sans">
                  Formulate macro strategic frameworks. Decipher internal Strengths & Weaknesses against external Opportunities & Threats.
                </p>
              </div>
            </button>
          </div>
        </div>

        {/* Comparison Options Configurator */}
        {analysisType === "comparison" && (
          <div className="p-6 rounded border border-white/10 bg-[#0a0a0a] space-y-4 animate-fadeIn" id="dynamic-options-container">
            <div>
              <h4 className="font-serif text-base text-white font-semibold">Configure Options to Compare</h4>
              <p className="text-xs text-white/60 mt-0.5">List the distinct operational avenues you wish to contrast.</p>
            </div>

            <div className="space-y-3">
              {comparisonOptions.map((opt, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <span className="font-mono text-xs text-[#c5a059] w-6 text-right font-bold">{idx + 1}.</span>
                  <input
                    type="text"
                    value={opt}
                    onChange={(e) => handleOptionChange(idx, e.target.value)}
                    placeholder={`Avenue ${idx + 1}`}
                    disabled={isAnalyzing}
                    className="flex-1 px-3.5 py-2 text-sm bg-[#111111] border border-white/10 rounded focus:outline-none focus:border-[#c5a059] text-white font-serif"
                    id={`comparison-option-input-${idx}`}
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveComparisonOption(idx)}
                    disabled={isAnalyzing}
                    className="p-1 px-2 text-rose-400 hover:bg-rose-500/10 rounded transition-all cursor-pointer"
                    title="Remove route"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Inline add comparison option */}
            <div className="flex items-center gap-3 pt-4 border-t border-white/5 border-dashed">
              <span className="w-6"></span>
              <input
                type="text"
                placeholder="Declare another avenue to compare..."
                value={newOptionName}
                onChange={(e) => setNewOptionName(e.target.value)}
                disabled={isAnalyzing}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddComparisonOption();
                  }
                }}
                id="new-option-input-field"
                className="flex-1 px-3.5 py-2 text-sm bg-[#111111] border border-dashed border-white/20 rounded text-white/90 focus:outline-none focus:border-[#c5a059]"
              />
              <button
                type="button"
                onClick={handleAddComparisonOption}
                disabled={isAnalyzing}
                id="add-option-button"
                className="px-4 py-2 bg-white/5 border border-white/15 text-white hover:bg-[#c5a059] hover:text-black hover:border-transparent rounded text-xs transition-colors flex items-center gap-1.5 cursor-pointer font-semibold"
              >
                <Plus className="w-4 h-4" />
                Add Avenue
              </button>
            </div>
          </div>
        )}

        {/* Submit */}
        <div className="pt-4">
          {isAnalyzing ? (
            <div className="w-full bg-[#111111] text-white rounded-xl p-8 border border-[#c5a059]/30 flex flex-col items-center justify-center space-y-4 pulse-border-gold transition-all" id="form-loading-state">
              <div className="relative w-10 h-10 flex items-center justify-center">
                <div className="absolute inset-0 border-2 border-white/5 rounded-full"></div>
                <div className="absolute inset-0 border-2 border-t-[#c5a059] rounded-full animate-spin"></div>
              </div>
              <div className="text-center max-w-md">
                <span className="text-[10px] font-mono tracking-[0.3em] text-[#c5a059] uppercase animate-pulse font-bold">
                  Calibrating Tiebreaker Calculus
                </span>
                <p className="text-base font-serif italic text-white mt-2 font-medium">
                  {loadingSteps[loadingStep]}
                </p>
                <p className="text-xs text-white/65 mt-1 font-sans">Evaluating weighted tradeoffs against risk factors...</p>
              </div>
            </div>
          ) : (
            <button
              type="submit"
              id="submit-decision-analysis"
              className="w-full py-4 px-6 rounded text-black font-semibold text-sm transition-all flex items-center justify-center gap-2.5 cursor-pointer bg-[#c5a059] hover:bg-[#b48e47] active:scale-[0.98] shadow-xl hover:shadow-[0_4px_25px_rgba(197,160,89,0.15)] group uppercase tracking-widest font-mono"
            >
              <Sparkles className="w-4 h-4 text-black group-hover:scale-125 transition-transform" />
              Initiate AI Decision Matrix
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
