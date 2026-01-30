import axe from 'axe-core';
import type { AxeRuleSummary, GetRulesInput } from '../types.js';

const normalizeTags = (tags?: string[] | string) => {
  if (!tags) {
    return [];
  }

  return (Array.isArray(tags) ? tags : [tags]).map(tag => tag.trim()).filter(Boolean);
};

export const getRules = (input: GetRulesInput = {}): AxeRuleSummary[] => {
  const tags = normalizeTags(input.tags);
  const rules = axe.getRules();

  return rules
    .filter(rule => {
      if (tags.length === 0) {
        return true;
      }

      return rule.tags?.some(tag => tags.includes(tag));
    })
    .map(rule => ({
      id: rule.ruleId,
      description: rule.description,
      help: rule.help,
      helpUrl: rule.helpUrl,
      tags: rule.tags ?? []
    }));
};
