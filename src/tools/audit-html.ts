import axe from 'axe-core';
import { JSDOM } from 'jsdom';
import type { AxeResults, RunOptions } from 'axe-core';
import type { AuditHtmlInput } from '../types.js';
import { buildSelectorContext, resolveWcagTags } from '../utils/config.js';

type AxeWindow = Window & {
  eval: (code: string) => unknown;
  axe?: {
    run: (context: Parameters<typeof axe.run>[0], options: RunOptions) => Promise<AxeResults>;
  };
};

export const auditHtml = async (input: AuditHtmlInput): Promise<AxeResults> => {
  const { html, wcag_level, include_selectors, exclude_selectors } = input;
  const dom = new JSDOM(html, { pretendToBeVisual: true, runScripts: 'dangerously' });
  const { window } = dom as unknown as { window: AxeWindow };

  if (!axe.source) {
    throw new Error('axe-core source script not available.');
  }

  window.eval(axe.source);

  if (!window.axe) {
    throw new Error('axe-core failed to initialize in JSDOM.');
  }

  try {
    const tags = resolveWcagTags(wcag_level);
    const context = buildSelectorContext(include_selectors, exclude_selectors);
    const options: RunOptions = {
      runOnly: {
        type: 'tag',
        values: tags
      }
    };
    const axeContext = (context ?? window.document) as Parameters<typeof axe.run>[0];
    const results = await window.axe.run(axeContext, options);
    return results;
  } finally {
    dom.window.close();
  }
};
