# Claude Code Tips & Tricks Reference

A comprehensive guide to Claude Code features for power users.

---

## Keyboard Shortcuts

| Shortcut | What It Does |
|----------|--------------|
| `Esc` + `Esc` | Rewind/undo Claude's changes (restore to any previous state) |
| `Ctrl+R` | Search command history (like bash reverse search) |
| `Ctrl+O` | Toggle verbose mode (see Claude's thinking process) |
| `Shift+Tab` or `Alt+M` | Cycle permission modes (Normal → Auto-Accept → Plan) |
| `Option+P` (Mac) / `Alt+P` | Switch models mid-conversation |
| `Ctrl+B` | Move long-running commands to background |
| `?` | Show environment-specific shortcuts |

---

## Quick Prefixes

| Prefix | What It Does | Example |
|--------|--------------|---------|
| `!` | Run bash directly (no approval needed) | `! npm test` |
| `#` | Add to memory file (CLAUDE.md) | `# Always use npm ci on production` |
| `ultrathink:` | Enable extended thinking for complex tasks | `ultrathink: Design caching strategy` |

---

## Plan Mode (Safe Exploration)

Claude analyzes your codebase **read-only** and creates a plan before making changes.

```bash
# Start in Plan Mode
claude --permission-mode plan

# Toggle during session
Shift+Tab  (press twice to reach Plan Mode)

# Headless analysis
claude --permission-mode plan -p "Analyze auth system and suggest improvements"
```

**Use cases:**
- Multi-file refactoring
- Exploring unfamiliar codebases
- "Show me what you'd do" scenarios

---

## Session Management

```bash
# Resume most recent session
claude --continue

# Resume by name
claude --resume auth-refactor

# List and pick session
claude --resume

# Name current session (inside Claude)
/rename payment-integration-phase-2
```

**Session picker shortcuts:**
- `↑` / `↓` - Navigate
- `P` - Preview session content
- `R` - Rename
- `B` - Filter by git branch
- `/` - Search

---

## Memory System

### Quick Memory Addition
Start message with `#` to save context:
```
# Always validate user input before database queries
```

### Memory File Hierarchy (highest to lowest priority)
1. Enterprise policy (`/Library/Application Support/ClaudeCode/CLAUDE.md`)
2. Project memory (`.claude/CLAUDE.md` or `./CLAUDE.md`)
3. User memory (`~/.claude/CLAUDE.md`)
4. Local project memory (`.claude/CLAUDE.local.md` - auto-gitignored)

### Modular Rules (for large projects)
```
.claude/
├── CLAUDE.md           # Main project instructions
└── rules/              # Automatically loaded
    ├── code-style.md
    ├── testing.md
    └── security.md
```

### Path-Specific Rules
```markdown
---
paths: src/api/**/*.ts
---

# API Development Rules
- All endpoints require input validation
- Use standard error response format
```

---

## Useful Slash Commands

| Command | What It Does |
|---------|--------------|
| `/context` | Visual token usage grid |
| `/cost` | Token counts and cost estimate |
| `/compact` | Summarize long conversations to free up context |
| `/config` | Toggle settings (thinking mode, etc.) |
| `/agents` | View and create custom subagents |
| `/hooks` | Manage automation hooks |
| `/statusline` | Configure status line display |
| `/help` | Show all available commands |
| `/memory` | View loaded memory files |
| `/mcp` | Manage MCP server connections |

---

## Custom Slash Commands

Create project-specific commands in `.claude/commands/`:

### Basic Command
```bash
mkdir -p .claude/commands
echo "Run all tests and summarize failures:" > .claude/commands/test-summary.md
```
Now `/test-summary` works in your project!

### Advanced Command with Frontmatter
```markdown
---
allowed-tools: Bash(git add:*), Bash(git status:*), Bash(git commit:*)
description: Create a git commit with context
---

## Commit Changes

Based on:
- Current git status: !`git status`
- Recent diff: !`git diff HEAD`
- Current branch: !`git branch --show-current`

Create a detailed, conventional commit.
```

### Positional Arguments
```markdown
---
argument-hint: [pr-number] [priority] [assignee]
description: Review pull request
---

Review PR #$1 with priority $2 and assign to $3.
```

### Namespaced Commands (subdirectories)
```
.claude/commands/
├── frontend/component.md      # /component (project:frontend)
├── backend/deploy.md          # /deploy (project:backend)
└── test.md                    # /test (project)
```

---

## Hooks (Automation)

Hooks run automatically on Claude events without prompting.

### Hook Events
- `PreToolUse` - Before Claude uses a tool (can block)
- `PostToolUse` - After a tool completes
- `Notification` - When Claude needs input
- `Stop` - When Claude finishes a task

### Example: Auto-format TypeScript after edits
```bash
# PostToolUse hook
jq -r '.tool_input.file_path' | {
  read file_path
  if echo "$file_path" | grep -q '\.ts$'; then
    npx prettier --write "$file_path"
  fi
}
```

### Example: Block edits to sensitive files
```bash
# PreToolUse hook (exit code 2 = block)
python3 -c "
import json, sys
data = json.load(sys.stdin)
path = data.get('tool_input', {}).get('file_path', '')
sensitive = ['.env', 'package-lock.json', '.git/']
sys.exit(2 if any(p in path for p in sensitive) else 0)
"
```

### Example: Desktop notification
```bash
# Notification hook
notify-send 'Claude Code' 'Awaiting your input'
```

Manage hooks with `/hooks` command.

---

## MCP Servers (External Integrations)

Connect Claude to external tools and services.

### Installation Methods
```bash
# HTTP (cloud services)
claude mcp add --transport http notion https://mcp.notion.com/mcp

# Stdio (local tools like databases)
claude mcp add --transport stdio postgres \
  --env DB_URL=postgresql://... \
  -- npx @modelcontextprotocol/server-postgres
```

### Scopes
- `--scope local` - Project-specific, private (default)
- `--scope project` - Team-shared via `.mcp.json`
- `--scope user` - Cross-project, personal

### Use Cases
```
> "Find customers who haven't purchased in 90 days"  (database)
> "What errors in Sentry last 24 hours?"             (monitoring)
> "Create Jira ticket for this bug"                  (project management)
```

---

## Extended Thinking

Reserve tokens for Claude's internal reasoning on complex tasks.

### Enable
```bash
/config  # Toggle "Enable thinking mode"

# Or per-request:
ultrathink: Design a caching layer for our API
```

### Configure Budget
```bash
export MAX_THINKING_TOKENS=5000
claude
```

### View Thinking
```
Ctrl+O  # Toggle verbose mode to see thinking text
```

---

## Headless Mode (CI/CD)

Use Claude in scripts and pipelines:

```bash
# Analyze code
claude -p "Review this code for security issues" < code.ts

# Generate output
claude -p "Fix this bug" < error.log > fix-summary.txt

# JSON output
claude -p "List todos in codebase" --output-format json
```

### Output Formats
- `--output-format text` - Just Claude's response (default)
- `--output-format json` - Full conversation with metadata
- `--output-format stream-json` - Real-time JSON output

---

## Custom Subagents

Create specialized agents for your project:

```
.claude/agents/
├── code-reviewer.md
├── security-auditor.md
└── performance-optimizer.md
```

View and manage with `/agents` command.

---

## Status Line Configuration

Customize the info bar shown during sessions:

```bash
/statusline
```

Common elements:
- Current directory
- Git branch
- Model name
- Context usage percentage

---

## Tips & Tricks

### Compact Long Conversations
```
/compact                              # Basic summarization
/compact Focus on auth module changes # Focused summarization
```

### Git Worktree Isolation
```bash
# Parallel work with separate Claude sessions
git worktree add ../project-feature-a -b feature-a
cd ../project-feature-a
claude  # Completely isolated session
```

### Pipe as Unix Utility
```bash
cat error.log | claude -p "What's the root cause?" > analysis.txt
```

### Package.json Integration
```json
{
  "scripts": {
    "lint:claude": "claude -p 'Check for typos in recent changes' --output-format json"
  }
}
```

---

## Quick Reference Card

| Want to... | Do this |
|------------|---------|
| Undo Claude's changes | `Esc` + `Esc` |
| Run bash without approval | `! command` |
| Save something to memory | `# your note` |
| Deep thinking on complex task | `ultrathink: question` |
| See token usage | `/context` |
| Resume yesterday's work | `claude --continue` |
| Create project command | Add `.claude/commands/name.md` |
| Auto-format on save | Set up PostToolUse hook |
| Connect to database | `claude mcp add` |
| Safe exploration mode | `Shift+Tab` twice |

---

**Last Updated:** December 2024
**Source:** Claude Code Official Documentation
