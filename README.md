# AI Playwright Practice

A hands-on project exploring how AI agents can assist with end-to-end test
automation using Playwright, TypeScript, and the Playwright MCP server.

The goal is to apply 10+ years of test automation experience to AI-assisted
workflows: generating tests, reviewing them critically, and measuring their quality.

## What this repo covers

- End-to-end tests for a public practice site ([SauceDemo](https://www.saucedemo.com))
- Test generation with AI agents via Playwright MCP
- Page Object Model structure and stable, role-based locators
- Human review of AI-generated tests: assertions, waits, test data, independence
- Flakiness checks with repeated runs

## Tech stack

- Playwright (TypeScript)
- Playwright MCP server
- Node.js
- An AI coding agent (for example Gemini CLI or Claude)

## Getting started

```bash
npm install
npx playwright install
npx playwright test
```

Other useful commands:

```bash
npm run test:headed        # watch the browser
npm run test:flaky-check   # run every test 10 times to look for flakiness
npm run report             # open the HTML report
```

## Project structure

```
tests/    Test specs (login, checkout)
pages/    Page objects (login, inventory, cart, checkout)
```

## Connecting Playwright MCP to an AI agent

Add this server to your agent's MCP configuration:

```json
{
  "mcpServers": {
    "playwright": { "command": "npx", "args": ["@playwright/mcp@latest"] }
  }
}
```

See [playwright.dev/agents](https://playwright.dev/agents) for current setup details.

## Review checklist for AI-generated tests

- Locators: role, label or test id, not brittle CSS/XPath
- Assertions check real outcomes, not just that an element exists
- No fixed waits (`waitForTimeout`)
- Test data is not hardcoded where it can be read from the page
- Tests are independent and can run in any order
- A deliberately broken test fails for the right reason
- Stable across 10 repeated runs

## Lessons learned

Notes on what the AI got wrong and how it was fixed will be added here.

## Notes

AI-generated tests are reviewed and corrected before being committed.
Only public practice sites and fake data are used. The credentials in the tests
are the public demo credentials published on the SauceDemo login page.
