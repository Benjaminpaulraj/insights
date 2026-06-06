---
title: "How Claude CLI Agent Works — A Complete Architecture Guide"
description: "A plain-English walkthrough of every layer inside Claude CLI: from the moment you press Enter to the moment output appears — tools, sub-agents, memory, permissions, and all."
pubDate: "May 24 2026"
heroImage: "../../assets/blog-placeholder-4.jpg"
---

> **Reading time: ~18 minutes**

---

## TL;DR — 6 Things to Know Before You Read

> 🔑 **The short version:**
>
> 1. Claude CLI is a **10-layer orchestration engine** — not just a chatbot wrapper
> 2. Every prompt passes through pre-processing → permission checks → context assembly → model API → tool execution
> 3. Tools are Claude's "hands" — there are 40+ of them across 8 categories (File, Shell, Search, Web, Agent, MCP, Task, Scheduling)
> 4. Sub-agents are **worker processes with their own 200K token context windows** — spawned, used, and discarded
> 5. Memory lives in three places: `CLAUDE.md` (permanent), `~/.claude/projects/.../memory/` (AI-maintained), and git history (implicit)
> 6. Skills are **pre-built prompt templates** loaded on demand — not separate code, just structured instructions

---

> 💡 **Interactive Diagram:** Explore every layer visually in the [Claude CLI Architecture diagram →](/insights/claude-cli-architecture.html)

---

## Table of Contents

- [What Happens When You Press Enter?](#what-happens-when-you-press-enter)
- [Layer 1 — User Input](#layer-1--user-input)
- [Layer 2 — Pre-Processing](#layer-2--pre-processing)
- [Layer 3 — Permission System](#layer-3--permission-system)
- [Layer 4 — Context Assembly](#layer-4--context-assembly)
- [Layer 5 — Claude Model API](#layer-5--claude-model-api)
- [Layer 6 — Response Parsing](#layer-6--response-parsing)
- [Layer 7 — Tool Execution](#layer-7--tool-execution)
- [Layer 8 — Sub-Agent System](#layer-8--sub-agent-system)
- [Layer 9 — Memory System](#layer-9--memory-system)
- [Layer 10 — Output Layer](#layer-10--output-layer)
- [The Complete Request Lifecycle](#the-complete-request-lifecycle)
- [The Skills System](#the-skills-system)
- [Golden Rules](#golden-rules)

---

## What Happens When You Press Enter? {#what-happens-when-you-press-enter}

You press Enter. Twelve seconds later, two source files are refactored and 47 tests pass. Between that single keypress and the result, 10 invisible systems fired — permissions checked, context assembled, sub-agents spawned, tools executed in parallel. Most people see none of it.

This is what those systems are, and how they connect.

Here is the high-level picture:

```
┌─────────────────────────────────────────────────────────┐
│  Layer 1 ·  USER INPUT                                  │
│      (text · !command · /skill · @file · STDIN)         │
└───────────────────────┬─────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│  Layer 2 ·  PRE-PROCESSING                              │
│   CLAUDE.md + Memory Files + Git Status + System Info   │
└───────────────────────┬─────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│  Layer 3 ·  PERMISSION SYSTEM                           │
│         settings.json · allowlists · hooks              │
└───────────────────────┬─────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│  Layer 4 ·  CONTEXT ASSEMBLY                            │
│   System prompt + Tool schemas + Conversation history   │
└───────────────────────┬─────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│  Layer 5 ·  CLAUDE MODEL API                            │
│      claude-haiku-4-5 · sonnet-4-6 · opus-4-8           │
└───────────────────────┬─────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│  Layer 6 ·  RESPONSE PARSING                            │
│       Plain text → render  ·  Tool calls → execute      │
└───────────────────────┬─────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│  Layer 7 ·  TOOL EXECUTION                              │
│  File · Shell · Search · Web · Agent · MCP · Task · …   │
└───────────────────────┬─────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│  Layer 8 ·  SUB-AGENT SYSTEM                            │
│  Spawn workers · Worktree isolation · Parallel tasks    │
└───────────────────────┬─────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│  Layer 9 ·  MEMORY SYSTEM                               │
│  CLAUDE.md (permanent) · Memory files · Git history     │
└───────────────────────┬─────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│  Layer 10 · OUTPUT                                      │
│        Markdown rendered · File changes applied         │
└─────────────────────────────────────────────────────────┘
```

Each layer is a discrete system. Let's walk through all ten — every box in that diagram above.

---

## Layer 1 — User Input {#layer-1--user-input}

Before Claude sees anything, your input goes through a **mode detection step**. There are five ways to send input to Claude CLI:

```
┌──────────────────┬────────────────────────────────────────┬──────────────────────────────┐
│   Input Mode     │  Example                               │  What it triggers            │
├──────────────────┼────────────────────────────────────────┼──────────────────────────────┤
│ Plain text       │  "Refactor this function"              │  Full agent pipeline         │
├──────────────────┼────────────────────────────────────────┼──────────────────────────────┤
│ ! prefix         │  ! git status                          │  Direct shell bypass         │
├──────────────────┼────────────────────────────────────────┼──────────────────────────────┤
│ /skill-name      │  /code-review                          │  Skill template loader       │
├──────────────────┼────────────────────────────────────────┼──────────────────────────────┤
│ @file reference  │  @README.md explain this               │  File attachment to context  │
├──────────────────┼────────────────────────────────────────┼──────────────────────────────┤
│ STDIN pipe       │  cat log.txt | claude                  │  Direct context injection    │
└──────────────────┴────────────────────────────────────────┴──────────────────────────────┘
```

The `!` prefix is the most useful shortcut you probably aren't using. Type `! npm test` and the command runs directly in the session — its output lands straight into the conversation, so Claude can see the test results without you having to copy-paste them.

> 🔑 **Key Insight:** The `!` prefix is not Claude running the command. It bypasses the agent entirely and runs the command in your shell directly. This is faster and cheaper for one-off shell operations.

---

## Layer 2 — Pre-Processing {#layer-2--pre-processing}

Before any API call is made, the harness assembles **background context**. This is everything Claude should know before reading your message.

Four sources get combined:

```
┌──────────────────┐   ┌──────────────────┐   ┌──────────────────┐   ┌──────────────────┐
│   CLAUDE.md      │ + │  Memory Files    │ + │   Git Status     │ + │  System Context  │
│  (project rules) │   │  (AI knowledge)  │   │  (branch, diff)  │   │  (date, email)   │
└──────────────────┘   └──────────────────┘   └──────────────────┘   └──────────────────┘
                                    ↓
                        ┌──────────────────────┐
                        │   Combined System    │
                        │       Prompt         │
                        └──────────────────────┘
```

**CLAUDE.md** is your project instruction file. Place it at the root of your repo and every session reads it automatically. It tells Claude things like your deployment base path, writing style, and code conventions — without you having to repeat them.

**Memory files** live at `~/.claude/projects/<project>/memory/`. Claude writes to these files itself, so knowledge persists across sessions. The file `MEMORY.md` is the index — one line per memory, loaded first.

**Git status** is injected automatically. Claude always knows your current branch, last few commits, and any uncommitted changes. This is why it can say things like "I see you're on the `main` branch with 3 uncommitted files."

**System context** includes today's date, your email address (from your profile), and other runtime values the harness injects into the system prompt.

> 🔑 **Key Insight:** All of this happens before a single token is sent to the model. Pre-processing is free (no API cost) and happens in milliseconds.

---

## Layer 3 — Permission System {#layer-3--permission-system}

Claude cannot do anything without passing through the permission system first. Every tool call is checked against an allowlist before it runs.

**Two settings files control permissions:**

```
┌───────────────────────────────────────────┐  ← User-level (applies everywhere)
│  ~/.claude/settings.json                  │
│  {                                        │
│    "permissions": {                       │
│      "allow": ["Bash(npm run *)", "Read"] │
│    }                                      │
│  }                                        │
└───────────────────────────────────────────┘
                      ↓ overridden by
┌───────────────────────────────────────────┐  ← Project-level (applies to this repo)
│  .claude/settings.local.json              │
│  {                                        │
│    "permissions": {                       │
│      "allow": ["Bash(git *)"]             │
│    }                                      │
│  }                                        │
└───────────────────────────────────────────┘
```

Project-level settings override user-level settings. If both files exist, they merge — with the project file taking precedence on conflicts.

**The four hook types** let you run custom logic around tool execution:

| Hook | When it fires | Use case |
|---|---|---|
| `PreToolUse` | Before a tool runs | Block dangerous commands, log activity |
| `PostToolUse` | After a tool runs | Validate results, trigger follow-ups |
| `Stop` | When Claude finishes responding | Show desktop notification |
| `Notification` | On any system notification | Alert to background task completion |

Hooks run as shell commands you define in settings. They cannot be overridden by Claude — they are your safety net.

> ⚠️ **Watch Out:** If a tool is not in your allowlist, Claude will prompt you for approval each time. You can permanently approve a tool category during the prompt. Add frequently-used tools to your allowlist to reduce interruptions.

---

## Layer 4 — Context Assembly {#layer-4--context-assembly}

Context assembly is where all the pieces come together into a single payload sent to the API. The 200K token window is divided roughly like this:

```
████████████████████████ System Prompt        (CLAUDE.md + memory + tool schemas)
████████████████████████ Conversation History  (previous turns in this session)
████████████████         Tool Schemas          (definitions of all available tools)
████                     Current Input          (your message right now)
░░░░░░░░░░░░░░░░░░░      Available space        (headroom for long responses)
```

**Deferred tools** are a key detail most people miss. Not all tool schemas are loaded upfront — that would eat too much of the context window. Some tools (like the scheduling and MCP tools) are listed by name only, and their full schemas are fetched on-demand when needed using `ToolSearch`. This keeps the baseline context lean.

**Conversation compaction** kicks in automatically when the context approaches its limit. The harness summarises older parts of the conversation and replaces them with a compact summary. The summary appears in the next context window as if it were always there.

> 🔑 **Key Insight:** The context window is shared by everyone — your messages, Claude's responses, tool results, and all the background context. Sending massive files or paste-bombing long outputs eats your budget fast.

---

## Layer 5 — Claude Model API {#layer-5--claude-model-api}

The assembled context is sent to Anthropic's API and processed by one of three model tiers:

```
┌──────────────────┬──────────────────────┬─────────────────┬──────────────────┐
│   Model          │  ID                  │  Speed          │  Best For        │
├──────────────────┼──────────────────────┼─────────────────┼──────────────────┤
│ Claude Haiku 4.5 │ claude-haiku-4-5-... │ Fastest         │ Simple tasks,    │
│                  │                      │                 │ sub-agents       │
├──────────────────┼──────────────────────┼─────────────────┼──────────────────┤
│ Claude Sonnet 4.6│ claude-sonnet-4-6    │ Balanced        │ Most coding and  │
│  (default)       │                      │                 │ writing tasks    │
├──────────────────┼──────────────────────┼─────────────────┼──────────────────┤
│ Claude Opus 4.8  │ claude-opus-4-8      │ Most capable    │ Complex analysis,│
│                  │                      │                 │ hard reasoning   │
└──────────────────┴──────────────────────┴─────────────────┴──────────────────┘
```

**Two special modes** alter how the model processes your request:

**Plan Mode** (`/plan`) — Claude reads all relevant files, designs a detailed implementation plan, and presents it before making any changes. No edits happen until you approve. Use this for tasks with wide blast radius.

**Fast Mode** (`/fast`) — Routes the request through Claude Opus with faster output streaming. It does not downgrade to a smaller model.

The response streams back token-by-token — you see words appear as the model generates them, not after the full response is complete.

> 🔑 **Key Insight:** Model tier is the single biggest lever on speed and cost. Haiku is ~10–20× faster and cheaper than Opus for the same task. Sub-agents often use Haiku; your main session uses Sonnet. Choose deliberately — don't default to Opus for everything.

---

## Layer 6 — Response Parsing {#layer-6--response-parsing}

As tokens stream back, the harness parses every chunk in real time. There are three possible routing paths:

```
                    ┌───────────────────┐
                    │  Response arrives │
                    └────────┬──────────┘
                             ↓
              ┌──────────────┴──────────────┐
              │   Is it a tool call block?  │
              └──────────────┬──────────────┘
              NO ↙                         ↘ YES
    ┌──────────────────┐         ┌──────────────────────────┐
    │ Render as GitHub │         │  Are there multiple      │
    │  Markdown in     │         │  independent calls?      │
    │  the terminal    │         └──────────────┬───────────┘
    └──────────────────┘         NO ↙                    ↘ YES
                          ┌────────────────┐    ┌───────────────────────┐
                          │ Execute single │    │ Execute all in        │
                          │ tool, return   │    │ parallel, merge       │
                          │ result         │    │ results               │
                          └────────────────┘    └───────────────────────┘
```

**Parallel tool execution** is one of Claude's most powerful features. If Claude needs to, say, read three files and search two directories, and those operations don't depend on each other's results, it issues all five tool calls at once. They run concurrently and the results come back together.

**`AskUserQuestion`** is a special tool that triggers a UI permission prompt in the terminal — not a plain text question. It blocks execution until you answer, and the harness renders your answer options as selectable choices.

> 🔑 **Key Insight:** When Claude says "let me check a few things," it may be running 5–10 tool calls in parallel. Each parallel batch takes roughly the same time as a single call, so parallelism is essentially free from your perspective.

---

## Layer 7 — Tool Execution {#layer-7--tool-execution}

Tools are what make Claude an *agent* rather than a chatbot. Without them, Claude can only generate text. Tools give it the ability to read real files, run real commands, and change the real world.

There are **8 tool categories** with 40+ individual tools:

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│                         TOOL EXECUTION LAYER                                     │
├──────────────┬───────────────────────────────────────────────────────────────────┤
│  Category    │  Tools                                                             │
├──────────────┼───────────────────────────────────────────────────────────────────┤
│  📁 File     │  Read · Write · Edit                                               │
│              │  Read files, create new files, make precise string replacements   │
├──────────────┼───────────────────────────────────────────────────────────────────┤
│  🖥️  Shell   │  Bash (foreground) · Bash (background)                            │
│              │  Run any shell command; background mode persists across turns      │
├──────────────┼───────────────────────────────────────────────────────────────────┤
│  🔍 Search   │  Grep · Glob · LS · Find                                          │
│              │  Regex search, pattern matching, directory listing, file finder   │
├──────────────┼───────────────────────────────────────────────────────────────────┤
│  🌐 Web      │  WebFetch · WebSearch                                             │
│              │  Fetch any URL, perform web searches with results returned        │
├──────────────┼───────────────────────────────────────────────────────────────────┤
│  🤖 Agent    │  Agent (spawn) · SendMessage                                      │
│              │  Spawn child agents with full tool access; message running agents │
├──────────────┼───────────────────────────────────────────────────────────────────┤
│  🔌 MCP      │  chrome-devtools · google-drive · (custom servers)                │
│              │  External servers connected via Model Context Protocol             │
├──────────────┼───────────────────────────────────────────────────────────────────┤
│  📋 Task     │  TaskCreate · TaskGet · TaskList · TaskStop · TaskUpdate          │
│              │  Long-running background task management                          │
├──────────────┼───────────────────────────────────────────────────────────────────┤
│  ⏰ Schedule │  CronCreate · CronDelete · CronList · ScheduleWakeup             │
│              │  Set up recurring jobs, schedule future agent runs               │
└──────────────┴───────────────────────────────────────────────────────────────────┘
```

**The Bash tool** is the most powerful and the most risky. It can run any shell command — `npm install`, `git push`, `rm -rf`. This is why the permission system and hooks exist: to constrain what Bash can do.

**The Agent tool** is how Claude multiplies itself. Spawning a sub-agent creates a completely separate Claude instance with its own context window, its own tools, and its own lifecycle. The parent agent waits (or continues) while the child works.

> 🔑 **Key Insight:** Tool results are injected back into the context and sent to the model in the next turn. The model sees your message, the tool results, and then generates the next response. Each tool call + response is a "turn" in the multi-turn conversation loop.

---

## Layer 8 — Sub-Agent System {#layer-8--sub-agent-system}

Sub-agents are how Claude handles tasks too big for one context window, or tasks that benefit from parallelism.

A parent agent spawns children using the `Agent` tool:

```
                        ┌─────────────────┐
                        │  Parent Agent   │
                        │  (your session) │
                        └────────┬────────┘
                                 │ spawns
                    ┌────────────┼────────────┐
                    ↓            ↓            ↓
             ┌──────────┐ ┌──────────┐ ┌──────────┐
             │  Explore │ │  Plan    │ │  claude  │
             │  Agent   │ │  Agent   │ │  Agent   │
             │(read-only│ │(architect│ │(general) │
             │ search)  │ │  mode)   │ │          │
             └──────────┘ └──────────┘ └──────────┘
```

**Named agent types** have pre-set tool configurations and personalities:

| Agent Type | Description | Best For |
|---|---|---|
| `claude` | Full-capability general agent | Coding, writing, any task |
| `Explore` | Read-only search agent | File/codebase exploration |
| `Plan` | Software architect agent | Design + planning only |
| `general-purpose` | Broad task agent | Research, multi-step tasks |
| `claude-code-guide` | Claude Code expert | Questions about Claude Code |
| `statusline-setup` | Config specialist | Configuring the status line |

**Two isolation modes** control how agents share the filesystem:

```
┌─────────────────────────────────────┐  ┌─────────────────────────────────────┐
│         Worktree Mode               │  │         Shared Mode                 │
│  isolation: "worktree"              │  │  (default)                          │
├─────────────────────────────────────┤  ├─────────────────────────────────────┤
│ • Own git branch (auto-created)     │  │ • Works in same directory           │
│ • File changes are isolated         │  │ • All agents see the same files     │
│ • Auto-cleaned if nothing changed   │  │ • Changes are immediately visible   │
│ • Safe for experimental work        │  │ • Good for reading / searching      │
└─────────────────────────────────────┘  └─────────────────────────────────────┘
```

**Background agents** (`run_in_background: true`) run asynchronously. The parent continues its own work while the child runs. When the child finishes, the parent is notified.

**`SendMessage`** lets you send instructions to a still-running agent by ID, without starting a new one. This is how you "continue" an agent across turns.

> ⚠️ **Watch Out:** Each sub-agent starts with a fresh context window. It does not inherit your conversation history. You must pass relevant context explicitly in the agent's prompt.

---

## Layer 9 — Memory System {#layer-9--memory-system}

Claude has no built-in persistent memory. But three mechanisms simulate it:

### Tier 1 — CLAUDE.md (Permanent Project Instructions)

The `CLAUDE.md` file at your project root is loaded into every session automatically. It is human-written, version-controlled, and always in context.

Use it for:
- Project overview and architecture
- Commands (`npm run dev`, `npm run build`)
- Writing style guidelines
- Rules Claude must always follow

> 🔑 **Key Insight:** CLAUDE.md counts against your context budget. Keep it focused. Everything in it is sent to the model on every single turn.

### Tier 2 — Memory Files (AI-Maintained Knowledge)

Claude can write to `~/.claude/projects/<project-name>/memory/` across sessions. These files follow a format:

```
~/.claude/projects/my-project/memory/
  MEMORY.md              ← Index of all memories (loaded at session start)
  decisions.md           ← Technical decisions and rationale
  architecture.md        ← System design knowledge
  user-preferences.md    ← How the user likes to work
```

When you say "remember that we decided to use Postgres," Claude creates or updates a file in this directory. On the next session, the `MEMORY.md` index is loaded and relevant memories are retrieved.

### Tier 3 — Git History (Implicit Timeline)

Git is the most powerful memory system available. Every file change, every commit message, every branch is a queryable record. Claude can run:

```bash
git log --oneline -20         # See recent work
git diff HEAD~3               # What changed in the last 3 commits
git log --grep "fix"          # Find commits about a specific topic
```

This gives Claude access to the full project timeline without any extra configuration.

---

## Layer 10 — Output Layer {#layer-10--output-layer}

Output is not just text. Claude's responses are routed to different destinations depending on type:

| Output Type | Destination | Example |
|---|---|---|
| Plain text | Terminal (rendered as GitHub Markdown) | Explanations, summaries |
| File edits | Applied directly to disk | Code changes via Edit/Write |
| Tool results | Injected into next context turn | Bash output, file contents |
| Permission prompts | Interactive UI in terminal | Approve/deny tool use |
| Background tasks | Task queue (monitored via TaskGet) | Long-running builds |
| Push notifications | System desktop notification | Task completion alerts |

When output contains code blocks, they are syntax-highlighted in the terminal. When output contains tables or headers, they are rendered with GitHub Markdown formatting.

> 🔑 **Key Insight:** Output type determines what happens next. Text is terminal-only and final. Tool results loop back into the model for another turn. File edits persist on disk permanently. Understanding these routes tells you *why* Claude sometimes keeps going after responding — it's still processing tool results, not just talking.

---

## The Complete Request Lifecycle {#the-complete-request-lifecycle}

Here is the full 20-step journey of a single request: *"Refactor the auth module to use async/await"*

> 💡 **Tip:** Open the [interactive diagram](/insights/claude-cli-architecture.html) alongside this section — it lets you click each step for deeper detail.

**Step 1** — You type the message and press Enter

**Step 2** — Input mode detection: plain text → full agent pipeline

**Step 3** — CLAUDE.md is read from project root (e.g., "this is an Express.js API")

**Step 4** — MEMORY.md index is loaded; relevant memory files are retrieved (e.g., "user prefers async/await, no callbacks")

**Step 5** — Git status is injected: current branch = `feature/auth-refactor`, 2 staged files

**Step 6** — System context added: today's date, user email

**Step 7** — Permission system checked: are Read/Edit/Bash tools in the allowlist? Yes.

**Step 8** — Context assembled: system prompt (CLAUDE.md + memories + tool schemas) + conversation history + your message

**Step 9** — Full context payload sent to Claude Sonnet 4.6 API (streaming enabled)

**Step 10** — Claude responds with a plan + multiple tool calls: `Read("src/auth/index.js")`, `Read("src/auth/middleware.js")`, `Grep("callback", "src/auth/")`

**Step 11** — Response parsing: 3 tool calls detected, all independent → execute in parallel

**Step 12** — Tool Execution Layer runs all 3 tools concurrently

**Step 13** — Results injected back into context

**Step 14** — Second API turn: Claude now has the file contents and decides to make edits

**Step 15** — Claude issues `Edit` tool calls: replace callback patterns with async/await in both files

**Step 16** — Permission check: Edit is allowlisted → no prompt needed → files updated on disk

**Step 17** — Claude issues `Bash("npm test")` to verify the changes didn't break anything

**Step 18** — Test output injected back; Claude sees 47 passing, 0 failing

**Step 19** — Claude generates final response: "I've refactored both files. All 47 tests pass."

**Step 20** — Output rendered as Markdown in your terminal. The session continues.

Total tool calls: 6 (3 reads + 2 edits + 1 bash). Total API turns: 3. Elapsed time: ~12 seconds.

---

## The Skills System {#the-skills-system}

Skills are **pre-built prompt templates** that get loaded into the conversation when you invoke them with a `/skill-name` command.

They are not plugins. They are not code. They are carefully written Markdown instruction files that tell Claude how to approach a specific type of task.

**How the invocation flow works:**

```
You type /code-review
        ↓
Harness detects /skill-name → calls Skill tool
        ↓
Skill tool loads the skill's Markdown file into the conversation
        ↓
Claude reads the instructions and follows them as if they were system-level rules
        ↓
Result: Claude behaves like a specialist for this task
```

**Currently available skills:**

| Plugin | Skill | What it does |
|---|---|---|
| chrome-devtools-mcp | `chrome-devtools` | Debug pages via Chrome DevTools MCP |
| chrome-devtools-mcp | `a11y-debugging` | Accessibility audits (ARIA, focus, contrast) |
| chrome-devtools-mcp | `debug-optimize-lcp` | Diagnose slow Largest Contentful Paint |
| chrome-devtools-mcp | `memory-leak-debugging` | Find and fix JS memory leaks |
| chrome-devtools-mcp | `chrome-devtools-cli` | Automate browser tasks via shell scripts |
| chrome-devtools-mcp | `troubleshooting` | Fix Chrome DevTools MCP connection issues |
| frontend-design | `frontend-design` | Build production-grade UI components |
| — | `update-config` | Update Claude Code settings and hooks |
| — | `keybindings-help` | Customise keyboard shortcuts |
| — | `verify` | Run the app and confirm a change works |
| — | `code-review` | Review the current diff for bugs |
| — | `simplify` | Simplify changed code — reuse, efficiency, cleanup; applies fixes (no bug hunting) |
| — | `fewer-permission-prompts` | Reduce repetitive permission prompts |
| — | `loop` | Run a command on a recurring interval |
| — | `schedule` | Set up scheduled / cron-based agents |
| — | `claude-api` | Build and debug Anthropic SDK apps |
| — | `run` | Launch the app and observe behaviour |
| — | `init` | Generate a CLAUDE.md for a new project |
| — | `review` | Full pull request review |
| — | `security-review` | Security audit of pending changes |

> 🔑 **Key Insight:** Skills are user-invocable (you type `/skill-name`) but Claude itself can also invoke them programmatically using the `Skill` tool. This is how the agent can delegate specialised tasks — for example, spawning a sub-agent and telling it to `/code-review` a specific file.

---

## Golden Rules {#golden-rules}

Six things to remember every time you use Claude CLI:

**1. Put your rules in CLAUDE.md.** Anything you want Claude to always know belongs in CLAUDE.md, not in every prompt. Stop repeating yourself.

**2. Use `!` for quick shell commands.** Don't ask Claude to run `git status`. Run it yourself with `! git status` and the output lands straight in the conversation.

**3. Plan before you edit.** Use `/plan` or the Plan agent for any change touching more than 3 files. It costs one extra turn but saves you from 30-turn debugging sessions.

**4. Parallel tool calls are free.** Claude runs independent tool calls simultaneously. If you need to check 10 files, say so explicitly — Claude will read all 10 at once.

**5. Sub-agents don't inherit your context.** When you spawn an agent, give it all the context it needs explicitly. It starts from zero.

**6. Deferred tools need ToolSearch.** Some tools (MCP, scheduling) aren't loaded by default. If Claude says "I need to use ToolSearch first," that's normal — it's fetching the tool schema before calling it.

---

> 💡 **Explore every layer visually:** [Claude CLI Architecture Interactive Diagram →](/insights/claude-cli-architecture.html)

*Last updated: June 2026 · Covers Claude CLI with claude-sonnet-4-6 as default model*
