#!/usr/bin/env node
import { createServer } from 'node:http';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { extname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(fileURLToPath(new URL('.', import.meta.url)), '..');
const DOCS_DIR = join(ROOT, 'src', 'content', 'docs');
const PORT = Number(process.env.PORT || 8787);
const PROTOCOL_VERSION = '2025-06-18';

function walk(dir) {
	const entries = [];
	for (const name of readdirSync(dir)) {
		const fullPath = join(dir, name);
		if (statSync(fullPath).isDirectory()) {
			entries.push(...walk(fullPath));
			continue;
		}
		if (['.md', '.mdx'].includes(extname(name))) {
			entries.push(fullPath);
		}
	}
	return entries;
}

function stripFrontmatter(content) {
	return content.replace(/^---[\s\S]*?---\s*/, '').trim();
}

function readDocs() {
	return walk(DOCS_DIR)
		.map((filePath) => {
			const id = relative(DOCS_DIR, filePath).replace(/\\/g, '/').replace(/\.mdx?$/, '');
			const raw = readFileSync(filePath, 'utf8');
			const title = raw.match(/^title:\s*(.+)$/m)?.[1]?.trim() || id;
			const description = raw.match(/^description:\s*(.+)$/m)?.[1]?.trim() || '';
			return {
				id,
				uri: `license-server-for-woocommerce://${id}`,
				title,
				description,
				text: stripFrontmatter(raw),
			};
		})
		.filter((doc) => doc.id !== '404')
		.sort((a, b) => a.id.localeCompare(b.id));
}

const docs = readDocs();

function findDoc(uriOrId) {
	return docs.find((doc) => doc.uri === uriOrId || doc.id === uriOrId || doc.id === uriOrId?.replace(/^\/+/, ''));
}

function searchDocs(query) {
	const needle = String(query || '').trim().toLowerCase();
	if (!needle) {
		return docs.slice(0, 12);
	}
	return docs
		.map((doc) => {
			const haystack = `${doc.title}\n${doc.description}\n${doc.text}`.toLowerCase();
			return {
				doc,
				score: haystack.includes(needle) ? 1 : 0,
			};
		})
		.filter((result) => result.score > 0)
		.map((result) => result.doc)
		.slice(0, 12);
}

const prompts = {
	setup_license_server:
		'Use the License Server docs to guide a WordPress/WooCommerce admin through installation, software release setup, product configuration, and verification.',
	integrate_client_plugin:
		'Use the License Server docs to design a client plugin integration with activation, license checks, cached status, update checks, and protected downloads.',
	troubleshoot_license_activation:
		'Use the License Server troubleshooting and REST docs to diagnose why a license activation, check, update-check, or download request is failing.',
};

function result(value) {
	return { jsonrpc: '2.0', result: value };
}

function error(code, message) {
	return { jsonrpc: '2.0', error: { code, message } };
}

async function handleRequest(message) {
	const { id, method, params = {} } = message || {};

	if (method?.startsWith('notifications/')) {
		return null;
	}

	let response;
	switch (method) {
		case 'initialize':
			response = result({
				protocolVersion: PROTOCOL_VERSION,
				capabilities: {
					resources: {},
					tools: {},
					prompts: {},
				},
				serverInfo: {
					name: 'license-server-for-woocommerce',
					version: '0.1.0',
				},
			});
			break;
		case 'resources/list':
			response = result({
				resources: docs.map((doc) => ({
					uri: doc.uri,
					name: doc.title,
					description: doc.description,
					mimeType: 'text/markdown',
				})),
			});
			break;
		case 'resources/read': {
			const doc = findDoc(params.uri);
			response = doc
				? result({
						contents: [
							{
								uri: doc.uri,
								mimeType: 'text/markdown',
								text: doc.text,
							},
						],
					})
				: error(-32004, `Unknown resource: ${params.uri}`);
			break;
		}
		case 'tools/list':
			response = result({
				tools: [
					{
						name: 'search_license_server_docs',
						description: 'Search License Server documentation and agent guide pages.',
						inputSchema: {
							type: 'object',
							properties: {
								query: { type: 'string' },
							},
							required: ['query'],
						},
					},
					{
						name: 'get_license_server_doc',
						description: 'Read a License Server documentation page by resource URI or document id.',
						inputSchema: {
							type: 'object',
							properties: {
								id: { type: 'string' },
							},
							required: ['id'],
						},
					},
				],
			});
			break;
		case 'tools/call':
			response = handleToolCall(params);
			break;
		case 'prompts/list':
			response = result({
				prompts: Object.entries(prompts).map(([name, description]) => ({ name, description })),
			});
			break;
		case 'prompts/get': {
			const prompt = prompts[params.name];
			response = prompt
				? result({
						description: prompt,
						messages: [
							{
								role: 'user',
								content: {
									type: 'text',
									text: prompt,
								},
							},
						],
					})
				: error(-32004, `Unknown prompt: ${params.name}`);
			break;
		}
		default:
			response = error(-32601, `Method not found: ${method}`);
	}

	if (id !== undefined && response) {
		response.id = id;
	}
	return response;
}

function handleToolCall(params) {
	const args = params.arguments || {};
	if (params.name === 'search_license_server_docs') {
		const matches = searchDocs(args.query);
		return result({
			content: [
				{
					type: 'text',
					text: matches
						.map((doc) => `${doc.title}\nURI: ${doc.uri}\n${doc.description}`)
						.join('\n\n'),
				},
			],
		});
	}
	if (params.name === 'get_license_server_doc') {
		const doc = findDoc(args.id);
		return doc
			? result({
					content: [{ type: 'text', text: doc.text }],
				})
			: error(-32004, `Unknown document: ${args.id}`);
	}
	return error(-32602, `Unknown tool: ${params.name}`);
}

function startStdio() {
	let buffer = '';
	process.stdin.setEncoding('utf8');
	process.stdin.on('data', async (chunk) => {
		buffer += chunk;
		const lines = buffer.split('\n');
		buffer = lines.pop() || '';
		for (const line of lines) {
			if (!line.trim()) {
				continue;
			}
			const response = await handleRequest(JSON.parse(line));
			if (response) {
				process.stdout.write(`${JSON.stringify(response)}\n`);
			}
		}
	});
}

function readBody(request) {
	return new Promise((resolve, reject) => {
		let body = '';
		request.setEncoding('utf8');
		request.on('data', (chunk) => {
			body += chunk;
		});
		request.on('end', () => resolve(body));
		request.on('error', reject);
	});
}

function startHttp() {
	const server = createServer(async (request, response) => {
		if (request.url !== '/mcp' || request.method !== 'POST') {
			response.writeHead(404, { 'Content-Type': 'application/json' });
			response.end(JSON.stringify({ error: 'Use POST /mcp for MCP JSON-RPC requests.' }));
			return;
		}

		try {
			const body = await readBody(request);
			const payload = JSON.parse(body);
			const messages = Array.isArray(payload) ? payload : [payload];
			const replies = [];
			for (const message of messages) {
				const reply = await handleRequest(message);
				if (reply) {
					replies.push(reply);
				}
			}
			response.writeHead(200, { 'Content-Type': 'application/json' });
			response.end(JSON.stringify(Array.isArray(payload) ? replies : replies[0] || null));
		} catch (err) {
			response.writeHead(400, { 'Content-Type': 'application/json' });
			response.end(JSON.stringify(error(-32700, err instanceof Error ? err.message : 'Invalid request')));
		}
	});

	server.listen(PORT, () => {
		console.error(`License Server for WooCommerce MCP listening on http://localhost:${PORT}/mcp`);
	});
}

if (process.argv.includes('--http')) {
	startHttp();
} else {
	startStdio();
}
