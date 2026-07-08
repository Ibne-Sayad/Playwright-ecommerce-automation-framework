import fs from 'fs';
import path from 'path';
import { DEFAULT_BASE_URL, DEFAULT_TEST_TIMEOUT, PROJECT_NAMES } from './constants';

const allowedProjectNames = new Set<string>(Object.values(PROJECT_NAMES));

function loadEnvFile(fileName = '.env') {
  const envPath = path.resolve(process.cwd(), fileName);

  if (!fs.existsSync(envPath)) return;

  const lines = fs.readFileSync(envPath, 'utf-8').split(/\r?\n/);

  for (const line of lines) {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith('#')) continue;

    const equalsIndex = trimmed.indexOf('=');
    if (equalsIndex === -1) continue;

    const key = trimmed.slice(0, equalsIndex).trim();
    const rawValue = trimmed.slice(equalsIndex + 1).trim();
    const value = rawValue.replace(/^['"]|['"]$/g, '');

    if (key && process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}

function parseBoolean(value: string | undefined, fallback: boolean) {
  if (value === undefined) return fallback;
  return ['1', 'true', 'yes', 'on'].includes(value.toLowerCase());
}

function parseNumber(value: string | undefined, fallback: number) {
  if (!value) return fallback;

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function parseProjectNames(value: string | undefined) {
  const selected = (value || PROJECT_NAMES.chromium)
    .split(',')
    .map((project) => project.trim())
    .filter(Boolean);

  const invalidProjects = selected.filter((project) => !allowedProjectNames.has(project));

  if (invalidProjects.length) {
    throw new Error(`Unsupported BROWSERS value(s): ${invalidProjects.join(', ')}`);
  }

  return selected;
}

loadEnvFile();

export const env = {
  baseURL: process.env.BASE_URL || DEFAULT_BASE_URL,
  browsers: parseProjectNames(process.env.BROWSERS),
  headless: parseBoolean(process.env.HEADLESS, true),
  retries: process.env.CI ? 2 : parseNumber(process.env.RETRIES, 0),
  testTimeout: parseNumber(process.env.TEST_TIMEOUT, DEFAULT_TEST_TIMEOUT),
  workers: process.env.CI ? 2 : parseNumber(process.env.WORKERS, 1),
  isCI: Boolean(process.env.CI)
};
