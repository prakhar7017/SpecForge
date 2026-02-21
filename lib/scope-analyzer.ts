import type { GeneratedSpec } from "./validators";

export interface ScopeAnalysis {
  totalComplexityScore: number;
  p0Count: number;
  riskDensityScore: number;
  estimatedScope: "Small" | "Medium" | "Large";
  warnings: string[];
  suggestion: string;
}

const COMPLEXITY_WEIGHTS = { S: 1, M: 2, L: 3 } as const;

export function analyzeScope(spec: GeneratedSpec): ScopeAnalysis {
  let totalComplexityScore = 0;
  let p0Count = 0;
  const warnings: string[] = [];

  spec.userStories.forEach((story) => {
    totalComplexityScore += COMPLEXITY_WEIGHTS[story.complexity] * story.tasks.length;
    if (story.priority === "P0") {
      p0Count += story.tasks.length;
    }
  });

  const riskDensityScore = spec.risks.length + spec.unknowns.length;
  const totalTasks = spec.userStories.reduce((sum, story) => sum + story.tasks.length, 0);

  // Determine scope
  let estimatedScope: "Small" | "Medium" | "Large";
  if (totalComplexityScore <= 10) {
    estimatedScope = "Small";
  } else if (totalComplexityScore <= 25) {
    estimatedScope = "Medium";
  } else {
    estimatedScope = "Large";
  }

  // Generate warnings
  if (p0Count > totalTasks * 0.5) {
    warnings.push(`High P0 ratio: ${p0Count}/${totalTasks} tasks are critical`);
  }
  if (p0Count > 10) {
    warnings.push("Too many P0 tasks - consider splitting into phases");
  }
  if (riskDensityScore > 5) {
    warnings.push("High number of risks/unknowns identified");
  }
  if (totalComplexityScore > 30) {
    warnings.push("Large scope detected - consider breaking into phases");
  }

  // Generate suggestion
  let suggestion = "";
  if (estimatedScope === "Large" || p0Count > 10) {
    suggestion =
      "Consider splitting this into multiple phases. Start with core P0 features, then iterate.";
  } else if (estimatedScope === "Medium") {
    suggestion = "Manageable scope. Plan for 2-3 sprints with clear milestones.";
  } else {
    suggestion = "Small scope. Can likely be completed in 1-2 sprints.";
  }

  return {
    totalComplexityScore,
    p0Count,
    riskDensityScore,
    estimatedScope,
    warnings,
    suggestion,
  };
}