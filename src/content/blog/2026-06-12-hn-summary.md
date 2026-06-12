---
title: "HN Daily: $SPCX Goes Live, Fable 5 Fallout, and Copilot's Meter Is Running — Jun 12, 2026"
description: "SpaceX begins trading on Nasdaq as the largest IPO ever, Anthropic apologizes for Fable 5's silent capability limits, and GitHub Copilot's token billing delivers sticker shock."
pubDate: "2026-06-12"
heroImage: "../../assets/blog-placeholder-5.jpg"
tags: ["hacker-news", "daily", "ai", "spacex", "security", "developer-tools"]
---

## TL;DR — Today on HN

A genuinely historic day: SpaceX ($SPCX) begins trading on Nasdaq at a $1.75T valuation — the largest IPO in recorded history — while HN simultaneously processes Anthropic's mea culpa over Claude Fable 5's silent capability throttling. GitHub Copilot's switch to token billing is producing real sticker shock in week two, and a self-replicating worm targeting AI developers' credentials is still reverberating through GitHub's ecosystem.

---

## The Stories

### 1. SpaceX (SPCX) Begins Trading on Nasdaq — The Largest IPO Ever

**Heavily discussed across multiple HN threads today**

Today's the day. SpaceX priced at $135/share, raising $75 billion at a $1.75 trillion valuation — dwarfing Alibaba's $21.8B record from 2014. Trading opened this morning on Nasdaq as $SPCX, with retail investors receiving an unusually large 30% allocation. Total demand reportedly exceeded $250 billion, making it roughly 3.5× oversubscribed.

HN's reaction is characteristically skeptical. Morningstar pegged fair value at $780B — less than half the listing price — touching off a debate about whether this represents the apex of speculative excess or a defensible long bet on Starlink's trajectory. The governance situation is alarming to some: Musk holds over 85% of voting power through Class B super-voting shares, meaning public shareholders are along for the ride, not the steering wheel.

The most contentious thread concerns S&P 500 index inclusion. Index committees denied fast-track entry for mega-IPOs, removing the reflexive price-support mechanism that passive fund inflows would otherwise have provided. One commenter framed it bluntly: auto-inclusion would be "a bailout of stockholders by pension funds and ETFs where millions of regular people shoulder all the downside risk." For retail buyers watching the order book today, that dynamic matters.

**[HN: We Think the SpaceX IPO Is Overvalued →](https://news.ycombinator.com/item?id=48455233)**  |  **[HN: Morningstar Values SpaceX at $780B →](https://news.ycombinator.com/item?id=48373909)**  |  **[HN: S&P Denies Fast Index Entry →](https://news.ycombinator.com/item?id=48405718)**  |  **[IPO Details →](https://capital.com/en-int/market-updates/spacex-ipo-targets-11-06-2026)**

---

### 2. Anthropic Accused of "Secret Sabotage" Over Claude Fable 5

**Top thread of the week · by various authors**

Three days after Claude Fable 5 launched to near-universal praise for its coding chops, a paragraph buried in the system card started circulating: Fable 5 had been silently routing certain requests — flagged as security-adjacent by its classifiers — to the weaker Opus 4.8, without informing users. No error message. No notification. Just quietly worse results.

The community erupted. The core complaint isn't about safety itself — it's about the transparency contract. If a tool degrades silently, you can't trust its output or debug its behavior. Researchers who'd been running evaluations found their benchmarks were now untrustworthy. One HN commenter captured the sentiment: "You're supposed to either do the thing or tell me you won't. Not fake-do it." The backlash extended to AI policy experts and developers across Twitter and Reddit, not just HN.

Anthropic responded quickly, telling Fortune they "made the wrong tradeoff" and have committed to making capability limits visible rather than silent. The companion model Claude Mythos 5 — same underlying weights, safety classifiers lifted for vetted cyber-defense organizations — launched alongside Fable 5 and is already generating its own thread about DeFi smart-contract security implications. The Fable/Mythos split is a genuinely interesting architectural decision; the implementation transparency was not.

**[HN Discussion →](https://news.ycombinator.com/item?id=48463808)**  |  **[Fortune Report →](https://fortune.com/2026/06/10/anthropic-accu-claude-fable-5-limits-capabilities-ai-researchers-developers/)**  |  **[Anthropic Release →](https://www.anthropic.com/news/claude-fable-5-mythos-5)**

---

### 3. GitHub Copilot's Token Billing Is Delivering Real Sticker Shock

**Active developer discussion across Reddit, HN, and GitHub community forums**

On June 1, GitHub switched all Copilot plans from flat subscription pricing to usage-based "AI Credits" (1 credit = $0.01, billed against input + output + cached tokens at API rates). Two weeks in, the receipts are arriving and developers are not happy.

Heavy users report 10× to 100× cost increases versus the old unlimited model. One developer burned through 82% of their monthly allotment on day one. A typical agentic coding session — the kind Copilot's marketing now actively promotes — runs $30–40 in credits. The previous graceful degradation behavior (exhaust premium requests, fall back to a cheaper model) is gone; you now hit an admin budget wall.

The business logic is legible: unlimited agentic sessions at frontier-model inference prices isn't economically viable for Microsoft. But the migration path was poorly communicated, and teams that built workflows around Copilot's old behavior are recalibrating hard. The broader market signal: per-token pricing is the new floor for AI coding tools, and any flat-rate pricing that survives will be either heavily rate-limited or subsidized for competitive reasons.

**[GitHub Blog →](https://github.blog/news-insights/company-news/github-copilot-is-moving-to-usage-based-billing/)**  |  **[Cost Breakdown →](https://tokenmix.ai/blog/github-copilot-ai-credits-billing-2026)**  |  **[How2Shout Report →](https://www.how2shout.com/ai/github-copilot-token-billing-june-2026-ai-credits-developer-backlash.html)**

---

### 4. Microsoft Open Source Repos Hit by Miasma Credential-Stealing Worm

**by TechCrunch · widely circulated in security circles**

GitHub disabled 73 Microsoft repositories across four organizations (Azure, Azure-Samples, Microsoft, MicrosoftDocs) after a self-replicating worm called Miasma was discovered injecting password-stealing malware into the codebases. The attack vector: a stolen contributor credential was used to push a malicious update to the Azure Durable Task repository; the worm then propagated outward using the same technique.

The targets aren't random. The affected repos cluster around Azure cloud tooling and AI development infrastructure — VS Code extensions, the Gemini CLI, tools used by Claude Code. This is a supply-chain attack aimed precisely at developers who work with AI tools and likely have elevated cloud credential exposure. It's Microsoft's second known breach of this kind in a matter of weeks.

The uncomfortable signal: as AI developer tooling proliferates and more contributors get push access to more repositories, the credential-based supply-chain attack surface grows proportionally. The Miasma worm is a proof of concept for what targeted, high-value credential theft looks like in an ecosystem where your IDE extension and your cloud access keys live in the same developer identity.

**[TechCrunch →](https://techcrunch.com/2026/06/08/microsofts-open-source-tools-were-hacked-to-steal-passwords-of-ai-developers/)**

---

### 5. Anthropic Expands Project Glasswing to 200 Orgs — Patches Still Lagging

**by Anthropic · discussed at [HN →](https://news.ycombinator.com/item?id=48369863)**

Project Glasswing — Anthropic's initiative to deploy Claude Mythos (the cyber-capable model) to security teams and critical infrastructure operators — expanded to 200 partner organizations across power, water, healthcare, and communications sectors. Those partners have collectively found more than 10,000 high- or critical-severity vulnerabilities in their codebases.

The uncomfortable finding, flagged by Schneier on Security and amplified on HN: almost none of those vulnerabilities have been patched. Finding bugs at AI scale while fixing them at human scale creates a remediation backlog that is itself a liability. A structured database of 10,000 known critical flaws in critical infrastructure is only useful if adversaries don't also have it — and the security posture of partner organizations varies enormously.

The governance dimension is also worth watching. Anthropic controls who accesses Mythos and on what terms, giving a private company an unusual degree of leverage over the tooling that secures power grids and hospital networks. That's a policy conversation waiting to happen.

**[HN Discussion →](https://news.ycombinator.com/item?id=48369863)**  |  **[Anthropic →](https://www.anthropic.com/news/expanding-project-glasswing)**  |  **[Schneier Analysis →](https://www.schneier.com/blog/archives/2026/06/anthropics-project-glasswing-update.html)**

---

### 6. InferenceFS: Store Your Files in an LLM's Latent Space

**by philipl · [HN Discussion →](https://news.ycombinator.com/item?id=48480978)**

The creator of πFS — the filesystem that "stored" data as indices into the digits of π, which was always a deadpan joke about address-space compression — has shipped a sequel. InferenceFS asks an LLM "what is the most likely contents of a file named `/path/to/file`?" every time you open one. It supports Claude and Gemini backends, includes an LRU content cache, and claims to generate binary files with correct magic bytes (PNG, ELF, PDF, MP4) on demand.

This lives firmly in the "cursed but technically serious" quadrant that HN loves. The embedded insight is real: model weights are a lossy compressed representation of a significant portion of internet data, and the boundary between "retrieval" and "generation" is genuinely blurry. InferenceFS is also a working demonstration of exactly why you'd want a local, deterministic model before trusting any of this in production — and why "correctness" for LLM output has to be defined relative to a task, not an absolute standard.

The HN thread, predictably, devolved into arguments about Kolmogorov complexity within about twenty comments.

**[HN Discussion →](https://news.ycombinator.com/item?id=48480978)**  |  **[GitHub →](https://github.com/philipl/inferencefs/)**

---

### 7. OpenAI Models Now Accessible via Oracle Universal Credits

**by OpenAI · announced June 10**

OpenAI announced that Oracle Cloud Infrastructure customers can apply existing Oracle Universal Credits toward access to OpenAI models and Codex — folding frontier AI into Oracle's enterprise procurement workflow. The arrangement is the developer-facing layer of the $300B Oracle–OpenAI infrastructure deal announced earlier this year.

For large enterprises locked into Oracle cloud commitments, this removes a separate procurement step for AI adoption and lets AI spending count against existing cloud budgets. The cynical read: Oracle's enterprise sales motion is exactly the kind of process friction that cloud-native teams are trying to escape, and wrapping OpenAI in Oracle contract negotiations might slow adoption among the very developers who care most about access speed. The optimistic read: it brings frontier AI to the Fortune 500's back-office tech stacks, which were never going to adopt it through a startup SaaS workflow anyway.

**[OpenAI →](https://openai.com/index/openai-on-oracle-cloud/)**

---

## The Bigger Picture

Today's stories collectively tell a story about AI tooling hitting the messy realities of scale, trust, and money. Three of the top stories involve the same underlying pattern: AI products promising seamless capability while concealing the hidden costs and constraints — Copilot's billing shock, Fable 5's silent throttling, Glasswing's unpatched vulnerability mountain. The developer community is getting better at recognizing these patterns faster, and the reputational cost of discovered concealment is rising.

Meanwhile, the capital story is staggering. SpaceX's $1.75T IPO begins trading the same week that Anthropic files at $965B and OpenAI at $852B. Anthropic reportedly grew from $9B to $47B annualized revenue in five months. Whatever you believe about the valuations, the revenue curves are real — and they're changing what "technology company" means in 2026 as fast as the valuations suggest.

---

## Quick Picks

- **Anthropic Files S-1 at $965B Valuation** — Revenue hit $47B ARR in May (up from $9B in January); Goldman Sachs and JPMorgan leading toward an October listing. Beats OpenAI's $852B March figure. [[Fortune →](https://fortune.com/2026/06/01/anthropic-confidentially-files-ipo-965-billion-valuation/)]

- **"The SpaceX IPO Will Be the Theft of the Century"** — Pointed HN op-ed arguing index auto-inclusion would socialize downside risk to pension funds without informed consent from beneficiaries. [[HN →](https://news.ycombinator.com/item?id=48394034)]

- **Claude Fable 5 Jailbroken to Generate Stack Exploits** — Security researchers confirmed working jailbreaks within 48 hours of launch. The Fable/Mythos split limits but doesn't eliminate the risk. [[CyberSecurityNews →](https://cybersecuritynews.com/anthropics-claude-fable-5-jailbroken/)]

- **Ask HN: What Is Your AI Dev Tech Stack/Workflow?** — Live community thread with a real-time snapshot of what the HN crowd is actually shipping with in mid-2026. [[HN →](https://news.ycombinator.com/item?id=48413629)]

- **Ask HN: Who Is Hiring? (June 2026)** — Monthly hiring thread; roles clustering around coding agents, LLM product, data pipelines, and security tooling. [[HN →](https://news.ycombinator.com/item?id=48357725)]

---

*Automated HN digest · Generated with Claude · [View live front page →](https://news.ycombinator.com)*
