import { Container } from '@cloudflare/containers';
import { env as cloudflareEnv } from 'cloudflare:workers';

interface Env {
	MOLTBOT_CONTAINER: DurableObjectNamespace<MoltbotContainer> & {
		getByName(name: string): MoltbotContainer;
	};
	// Secrets (add via: npx wrangler secret put <KEY>)
	CLAWDBOT_GATEWAY_TOKEN?: string;
	ANTHROPIC_API_KEY?: string;
	OPENAI_API_KEY?: string;
	BRAVE_API_KEY?: string;
	DISCORD_TOKEN?: string;
	TELEGRAM_TOKEN?: string;
}

// Cast the cloudflare env to our Env type
const env = cloudflareEnv as unknown as Env;

// Moltbot container configuration
export class MoltbotContainer extends Container {
	defaultPort = 8080;
	sleepAfter = '10m';

	// Pass secrets to the container as environment variables
	envVars = {
		...(env.CLAWDBOT_GATEWAY_TOKEN && { CLAWDBOT_GATEWAY_TOKEN: env.CLAWDBOT_GATEWAY_TOKEN }),
		...(env.ANTHROPIC_API_KEY && { ANTHROPIC_API_KEY: env.ANTHROPIC_API_KEY }),
		...(env.OPENAI_API_KEY && { OPENAI_API_KEY: env.OPENAI_API_KEY }),
		...(env.BRAVE_API_KEY && { BRAVE_API_KEY: env.BRAVE_API_KEY }),
		...(env.DISCORD_TOKEN && { DISCORD_TOKEN: env.DISCORD_TOKEN }),
		...(env.TELEGRAM_TOKEN && { TELEGRAM_TOKEN: env.TELEGRAM_TOKEN }),
	};

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
