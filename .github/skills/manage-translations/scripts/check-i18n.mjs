#!/usr/bin/env node
// Validates the translation files in src/assets/i18n against hu.yaml (the reference/fallback language)
// and checks that every literal t('...') / tList('...') key used in src/app exists. See ../SKILL.md.
//
// Run from anywhere: node .github/skills/manage-translations/scripts/check-i18n.mjs
// Exit code 1 if anything is wrong.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { load } from 'js-yaml';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../..');
const i18nDir = path.join(root, 'src/assets/i18n');
const appDir = path.join(root, 'src/app');
const serviceFile = path.join(appDir, 'shared/services/i18n.service.ts');
const REFERENCE = 'hu';

const isMapping = value => typeof value === 'object' && value !== null && !Array.isArray(value);

function flatten(object, prefix = '') {
  return Object.entries(object).flatMap(([key, value]) => {
    const fullKey = prefix + key;
    if (isMapping(value)) return flatten(value, fullKey + '.');
    if (Array.isArray(value)) return [[fullKey, `list(${value.length})`, value]];
    return [[fullKey, typeof value, value]];
  });
}

let problems = 0;
const report = message => { problems++; console.log('  ✗ ' + message); };

// 1. Every language file has exactly the keys (and value kinds / list lengths) of hu.yaml.
const files = fs.readdirSync(i18nDir).filter(file => file.endsWith('.yaml')).sort();
const languages = new Map();
for (const file of files) {
  const code = path.basename(file, '.yaml');
  try {
    const data = load(fs.readFileSync(path.join(i18nDir, file), 'utf8'));
    if (!isMapping(data)) throw new Error('top level is not a mapping');
    languages.set(code, new Map(flatten(data).map(([key, kind, value]) => [key, { kind, value }])));
  } catch (error) {
    console.log(`${file}`);
    report(`cannot be parsed: ${error.message}`);
  }
}

const reference = languages.get(REFERENCE);
if (!reference) {
  console.log(`Reference file ${REFERENCE}.yaml is missing or invalid.`);
  process.exit(1);
}

for (const [code, entries] of languages) {
  console.log(`${code}.yaml: ${entries.size} keys`);
  for (const [key, { kind }] of reference) {
    const entry = entries.get(key);
    if (!entry) report(`missing key ${key}`);
    else if (entry.kind !== kind) report(`${key} is ${entry.kind}, ${REFERENCE}.yaml has ${kind}`);
  }
  for (const [key, { kind, value }] of entries) {
    if (!reference.has(key)) report(`extra key ${key} (not in ${REFERENCE}.yaml)`);
    if (kind === 'string' && !String(value).trim()) report(`empty text ${key}`);
    if (kind !== 'string' && !kind.startsWith('list')) report(`${key} must be a text or a list of texts, found ${kind}`);
    if (Array.isArray(value)) {
      value.forEach((item, index) => {
        if (typeof item !== 'string') report(`${key}[${index}] must be a text, found ${Array.isArray(item) ? 'list' : typeof item}`);
        else if (!item.trim()) report(`empty text ${key}[${index}]`);
      });
    }
  }
}

// 2. The YAML files, the LanguageCode type and the LANGUAGES list name the same languages.
console.log('\nConfigured languages (i18n.service.ts):');
const service = fs.readFileSync(serviceFile, 'utf8');
const unionMatch = service.match(/export type LanguageCode\s*=\s*([^;]+);/);
const listMatch = service.match(/export const LANGUAGES[^=]*=\s*\[([\s\S]*?)\];/);
if (!unionMatch || !listMatch) {
  report('cannot find LanguageCode / LANGUAGES in i18n.service.ts (update this script if they moved)');
} else {
  const union = [...unionMatch[1].matchAll(/'([^']+)'/g)].map(match => match[1]).sort();
  const listed = [...listMatch[1].matchAll(/code:\s*'([^']+)'/g)].map(match => match[1]).sort();
  const yamlCodes = [...languages.keys()].sort();
  console.log(`  LanguageCode: ${union.join(', ')} | LANGUAGES: ${listed.join(', ')} | YAML files: ${yamlCodes.join(', ')}`);
  for (const code of new Set([...union, ...listed, ...yamlCodes])) {
    if (!union.includes(code)) report(`${code} is missing from the LanguageCode type`);
    if (!listed.includes(code)) report(`${code} is missing from LANGUAGES`);
    if (!yamlCodes.includes(code)) report(`src/assets/i18n/${code}.yaml is missing`);
  }
}

// 3. Keys referenced from code exist in the reference language.
const sourceFiles = [];
const walk = dir => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (/\.(html|ts)$/.test(entry.name) && !entry.name.endsWith('.spec.ts')) sourceFiles.push(full);
  }
};
walk(appDir);

console.log('\nKeys used in src/app:');
const dynamic = [];
let used = 0;
for (const file of sourceFiles) {
  const source = fs.readFileSync(file, 'utf8');
  for (const match of source.matchAll(/\b(t|tList)\(\s*(['"])([^'"]+)\2\s*(\+)?/g)) {
    const [, fn, , key, concatenated] = match;
    const relative = path.relative(root, file);
    if (concatenated) {
      dynamic.push(`${relative}: ${fn}('${key}' + ...)`);
      continue;
    }
    used++;
    const entry = reference.get(key);
    if (!entry) report(`${relative}: ${fn}('${key}') does not exist in ${REFERENCE}.yaml`);
    else if (fn === 't' && entry.kind !== 'string') report(`${relative}: t('${key}') is a list, use tList()`);
    else if (fn === 'tList' && !entry.kind.startsWith('list')) report(`${relative}: tList('${key}') is not a list, use t()`);
  }
}
console.log(`  ${used} literal keys checked`);
if (dynamic.length) {
  console.log('  Built at runtime (check these prefixes by hand):');
  dynamic.forEach(line => console.log('    ' + line));
}

console.log(problems ? `\n${problems} problem(s) found.` : '\nAll translation files are consistent.');
process.exit(problems ? 1 : 0);
