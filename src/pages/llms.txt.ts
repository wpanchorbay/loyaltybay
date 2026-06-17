import type { APIRoute } from 'astro';
import { getDocsForLlms, renderLlmsIndex } from '../lib/llms';

export const prerender = true;

export const GET: APIRoute = async () => {
	const entries = await getDocsForLlms();
	return new Response(renderLlmsIndex(entries), {
		headers: {
			'Content-Type': 'text/plain; charset=utf-8',
		},
	});
};
