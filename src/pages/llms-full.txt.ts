import type { APIRoute } from 'astro';
import { getDocsForLlms, renderLlmsFull } from '../lib/llms';

export const prerender = true;

export const GET: APIRoute = async () => {
	const entries = await getDocsForLlms();
	return new Response(renderLlmsFull(entries), {
		headers: {
			'Content-Type': 'text/plain; charset=utf-8',
		},
	});
};
