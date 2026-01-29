# Moltbot Cloudflare Deployment

Deploy [moltbot](https://github.com/moltbot/moltbot) to Cloudflare Containers.

## Prerequisites

- Docker running locally (`docker info` should succeed)
- Cloudflare account with Containers enabled (beta)
- Node.js 18+

## Setup

```bash
npm install
npx wrangler login
```

## Configure Secrets

Add your API keys as Cloudflare secrets:

```bash
npx wrangler secret put ANTHROPIC_API_KEY
npx wrangler secret put OPENAI_API_KEY
# Optional channel tokens:
npx wrangler secret put DISCORD_TOKEN
npx wrangler secret put TELEGRAM_TOKEN
```

## Deploy

```bash
npm run deploy
```

First deployment takes several minutes for container provisioning.

## Commands

```bash
npm run deploy   # Deploy to Cloudflare
npm run status   # List running containers
npm run images   # List container images
npm run logs     # Tail logs
```

## Configuration

Edit `wrangler.toml` to adjust:

- `max_instances` - Maximum concurrent container instances (default: 5)
- `sleepAfter` in `src/index.ts` - Container idle timeout (default: 5m)

## Pin moltbot Version

Edit `Dockerfile` to pin a specific version:

```dockerfile
RUN npm install -g moltbot@2026.1.27
```

## Notes

- Gateway available at `https://moltbot.<YOUR_ACCOUNT>.workers.dev`
- Container filesystem is ephemeral; WhatsApp sessions won't persist across container restarts
- For persistent sessions, configure external storage (R2/KV)
