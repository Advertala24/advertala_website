# Advertala sites

| Folder | Site | Stack |
| --- | --- | --- |
| `/` (repo root) | advertala.net clone | Vite + React, served by nginx |
| [`shopdepot/`](shopdepot/) | marketplace.shopdepot.us search lander | Node (Express) + React, server-side ad fetch |

## advertala.net (root)

    npm install
    npm run dev                                   # dev server
    docker compose up --build                     # http://localhost:8080

- Contact page is an "Email us" button that opens the visitor's mail app (`mailto:info@advertala.net`).
- Browser Technology platform icons are still text chips; drop images into `public/images/`.

## marketplace.shopdepot.us

See [`shopdepot/README.md`](shopdepot/README.md) for setup, DNS, the listings API and the earnings report.
