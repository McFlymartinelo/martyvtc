#!/bin/sh
set -eu

echo "Application des migrations Prisma…"
i=0
until npx prisma migrate deploy; do
  i=$((i + 1))
  if [ "$i" -ge 30 ]; then
    echo "Impossible d'appliquer les migrations (PostgreSQL injoignable ?)."
    exit 1
  fi
  echo "Nouvelle tentative dans 2s… ($i/30)"
  sleep 2
done

if [ "${SEED_ON_START:-false}" = "true" ]; then
  echo "Seed initial…"
  node prisma/seed.cjs || true
fi

exec "$@"
