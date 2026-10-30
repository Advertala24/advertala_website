# ShopDepot lander (marketplace.shopdepot.us)

Dark-theme, mobile-first search lander that shows sponsored listings from the
MediaWave `listings` XML API.

- `/` – search box
- `/results?q=<keywords>[&subid=<id>]` – results page. `subid` is sent to the API as `type`.

## How it works

The Node server (`server/`) calls the listings API **server-side** so the API key never reaches the browser. It sends the
**visitor's** IP (from `X-Forwarded-For`) and user-agent, `country=us`, `num`, and `serveUrl` (`SERVE_URL`, no query string).
The XML is parsed into ads plus the tokens `SearchID`, `ClientID`, `ImpressionGUID`, `RGUId`.

The HTML response then contains:

1. the Clarity/Yahoo beacon `<script>` + 1x1 `<img>` at the very top of `<head>`, with the tokens filled in;
2. `window.__DATA__` with the ads;
3. React renders each ad as `<li data-yiid data-appns data-k data-admd>`;
4. `mwgpageload.js?v=15` is appended to the bottom of `<body>` after the ads are in the DOM.

Footer links: Privacy Policy, Contact Us, For Advertisers (as supplied by the partner).

> The XML response schema was not in the integration notes. `server/xml.js` finds ads structurally (any node with an
> `ImpressionId`) and matches field names case-insensitively. Run with `DEBUG_RAW=1` against the real API, then tighten
> the field names if anything renders empty.

## Run

    cp .env.example .env      # set MWG_KEY
    npm install && npm run build
    set -a; . ./.env; set +a; npm start         # http://localhost:3000

Docker:

    docker compose up --build                   # reads .env, http://localhost:3000

Tests: `npm test`.

## Deploy / DNS

Point `marketplace.shopdepot.us` at the host running this container (A record to its public IP, or a CNAME to its hostname)
and terminate TLS in front of it (the page must be served over HTTPS). Keep the proxy passing the real client IP in
`X-Forwarded-For`; the API needs the visitor's IP, not the server's.

## cURL helpers

    export MWG_KEY=...                                   # never commit this
    ./scripts/listings.sh "family vacations"             # raw listings XML
    ./scripts/report.sh 2024-06-05 2024-06-05            # earnings report (JSON)

The report endpoint is intentionally not exposed by the web app, since it uses the same key.
