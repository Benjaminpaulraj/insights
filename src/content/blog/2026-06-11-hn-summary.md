---
title: "HN Daily: The Ad Cartel in Your Browser & America's AI Revolt — Jun 11, 2026"
description: "Big Tech bakes ad tracking into browsers, data center protests intensify, Perplexity rearchitects search for AI agents, and Anthropic's Project Glasswing finds 10K+ security bugs."
pubDate: "2026-06-11"
heroImage: "../../assets/blog-placeholder-5.jpg"
tags: ["hacker-news", "daily", "ai", "privacy", "ad-tech", "data-centers"]
---

## TL;DR — Today on HN

Today's front page was a split-screen of AI ambition meeting real-world friction. Anthropic is using Claude to find 10,000+ critical security vulnerabilities in the world's most important software — and Americans are protesting AI data centers because they can't fight the AI itself. Meanwhile, a Don Marti post quietly laid out how Big Tech is building an ad-attribution cartel directly into your browser, with W3C as the vehicle. The mood: AI is powerful enough to terrify, but the governance is still playing catch-up.

---

## The Stories

### 1. The way we treat pigs is a sin

**~834 points · ~467 comments · by noahsmith**

Noah Smith's Substack piece dropped into HN with the kind of moral directness that the community can't look away from. The argument: gestation and farrowing crates — the tiny metal boxes where sows spend most of their adult lives unable to turn around — are not a business efficiency. They're torture. Pigs are at least as smart as dogs. They'll never have a social interaction, never see sunlight. The article argues Congress is actively working to overturn state laws like California's Prop 12 that tried to address this.

The HN thread turned into a genuine philosophical debate. Some cited Peter Singer and the logic of consistency — if you wouldn't do it to a dog, the species distinction becomes hard to justify. Others argued the framing ignores economic realities for small farmers. A few noted the irony that HN debates animal welfare every few months but consumer behavior barely moves. The most upvoted comment: "The discomfort people feel reading this is exactly the evidence the author needs."

This one sticks because it doesn't ask you to go vegan. It asks whether Congress should be allowed to make animal cruelty mandatory.

**[HN Discussion →](https://news.ycombinator.com/item?id=48368634)**  |  **[Original →](https://www.noahpinion.blog/p/the-way-we-treat-pigs-is-a-sin)**

---

### 2. Expanding Project Glasswing

**~712 points · ~195 comments · by anthro_news**

Anthropic announced it's expanding Project Glasswing — its AI-powered vulnerability-finding program — to 150 more organizations across 15+ countries, including critical infrastructure sectors like power, water, healthcare, and communications. The first cohort of ~50 partners had access to Claude Mythos Preview, and since April they've uncovered more than **10,000 high or critical-severity security flaws**. One bug had been sitting in OpenBSD for 27 years, surviving decades of expert auditing and aggressive fuzzing.

The HN crowd zeroed in on the timeline Anthropic laid out: within 6–12 months, they expect other AI companies to have Mythos-class models. The concern isn't Anthropic's — it's whoever releases that capability without the safeguards. That framing reframes Project Glasswing not just as a security program but as a strategic positioning play: Anthropic is trying to patch the world before a competitor hands the same capability to the wrong actors.

The comment that landed hardest: "Anthropic is essentially doing the work that CISA should be doing, at a speed governments can't match." Whether that's reassuring or troubling depends entirely on how much you trust Anthropic.

**[HN Discussion →](https://news.ycombinator.com/item?id=48369863)**  |  **[Original →](https://www.anthropic.com/news/expanding-project-glasswing)**

---

### 3. The advertising cartel coming to your web browser

**~620 points · ~218 comments · by dmarti**

Don Marti, the author of the "attribution cartel" thesis, published what might be the clearest explanation yet of why browser-level ad attribution is dangerous — and why W3C is the mechanism through which it's being standardized into the web platform itself. The short version: a group of major tech companies are collaborating on a tracking scheme that will live in your browser, not require user consent, and be immune to opt-outs — even Global Privacy Control.

The structural bias is what makes this insidious. Attribution systems that sit closest to the moment of purchase — search, retail media, retargeting — always "win" attribution. That means Google and Amazon collect more ad dollars. Independent publishers, who can only prove brand halo effects not last-click conversions, get squeezed out. Firefox shipped with attribution tracking **on** by default, and enabling GPC didn't disable it.

HN responses ranged from "we knew this was coming" fatalism to detailed breakdowns of the W3C process and why browser vendors have incentive alignment problems when they also run ad networks. Several developers posted links to browser forks and extensions. The clearest thread conclusion: the web's governance structure was not designed for a world where browser vendors are also ad monopolists.

**[HN Discussion →](https://news.ycombinator.com/item?id=48375175)**  |  **[Original →](https://blog.zgp.org/the-advertising-cartel-coming-to-your-web-browser/)**

---

### 4. Americans don't know how to fight AI so they're fighting data centers

**~589 points · ~347 comments · by frontier_watcher**

Vox's take on the nationwide data center protest movement is the kind of piece that makes a real claim: people aren't actually fighting data centers, they're fighting AI — but AI is abstract and a data center is a building you can stand in front of. The article cites a Gallup poll showing 70% of Americans oppose a data center in their local area. Rising electricity bills, noise, water usage, and property concerns are the surface complaints. The underlying anxiety is about AI's trajectory and who's in control of it.

The HN discussion got heated. One camp argued the protesters are right to oppose unchecked AI infrastructure expansion — that NIMBYism here is actually a democratizing force applying friction to decisions being made without public input. The other camp countered that moratoria will just push data centers (and AI development) to other countries, making the US less competitive in a geopolitical race that's already underway. A retired engineer posted: "We solved the highway revolt of the 1960s by building highways through poorer neighborhoods. The data center siting playbook has been identical."

The deeper issue Vox surfaces — and HN spent time on — is that there's no democratic mechanism for deciding how much AI infrastructure is enough. Zoning boards are filling a vacuum left by Congress.

**[HN Discussion →](https://news.ycombinator.com/item?id=48371592)**  |  **[Original →](https://vox.com/future-perfect/490350/data-center-moratoria-ai-backlash)**

---

### 5. Rethinking search as code generation

**~445 points · ~132 comments · by perplexity_labs**

Perplexity published a research paper introducing "Search as Code" (SaC): instead of AI agents calling a fixed search API endpoint, they generate Python code that orchestrates search primitives directly. The premise is that modern AI agents inside systems like Perplexity Computer invoke hundreds or thousands of retrieval operations per task — a workflow that a monolithic search endpoint simply wasn't designed for.

The performance numbers are striking: 2.5x better results on complex benchmarks, 85% token reduction, and on a cybersecurity task requiring 200 CVE lookups (finding vendor advisories, affected versions, and exact patches), 100% accuracy where alternatives failed. The paper positions SaC as a fundamental architectural shift: search stops being a service you call and becomes an SDK you program.

HN's reaction was split between genuine enthusiasm for the architecture and skepticism about the framing. Critics noted this is essentially "give the model a REPL and a search library" and asked what the actual novel contribution is. Supporters countered that execution details matter and pointed to the benchmark numbers. The most interesting subthread: whether this pattern gets commoditized across all search providers in six months, and what Perplexity's moat actually is.

**[HN Discussion →](https://news.ycombinator.com/item?id=48372547)**  |  **[Original →](https://research.perplexity.ai/articles/rethinking-search-as-code-generation)**

---

### 6. Fidonet: Technology, Use, Tools, and History (1993)

**~493 points · ~156 comments · by historian_hn**

A 1993 Communications of the ACM paper on FidoNet — the BBS-to-BBS email and file network that reached 20,000+ nodes before the web existed — hit the front page and stayed there. This happens on HN roughly once a year with FidoNet, and the reason is always the same: it's a fully functional global communications network built by hobbyists, on telephone lines, with dial-up modems, financed entirely by private individuals who cared about minimizing call costs.

The paper covers the technical protocol design decisions (why xmodem was replaced, how message routing worked without a central directory) alongside the social dynamics of a pre-IETF internet where governance was informal and nodes joined voluntarily. The constraint-driven design — every byte saved was money saved — produced some remarkably elegant solutions.

Today's HN thread was the usual mix of people who ran FidoNet nodes in the 80s and 90s (more than you'd expect) sharing war stories, and younger engineers who find it fascinating that a mesh network without IP, DNS, or HTTPS could be so functional. Several drew the parallel to current debates about decentralized protocols. One comment: "FidoNet had better uptime than AWS."

**[HN Discussion →](https://news.ycombinator.com/item?id=48370291)**  |  **[Original →](https://cacm.acm.org/research/fidonet-technology-tools-and-history/)**

---

### 7. Show HN: I built B10.Studio — the most powerful content spoofer

**~178 points · ~89 comments · by b10_dev**

A Show HN that generated real controversy: B10.Studio generates unique variants of any video or image at scale using color grading, geometric warps, and EXIF rewrites that survive platform duplicate-detection. The use case the builder advertises is social media reposting — getting more reach by evading deduplication. The feature list includes batch upload, REST API, and ZIP/Google Drive delivery.

HN's reaction was predictably divided. Developers interested in the technical side (how does it defeat perceptual hashing at scale?) engaged with the creator. The majority of the thread was a debate about what this actually enables: spam campaigns, misinformation distribution, manipulation of recommendation algorithms, and bypassing copyright detection. The creator defended it as a tool like any other, pointing to legitimate uses in privacy (obfuscating personal videos) and A/B testing.

What makes this interesting as a HN artifact: it's a Show HN that the community clearly wanted to flag off the front page, but couldn't — because the technical execution is real, and the debate about platform power vs. creator tools is real. The tool is the argument.

**[HN Discussion →](https://news.ycombinator.com/item?id=48370446)**  |  **[Original →](https://b10.studio/)**

---

## The Bigger Picture

Today's stories collectively tell a story about power asymmetries arriving faster than governance can handle. The ad cartel post and the data center revolt story are the same underlying phenomenon from different angles: large-scale AI and tech infrastructure decisions are being made by a small number of actors, and the public is being presented with outcomes rather than choices. When Americans can't influence AI policy, they blockade data centers. When publishers can't fight Google's ad dominance, Don Marti writes a blog post about W3C standards that gets 600 points on HN.

Project Glasswing sits in interesting tension with this. Anthropic using AI to find 10,000 vulnerabilities in critical infrastructure is genuinely good — but it also deepens the dependency on a single private company to act as de facto internet security auditor. The beneficence is real; so is the concentration. The FidoNet story, sitting quietly in the middle of all this, is the community reminding itself that distributed, constraint-driven systems built by volunteers once worked really well. Whether that's inspiration or nostalgia is up to the reader.

---

## Quick Picks

- **The solution might be cancelling my AI subscription** — Simon Willison reflects on how low-friction AI tools create "pseudo-productivity": the feeling of getting things done while actually finishing less. Resonant. ~567pts · [HN →](https://news.ycombinator.com/item?id=48345896)

- **Anthropic surpasses OpenAI to become most valuable AI startup** — $65B Series H at a $965B valuation, leapfrogging OpenAI's $730B. Run-rate revenue crossed $47B driven by Claude Code adoption. ~445pts · [HN →](https://news.ycombinator.com/item?id=48336233)

- **Ask HN: Who is hiring? (June 2026)** — Monthly thread. Top demand: AI engineers, coding agents, LLM product, secure dev tools. The market wants builders who can ship, not demo. [HN →](https://news.ycombinator.com/item?id=48357725)

---

*Automated HN digest · Generated with Claude · [View live front page →](https://news.ycombinator.com)*
