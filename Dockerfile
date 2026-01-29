FROM node:22-bookworm-slim

# Install git (required for some npm dependencies)
RUN apt-get update && apt-get install -y git && rm -rf /var/lib/apt/lists/*

# Install clawdbot (moltbot's npm package name)
RUN npm install -g clawdbot@latest

# Cloudflare Containers require port 8080
EXPOSE 8080

# Create workspace for node user
RUN mkdir -p /home/node/workspace && chown -R node:node /home/node/workspace

# Security hardening: run as non-root
USER node

# Configure gateway and agent settings via clawdbot config
RUN clawdbot config set gateway.mode local && \
    clawdbot config set gateway.port 8080 && \
    clawdbot config set gateway.bind lan && \
    clawdbot config set gateway.controlUi.allowInsecureAuth true && \
    clawdbot config set agents.defaults.model.primary "anthropic/claude-sonnet-4-5" && \
    clawdbot config set agents.defaults.workspace "/home/node/workspace"

# Run gateway
# Note: CLAWDBOT_GATEWAY_TOKEN is passed via Cloudflare Worker envVars
CMD ["clawdbot", "gateway", "run", "--force"]
