#!/usr/bin/env bash
# Publisher earnings report. Usage: MWG_KEY=... ./scripts/report.sh 2024-06-05 2024-06-05
set -euo pipefail
: "${MWG_KEY:?set MWG_KEY}"
START="${1:?usage: report.sh <start YYYY-MM-DD> [end YYYY-MM-DD]}"
END="${2:-$START}"
curl -sS -G "https://reporting.mediawavegroup.org/json/pubstats" \
  --data-urlencode "key=$MWG_KEY" \
  --data-urlencode "start_date=$START" \
  --data-urlencode "end_date=$END"
