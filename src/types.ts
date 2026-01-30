export type WcagLevel = 'A' | 'AA' | 'AAA';

export interface AuditBaseInput {
  wcag_level?: WcagLevel;
  include_selectors?: string[];
  exclude_selectors?: string[];
}

export interface AuditUrlInput extends AuditBaseInput {
  url: string;
  wait_for?: string;
}

export interface AuditHtmlInput extends AuditBaseInput {
  html: string;
}

export interface GetRulesInput {
  tags?: string[] | string;
}

export interface FormattedNode {
  html: string;
  target: string[];
  failureSummary?: string;
}

export interface FormattedRule {
  id: string;
  impact?: 'critical' | 'serious' | 'moderate' | 'minor';
  description: string;
  help: string;
  helpUrl: string;
  tags?: string[];
  nodes: FormattedNode[];
}

export interface FormattedResult {
  summary: {
    violations: number;
    passes: number;
    incomplete: number;
    inapplicable: number;
  };
  violations: FormattedRule[];
  passes: FormattedRule[];
  incomplete: FormattedRule[];
}

export interface AxeRuleSummary {
  id: string;
  description: string;
  help: string;
  helpUrl: string;
  tags: string[];
}
