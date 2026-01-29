FROM node:22-bookworm-slim

# Install moltbot from npm
RUN npm install -g moltbot@latest

# Cloudflare Containers require port 8080
EXPOSE 8080

# Security hardening: run as non-root
USER node

# Run gateway bound to all interfaces on port 8080
CMD ["moltbot", "gateway", "run", "--bind", "0.0.0.0", "--port", "8080", "--force"]
