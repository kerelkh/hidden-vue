# Hidden Monitoring (Vue 3 + Electron)

Real-time live TV monitoring for Indonesia. Built with Vue 3, TypeScript, Vite, Tailwind CSS, and packaged with Electron for desktop installation.

## Features

- **Dashboard**: Live TV streams from Indonesian channels (YouTube embeds). Toggle individual channels on/off.
- **No backend required** — runs entirely on the client.
- **Desktop app** via Electron (installable on Windows, macOS, Linux).

## Tech Stack

- Vue 3 (Composition API + TypeScript)
- Vue Router (hash mode)
- Tailwind CSS 4
- Swiper (carousels — currently unused but available)
- Electron (desktop packaging)

## Setup & Development

```bash
# Install dependencies
npm install

# Run web dev server (browser)
npm run dev

# Build for web
npm run build
npm run preview
```

## Build Desktop App (Electron)

```bash
# Install Electron dependencies first
npm install --save-dev electron electron-builder

# Run Electron in development (builds Vue first, then launches app)
npm run electron:dev

# Build distributable installers (Windows/Linux)
npm run electron:build
```

Built installers will be in the `release/` directory.

## Deployment

### Web
- Deploy the `dist/` folder to any static host (Caddy, GitHub Pages, Netlify, Vercel).
- CSP is configured in `index.html` for YouTube embeds.

### Desktop
- Use `npm run electron:build` to create platform-specific installers (`.exe`, `.AppImage`, etc.).
- The `release/` folder contains the installers.

## Architecture

- **Channels**: Managed via `src/composables/useChannels.ts`. Stored in `localStorage` with defaults for Indonesian news channels.
- **Dashboard**: `src/views/Dashboard.vue` displays a grid of YouTube embeds. Toggle channels via sidebar.
- **No authentication, no server, no RSS fetching** — entirely client-side.

## CSP (Content Security Policy)

`index.html` includes a CSP meta tag allowing:
- Scripts and styles from `'self'`
- YouTube embeds (`frame-src`)
- Fonts from fonts.bunny.net

Adjust as needed for your deployment.

## Future Ideas

- Add RSS feed fetch with a tiny backend (if automation needed)
- Multi-device sync via a simple backend
- More channels/customization

## License

MIT (or choose your own)