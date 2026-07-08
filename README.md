# Playwright E-Commerce Automation Framework

End-to-end QA automation framework built with Playwright and TypeScript for validating core e-commerce user journeys.

## Application Under Test

https://automationexercise.com

## Tech Stack

- Playwright
- TypeScript
- Page Object Model
- JSON test data
- GitHub Actions
- Playwright HTML reporting

## Key Features

- Page Object Model structure for maintainable test code
- Data-driven support for reusable test credentials
- Dynamic user generation for registration flows
- Centralized overlay and ad handling for improved test stability
- Screenshots, traces, and videos retained on failure
- HTML test reports for local review
- CI/CD execution with GitHub Actions

## Test Coverage

- Home page load validation
- User registration entry flow
- Account creation and login with generated credentials
- Invalid login error validation
- Product search
- Product details navigation
- Add product to cart
- Remove product from cart
- Contact form submission

## Project Structure

```text
.
|-- .github/workflows/      # GitHub Actions workflow
|-- pages/                  # Page Object Model classes
|-- test-data/              # JSON test data
|-- tests/                  # Playwright test specifications
|-- utils/                  # Shared helpers and stability utilities
|-- global-setup.js         # Browser storage and consent setup
|-- playwright.config.ts    # Playwright configuration
|-- package.json            # Scripts and dependencies
`-- tsconfig.json           # TypeScript configuration
```

## Setup

Install project dependencies:

```bash
npm install
```

Install the Chromium browser used by the test project:

```bash
npx playwright install chromium
```

## Running Tests

Run the full test suite:

```bash
npm test
```

Run tests in headed mode:

```bash
npm run test:headed
```

Run Playwright directly:

```bash
npx playwright test
```

## HTML Report

Open the latest Playwright HTML report:

```bash
npm run report
```

## CI/CD

The project includes a GitHub Actions workflow at `.github/workflows/playwright.yml`.

The workflow runs on pull requests and pushes to `main` or `master`, installs dependencies, installs Playwright browsers, executes the test suite, and uploads the Playwright report when a failure occurs.

## Failure Artifacts

Playwright is configured to capture useful debugging artifacts on failure:

- Screenshots
- Traces
- Videos

These artifacts make it easier to inspect failures locally or from CI results.

## Stability Handling

The framework includes centralized overlay and ad handling in `utils/neutralize-ads.ts`. This helper removes or hides common consent banners, ad iframes, and overlay elements that can otherwise intercept clicks or block assertions during test execution.
