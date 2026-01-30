# axe-mcp

MCP server that runs axe-core accessibility audits.

## Setup

```bash
npm install
npx playwright install
npm run build
```

## Run

```bash
npm run start
```

## Tools

### `audit_url`

Audit a live URL using Playwright.

### `audit_html`

Audit raw HTML content using JSDOM + axe-core.

### `get_rules`

List available axe-core rules, optionally filtered by tags.
