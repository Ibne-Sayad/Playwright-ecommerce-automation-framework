# Playwright Automation Portfolio

This project is a GitHub-ready Playwright + TypeScript end-to-end automation framework for automationexercise.com.

## Tech Stack
- Playwright
- TypeScript
- Page Object Model
- Data-driven testing
- GitHub Actions CI
- HTML reporting
- Screenshots, traces, and videos on failure

## Project Structure
- tests/ - end-to-end test scenarios
- pages/ - page object model classes
- test-data/ - JSON test data templates
- utils/ - helper utilities
- .github/workflows/ - CI configuration

## Setup
1. Install dependencies:
   ```bash
   npm install
   ```
2. Install Playwright browsers:
   ```bash
   npx playwright install chromium
   ```

## Run Tests
- Run all tests:
  ```bash
  npm test
  ```
- Run tests in headed mode:
  ```bash
  npm run test:headed
  ```
- Open the HTML report:
  ```bash
  npm run report
  ```

## Coverage
- Home page loads successfully
- User registration with generated test data
- Login with valid credentials
- Login with invalid credentials
- Product search
- View product details
- Add product to cart
- Remove product from cart
- Contact us form submission

## Suggested commit plan
1. Initialize Playwright TypeScript project
2. Add base configuration and test data utilities
3. Add Page Object Model classes
4. Add authentication test scenarios
5. Add product and cart test scenarios
6. Add contact form test scenario
7. Add GitHub Actions workflow
8. Add final README documentation
