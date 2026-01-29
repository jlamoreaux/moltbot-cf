import { Container } from '@cloudflare/containers';

interface Env {
	MOLTBOT_CONTAINER: DurableObjectNamespace<MoltbotContainer> & {
		getByName(name: string): MoltbotContainer;
	};
	// Secrets (add via: npx wrangler secret put <KEY>)
	CLAWDBOT_GATEWAY_TOKEN?: string;
	ANTHROPIC_API_KEY?: string;
	OPENAI_API_KEY?: string;
	DISCORD_TOKEN?: string;
	TELEGRAM_TOKEN?: string;
}

// Moltbot container configuration
export class MoltbotContainer extends Container {
	defaultPort = 8080;
	sleepAfter = '10m';

	// Pass secrets to the container as environment variables
	override get envVars(): Record<string, string> {
		const env = this.env as Env;
		const vars: Record<string, string> = {};

		if (env.CLAWDBOT_GATEWAY_TOKEN) vars.CLAWDBOT_GATEWAY_TOKEN = env.CLAWDBOT_GATEWAY_TOKEN;
		if (env.ANTHROPIC_API_KEY) vars.ANTHROPIC_API_KEY = env.ANTHROPIC_API_KEY;
		if (env.OPENAI_API_KEY) vars.OPENAI_API_KEY = env.OPENAI_API_KEY;
		if (env.DISCORD_TOKEN) vars.DISCORD_TOKEN = env.DISCORD_TOKEN;
		if (env.TELEGRAM_TOKEN) vars.TELEGRAM_TOKEN = env.TELEGRAM_TOKEN;

		return vars;
	}

	override onStart() {
		console.log('Moltbot container started');
	}

	override onError(error: unknown) {
		console.log('Container error:', error);
	}
}

export default {
	async fetch(request: Request, env: Env): Promise<Response> {
		const url = new URL(request.url);

		if (url.pathname === '/health') {
			return new Response('OK', { status: 200 });
		}

		// Use getByName for stateful routing to a single instance
		const container = env.MOLTBOT_CONTAINER.getByName('moltbot-main');

		return container.fetch(request);
	},
};
