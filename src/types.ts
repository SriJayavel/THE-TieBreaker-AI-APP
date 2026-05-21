/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type AnalysisType = "pros_cons" | "comparison" | "swot";

export interface ProConFactor {
  text: string;
  weight: "high" | "medium" | "low";
  explanation: string;
}

export interface ProsConsResult {
  summary: string;
  pros: ProConFactor[];
  cons: ProConFactor[];
  verdict: string;
  score: number;
}

export interface CriterionOptionValue {
  optionName: string;
  score: number; // 1 to 10
  text: string;
}

export interface ComparisonCriterion {
  name: string;
  explanation: string;
  options: CriterionOptionValue[];
}

export interface ComparisonResult {
  summary: string;
  criteria: ComparisonCriterion[];
  bestOption: string;
  verdict: string;
}

export interface SWOTFactor {
  text: string;
  explanation: string;
}

export interface SwotResult {
  summary: string;
  strengths: SWOTFactor[];
  weaknesses: SWOTFactor[];
  opportunities: SWOTFactor[];
  threats: SWOTFactor[];
  verdict: string;
}

export interface Decision {
  decisionId: string;
  title: string;
  description: string;
  analysisType: AnalysisType;
  options: string[];
  category: string;
  createdAt: string;
  analysisResult: ProsConsResult | ComparisonResult | SwotResult;
}

export interface PredefinedCategory {
  id: string;
  name: string;
  iconName: string;
  color: string;
}
