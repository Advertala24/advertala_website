#!/usr/bin/env bash
# Smoke-test a running lander (local or deployed) against the partner's requirements.
# Usage: ./scripts/smoke.sh [base_url] [query]
#   ./scripts/smoke.sh http://localhost:3000
#   ./scripts/smoke.sh https://marketplace.shopdepot.us "family vacations"
set -uo pipefail
BASE="${1:-http://localhost:3000}"
Q="${2:-family vacations}"
fail=0
ok()  { echo "  ok   $1"; }
bad() { echo "  FAIL $1"; fail=1; }
check() { local d="$1"; shift; if "$@" >/dev/null 2>&1; then ok "$d"; else bad "$d"; fi; }

HTML=$(curl -sS -m 20 -G "$BASE/results" --data-urlencode "q=$Q" --data-urlencode "subid=smoke") || { echo "request failed"; exit 1; }
echo "GET $BASE/results?q=$Q"

check "beacon script present"            grep -q "selectTier('init'" <<<"$HTML"
check "beacon <img> present"             grep -q 'search.yahoo.com/beacon/geop' <<<"$HTML"
check "beacon ysid is filled in"         grep -Eq "ysid:'[^']+'" <<<"$HTML"
check "no unfilled [Placeholders]"       bash -c '! grep -Eq "\[(SearchID|ClientID|ImpressionGUID|RGUId)\]" <<<"$0"' "$HTML"
# Beacon must come before every other <script> in the document.
first_script=$(grep -n '<script' <<<"$HTML" | head -1 | cut -d: -f1)
beacon_line=$(grep -n "selectTier('init'" <<<"$HTML" | head -1 | cut -d: -f1)
if [ -n "$first_script" ] && [ -n "$beacon_line" ] && [ "$beacon_line" -le $((first_script + 6)) ]; then ok "beacon is the first script"; else bad "beacon is the first script"; fi
check "ads in page data"                 grep -q '"impressionId":"' <<<"$HTML"
check "page loads app bundle"            grep -q '/assets/index-' <<<"$HTML"
for p in / /privacy /contact; do
  code=$(curl -s -o /dev/null -w '%{http_code}' -m 20 "$BASE$p"); [ "$code" = 200 ] && ok "GET $p -> 200" || bad "GET $p -> $code"
done
code=$(curl -s -o /dev/null -w '%{http_code}' -m 20 "$BASE/healthz"); [ "$code" = 200 ] && ok "healthz" || bad "healthz -> $code"
echo "(data-yiid / data-appns / data-k / data-admd and mwgpageload.js are added client-side; check them in a browser.)"
exit $fail
