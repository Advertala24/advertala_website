# Advertala website

React (Vite) clone of advertala.net.

## Develop
    npm install
    npm run dev

## Docker
    docker build -t advertala-website .
    docker run -p 8080:80 advertala-website   # http://localhost:8080
    # or: docker compose up --build

## Notes
- Contact page is a simple "Email us" button that opens the visitor's mail app (`mailto:info@advertala.net`).
- Outbrain/Taboola/TikTok logos and platform icons are text placeholders; drop real images into `public/images/`.
