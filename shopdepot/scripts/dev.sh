#!/usr/bin/env bash
# Build and run the lander locally. Loads .env if present.
# Usage: ./scripts/dev.sh          (real API, needs MWG_KEY)
#        ./scripts/dev.sh --mock   (replays the saved sample, no key or network needed)
set -euo pipefail
cd "$(dirname "$0")/.."
[ -f .env ] && { set -a; . ./.env; set +a; }
[ -d node_modules ] || npm install
npm run build

if [ "${1:-}" = "--mock" ]; then
  node scripts/mock-api.mjs 4999 &
  trap 'kill $! 2>/dev/null' EXIT
  export LISTINGS_API=http://localhost:4999/listings MWG_KEY="${MWG_KEY:-mock}"
fi
exec node server/index.js
