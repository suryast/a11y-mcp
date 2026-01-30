import { AxeBuilder } from '@axe-core/playwright';
import { chromium } from 'playwright';
import type { AxeResults } from 'axe-core';
import type { AuditUrlInput } from '../types.js';
import { normalizeSelectors, resolveWcagTags } from '../utils/config.js';

export const auditUrl = async (input: AuditUrlInput): Promise<AxeResults> => {
  const { url, wait_for, wcag_level, include_selectors, exclude_selectors } = input;
  const tags = resolveWcagTags(wcag_level);

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    await page.goto(url, { waitUntil: 'domcontentloaded' });

    if (wait_for) {
      await page.waitForSelector(wait_for, { state: 'attached' });
    }

    let builder = new AxeBuilder({ page }).withTags(tags);

    normalizeSelectors(include_selectors).forEach(selector => {
      builder = builder.include(selector);
    });

    normalizeSelectors(exclude_selectors).forEach(selector => {
      builder = builder.exclude(selector);
    });

    const results = await builder.analyze();
    return results;
  } finally {
    await page.close().catch(() => undefined);
    await context.close().catch(() => undefined);
    await browser.close().catch(() => undefined);
  }
};
