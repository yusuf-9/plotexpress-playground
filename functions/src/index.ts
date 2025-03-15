import { parseCSV, parseExcel, validateFileType, validateFileSize, convertToArrayOfObjects } from './utils';

interface FileData {
	name: string;
	type: string;
	data: ArrayBuffer;
}

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		// Enable CORS
		if (request.method === 'OPTIONS') {
			return new Response(null, {
				headers: {
					'Access-Control-Allow-Origin': '*',
					'Access-Control-Allow-Methods': 'POST, OPTIONS',
					'Access-Control-Allow-Headers': 'Content-Type',
				},
			});
		}

		// Health check endpoint
		if (request.method === 'GET' && new URL(request.url).pathname === '/health') {
			return new Response(JSON.stringify({ status: 'OK' }), {
				headers: { 'Content-Type': 'application/json' },
			});
		}

		// File parsing endpoint
		if (request.method === 'POST' && new URL(request.url).pathname === '/api/parse') {
			try {
				const formData = await request.formData();
				const file = formData.get('file');

				if (!file || !(file instanceof File)) {
					return new Response(JSON.stringify({ error: 'No file uploaded' }), {
						status: 400,
						headers: { 'Content-Type': 'application/json' },
					});
				}

				// Validate file size
				await validateFileSize(file.size);

				// Validate and determine file type
				const fileType = validateFileType(file.name);
				if (!fileType) {
					return new Response(JSON.stringify({ error: 'Invalid file type. Only CSV, JSON, and Excel (.xlsx) are supported.' }), {
						status: 400,
						headers: { 'Content-Type': 'application/json' },
					});
				}

				let parsedData;
				const arrayBuffer = await file.arrayBuffer();

				if (fileType === 'csv') {
					const text = new TextDecoder().decode(arrayBuffer);
					const csvData = await parseCSV(text);
					parsedData = convertToArrayOfObjects(csvData);
				} else if (fileType === 'json') {
					const text = new TextDecoder().decode(arrayBuffer);
					parsedData = JSON.parse(text);
				} else if (fileType === 'excel') {
					const excelData = await parseExcel(arrayBuffer);
					parsedData = convertToArrayOfObjects(excelData);
				}

				return new Response(JSON.stringify({ data: parsedData }), {
					headers: {
						'Content-Type': 'application/json',
						'Access-Control-Allow-Origin': '*',
					},
				});
			} catch (error) {
				const status = error instanceof Error && 'status' in error ? (error as any).status : 500;
				return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Something went wrong' }), {
					status,
					headers: {
						'Content-Type': 'application/json',
						'Access-Control-Allow-Origin': '*',
					},
				});
			}
		}

		return new Response('Not Found', { status: 404 });
	},
} satisfies ExportedHandler<Env>;
