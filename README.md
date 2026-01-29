# Moltbot Cloudflare Deployment

Deploy [moltbot](https://github.com/moltbot/moltbot) to Cloudflare Containers.

## Prerequisites

- Docker running locally (`docker info` should succeed)
- Cloudflare account with Containers enabled (beta)
- Node.js 18+

## Local Testing

```bash
docker build -t moltbot-cf .
docker run -p 8080:8080 -e CLAWDBOT_GATEWAY_TOKEN=mytoken moltbot-cf
```

## Setup

```bash
npm install
npx wrangler login
```

## Configure Secrets

**Required:**
```bash
npx wrangler secret put CLAWDBOT_GATEWAY_TOKEN
```

**Optional (for AI/channel features):**
```bash
npx wrangler secret put ANTHROPIC_API_KEY
npx wrangler secret put OPENAI_API_KEY
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
- `instance_type` - Container size (default: standard-1, 4GB RAM)

Edit `src/index.ts` to adjust:

- `sleepAfter` - Container idle timeout (default: 10m)

## Pin clawdbot Version

Edit `Dockerfile` to pin a specific version:

```dockerfile
RUN npm install -g clawdbot@2026.1.24
```

## Notes

- Gateway available at `https://moltbot.<YOUR_ACCOUNT>.workers.dev`
- Container filesystem is ephemeral; WhatsApp sessions won't persist across container restarts
- For persistent sessions, configure external storage (R2/KV)
