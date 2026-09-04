#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

if [ "$(id -u)" -ne 0 ]; then
  echo "Relance ce script en root : sudo bash scripts/setup-debian.sh"
  exit 1
fi

export DEBIAN_FRONTEND=noninteractive

echo "→ Paquets de base"
apt-get update -y
apt-get install -y ca-certificates curl gnupg openssl ufw

if ! command -v docker >/dev/null 2>&1; then
  echo "→ Installation de Docker"
  install -m 0755 -d /etc/apt/keyrings
  curl -fsSL https://download.docker.com/linux/debian/gpg -o /etc/apt/keyrings/docker.asc
  chmod a+r /etc/apt/keyrings/docker.asc
  # shellcheck disable=SC1091
  echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/debian $(. /etc/os-release && echo "$VERSION_CODENAME") stable" \
    > /etc/apt/sources.list.d/docker.list
  apt-get update -y
  apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin docker-buildx-plugin
  systemctl enable --now docker
fi

PUBLIC_IP="$(curl -fsS --max-time 8 https://ifconfig.me || hostname -I | awk '{print $1}')"
DOMAIN="${DOMAIN:-}"

if [ ! -f .env ]; then
  echo "→ Création du fichier .env"
  AUTH_SECRET="$(openssl rand -base64 48 | tr -d '\n')"
  POSTGRES_PASSWORD="$(openssl rand -base64 24 | tr -d '\n=+/')"
  if [ -n "$DOMAIN" ]; then
    SITE_ADDRESS="$DOMAIN"
    PUBLIC_URL="https://${DOMAIN}"
  else
    SITE_ADDRESS=":80"
    PUBLIC_URL="http://${PUBLIC_IP}"
  fi

  cat > .env <<EOF
# URL publique — doit correspondre à ce que tu tapes dans le navigateur
NEXTAUTH_URL=${PUBLIC_URL}
AUTH_URL=${PUBLIC_URL}
AUTH_SECRET=${AUTH_SECRET}
NEXTAUTH_SECRET=${AUTH_SECRET}

POSTGRES_USER=martyvtc
POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
POSTGRES_DB=martyvtc
DATABASE_URL=postgresql://martyvtc:${POSTGRES_PASSWORD}@db:5432/martyvtc?schema=public

SITE_ADDRESS=${SITE_ADDRESS}
ACME_EMAIL=${ACME_EMAIL:-admin@localhost}

SEED_ON_START=true
ADMIN_EMAIL=${ADMIN_EMAIL:-admin@localhost}
ADMIN_PASSWORD=${ADMIN_PASSWORD:-changeme123}

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
NEXT_PUBLIC_GOOGLE_CLIENT_ID=

STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=

RESEND_API_KEY=
EMAIL_FROM="Marty <noreply@example.com>"
EOF
  chmod 600 .env
  echo "  URL publique : ${PUBLIC_URL}"
else
  echo "→ .env déjà présent, inchangé"
fi

if command -v ufw >/dev/null 2>&1; then
  echo "→ Pare-feu (SSH + HTTP/HTTPS)"
  ufw allow OpenSSH
  ufw allow 80/tcp
  ufw allow 443/tcp
  if ufw status | grep -q "Status: inactive"; then
    echo "  UFW est inactif. Pour l'activer : ufw --force enable"
  fi
fi

echo "→ Build et lancement"
docker compose pull
docker compose up -d --build

echo
echo "Prêt. Attends 20–40 s que Postgres et les migrations se terminent."
echo "Accès : $(grep '^NEXTAUTH_URL=' .env | cut -d= -f2-)"
echo "Admin : $(grep '^ADMIN_EMAIL=' .env | cut -d= -f2-) / $(grep '^ADMIN_PASSWORD=' .env | cut -d= -f2-)"
echo "Pense à changer ADMIN_PASSWORD et à mettre SITE_ADDRESS=ton-domaine pour le HTTPS."
