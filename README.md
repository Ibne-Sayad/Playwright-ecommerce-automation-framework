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
- Environment-based configuration with `.env` support
- Configurable Chromium, Firefox, WebKit, and mobile Chrome projects
- Tagged test execution with `@smoke`, `@regression`, and `@sanity`
- Reusable Playwright fixtures for page objects
- Accessibility checks with axe-core
- Data-driven support for reusable test credentials
- Dynamic user generation for registration flows
- Centralized constants and project configuration
- Lightweight logging utility
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
|-- config/                 # Environment, constants, and project config
|-- fixtures/               # Reusable Playwright fixtures
|-- pages/                  # Page Object Model classes
|-- test-data/              # JSON test data
|-- tests/                  # Playwright test specifications
|-- utils/                  # Shared helpers and stability utilities
|-- .env.example            # Sample local environment configuration
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

For full cross-browser execution, install all configured browsers:

```bash
npx playwright install chromium firefox webkit
```

Optional local environment setup:

```bash
cp .env.example .env
```

The default configuration runs Chromium. To opt into additional projects, set `BROWSERS` in `.env`:

```text
BROWSERS=chromium,firefox,webkit,mobile-chrome
```

## Running Tests

Run the default CI-safe test suite:

```bash
npm test
```

This excludes visual snapshot tests because screenshot baselines are platform-specific.

Run tests in headed mode:

```bash
npm run test:headed
```

Run Playwright directly:

```bash
npx playwright test
```

Run every test, including visual snapshots:

```bash
npm run test:all
```

Run tagged suites:

```bash
npm run test:smoke
npm run test:sanity
npm run test:regression
```

Run visual regression checks:

```bash
npm run test:visual
```

Visual tests use Playwright screenshot assertions against stable page components instead of full-page screenshots. This keeps baselines focused and reduces noise from dynamic ads, overlays, and third-party content. Visual snapshots are run separately from the default CI job because Playwright screenshot baselines are OS-specific.

Run accessibility checks:

```bash
npm run test:a11y
```

Accessibility tests use `@axe-core/playwright` to scan key pages. The suite records violation details as JSON attachments and fails only on critical violations so known demo-site issues can be reviewed without making the test suite permanently unusable.

Run TypeScript validation:

```bash
npm run typecheck
```

## HTML Report

Open the latest Playwright HTML report:

```bash
npm run report
```

## CI/CD

The project includes a GitHub Actions workflow at `.github/workflows/playwright.yml`.

The workflow runs on pull requests and pushes to `main` or `master`, installs dependencies, installs Playwright browsers, executes the default CI-safe test suite, and uploads the Playwright report when a failure occurs.

## Failure Artifacts

Playwright is configured to capture useful debugging artifacts on failure:

- Screenshots
- Traces
- Videos

These artifacts make it easier to inspect failures locally or from CI results.

## Stability Handling

The framework includes centralized overlay and ad handling in `utils/neutralize-ads.ts`. This helper removes or hides common consent banners, ad iframes, and overlay elements that can otherwise intercept clicks or block assertions during test execution.
