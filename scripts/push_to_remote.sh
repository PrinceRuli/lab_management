#!/usr/bin/env bash
# One-click script to add remote and push repository (POSIX shell)
# Run locally from repo root: ./scripts/push_to_remote.sh

set -euo pipefail

DEFAULT_REMOTE="https://github.com/PrinceRuli/lab_management.git"

read -r -p "Remote repository URL (leave empty for $DEFAULT_REMOTE): " REMOTE_URL
if [ -z "$REMOTE_URL" ]; then
  REMOTE_URL="$DEFAULT_REMOTE"
fi

if ! command -v git >/dev/null 2>&1; then
  echo "git not found in PATH. Install git and re-run."
  exit 1
fi

if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo "Git repo not found — initializing..."
  git init
else
  echo "Git repo detected."
fi

git add -A || true

if [ -n "$(git status --porcelain)" ]; then
  read -r -p "Commit message (leave empty for 'Import local workspace'): " MSG
  if [ -z "$MSG" ]; then MSG="Import local workspace"; fi
  git commit -m "$MSG" || true
else
  echo "No changes to commit."
fi

EXISTING_REMOTE=$(git remote get-url origin 2>/dev/null || true)
if [ -n "$EXISTING_REMOTE" ]; then
  echo "Remote 'origin' already set to: $EXISTING_REMOTE"
  read -r -p "Replace remote 'origin' with $REMOTE_URL ? (y/N): " REPLY
  if [[ "$REPLY" =~ ^[Yy]$ ]]; then
    git remote remove origin
    git remote add origin "$REMOTE_URL"
  else
    echo "Keeping existing remote."
  fi
else
  git remote add origin "$REMOTE_URL"
fi

git branch -M main || true

read -r -p "Force push (will overwrite remote history)? (y/N): " FORCE
if [[ "$FORCE" =~ ^[Yy]$ ]]; then
  git push -u origin main --force
else
  git push -u origin main
fi

echo "Done. Remote set and push completed."
