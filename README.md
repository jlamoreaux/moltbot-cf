# Moltbot Cloudflare Deployment

Deploy [moltbot](https://github.com/moltbot/moltbot) to [Cloudflare Containers](https://developers.cloudflare.com/containers/).

## Prerequisites

- Docker running locally (`docker info` should succeed)
- Cloudflare account with Containers enabled (beta)
- Node.js 22+ (required by Wrangler 4)

## Quick Start

### 1. Clone and install

```bash
git clone https://github.com/jlamoreaux/moltbot-cf.git
cd moltbot-cf
npm install
```

### 2. Local testing

```bash
# Copy example env and add your secrets
cp .env.example .env.local
# Edit .env.local with your values

# Run locally
docker compose up --build
```

Connect to the gateway at `ws://localhost:8080` with your token.

### 3. Deploy to Cloudflare

```bash
# Login to Cloudflare
npx wrangler login

# Add required secrets
npx wrangler secret put CLAWDBOT_GATEWAY_TOKEN
npx wrangler secret put ANTHROPIC_API_KEY

# Deploy
npm run deploy
```

First deployment takes several minutes for container provisioning.

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `CLAWDBOT_GATEWAY_TOKEN` | Yes | Gateway authentication token |
| `ANTHROPIC_API_KEY` | Yes | Anthropic API key for Claude |
| `OPENAI_API_KEY` | No | OpenAI API key (alternative provider) |
| `BRAVE_API_KEY` | No | Brave Search API key for web search |
| `DISCORD_TOKEN` | No | Discord bot token |
| `TELEGRAM_TOKEN` | No | Telegram bot token |

Generate a secure token:
```bash
openssl rand -base64 32
```

## Commands

```bash
npm run deploy   # Deploy to Cloudflare
npm run status   # List running containers
npm run images   # List container images
npm run logs     # Tail logs
```

## Configuration

### Container resources

Edit `wrangler.toml`:

- `max_instances` - Max concurrent containers (default: 5)
- `instance_type` - Container size (default: standard-1, 4GB RAM)

### Container behavior

Edit `src/index.ts`:

- `sleepAfter` - Idle timeout before container sleeps (default: 10m)

### Moltbot settings

Edit `Dockerfile` to change `clawdbot config set` commands:

- `agents.defaults.model.primary` - Default AI model
- `agents.defaults.workspace` - Workspace directory

### Pin clawdbot version

```dockerfile
RUN npm install -g clawdbot@2026.1.24
```

## Security

### Cloudflare Access (recommended)

Protect your gateway with [Cloudflare Zero Trust](https://one.dash.cloudflare.com/):

1. Go to Access → Applications → Add application
2. Select "Self-hosted"
3. Set domain to `moltbot.<YOUR_ACCOUNT>.workers.dev`
4. Add a policy to allow your email

### Gateway token

Always use a strong, unique token for `CLAWDBOT_GATEWAY_TOKEN`.

## Notes

- Gateway URL: `https://moltbot.<YOUR_ACCOUNT>.workers.dev`
- Container filesystem is ephemeral - sessions don't persist across restarts
- For persistent WhatsApp sessions, consider external storage (R2/KV)
- WebSocket connections work through Cloudflare Workers

## Troubleshooting

**"pairing required" error**: The gateway needs `allowInsecureAuth` for token-only auth (already configured in Dockerfile).

**Container not starting**: Check `npm run status` and `npm run logs`.

**WebSocket disconnects**: If using Cloudflare Access, ensure WebSocket connections are allowed.

## License

MIT
