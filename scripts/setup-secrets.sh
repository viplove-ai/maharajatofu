#!/usr/bin/env bash
#
# One-time setup: create the maharaja_tofu database inside the existing Neon
# project and wire up the two secrets the deploy pipeline needs.
#
# Nothing secret is printed. The values live only in the running nirman
# machine's environment — Fly stores digests, not values — so they are read from
# there and piped straight into `flyctl secrets` and `gh secret`.
#
# Usage:  ./scripts/setup-secrets.sh
set -euo pipefail

NIRMAN_APP=nirman-constructions-api
TOFU_APP=maharaja-tofu
REPO=viplove-ai/maharajatofu
DB_NAME=maharaja_tofu

need() { command -v "$1" >/dev/null || { echo "missing: $1" >&2; exit 1; }; }
need flyctl
need gh
need psql

echo "==> Reading Neon credentials from $NIRMAN_APP"
# nirman holds the JDBC URL and the credentials as three separate secrets.
env_blob=$(flyctl ssh console --app "$NIRMAN_APP" \
  -C "printenv DATABASE_URL DB_USER DB_PASSWORD" 2>/dev/null | tr -d '\r')

jdbc_url=$(printf '%s\n' "$env_blob" | sed -n '1p')
db_user=$(printf '%s\n' "$env_blob" | sed -n '2p')
db_pass=$(printf '%s\n' "$env_blob" | sed -n '3p')

if [ -z "$jdbc_url" ] || [ -z "$db_user" ] || [ -z "$db_pass" ]; then
  echo "could not read all three values from $NIRMAN_APP" >&2
  echo "is the machine running?  flyctl status --app $NIRMAN_APP" >&2
  exit 1
fi

# jdbc:postgresql://ep-xxx.region.aws.neon.tech/neondb?sslmode=require
#   direct host -> ep-xxx.region.aws.neon.tech
#   pooled host -> ep-xxx-pooler.region.aws.neon.tech
direct_host=$(printf '%s' "$jdbc_url" | sed -E 's#^jdbc:postgresql://##; s#/.*$##')
admin_db=$(printf '%s' "$jdbc_url" | sed -E 's#^[^/]*//[^/]+/##; s#\?.*$##')
pooled_host=$(printf '%s' "$direct_host" | sed -E 's#^([^.]+)\.#\1-pooler.#')

echo "    endpoint: $direct_host"
echo "    pooled:   $pooled_host"

# CREATE DATABASE cannot run inside a transaction, and PgBouncer in transaction
# mode would wrap it in one — so this step uses the DIRECT endpoint. The app
# itself uses the pooled one, which is fine because the HTTP driver holds no
# prepared-statement state.
admin_url="postgresql://${db_user}:${db_pass}@${direct_host}/${admin_db}?sslmode=require"
tofu_url="postgresql://${db_user}:${db_pass}@${pooled_host}/${DB_NAME}?sslmode=require"

echo "==> Creating database '$DB_NAME' if it does not already exist"
if psql "$admin_url" -tAc "SELECT 1 FROM pg_database WHERE datname='${DB_NAME}'" | grep -q 1; then
  echo "    already exists"
else
  psql "$admin_url" -c "CREATE DATABASE ${DB_NAME}"
  echo "    created"
fi

echo "==> Setting DATABASE_URL on the Fly app"
flyctl secrets import --app "$TOFU_APP" >/dev/null <<EOF
DATABASE_URL=$tofu_url
EOF

echo "==> Setting DATABASE_URL as a GitHub Actions secret"
printf '%s' "$tofu_url" | gh secret set DATABASE_URL --repo "$REPO"

echo "==> Creating a Fly deploy token and setting FLY_API_TOKEN"
# Scoped to this app alone — nirman's token is never reused, and the value goes
# straight from flyctl into the GitHub secret without touching a terminal.
flyctl tokens create deploy --app "$TOFU_APP" --name github-actions --expiry 8760h \
  | tr -d '\n' \
  | gh secret set FLY_API_TOKEN --repo "$REPO"

echo
echo "==> Done. Repository secrets now set:"
gh secret list --repo "$REPO"
echo
echo "Next, trigger the first deploy:"
echo "  git commit --allow-empty -m 'Trigger first deploy' && git push"
