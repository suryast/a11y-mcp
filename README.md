# a11y-mcp

An MCP (Model Context Protocol) server that enables AI assistants to run automated accessibility audits using [axe-core](https://github.com/dequelabs/axe-core).

## What is this?

This MCP server allows AI assistants (like Claude in Cursor) to:

- Audit live web pages for accessibility issues
- Audit raw HTML content for accessibility violations
- Query available axe-core rules by WCAG level

Results are returned in a structured format with WCAG violation details, affected elements, and remediation guidance.

## Setup

```bash
# Install dependencies
npm install

# Install Playwright browsers (required for URL auditing)
npx playwright install chromium

# Build the TypeScript
npm run build
```

## Cursor Configuration

Add to your `~/.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "axe-mcp": {
      "command": "node",
      "args": ["/path/to/a11y-mcp/dist/index.js"]
    }
  }
}
```

Restart Cursor after updating the configuration.

## Available Tools

### `audit_url`

Audits a live URL by launching a headless Chromium browser.

**Parameters:**
- `url` (required) - URL to audit
- `wcag_level` - WCAG conformance level: `A`, `AA` (default), or `AAA`
- `include_selectors` - CSS selectors to include in the audit
- `exclude_selectors` - CSS selectors to exclude from the audit
- `wait_for` - CSS selector to wait for before auditing

### `audit_html`

Audits raw HTML content using JSDOM (no browser required).

**Parameters:**
- `html` (required) - HTML content to audit
- `wcag_level` - WCAG conformance level: `A`, `AA` (default), or `AAA`
- `include_selectors` - CSS selectors to include in the audit
- `exclude_selectors` - CSS selectors to exclude from the audit

### `get_rules`

Lists available axe-core rules.

**Parameters:**
- `tags` - Filter rules by tags (e.g., `wcag2a`, `wcag21aa`, `best-practice`)

## Example Usage

Ask your AI assistant:

> "Audit https://example.com for accessibility issues"

> "Check this HTML for WCAG AA violations: `<button><img src='icon.png'></button>`"

> "What axe-core rules check for WCAG 2.1 AA compliance?"

## License

MPL-2.0 - See [LICENSE](LICENSE)

This project uses [axe-core](https://github.com/dequelabs/axe-core) which is licensed under MPL-2.0.
