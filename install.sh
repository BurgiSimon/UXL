#!/usr/bin/env bash
# UXL (UX Lawyer) installer: puts the ux-lawyer Agent Skill (and optional rule files)
# where your AI coding agents look for them.
#
#   ./install.sh                     # user-level: Claude Code + every agent that reads ~/.agents/skills
#   ./install.sh --project .         # project-level: .claude/skills + .agents/skills in the given repo
#   ./install.sh --cursor . --copilot . --windsurf . --agents-md .
#   ./install.sh --all .             # everything, user + project level
#   ./install.sh --link              # symlink instead of copy (for UXL development)
#   ./install.sh --uninstall         # remove user-level installs
#
# Works from a clone, or piped:  curl -fsSL https://raw.githubusercontent.com/BurgiSimon/UXL/main/install.sh | bash
set -euo pipefail

REPO_URL="https://github.com/BurgiSimon/UXL"
SKILL_NAME="ux-lawyer"
MODE="copy"
DID=0

say() { printf '  \033[32m✓\033[0m %s\n' "$*"; }
note() { printf '  \033[33m•\033[0m %s\n' "$*"; }
die() { printf '  \033[31m✗\033[0m %s\n' "$*" >&2; exit 1; }

# Locate the repo (or fetch it)
SRC_DIR="$(cd "$(dirname "${BASH_SOURCE[0]:-$0}")" 2>/dev/null && pwd || echo "")"
if [[ -z "$SRC_DIR" || ! -f "$SRC_DIR/skills/$SKILL_NAME/SKILL.md" ]]; then
  command -v git >/dev/null || die "git is required to download UXL"
  TMP="$(mktemp -d)"
  trap 'rm -rf "$TMP"' EXIT
  git clone --depth 1 --quiet "$REPO_URL" "$TMP/UXL" || die "could not clone $REPO_URL"
  SRC_DIR="$TMP/UXL"
  MODE="copy"
fi
SKILL_SRC="$SRC_DIR/skills/$SKILL_NAME"

place_skill() {  # $1 = parent skills dir
  local dest="$1/$SKILL_NAME"
  mkdir -p "$1"
  rm -rf "$dest"
  if [[ "$MODE" == "link" ]]; then ln -s "$SKILL_SRC" "$dest"; else cp -R "$SKILL_SRC" "$dest"; fi
  say "skill → $dest"
  DID=1
}

place_file() {  # $1 = source (relative to repo), $2 = destination file
  mkdir -p "$(dirname "$2")"
  cp "$SRC_DIR/$1" "$2"
  say "rules → $2"
  DID=1
}

user_install() {
  place_skill "$HOME/.claude/skills"   # Claude Code (also read by Copilot in VS Code, OpenCode, Amp)
  place_skill "$HOME/.agents/skills"   # Codex, Cursor, Gemini CLI, GitHub Copilot, OpenCode, Amp, Windsurf/Devin
}

project_install() {  # $1 = project dir
  place_skill "$1/.claude/skills"
  place_skill "$1/.agents/skills"
}

agents_md() {  # append/refresh a UXL section in <dir>/AGENTS.md
  local f="$1/AGENTS.md" start="<!-- UXL:BEGIN -->" end="<!-- UXL:END -->"
  local block; block="$(printf '%s\n%s\n%s\n' "$start" "$(cat "$SRC_DIR/adapters/AGENTS.md")" "$end")"
  if [[ -f "$f" ]] && grep -q "$start" "$f"; then
    awk -v s="$start" -v e="$end" 'BEGIN{skip=0} $0==s{skip=1; next} $0==e{skip=0; next} !skip{print}' "$f" > "$f.tmp" && mv "$f.tmp" "$f"
  fi
  printf '\n%s\n' "$block" >> "$f"
  say "rules → $f (UXL section)"
  DID=1
}

uninstall() {
  for d in "$HOME/.claude/skills/$SKILL_NAME" "$HOME/.agents/skills/$SKILL_NAME" "$HOME/.codex/skills/$SKILL_NAME"; do
    if [[ -e "$d" || -L "$d" ]]; then rm -rf "$d"; say "removed $d"; fi
  done
  exit 0
}

[[ $# -eq 0 ]] && set -- --user

while [[ $# -gt 0 ]]; do
  case "$1" in
    --link) MODE="link" ;;
    --user) user_install ;;
    --claude) place_skill "$HOME/.claude/skills" ;;
    --agents) place_skill "$HOME/.agents/skills" ;;
    --codex) place_skill "$HOME/.agents/skills"; note "Codex reads ~/.agents/skills (older builds: ~/.codex/skills)" ;;
    --codex-legacy) place_skill "$HOME/.codex/skills" ;;
    --gemini) place_skill "$HOME/.gemini/skills" ;;
    --copilot-user) place_skill "$HOME/.copilot/skills" ;;
    --project) project_install "${2:-.}"; shift ;;
    --cursor) place_file adapters/cursor/ux-lawyer.mdc "${2:-.}/.cursor/rules/ux-lawyer.mdc"; shift ;;
    --copilot) place_file adapters/copilot/ux-lawyer.instructions.md "${2:-.}/.github/instructions/ux-lawyer.instructions.md"; shift ;;
    --windsurf) place_file adapters/windsurf/ux-lawyer.md "${2:-.}/.windsurf/rules/ux-lawyer.md"; shift ;;
    --agents-md) agents_md "${2:-.}"; shift ;;
    --all)
      dir="${2:-.}"; shift || true
      user_install; project_install "$dir"
      place_file adapters/cursor/ux-lawyer.mdc "$dir/.cursor/rules/ux-lawyer.mdc"
      place_file adapters/copilot/ux-lawyer.instructions.md "$dir/.github/instructions/ux-lawyer.instructions.md"
      place_file adapters/windsurf/ux-lawyer.md "$dir/.windsurf/rules/ux-lawyer.md"
      ;;
    --uninstall) uninstall ;;
    -h|--help) sed -n '2,13p' "$0" 2>/dev/null || true; exit 0 ;;
    *) die "unknown option: $1 (see --help)" ;;
  esac
  shift || true
done

[[ "$DID" == 1 ]] || die "nothing installed"
echo
note "Claude Code plugin (skill + /uxl:* commands + ux-auditor agent):"
note "  /plugin marketplace add BurgiSimon/UXL   then   /plugin install uxl@uxl"
note "Restart your agent so it picks up the skill. Try: \"build me a landing page\" or \"audit this app's UX\"."
