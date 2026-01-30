import * as z from 'zod/v4';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { auditHtml } from './tools/audit-html.js';
import { auditUrl } from './tools/audit-url.js';
import { getRules } from './tools/get-rules.js';
import { formatAxeResults, formatAxeResultsMarkdown } from './utils/formatter.js';

const server = new McpServer({
  name: 'axe-mcp',
  version: '0.1.0'
});

server.registerTool(
  'audit_url',
  {
    title: 'Audit URL',
    description: 'Run axe-core accessibility checks against a live URL.',
    inputSchema: {
      url: z.string().url().describe('URL to audit'),
      wcag_level: z.enum(['A', 'AA', 'AAA']).optional(),
      include_selectors: z.array(z.string()).optional(),
      exclude_selectors: z.array(z.string()).optional(),
      wait_for: z.string().optional()
    }
  },
  async input => {
    const results = await auditUrl(input);
    const formatted = formatAxeResults(results);
    const text = formatAxeResultsMarkdown(formatted);

    return {
      content: [{ type: 'text', text }],
      structuredContent: formatted as unknown as Record<string, unknown>
    };
  }
);

server.registerTool(
  'audit_html',
  {
    title: 'Audit HTML',
    description: 'Run axe-core accessibility checks against raw HTML.',
    inputSchema: {
      html: z.string().min(1),
      wcag_level: z.enum(['A', 'AA', 'AAA']).optional(),
      include_selectors: z.array(z.string()).optional(),
      exclude_selectors: z.array(z.string()).optional()
    }
  },
  async input => {
    const results = await auditHtml(input);
    const formatted = formatAxeResults(results);
    const text = formatAxeResultsMarkdown(formatted);

    return {
      content: [{ type: 'text', text }],
      structuredContent: formatted as unknown as Record<string, unknown>
    };
  }
);

server.registerTool(
  'get_rules',
  {
    title: 'List Rules',
    description: 'List axe-core rules, optionally filtered by tags.',
    inputSchema: {
      tags: z.union([z.string(), z.array(z.string())]).optional()
    }
  },
  async input => {
    const rules = getRules(input);

    return {
      content: [{ type: 'text', text: JSON.stringify(rules, null, 2) }],
      structuredContent: { rules }
    };
  }
);

const transport = new StdioServerTransport();

const run = async () => {
  await server.connect(transport);
};

run().catch(error => {
  console.error('Failed to start axe-mcp server:', error);
  process.exit(1);
});
