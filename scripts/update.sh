#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

if [ "$(id -u)" -ne 0 ]; then
  echo "Relance en root : sudo bash scripts/update.sh"
  exit 1
fi

if [ -d .git ]; then
  git pull --ff-only
fi

# Le seed ne doit pas se relancer à chaque mise à jour
if grep -q '^SEED_ON_START=true' .env 2>/dev/null; then
  sed -i 's/^SEED_ON_START=true/SEED_ON_START=false/' .env
fi

docker compose up -d --build
echo "Mise à jour déployée."
