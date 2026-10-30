#!/usr/bin/env bash
# Calls the listings API directly. Usage: MWG_KEY=... ./scripts/listings.sh "family vacations" [client_ip]
set -euo pipefail
: "${MWG_KEY:?set MWG_KEY}"
Q="${1:?usage: listings.sh <query> [client_ip]}"
IP="${2:-76.142.231.100}"
UA='Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36'
curl -sS -G "https://tracking.session1.com/mwg/xml/listings" \
  --data-urlencode "q=$Q" \
  --data-urlencode "type=${SUBID:-abc123}" \
  --data-urlencode "num=${NUM_ADS:-3}" \
  --data-urlencode "key=$MWG_KEY" \
  --data-urlencode "ip=$IP" \
  --data-urlencode "country=us" \
  --data-urlencode "ua=$UA" \
  --data-urlencode "serveUrl=${SERVE_URL:-https://marketplace.shopdepot.us/results}"
