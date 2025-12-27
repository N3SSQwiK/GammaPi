<!-- OPENSPEC:START -->
# OpenSpec Instructions

These instructions are for AI assistants working in this project.

Always open `@/openspec/AGENTS.md` when the request:
- Mentions planning or proposals (words like proposal, spec, change, plan)
- Introduces new capabilities, breaking changes, architecture shifts, or big performance/security work
- Sounds ambiguous and you need the authoritative spec before coding

Use `@/openspec/AGENTS.md` to learn:
- How to create and apply change proposals
- Spec format and conventions
- Project structure and guidelines

Keep this managed block so 'openspec update' can refresh the instructions.

<!-- OPENSPEC:END -->

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

GammaPi is a collection of automation workflows for Gamma Pi chapter of Phi Iota Alpha fraternity. The primary component is **PillarFunFacts**, an n8n-based Discord bot that posts daily historical facts about Latin American independence leaders and related topics.

## Architecture

### PillarFunFacts Workflow

Two workflow versions exist in `PillarFunFacts/`:

- **n8n_workflow.json** (v1): Simple version using Wikipedia Summary API directly
- **n8n_workflow_v2.json** (v2): Enhanced version with Gemini AI integration that scrapes full Wikipedia HTML, extracts content, and uses AI to generate engaging "Did You Know?" posts

**Workflow Pipeline (v2):**
```
Daily Schedule (9am) → Pick Random Topic → Fetch Wikipedia HTML → Extract Text & Image → Gemini AI → Discord Webhook
```

**Topic Categories in seed_topics.json:**
- `Pillar`: The five pillars (Bolívar, San Martín, O'Higgins, Martí, Juárez)
- `History`: Phi Iota Alpha organizational history
- `Concept`: Pan-Americanism and related ideologies
- `General`: Latin American independence events

## Working with n8n Workflows

- Workflows are stored as JSON exports from n8n
- Credential placeholders use `YOUR_*` pattern (e.g., `YOUR_DISCORD_WEBHOOK_URL_HERE`, `YOUR_GEMINI_CREDENTIAL_ID`)
- Wikipedia API requests require User-Agent header: `GammaPiBot/1.0`
- Discord embed color uses fraternity red: `#B41528`
