import type { AxeResults } from 'axe-core';
import type { FormattedNode, FormattedResult, FormattedRule } from '../types.js';

const MAX_HTML_LENGTH = 200;

type AxeRule = AxeResults['violations'][number];
type AxeNode = AxeRule['nodes'][number];

const truncateHtml = (html: string) => {
  if (html.length <= MAX_HTML_LENGTH) {
    return html;
  }

  return `${html.slice(0, MAX_HTML_LENGTH)}...`;
};

const getNodeSummary = (node: AxeNode) => {
  if (node.failureSummary) {
    return node.failureSummary;
  }

  const messages = [node.any, node.all, node.none]
    .flat()
    .map(entry => entry.message)
    .filter(Boolean);

  if (messages.length === 0) {
    return undefined;
  }

  return messages.join(' | ');
};

const formatTarget = (target: AxeNode['target']): string[] =>
  target.map(selector => (Array.isArray(selector) ? selector.join(' ') : String(selector)));

const mapNodes = (nodes: AxeNode[]): FormattedNode[] =>
  nodes.map(node => ({
    html: truncateHtml(node.html),
    target: formatTarget(node.target),
    failureSummary: getNodeSummary(node)
  }));

const mapRules = (rules: AxeRule[]): FormattedRule[] =>
  rules.map(rule => ({
    id: rule.id,
    impact: rule.impact ?? undefined,
    description: rule.description,
    help: rule.help,
    helpUrl: rule.helpUrl,
    tags: rule.tags,
    nodes: mapNodes(rule.nodes)
  }));

export const formatAxeResults = (results: AxeResults): FormattedResult => ({
  summary: {
    violations: results.violations.length,
    passes: results.passes.length,
    incomplete: results.incomplete.length,
    inapplicable: results.inapplicable.length
  },
  violations: mapRules(results.violations),
  passes: mapRules(results.passes),
  incomplete: mapRules(results.incomplete)
});

export const formatAxeResultsMarkdown = (formatted: FormattedResult) => {
  const lines: string[] = [];

  lines.push('Summary');
  lines.push(`- violations: ${formatted.summary.violations}`);
  lines.push(`- passes: ${formatted.summary.passes}`);
  lines.push(`- incomplete: ${formatted.summary.incomplete}`);
  lines.push(`- inapplicable: ${formatted.summary.inapplicable}`);
  lines.push('');

  const addRuleSection = (title: string, rules: FormattedRule[]) => {
    if (rules.length === 0) {
      return;
    }

    lines.push(title);

    rules.forEach((rule, index) => {
      const impact = rule.impact ? `[${rule.impact}] ` : '';
      lines.push(`${index + 1}. ${impact}${rule.id} - ${rule.help}`);
      lines.push(`   - ${rule.description}`);
      lines.push(`   - ${rule.helpUrl}`);

      rule.nodes.forEach((node, nodeIndex) => {
        lines.push(`   - Node ${nodeIndex + 1}: ${node.target.join(', ')}`);
        lines.push(`     - HTML: ${node.html}`);
        if (node.failureSummary) {
          lines.push(`     - Details: ${node.failureSummary}`);
        }
      });
    });

    lines.push('');
  };

  addRuleSection('Violations', formatted.violations);
  addRuleSection('Incomplete', formatted.incomplete);
  addRuleSection('Passes', formatted.passes);

  return lines.join('\n');
};
