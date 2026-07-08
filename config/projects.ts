import { devices, type Project } from '@playwright/test';
import { PROJECT_NAMES } from './constants';

const projectDefinitions: Record<string, Project> = {
  [PROJECT_NAMES.chromium]: {
    name: PROJECT_NAMES.chromium,
    use: { ...devices['Desktop Chrome'] }
  },
  [PROJECT_NAMES.firefox]: {
    name: PROJECT_NAMES.firefox,
    use: { ...devices['Desktop Firefox'] }
  },
  [PROJECT_NAMES.webkit]: {
    name: PROJECT_NAMES.webkit,
    use: { ...devices['Desktop Safari'] }
  },
  [PROJECT_NAMES.mobileChrome]: {
    name: PROJECT_NAMES.mobileChrome,
    use: { ...devices['Pixel 5'] }
  }
};

export function buildProjects(selectedProjects: string[]) {
  return selectedProjects.map((projectName) => projectDefinitions[projectName]);
}
