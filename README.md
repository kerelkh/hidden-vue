# Hidden Monitoring (Vue 3 Standalone)

Real-time news and live TV monitoring for Indonesia. Built with Vue 3, TypeScript, Vite, Tailwind CSS, and Swiper.

## Features

- **Dashboard**: Live TV streams from Indonesian channels (YouTube embeds). Pause/play all, toggle individual channels.
- **News**: Article carousels by category (Criminals, Economy, Intelligence, World). Manual CRUD, local storage persistence.
- **No backend required** — runs entirely in the browser.
- **Content Security Policy** configured for safe embedding.

## Tech Stack

- Vue 3 (Composition API + TypeScript)
- Vue Router (hash mode)
- Tailwind CSS 4
- Swiper (vertical carousels)
- Lucide icons (optional)

## Setup

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Development

The project uses:
- `src/composables/useChannels.ts` — channel state management (localStorage)
- `src/composables/useNews.ts` — article state management (localStorage)
- `src/views/Dashboard.vue` — live TV grid
- `src/views/News.vue` — article carousels with add/edit/delete
- `src/views/Welcome.vue` — landing page

## CSP (Content Security Policy)

`index.html` includes a CSP meta tag that allows:
- Scripts and styles from self
- YouTube embeds
- Fonts from fonts.bunny.net

For production, adjust the CSP as needed.

## Data Model

### Channels
Stored in `localStorage` key `live_tv_channels`. Defaults to 9 Indonesian news channels.

### Articles
Stored in `localStorage` key `hidden_news_articles`, max 1000 items. Categories: `criminals`, `economy`, `intelligence`, `world`.

## Notes

- This app is a client-side only rewrite of the original Laravel + Inertia app (kerelkh/hidden-monitoring).
- No authentication, no server, no RSS fetching. Articles are managed manually.