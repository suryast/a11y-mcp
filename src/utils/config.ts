import type { WcagLevel } from '../types.js';

const WCAG_TAGS: Record<WcagLevel, string[]> = {
  A: ['wcag2a', 'wcag21a', 'wcag22a'],
  AA: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22a', 'wcag22aa'],
  AAA: ['wcag2a', 'wcag2aa', 'wcag2aaa', 'wcag21a', 'wcag21aa', 'wcag21aaa', 'wcag22a', 'wcag22aa']
};

export const resolveWcagTags = (level?: WcagLevel): string[] => {
  if (!level) {
    return WCAG_TAGS.AA;
  }

  return WCAG_TAGS[level];
};

export const normalizeSelectors = (selectors?: string[]): string[] => {
  if (!selectors || selectors.length === 0) {
    return [];
  }

  return selectors.map(selector => selector.trim()).filter(Boolean);
};

export const buildSelectorContext = (includeSelectors?: string[], excludeSelectors?: string[]) => {
  const include = normalizeSelectors(includeSelectors).map(selector => [selector]);
  const exclude = normalizeSelectors(excludeSelectors).map(selector => [selector]);

  if (include.length === 0 && exclude.length === 0) {
    return null;
  }

  return {
    ...(include.length > 0 ? { include } : {}),
    exclude
  };
};
