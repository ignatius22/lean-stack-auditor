import { BLOAT_DATABASE } from "./bloatDatabase.js";

export function detectBloat(dependencies) {
  const bloatedDeps = [];

  for (const dep of dependencies) {
    const pattern = BLOAT_DATABASE[dep.name];

    if (pattern) {
      bloatedDeps.push({
        ...dep,
        ...pattern,
        savings: dep.sizeKB,
        savingsPercent:
          pattern.estimatedUsage < 100 ? 100 - pattern.estimatedUsage : 0,
      });
    }
  }

  return bloatedDeps.sort((a, b) => {
    // Sort by priority first, then size
    const priorityOrder = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };
    const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];

    if (priorityDiff !== 0) return priorityDiff;
    return b.savings - a.savings;
  });
}
