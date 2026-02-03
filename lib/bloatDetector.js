import { BLOAT_DATABASE } from "./bloatDatabase.js";

export function detectBloat(dependencies) {
  const bloatedDeps = [];

  for (const dep of dependencies) {
    const pattern = BLOAT_DATABASE[dep.name];

    if (pattern) {
      // Calculate savings based on the REAL detected size
      // If the real size is smaller than 2KB, it's likely tree-shaken or just a stub, so ignore it.
      if (dep.sizeKB < 2) continue;

      bloatedDeps.push({
        ...dep,
        ...pattern,
        savings: dep.sizeKB,
        savingsPercent: 100 // We assume we can remove it entirely
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
