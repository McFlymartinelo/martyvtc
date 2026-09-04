# Marty VTC

Site de réservation VTC en marque blanche (Next.js, Prisma, Auth.js, Stripe).

La charte se règle dans `config/brand.ts`. Les tarifs sont dans `config/tarifs.ts`.

## Local

```bash
docker compose -f docker-compose.dev.yml up -d
cp .env.example .env
npx prisma migrate deploy
npm run db:seed
npm run dev
```

Admin : `admin@localhost` / `changeme123`.

## Debian (accès distant)

Sur le serveur, depuis la racine du projet :

```bash
sudo bash scripts/setup-debian.sh
```

Le script installe Docker, ouvre les ports 80/443, génère les secrets, lance Postgres + l’app + Caddy.

- Sans domaine : le site est servi en HTTP sur `http://IP_PUBLIQUE`
- Avec un domaine (HTTPS automatique) :

```bash
sudo DOMAIN=vtc.tondomaine.fr ACME_EMAIL=toi@email.fr bash scripts/setup-debian.sh
```

Puis pointe un enregistrement DNS **A** vers l’IP du serveur.

Mise à jour plus tard :

```bash
sudo bash scripts/update.sh
```

Après le premier lancement, passe `SEED_ON_START=false` dans `.env` (le script d’update le fait déjà).
