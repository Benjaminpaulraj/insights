#!/usr/bin/env node
/**
 * Daily Word Generator — uses the Claude CLI (`claude -p`) to generate content.
 *
 * Usage:
 *   node scripts/generate-daily-word.mjs
 *   node scripts/generate-daily-word.mjs --word "serendipity"
 *   node scripts/generate-daily-word.mjs --dry-run
 *
 * Requires: `claude` CLI installed and authenticated
 *   npm install -g @anthropic-ai/claude-code
 *   claude auth login
 *
 * In CI: set ANTHROPIC_API_KEY env var — the CLI picks it up automatically.
 */

import { spawnSync } from 'child_process';
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const BLOG_DIR = join(ROOT, 'src/content/blog');
const CONFIG_PATH = join(__dirname, 'word-config.json');

// --- CLI flags ---
const args = process.argv.slice(2);
const isDryRun = args.includes('--dry-run');
const forceWordIndex = args.indexOf('--word');
if (forceWordIndex !== -1 && !args[forceWordIndex + 1]) {
  console.error('Error: --word flag requires a value, e.g. --word "serendipity"');
  process.exit(1);
}
const forceWord = forceWordIndex !== -1 ? args[forceWordIndex + 1] : null;

// --- Load config ---
const config = JSON.parse(readFileSync(CONFIG_PATH, 'utf8'));

// --- Collect already-used words from existing blog filenames ---
function getUsedWords() {
  if (!existsSync(BLOG_DIR)) return [];
  return readdirSync(BLOG_DIR)
    .filter(f => f.match(/^\d{4}-\d{2}-\d{2}-word-/))
    .map(f =>
      f.replace(/^\d{4}-\d{2}-\d{2}-word-/, '').replace(/\.md$/, '').replace(/-/g, ' ')
    );
}

// --- Build the full prompt string ---
function buildPrompt(date, usedWords) {
  if (forceWord) {
    // Inject the forced word into the template but still use the content structure
    const contentStructure = config.userPromptTemplate.split('\n\nThe content field must follow')[1] ?? '';
    return [
      `Today is ${date}.`,
      `Write a traditional-style dictionary blog post for the word: "${forceWord}".`,
      `Return ONLY a valid JSON object (no markdown fences, no preamble) with exactly these fields:`,
      ``,
      `{`,
      `  "word": "${forceWord}",`,
      `  "title": "Word of the Day: ${forceWord}",`,
      `  "description": "one sentence (under 160 chars) explaining why this word matters today",`,
      `  "tags": ["array", "of", "3 to 5", "relevant tags"],`,
      `  "content": "full markdown blog post content"`,
      `}`,
      contentStructure ? `\nThe content field must follow${contentStructure}` : '',
    ].join('\n');
  }

  return config.userPromptTemplate
    .replace('{date}', date)
    .replace('{themes}', config.themes.join(', '))
    .replace('{examples}', config.exampleWords.join(', '))
    .replace('{usedWords}', usedWords.length > 0 ? usedWords.join(', ') : 'none yet');
}

// --- Call `claude -p` with the prompt piped via stdin ---
function runClaude(systemPrompt, userPrompt) {
  const fullPrompt = `${systemPrompt}\n\n---\n\n${userPrompt}`;

  const model = config.model || 'claude-opus-4-8';

  const result = spawnSync(
    'claude',
    ['--print', '--model', model, '--output-format', 'text'],
    {
      input: fullPrompt,
      encoding: 'utf8',
      maxBuffer: 10 * 1024 * 1024, // 10 MB
    }
  );

  if (result.error) {
    console.error('Failed to run claude CLI:', result.error.message);
    console.error('Make sure it is installed: npm install -g @anthropic-ai/claude-code');
    process.exit(1);
  }

  if (result.status !== 0) {
    console.error('claude CLI exited with error:');
    console.error(result.stderr);
    process.exit(result.status);
  }

  return result.stdout.trim();
}

// --- Parse JSON from the response (handles accidental fences) ---
function extractJSON(text) {
  const fenceMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenceMatch) return JSON.parse(fenceMatch[1].trim());
  const braceStart = text.indexOf('{');
  const braceEnd = text.lastIndexOf('}');
  if (braceStart !== -1 && braceEnd !== -1) {
    return JSON.parse(text.slice(braceStart, braceEnd + 1));
  }
  throw new Error('No JSON object found in response');
}

// --- Main ---
function main() {
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  const usedWords = getUsedWords();

  console.log(`Generating daily word for ${today}...`);
  if (usedWords.length > 0) console.log(`Skipping ${usedWords.length} already-used words.`);
  if (forceWord) console.log(`Force word: "${forceWord}"`);

  const rawText = runClaude(config.systemPrompt, buildPrompt(today, usedWords));

  let wordData;
  try {
    wordData = extractJSON(rawText);
  } catch (err) {
    console.error('Failed to parse JSON from Claude response:', err.message);
    console.error('Raw output:\n', rawText);
    process.exit(1);
  }

  // Validate required fields
  for (const field of ['word', 'title', 'description', 'content']) {
    if (!wordData[field]) {
      console.error(`Missing or empty field in response: "${field}"`);
      process.exit(1);
    }
  }
  if (!Array.isArray(wordData.tags) || wordData.tags.length === 0) {
    console.error('Missing or empty field in response: "tags"');
    process.exit(1);
  }

  const slug = wordData.word.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const filename = `${today}-word-${slug}.md`;
  const filepath = join(BLOG_DIR, filename);

  const safeTitle = wordData.title.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, ' ');
  const safeDescription = wordData.description.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, ' ');

  const markdown = `---
title: "${safeTitle}"
description: "${safeDescription}"
pubDate: "${today}"
tags: ${JSON.stringify(wordData.tags)}
---

${wordData.content.trim()}
`;

  if (isDryRun) {
    console.log('\n--- DRY RUN — file NOT written ---');
    console.log(`Would write: ${filepath}`);
    console.log('\n--- Content preview ---\n');
    console.log(markdown.slice(0, 800) + (markdown.length > 800 ? '\n...(truncated)' : ''));
  } else {
    writeFileSync(filepath, markdown, 'utf8');
    console.log(`Written: ${filepath}`);
  }

  console.log(`\nWord:  ${wordData.word}`);
  console.log(`Title: ${wordData.title}`);
  console.log(`Tags:  ${wordData.tags.join(', ')}`);
}

main();
