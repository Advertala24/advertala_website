#!/usr/bin/env bash
# Publisher earnings report (reporting.mediawavegroup.org/json/pubstats).
# Usage: MWG_KEY=... ./scripts/report.sh [start YYYY-MM-DD] [end YYYY-MM-DD]
#   no args        -> yesterday
#   one date       -> that day
# Output is pretty-printed when jq is installed.
set -euo pipefail
cd "$(dirname "$0")/.."
[ -z "${MWG_KEY:-}" ] && [ -f .env ] && { set -a; . ./.env; set +a; }
: "${MWG_KEY:?set MWG_KEY (env var or .env)}"
START="${1:-$(date -u -d yesterday +%F)}"
END="${2:-$START}"
out=$(curl -fsS -G "https://reporting.mediawavegroup.org/json/pubstats" \
  --data-urlencode "key=$MWG_KEY" \
  --data-urlencode "start_date=$START" \
  --data-urlencode "end_date=$END")
if command -v jq >/dev/null; then jq . <<<"$out"; else echo "$out"; fi
