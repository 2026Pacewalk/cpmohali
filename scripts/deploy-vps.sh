#!/usr/bin/env bash
# Build the site and deploy it to the VPS (cpmohali.in).
# The server keeps its own .env (database, secrets) and node_modules; this only replaces dist/ and server/.
# Usage: bash scripts/deploy-vps.sh        (needs the SSH key at ~/.ssh/cpmohali_vps)
set -euo pipefail

HOST=root@163.227.92.219
PORT=22587
KEY="${CPMOHALI_SSH_KEY:-$HOME/.ssh/cpmohali_vps}"
APP=/var/www/cpmohali
SSH=(ssh -i "$KEY" -p "$PORT" -o BatchMode=yes "$HOST")

cd "$(dirname "$0")/.."
npm run build
PKG="$(mktemp -d)/cpmohali-release.tgz"
tar --force-local -czf "$PKG" dist server package.json package-lock.json

scp -i "$KEY" -P "$PORT" -o BatchMode=yes "$PKG" "$HOST:/tmp/cpmohali-release.tgz"
"${SSH[@]}" "set -e
  cd $APP
  old_lock=\$(md5sum package-lock.json | cut -d' ' -f1)
  rm -rf dist.new && mkdir dist.new && tar -xzf /tmp/cpmohali-release.tgz -C dist.new && rm /tmp/cpmohali-release.tgz
  rm -rf dist server.old && mv server server.old && mv dist.new/dist dist && mv dist.new/server server
  mv dist.new/package.json dist.new/package-lock.json . && rm -rf dist.new server.old
  [ \"\$(md5sum package-lock.json | cut -d' ' -f1)\" = \"\$old_lock\" ] || npm ci --omit=dev --no-audit --no-fund
  pm2 reload cpmohali --update-env >/dev/null
  sleep 3
  curl -fsS -o /dev/null -w 'local healthz %{http_code}\n' http://127.0.0.1:3090/healthz"
curl -fsS -o /dev/null -w "https://cpmohali.in %{http_code}\n" https://cpmohali.in/
