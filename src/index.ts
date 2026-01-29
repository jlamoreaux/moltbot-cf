import { Container } from 'cloudflare:workers';

interface Env {
	MOLTBOT_CONTAINER: DurableObjectNamespace<MoltbotContainer>;
	// Add secrets via: wrangler secret put <KEY>
	ANTHROPIC_API_KEY?: string;
	OPENAI_API_KEY?: string;
	DISCORD_TOKEN?: string;
	TELEGRAM_TOKEN?: string;
}

// Moltbot container configuration
export class MoltbotContainer extends Container {
	// Gateway listens on port 8080
	defaultPort = 8080;

	// Keep container alive for 5 minutes after last request
	sleepAfter = '5m';

	// Pass environment variables to the container
	override get envVars(): Record<string, string> {
		const env = this.env as Env;
		const vars: Record<string, string> = {};

		// Pass through API keys if configured
		if (env.ANTHROPIC_API_KEY) vars.ANTHROPIC_API_KEY = env.ANTHROPIC_API_KEY;
		if (env.OPENAI_API_KEY) vars.OPENAI_API_KEY = env.OPENAI_API_KEY;
		if (env.DISCORD_TOKEN) vars.DISCORD_TOKEN = env.DISCORD_TOKEN;
		if (env.TELEGRAM_TOKEN) vars.TELEGRAM_TOKEN = env.TELEGRAM_TOKEN;

		return vars;
	}
}

export default {
	async fetch(request: Request, env: Env): Promise<Response> {
		const url = new URL(request.url);

		// Health check endpoint
		if (url.pathname === '/health') {
			return new Response('OK', { status: 200 });
		}

		// Route all requests to a single named container instance
		// Using a fixed name means all requests go to the same stateful instance
		const id = env.MOLTBOT_CONTAINER.idFromName('moltbot-main');
		const container = env.MOLTBOT_CONTAINER.get(id);

		// Forward the request to the container
		return container.fetch(request);
	},
};
