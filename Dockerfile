FROM node:22-bookworm-slim

# Install git (required for some npm dependencies)
RUN apt-get update && apt-get install -y git && rm -rf /var/lib/apt/lists/*

# Install clawdbot (moltbot's npm package name)
RUN npm install -g clawdbot@latest

# Cloudflare Containers require port 8080
EXPOSE 8080

# Security hardening: run as non-root
USER node

# Configure gateway for headless operation
RUN clawdbot config set gateway.mode local && \
    clawdbot config set gateway.port 8080 && \
    clawdbot config set gateway.bind lan

# Default token (override with CLAWDBOT_GATEWAY_TOKEN env var at runtime)
ENV CLAWDBOT_GATEWAY_TOKEN=changeme

# Run gateway
CMD ["clawdbot", "gateway", "run", "--force"]
