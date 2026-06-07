#!/usr/bin/env node
/**
 * HN Daily Summary Generator — fetches HackerNews front page and generates a blog post
 * using the Claude CLI (`claude --print`).
 *
 * Usage:
 *   node scripts/generate-hn-summary.mjs
 *   node scripts/generate-hn-summary.mjs --dry-run
 *   node scripts/generate-hn-summary.mjs --date 2026-06-07
 *
 * Requires: `claude` CLI installed and authenticated
 *   npm install -g @anthropic-ai/claude-code
 *
 * In CI: set ANTHROPIC_API_KEY env var — the CLI picks it up automatically.
 */

import { spawnSync } from 'child_process';
import { writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { readFileSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const BLOG_DIR = join(ROOT, 'src/content/blog');
const CONFIG_PATH = join(__dirname, 'hn-config.json');

// --- CLI flags ---
const args = process.argv.slice(2);
const isDryRun = args.includes('--dry-run');
const dateIndex = args.indexOf('--date');
const targetDate = dateIndex !== -1 ? args[dateIndex + 1] : new Date().toISOString().split('T')[0];

// --- Load config ---
const config = JSON.parse(readFileSync(CONFIG_PATH, 'utf8'));

// --- Strip HTML from HN comment text ---
function stripHTML(html) {
  if (!html) return '';
  return html
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&#x2F;/g, '/')
    .replace(/&#x27;/g, "'")
    .replace(/&gt;/g, '>')
    .replace(/&lt;/g, '<')
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, ' ')
    .trim();
}

// --- Fetch top HN front-page stories via Algolia ---
async function fetchHNStories(count) {
  const url = `https://hn.algolia.com/api/v1/search?tags=front_page&hitsPerPage=${count}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Algolia API error: ${res.status}`);
  const data = await res.json();
  return data.hits.map(hit => ({
    objectID: hit.objectID,
    title: hit.title || '(no title)',
    url: hit.url || null,
    hn_url: `https://news.ycombinator.com/item?id=${hit.objectID}`,
    score: hit.points ?? 0,
    num_comments: hit.num_comments ?? 0,
    author: hit.author || 'unknown',
  }));
}

// --- Fetch top N comments for a story ---
async function fetchTopComments(storyId, count) {
  try {
    const storyRes = await fetch(`https://hacker-news.firebaseio.com/v0/item/${storyId}.json`);
    if (!storyRes.ok) return [];
    const story = await storyRes.json();
    if (!story?.kids?.length) return [];

    const topKids = story.kids.slice(0, count);
    const comments = await Promise.all(
      topKids.map(async kid => {
        try {
          const res = await fetch(`https://hacker-news.firebaseio.com/v0/item/${kid}.json`);
          if (!res.ok) return null;
          const comment = await res.json();
          if (!comment || comment.deleted || comment.dead || !comment.text) return null;
          return {
            by: comment.by || 'anonymous',
            text: stripHTML(comment.text).slice(0, 300),
          };
        } catch {
          return null;
        }
      })
    );
    return comments.filter(Boolean);
  } catch {
    return [];
  }
}

// --- Build the prompt ---
function buildPrompt(date, stories) {
  const storiesJSON = JSON.stringify(stories, null, 2);
  return config.userPromptTemplate
    .replace('{date}', date)
    .replace('{stories}', storiesJSON);
}

// --- Call `claude --print` with prompt via stdin ---
function runClaude(systemPrompt, userPrompt) {
  const fullPrompt = `${systemPrompt}\n\n---\n\n${userPrompt}`;
  const model = config.model || 'claude-sonnet-4-6';

  const result = spawnSync(
    'claude',
    ['--print', '--model', model, '--output-format', 'text'],
    {
      input: fullPrompt,
      encoding: 'utf8',
      maxBuffer: 10 * 1024 * 1024,
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

// --- Extract JSON from response (handles accidental fences) ---
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
async function main() {
  const outputFile = join(BLOG_DIR, `${targetDate}-hn-summary.md`);

  if (existsSync(outputFile) && !isDryRun) {
    console.log(`Already generated for ${targetDate}: ${outputFile}`);
    process.exit(0);
  }

  console.log(`Fetching HN front page stories for ${targetDate}...`);
  const stories = await fetchHNStories(config.storyCount);
  console.log(`Fetched ${stories.length} stories.`);

  if (config.includeComments) {
    console.log(`Fetching top ${config.commentsPerStory} comments per story...`);
    const allComments = await Promise.all(
      stories.map(s => fetchTopComments(s.objectID, config.commentsPerStory))
    );
    stories.forEach((s, i) => { s.topComments = allComments[i]; });
  }

  console.log(`Calling Claude (${config.model})...`);
  const rawText = runClaude(config.systemPrompt, buildPrompt(targetDate, stories));

  let postData;
  try {
    postData = extractJSON(rawText);
  } catch (err) {
    console.error('Failed to parse JSON from Claude response:', err.message);
    console.error('Raw output:\n', rawText);
    process.exit(1);
  }

  for (const field of ['title', 'description', 'tags', 'content']) {
    if (!postData[field]) {
      console.error(`Missing field in response: "${field}"`);
      process.exit(1);
    }
  }

  const safeTitle = postData.title.replace(/"/g, '\\"');
  const safeDescription = postData.description.replace(/"/g, '\\"');

  const markdown = `---
title: "${safeTitle}"
description: "${safeDescription}"
pubDate: "${targetDate}"
heroImage: "${config.heroImage}"
tags: ${JSON.stringify(postData.tags)}
---

${postData.content.trim()}
`;

  if (isDryRun) {
    console.log('\n--- DRY RUN — file NOT written ---');
    console.log(`Would write: ${outputFile}`);
    console.log('\n--- Content preview ---\n');
    console.log(markdown.slice(0, 1000) + (markdown.length > 1000 ? '\n...(truncated)' : ''));
  } else {
    writeFileSync(outputFile, markdown, 'utf8');
    console.log(`Written: ${outputFile}`);
  }

  console.log(`\nTitle: ${postData.title}`);
  console.log(`Tags:  ${postData.tags.join(', ')}`);
  console.log(`Stories covered: ${stories.length}`);
}

main().catch(err => {
  console.error('Unexpected error:', err);
  process.exit(1);
});
