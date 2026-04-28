---
title: "How Claude's Memory Works — A Simple Guide to Context Management"
description: "Claude has a 200K token 'working memory'. Learn how to use it smarter with 11 practical strategies, explained in plain English with clear visuals."
pubDate: "Apr 27 2026"
heroImage: "../../assets/blog-placeholder-3.jpg"
---

> **Reading time: ~15 minutes**

---

## TL;DR — The 5 Things You Need to Know

> 🔑 **Before you dive in, here's the short version:**
>
> 1. Claude has a **200,000 token "working memory"** — big, but not infinite
> 2. Every conversation starts **completely fresh** — Claude remembers nothing from last time
> 3. You can fake long-term memory using **CLAUDE.md files and Skills**
> 4. Loading too much into context at once makes Claude **worse**, not better
> 5. The 11 strategies below help you **stay under the limit and get better answers**

---

## Table of Contents

- [What Is Claude Really Doing?](#what-is-claude-really-doing)
- [Brain vs Claude — A Side-by-Side Look](#brain-vs-claude)
- [What Claude Cannot Do](#what-claude-cannot-do)
- [What Claude Is Surprisingly Good At](#what-claude-is-good-at)
- [Your 200K Token Budget — Visualized](#your-200k-token-budget)
- [11 Strategies to Master Context](#11-strategies)
  - [1. Markdown Files — Your Notebook](#1-markdown-files)
  - [2. CLAUDE.md — The Daily Briefing](#2-claudemd)
  - [3. Skills — Muscle Memory for Claude](#3-skills)
  - [4. Built-in Tools — Claude's Hands](#4-built-in-tools)
  - [5. MCP Servers — Speed Dial Experts](#5-mcp-servers)
  - [6. Prompt Caching — Stop Paying Twice](#6-prompt-caching)
  - [7. Hooks — Set It and Forget It](#7-hooks)
  - [8. Extended Thinking — Slow Down to Speed Up](#8-extended-thinking)
  - [9. Sub-Agents — Divide and Conquer](#9-sub-agents)
  - [10. Plan vs Edit Mode — Think Before You Type](#10-plan-vs-edit-mode)
  - [11. RAG — Smart Search, Not Brute Force](#11-rag)
- [Real Example: Context Done Wrong vs Right](#real-example)
- [The Golden Rules](#golden-rules)
- [The Human–Claude Partnership](#the-partnership)
- [Your Next Steps](#your-next-steps)

---

## What Is Claude Really Doing? {#what-is-claude-really-doing}

Imagine hiring a brilliant contractor who has read **every programming book, forum post, and open-source project** ever written. They show up on day one knowing everything they learned. But here's the catch:

- They cannot learn anything new after training
- They forget everything when they leave for the day
- Their desk only fits a certain amount of paperwork at once

That's Claude. It's not "thinking" the way you do. It's doing **pattern matching at massive scale** — predicting what helpful text comes next based on billions of examples it was trained on.

> 🔑 **Key Insight:** Claude doesn't understand your code the way a senior engineer does. It recognizes patterns that look similar to what it has seen before. That's still incredibly powerful — but it explains *why* context management matters so much.

---

## Brain vs Claude — A Side-by-Side Look {#brain-vs-claude}

```
┌──────────────────────────────┬──────────────────────────────────┐
│       🧠 Human Brain         │          🤖 Claude               │
├──────────────────────────────┼──────────────────────────────────┤
│ Working memory: ~7 items     │ Context window: 200K tokens      │
│ at once                      │ (~150,000 words, ~500 pages)     │
├──────────────────────────────┼──────────────────────────────────┤
│ Unlimited long-term storage  │ Fixed knowledge from training    │
│                              │ (no updates after cutoff)        │
├──────────────────────────────┼──────────────────────────────────┤
│ Remembers every conversation │ Forgets everything when session  │
│ with you                     │ ends                             │
├──────────────────────────────┼──────────────────────────────────┤
│ Creates new ideas and        │ Combines existing patterns —     │
│ concepts from scratch        │ no true "new" understanding      │
├──────────────────────────────┼──────────────────────────────────┤
│ Learns and adapts over time  │ Static — same model until        │
│                              │ Anthropic releases an update     │
├──────────────────────────────┼──────────────────────────────────┤
│ True creativity              │ Probabilistic output             │
│                              │ (very good guessing)             │
└──────────────────────────────┴──────────────────────────────────┘
```

### What is a "token"?

A token is roughly **4 characters** of text. So:

```
1 token      ≈  4 characters   (e.g., " the")
1,000 tokens ≈  750 words
200K tokens  ≈  150,000 words  ≈  500 pages of text
```

An average code file is **500–2,000 tokens**. A big React component is around **300–800 tokens**.

---

## What Claude Cannot Do {#what-claude-cannot-do}

This is not a criticism — knowing the limits makes you a better driver.

| Limitation | Plain English |
|---|---|
| No real-time learning | What you tell Claude today won't be remembered tomorrow |
| No lasting memory | Every session is day one for Claude |
| Probabilistic reasoning | It guesses well, but can't guarantee mathematical accuracy |
| No code execution (without tools) | It can write code but can't run it to check if it works |
| No web access (without tools) | It can't Google something on its own |
| Context window limit | If you feed it too much, the oldest info literally disappears |
| No causal understanding | It knows correlation ("X often happens with Y") but not causation ("X causes Y") |

> 💡 **Pro Tip:** Every one of these limitations has a workaround. See the 11 strategies below — each one is designed to patch a specific gap.

---

## What Claude Is Surprisingly Good At {#what-claude-is-good-at}

| Strength | Why It Matters |
|---|---|
| Pattern recognition at scale | Has seen millions of code examples — spots issues instantly |
| Code generation & completion | Write boilerplate in seconds, not minutes |
| Refactoring | Transform messy code into clean code consistently |
| Explanation & documentation | Explain complex things at any level you need |
| Summarization | Turn 50 pages into 5 bullet points |
| Consistency across large codebases | Apply the same standards everywhere, every time |
| Rapid prototyping | Get a working MVP skeleton in minutes |
| Multi-language proficiency | Switches between Python, TypeScript, Go, SQL effortlessly |
| 24/7 availability | Never tired, never bored, never in a bad mood |
| Objective code reviews | No ego, no office politics |

> 🔑 **Key Insight:** Use Claude for what it does better than humans. Use *your* brain for what humans do better than Claude — strategy, judgment, creativity, and final sign-off.

---

## Your 200K Token Budget — Visualized {#your-200k-token-budget}

Think of your 200K token context window like RAM on a computer. Load too much, and everything slows down or breaks. Here's the recommended breakdown:

```
YOUR 200K TOKEN BUDGET
══════════════════════════════════════════════════════

🟢 Project Context              ████░░░░░░░░░░░░░░░░░  20K
   What goes here:
   • CLAUDE.md file (tech stack, conventions)
   • Current sprint goals
   • Architecture overview

🔵 Active Work Files            ████████░░░░░░░░░░░░░  50K
   What goes here:
   • Files you're currently editing
   • Related test files
   • Recent changes

🟣 Conversation History         █████████████░░░░░░░░  80K
   What goes here:
   • Your questions and Claude's replies
   • Code generated this session
   • Debugging back-and-forth

🔴 Reserve Buffer               ████████░░░░░░░░░░░░░  50K
   What goes here:
   • Tool outputs and error messages
   • Search results
   • Room for unexpected expansions

══════════════════════════════════════════════════════
Total: 200K tokens
```

> ⚠️ **Watch Out:** When context fills up, Claude starts "forgetting" things from earlier in the conversation. Signs this is happening: Claude repeats itself, gives vague answers, or ignores things you mentioned earlier.

---

## 11 Strategies to Master Context {#11-strategies}

### 1. Markdown Files — Your Notebook {#1-markdown-files}

**What is it?** Simple text files with formatting. You've probably seen README.md files on GitHub.

**The analogy:** Markdown files are like your personal notebooks. You don't carry all your notebooks everywhere, but you know exactly where to find the right one.

**Why it works for context management:** Instead of pasting your project's architecture into every chat, you write it in a file once. Claude can read that file when it needs the info — saving context space the rest of the time.

**Common files to create:**

```
your-project/
├── README.md           ← Big picture: what this project is
├── DECISIONS.md        ← Why you made important choices
├── CONVENTIONS.md      ← Your coding rules and style
├── TROUBLESHOOTING.md  ← Common bugs and how to fix them
└── CLAUDE.md           ← Special file just for Claude (see next section)
```

**What to put in each:**

| File | Contents |
|---|---|
| `README.md` | Project overview, how to run locally, folder structure |
| `DECISIONS.md` | "We chose PostgreSQL over MongoDB because..." |
| `CONVENTIONS.md` | Naming rules, formatting rules, patterns to follow |
| `TROUBLESHOOTING.md` | "If you see error X, do Y" |

> 🎯 **Quick Action:** Create a `DECISIONS.md` file right now. Write down the last big technical choice you made and *why*. Future Claude (and future you) will thank you.

---

### 2. CLAUDE.md — The Daily Briefing {#2-claudemd}

**What is it?** A special file placed at the root of your project. Claude Code reads it automatically every single time you start a session.

**The analogy:** Imagine leaving a detailed sticky note on your desk every morning. When you sit down, you instantly know what's going on — no need to re-read yesterday's emails. CLAUDE.md is that sticky note, but for Claude.

**Where to put it:**

```
your-project/
└── CLAUDE.md    ← Here! At the very top level of your project
```

Also works globally at: `~/.claude/CLAUDE.md` (for preferences across all projects)

**Template to copy and fill in:**

```markdown
# Project: [Your Project Name]

## Tech Stack
- Backend: [e.g., FastAPI + PostgreSQL]
- Frontend: [e.g., React + TypeScript]
- Auth: [e.g., JWT]

## Coding Conventions
- [e.g., Use async/await for all database operations]
- [e.g., Follow PEP 8 for Python files]
- [e.g., Functional components only in React]

## Common Commands
- Start dev server: `npm run dev`
- Run tests: `pytest -v`
- Apply DB migrations: `alembic upgrade head`

## Current Focus
- Working on: [current file or feature]
- Last change: [brief description]
- Next task: [what comes next]

## Important Rules
- Never commit .env files
- All migrations need team review before merging
```

> 💡 **Pro Tip:** Update the "Current Focus" section at the end of each work session. This is how you create continuity across conversations even though Claude has no real memory.

---

### 3. Skills — Muscle Memory for Claude {#3-skills}

**What is it?** A folder of documented procedures. Each "skill" is a step-by-step guide for a task Claude might need to repeat.

**The analogy:** Skills are like muscle memory. Once a pianist knows how to play a scale, they don't think about each finger — they just execute. Skills work the same way: document a process once, then Claude runs it without you re-explaining every time.

**Where to store skills:**

```
your-project/
└── .claude/
    └── skills/
        ├── deploy-to-production/
        │   └── SKILL.md
        ├── run-test-suite/
        │   └── SKILL.md
        └── create-new-feature/
            └── SKILL.md
```

**Example skill file:**

```markdown
---
name: deploy-to-production
description: Safe, step-by-step production deployment
---

# Production Deployment

## Before You Start
- [ ] All tests passing
- [ ] Code reviewed and approved
- [ ] Staging environment validated

## Steps
1. Create release branch: `git checkout -b release/v1.x.x`
2. Update version: edit `package.json`
3. Build: `npm run build`
4. Deploy to staging: `./scripts/deploy-staging.sh`
5. Run smoke tests — check the 3 critical user flows
6. Deploy to production: `./scripts/deploy-prod.sh`
7. Watch logs for 15 minutes
8. Tag release: `git tag v1.x.x && git push --tags`

## If Something Goes Wrong
1. `./scripts/rollback.sh [previous-version]`
2. Notify team in Slack #incidents
3. Write an incident report in docs/incidents/
```

> 🎯 **Quick Action:** Think of the last task you had to explain to Claude twice. Write it as a skill file. Next time, just say "follow the deploy-to-production skill."

---

### 4. Built-in Tools — Claude's Hands {#4-built-in-tools}

**What is it?** Claude Code comes with built-in tools that let Claude *do things*, not just talk about them.

**The analogy:** Imagine hiring a consultant who can only talk — versus one who can also read your files, run your tests, and search your code. The second one is obviously more useful. Tools are what make Claude the second type.

**The tools and what they do:**

```
┌─────────────────┬──────────────────────────────────────────────┐
│   Tool Name     │ What It Does                                 │
├─────────────────┼──────────────────────────────────────────────┤
│ Read            │ Opens and reads a file                       │
│ Edit            │ Makes a precise change to a specific line    │
│ Write           │ Creates a brand-new file                     │
│ Bash            │ Runs any terminal command (tests, git, etc.) │
│ Grep            │ Searches code for a word or pattern          │
│ Glob            │ Finds files matching a pattern (e.g., *.ts)  │
│ WebFetch        │ Reads a webpage (for docs, APIs, etc.)       │
│ WebSearch       │ Searches the web                             │
└─────────────────┴──────────────────────────────────────────────┘
```

**The smart workflow pattern:**

```
Step 1: UNDERSTAND  → Grep to find the code, Read to open it
Step 2: ANALYZE     → Bash to run tests and see the error
Step 3: FIX         → Edit to apply the targeted change
Step 4: VERIFY      → Bash to run tests again and confirm they pass
```

> 🔑 **Key Insight:** Tools let Claude gather *current, real* information instead of guessing. Always prefer "run the test and show me the output" over "what do you think might be wrong?"

---

### 5. MCP Servers — Speed Dial Experts {#5-mcp-servers}

**What is it?** MCP stands for Model Context Protocol. These are plug-ins that connect Claude to external services — databases, GitHub, Slack, Google Drive, and more.

**The analogy:** MCP servers are experts on speed dial. You don't memorize everything a doctor, lawyer, or accountant knows. You just call them when you need them. MCP servers work the same way — Claude calls them when it needs live, external information.

**Common MCP servers:**

```
┌───────────────────┬──────────────────────────────────────────┐
│   MCP Server      │ What Claude Can Do With It               │
├───────────────────┼──────────────────────────────────────────┤
│ 💾 Database MCP   │ Query your database, inspect schemas,    │
│                   │ analyze slow queries                      │
├───────────────────┼──────────────────────────────────────────┤
│ 🐙 GitHub MCP     │ Create issues & PRs, search repos,       │
│                   │ read commit history                       │
├───────────────────┼──────────────────────────────────────────┤
│ 💬 Slack MCP      │ Send messages, read channels,            │
│                   │ create notifications                      │
├───────────────────┼──────────────────────────────────────────┤
│ 📁 Google Drive   │ Read documents, search files,            │
│                   │ write meeting notes                       │
├───────────────────┼──────────────────────────────────────────┤
│ 🏢 Custom MCP     │ Connect to your internal APIs,           │
│                   │ legacy systems, company tools             │
└───────────────────┴──────────────────────────────────────────┘
```

**Context management benefit:** Without MCP, you'd have to paste your entire database schema into the chat (thousands of tokens). With a Database MCP, Claude queries only what it needs — saving all that context space.

> 💡 **Pro Tip:** If you find yourself copy-pasting the same external data into Claude every session (a schema, a dashboard, a doc), that's a sign you need an MCP server.

---

### 6. Prompt Caching — Stop Paying Twice {#6-prompt-caching}

**What is it?** When you use the Claude API, you can tell it to "remember" a large block of text for 5 minutes. If you send another request in that window, Claude skips re-processing that block — and you pay only 10% of the normal cost for it.

**The analogy:** Imagine photocopying a 100-page manual. If 10 different people need it today, you make one photocopy and share it — you don't print 10 separate copies. Prompt caching works the same way.

**When to cache vs when not to:**

```
┌─────────────────────────────────────┬──────────┐
│ Content                             │ Cache?   │
├─────────────────────────────────────┼──────────┤
│ System prompt + conventions         │ ✅ Yes   │
│ (sent with every message)           │          │
├─────────────────────────────────────┼──────────┤
│ Large codebase loaded for analysis  │ ✅ Yes   │
│ (referenced many times)             │          │
├─────────────────────────────────────┼──────────┤
│ Documentation blocks                │ ✅ Yes   │
│ (referenced across many turns)      │          │
├─────────────────────────────────────┼──────────┤
│ The user's question this turn       │ ❌ No    │
│ (changes every message)             │          │
└─────────────────────────────────────┴──────────┘
```

**The cost savings are real:**

```
Without caching:
  100K tokens × 10 requests = 1,000,000 tokens billed

With caching:
  First request:  100K tokens (full price)
  Next 9 requests: 100K × 10% each = 90K tokens total
  Total billed: 100K + 90K = 190K tokens
  Savings: ~81% on that context block
```

**How to mark something as cacheable (in the API):**

```python
{
    "type": "text",
    "text": your_large_context_here,
    "cache_control": {"type": "ephemeral"}
}
```

> 🎯 **Quick Action:** If you're building an app on the Claude API and you send the same system prompt every time, add `"cache_control": {"type": "ephemeral"}` to that block. The savings add up fast.

---

### 7. Hooks — Set It and Forget It {#7-hooks}

**What is it?** Hooks are shell commands that run automatically when Claude Code does something specific. You configure them once in a settings file, and they just work — every time, without you asking.

**The analogy:** Think of hooks like the rules on your kitchen timer. "When 20 minutes pass, ring the bell." Hooks say "when Claude edits a file, run the linter." No need to remember. No need to ask Claude to do it.

**The four hook types:**

```
When Claude...               →  Your hook runs
─────────────────────────────────────────────────
...is about to call a tool   →  PreToolUse hook
...finishes calling a tool   →  PostToolUse hook
...finishes its response     →  Stop hook
...sends you a notification  →  Notification hook
```

**Example: Auto-lint every time Claude edits a file**

Create/edit `.claude/settings.json`:

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit",
        "hooks": [
          {
            "type": "command",
            "command": "npm run lint --fix"
          }
        ]
      }
    ],
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "osascript -e 'display notification \"Claude finished\" with title \"Claude Code\"'"
          }
        ]
      }
    ]
  }
}
```

**Practical uses:**

- Auto-format code after every edit (no more "run prettier" reminders)
- Run tests automatically after code changes
- Get a desktop notification when a long task finishes
- Log every tool call for security auditing
- Block dangerous commands (like `rm -rf`) before they run

> ⚠️ **Watch Out:** Don't ask Claude to "remember to run lint after each edit." Claude has no persistent memory — it will forget. Use a hook instead. Hooks are reliable. Requests to "remember" are not.

---

### 8. Extended Thinking — Slow Down to Speed Up {#8-extended-thinking}

**What is it?** Extended Thinking gives Claude a private "scratch pad" to reason through a problem before giving you its final answer. Think of it as Claude taking a moment to think before speaking.

**The analogy:** Imagine asking a junior developer vs a senior developer the same hard question. The junior blurts out an answer immediately. The senior pauses, thinks it through, considers edge cases — and then gives you a much better answer. Extended Thinking makes Claude behave like the senior.

**When to use it:**

```
✅ Use Extended Thinking for:
   • Complex bugs where multiple systems interact
   • Architecture decisions with many trade-offs
   • Security analysis of intricate code
   • Algorithm design and optimization problems
   • Any "what should we do?" question where the stakes are high

❌ Skip it for:
   • Quick bug fixes with obvious causes
   • Writing boilerplate code
   • Simple documentation updates
   • "What does this function do?"
```

**How to trigger it in Claude Code (just say it):**

```
"Think carefully before responding:
 What are the architectural trade-offs between
 approach A and approach B for our auth system?"
```

**How to enable it via API:**

```python
response = client.messages.create(
    model="claude-opus-4-7",
    max_tokens=16000,
    thinking={
        "type": "enabled",
        "budget_tokens": 10000  # how much "scratch pad" space
    },
    messages=[{"role": "user", "content": your_question}]
)
```

> 🔑 **Key Insight:** Extended Thinking uses more tokens and takes longer. It's not for every task. Save it for the decisions that matter — architecture, security, complex bugs.

> 💡 **Pro Tip:** The best model for Extended Thinking is **Claude Opus 4.7**. It's the most capable at deep multi-step reasoning.

---

### 9. Sub-Agents — Divide and Conquer {#9-sub-agents}

**What is it?** Instead of doing everything in one conversation, Claude can spin up separate "helper agents" — each with their own fresh 200K context window — to work on parts of a big task in parallel.

**The analogy:** Imagine one doctor trying to give every patient in a hospital a checkup in a single day. Now imagine the same hospital with 10 doctors working simultaneously. Sub-agents are the 10 doctors.

**How sub-agents work:**

```
                   ┌─────────────────┐
                   │   Main Agent    │
                   │  (orchestrator) │
                   └────────┬────────┘
                            │ spawns
             ┌──────────────┼──────────────┐
             │              │              │
    ┌────────▼────┐ ┌───────▼─────┐ ┌────▼────────┐
    │  Sub-Agent  │ │  Sub-Agent  │ │  Sub-Agent  │
    │  "Audit the │ │  "Audit the │ │  "Audit the │
    │  auth code" │ │  payments   │ │  API layer" │
    │             │ │  module"    │ │             │
    └────────┬────┘ └───────┬─────┘ └────┬────────┘
             │              │              │
             └──────────────┼──────────────┘
                            │ results
                   ┌────────▼────────┐
                   │   Main Agent    │
                   │ synthesizes all │
                   │    findings     │
                   └─────────────────┘
```

**Why this matters for context management:**

Without sub-agents: All that exploratory searching, file reading, and intermediate work fills up your main context window — leaving less room for the actual answers.

With sub-agents: The messy exploratory work stays inside each sub-agent's isolated context. Your main conversation stays clean.

**Best use cases:**
- Auditing multiple modules simultaneously
- Running independent analyses that don't depend on each other
- Delegating a well-defined research task
- Processing multiple documents or files in parallel

> 🎯 **Quick Action:** Next time you have a task like "review all 5 modules for security issues," ask Claude to use sub-agents for each module. You'll get faster results and a cleaner main conversation.

---

### 10. Plan vs Edit Mode — Think Before You Type {#10-plan-vs-edit-mode}

**What is it?** Two different ways Claude approaches a task:

- **Plan Mode** — Claude analyzes first, creates a written plan, and waits for your approval before touching any code
- **Edit Mode** — Claude immediately makes targeted changes to specific files

**The analogy:** Plan Mode is like drawing blueprints before construction. Edit Mode is like a painter touching up a wall. You don't need blueprints to repaint a room. But you absolutely need blueprints before knocking down walls.

**Visual comparison:**

```
PLAN MODE                          EDIT MODE
─────────────────────────────────  ──────────────────────────────────
Use when: New features,            Use when: Bug fixes,
          refactoring,                       small tweaks,
          architecture changes               doc updates

What happens:                      What happens:
1. Claude reads your codebase       1. Claude reads the specific file
2. Creates implementation_plan.md   2. Makes the precise edit
3. Lists risks and dependencies     3. Done
4. WAITS for your approval
5. Then implements phase by phase

Speed: Slower (System 2 thinking)  Speed: Fast (System 1 thinking)
Approval required: Yes             Approval: Optional
```

**When Plan Mode saves you:**

Imagine asking Claude to "add caching to the API." Without Plan Mode, Claude might add caching in 3 different places using 3 different approaches — creating inconsistency and bugs.

With Plan Mode, Claude first maps every place caching touches, picks one approach, gets your sign-off, then implements it consistently everywhere.

> ⚠️ **Watch Out:** Never use Edit Mode for architecture-level changes. If the change touches more than 3 files or affects how different parts of your system connect, use Plan Mode first.

---

### 11. RAG — Smart Search, Not Brute Force {#11-rag}

**What is it?** RAG stands for Retrieval-Augmented Generation. In simple terms: instead of loading your *entire* codebase into the context window, Claude first *searches* for only the relevant files, then loads just those.

**The analogy:** Imagine a library with 10,000 books. You could carry all 10,000 to your desk. Or you could search the catalog, find the 5 books you actually need, and carry just those. RAG is the catalog search.

**How RAG works step by step:**

```
You ask: "How does authentication work in this project?"
                        │
                        ▼
           ┌────────────────────────┐
           │   Your question gets   │
           │   turned into a vector │
           │   (a mathematical      │
           │   fingerprint)         │
           └────────────┬───────────┘
                        │
                        ▼
           ┌────────────────────────┐
           │   Vector database      │
           │   scans all your files │
           │   for similar patterns │
           └────────────┬───────────┘
                        │ finds the 5 closest matches
                        ▼
           ┌────────────────────────┐
           │   Loads just those     │◄── 5K tokens instead
           │   5 files into context │    of 60K tokens
           └────────────┬───────────┘
                        │
                        ▼
           ┌────────────────────────┐
           │   Claude analyzes      │
           │   focused, relevant    │
           │   context              │
           └────────────┬───────────┘
                        │
                        ▼
     ✅ Accurate, focused answer
        195K tokens still available
```

**When do you need RAG?**

```
┌──────────────────────┬──────────┬─────────────────────────────┐
│ Project Size         │ Use RAG? │ Why                         │
├──────────────────────┼──────────┼─────────────────────────────┤
│ Small (< 20 files)   │ No       │ Everything fits easily      │
├──────────────────────┼──────────┼─────────────────────────────┤
│ Medium (20-100 files)│ Yes      │ Selective loading saves      │
│                      │          │ significant context          │
├──────────────────────┼──────────┼─────────────────────────────┤
│ Large (100+ files)   │ Essential│ Only practical option        │
├──────────────────────┼──────────┼─────────────────────────────┤
│ Documentation search │ Yes      │ Find answers without reading │
│                      │          │ everything                   │
├──────────────────────┼──────────┼─────────────────────────────┤
│ Legacy codebase      │ Essential│ Navigate unfamiliar code     │
└──────────────────────┴──────────┴─────────────────────────────┘
```

**Popular tools to set up RAG:**

| Tool | Type | Best For |
|---|---|---|
| ChromaDB | Open-source, runs locally | Small to medium projects, getting started |
| Pinecone | Managed cloud service | Production apps, easy scaling |
| Weaviate | Open-source cloud-native | Advanced search, hybrid RAG |
| FAISS | Local, by Meta | Maximum performance on your own hardware |
| LlamaIndex | Framework | Connecting RAG to Claude easily |

> 🎯 **Quick Action:** If your project has more than 50 files, set up ChromaDB locally this week. It takes about an hour to configure and immediately improves Claude's ability to navigate your codebase.

---

## Real Example: Context Done Wrong vs Right {#real-example}

Let's say you want to build a user authentication system. Here's how context management makes or breaks the result.

### The Wrong Way (Context Overload)

```
You type: "Build me an authentication system"

What Claude loads into context:
  ❌ All user-related files     (20 files = 30K tokens)
  ❌ All API endpoint files     (15 files = 20K tokens)
  ❌ All test files             (25 files = 25K tokens)
  ❌ All database models        (10 files = 10K tokens)
  ❌ All documentation files    ( 5 files = 15K tokens)
  ─────────────────────────────────────────────────────
  Total loaded upfront: 75 files = 100K tokens

  Tokens left for actual conversation: 100K
  Result: Scattered, incomplete, inconsistent code
```

### The Right Way (Structured Context)

```
CONVERSATION 1 — Planning (uses ~20K tokens)
┌────────────────────────────────────────────────┐
│ You: "Plan the auth system using Plan Mode"    │
│                                                │
│ Claude reads: README.md + ARCHITECTURE.md      │
│ Claude creates: implementation_plan.md         │
│ You approve the plan                           │
└────────────────────────────────────────────────┘
                        │
                        ▼
CONVERSATION 2 — Models & Database (uses ~40K tokens)
┌────────────────────────────────────────────────┐
│ You: "Implement Phase 1 from the plan"         │
│                                                │
│ Claude reads: implementation_plan.md           │
│ Claude creates: User model, DB migration       │
└────────────────────────────────────────────────┘
                        │
                        ▼
CONVERSATION 3 — Auth Service (uses ~35K tokens)
┌────────────────────────────────────────────────┐
│ You: "Implement Phase 2: auth endpoints"       │
│                                                │
│ Claude reads: plan + new models                │
│ Claude creates: JWT tokens, login, logout      │
└────────────────────────────────────────────────┘
                        │
                        ▼
CONVERSATION 4 — Testing (uses ~30K tokens)
┌────────────────────────────────────────────────┐
│ You: "Run the tests and fix any failures"      │
│                                                │
│ Claude reads: test files + new service files   │
│ Claude fixes: any remaining issues             │
└────────────────────────────────────────────────┘

Result:
✅ Each conversation used less than 50% of context
✅ Clear documentation trail at every step
✅ Fully working auth system with tests
✅ Easy to debug later — you know exactly what happened where
```

---

## The Golden Rules {#golden-rules}

### DO These Things

| Rule | Why It Matters |
|---|---|
| Keep `CLAUDE.md` updated at project root | Claude reads it automatically every session — always in context |
| Use Plan Mode for complex or architectural work | Prevents inconsistent, half-baked implementations |
| Provide clear, scoped context in requests | "Fix the login bug in auth/service.py line 42" beats "fix the auth" |
| Use Hooks for automation you need every time | Hooks are reliable; asking Claude to "remember" is not |
| Verify all AI-generated code before shipping | Claude is confident — but not always right |
| Break large tasks into focused conversations | Each focused conversation = better, more coherent results |
| Use Sub-Agents for parallel, independent analysis | Keeps your main context clean |
| Cache large, stable context when using the API | Cuts costs dramatically on repeated context |

### DON'T Do These Things

| Rule | Why It Hurts |
|---|---|
| Dump entire codebases into context | Wastes tokens, makes Claude slower and less accurate |
| Skip planning for big architectural changes | Claude will make inconsistent decisions across files |
| Mix multiple unrelated concerns in one chat | Confuses context, produces muddled answers |
| Trust AI output without testing | Claude is very confident — even when it is wrong |
| Let important decisions live only in chat history | Chat history is not searchable, not version-controlled |
| Use Edit Mode for multi-file architecture changes | Leads to inconsistency — use Plan Mode first |
| Ask Claude to "remember" something for next time | Claude forgets everything when the session ends |
| Let AI make final architectural decisions | Claude advises. You decide. You're accountable |

---

## The Human–Claude Partnership {#the-partnership}

The best results come when you understand who does what.

```
┌────────────────────────────────┬──────────────────────────────────┐
│       🧠 YOU Excel At          │       🤖 CLAUDE Excels At        │
├────────────────────────────────┼──────────────────────────────────┤
│ Strategic thinking & vision    │ Pattern recognition at scale     │
│ Understanding stakeholder needs│ Code generation & refactoring    │
│ Creative problem-solving       │ Consistency across large codebases│
│ Recognizing subtle domain bugs │ Rapid prototyping                │
│ Final verification             │ Recall from vast training data   │
│ Accountability & sign-off      │ 24/7 availability                │
└────────────────────────────────┴──────────────────────────────────┘
```

> 🔑 **Key Insight:**
> **You provide the vision and the verification.**
> **Claude provides the velocity and the consistency.**

This is not about replacing you. It's about multiplying what you can do in a day.

---

## Your Next Steps {#your-next-steps}

You don't need to implement all 11 strategies today. Start with the highest-impact ones:

### Week 1 — Foundation (30 minutes total)

```
[ ] Create CLAUDE.md at your project root
    Use the template from Strategy #2 above

[ ] Document one procedure as a Skill
    Pick a task you've explained to Claude more than once
    Write it in .claude/skills/[name]/SKILL.md
```

### Week 2 — Automation (1 hour total)

```
[ ] Try Plan Mode for your next feature
    Before you start coding, tell Claude:
    "Enter Plan Mode and create an implementation plan first"

[ ] Set up one Hook
    Start simple: auto-lint after every file edit
    Add it to .claude/settings.json
```

### Week 3 — Scale (2-3 hours total)

```
[ ] Set up RAG if you have 50+ files
    Try ChromaDB for a local, free start

[ ] Enable Prompt Caching if using the Claude API
    Add cache_control to your stable system prompt
```

---

## Model Comparison — Which Claude to Use

```
┌──────────────────────┬───────────────┬──────────────────────────────┐
│ Model                │ Context       │ Best For                     │
├──────────────────────┼───────────────┼──────────────────────────────┤
│ Claude Haiku 4.5     │ 200K tokens   │ Fast tasks, high-volume      │
│                      │               │ automation, simple questions  │
├──────────────────────┼───────────────┼──────────────────────────────┤
│ Claude Sonnet 4.6    │ 200K tokens   │ Everyday coding, features,   │
│                      │               │ balanced performance          │
├──────────────────────┼───────────────┼──────────────────────────────┤
│ Claude Opus 4.7      │ 200K tokens   │ Complex reasoning, Extended  │
│                      │               │ Thinking, architecture work  │
└──────────────────────┴───────────────┴──────────────────────────────┘

Quick rule:
  Quick task?          → Haiku 4.5
  Feature development? → Sonnet 4.6
  Hard decisions?      → Opus 4.7 with Extended Thinking
```

---

## Summary — The 11 Strategies at a Glance

```
┌────┬────────────────────────┬───────────────────────────────────┐
│ #  │ Strategy               │ One-line summary                  │
├────┼────────────────────────┼───────────────────────────────────┤
│  1 │ Markdown Files         │ Write it down once, reference     │
│    │                        │ it forever                        │
├────┼────────────────────────┼───────────────────────────────────┤
│  2 │ CLAUDE.md              │ The daily briefing Claude reads   │
│    │                        │ automatically every session       │
├────┼────────────────────────┼───────────────────────────────────┤
│  3 │ Skills                 │ Document procedures once, reuse   │
│    │                        │ them without re-explaining        │
├────┼────────────────────────┼───────────────────────────────────┤
│  4 │ Built-in Tools         │ Read → Analyze → Fix → Verify     │
├────┼────────────────────────┼───────────────────────────────────┤
│  5 │ MCP Servers            │ On-demand access to external      │
│    │                        │ systems (DB, GitHub, Slack)       │
├────┼────────────────────────┼───────────────────────────────────┤
│  6 │ Prompt Caching         │ Pay 10% for repeated context      │
├────┼────────────────────────┼───────────────────────────────────┤
│  7 │ Hooks                  │ Automate recurring actions —      │
│    │                        │ no "remember to..." needed        │
├────┼────────────────────────┼───────────────────────────────────┤
│  8 │ Extended Thinking      │ Claude thinks before it speaks    │
│    │                        │ for complex, high-stakes problems │
├────┼────────────────────────┼───────────────────────────────────┤
│  9 │ Sub-Agents             │ Parallel workers, each with their │
│    │                        │ own clean 200K context window     │
├────┼────────────────────────┼───────────────────────────────────┤
│ 10 │ Plan vs Edit Mode      │ Blueprints before construction    │
│    │                        │ (Plan) vs painting walls (Edit)   │
├────┼────────────────────────┼───────────────────────────────────┤
│ 11 │ RAG                    │ Search first, then load — not     │
│    │                        │ load everything upfront           │
└────┴────────────────────────┴───────────────────────────────────┘
```

---

> "The best code is not written — it's orchestrated."
>
> You're the conductor. Claude is your orchestra.
> Give it the right score, and the music writes itself.

---

*Last updated: April 2026*
*Source: Based on the Claude Context Management presentation*
