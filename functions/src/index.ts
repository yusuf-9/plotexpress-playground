import { parseCSV, parseExcel, validateFileType, validateFileSize, convertToArrayOfObjects } from './utils';
import { S3RequestPresigner } from '@aws-sdk/s3-request-presigner';
import { HttpRequest } from '@aws-sdk/protocol-http';
import { Hash } from '@aws-sdk/hash-node';
import { formatUrl } from '@aws-sdk/util-format-url';
import { nanoid } from 'nanoid';

interface FileData {
	name: string;
	type: string;
	data: ArrayBuffer;
}

export interface Env {
	R2_ACCESS_KEY_ID: string;
	R2_SECRET_ACCESS_KEY: string;
	R2_BUCKET_NAME: string;
	R2_REGION: string;
	R2_ENDPOINT: string;
}

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		// Enable CORS
		if (request.method === 'OPTIONS') {
			return new Response(null, {
				headers: {
					'Access-Control-Allow-Origin': '*',
					'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
					'Access-Control-Allow-Headers': 'Content-Type',
				},
			});
		}

		// Health check endpoint
		if (request.method === 'GET' && new URL(request.url).pathname === '/api/health') {
			return new Response(JSON.stringify({ status: 'OK' }), {
				headers: {
					'Content-Type': 'application/json',
					'Access-Control-Allow-Origin': '*',
				},
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

		// GET test-files metadata
		if (request.method === 'GET' && new URL(request.url).pathname === '/api/test-files-metadata') {
			return new Response(
				JSON.stringify({
					data: [
						{
							label: 'Stock Prices',
							description: 'Daily open, high, low, close prices and trading volumes for popular tech stocks over the past month.',
							category: 'Finance & Economics',
							link: env.R2_ENDPOINT + '/stock_prices.json',
						},
						{
							label: 'Inflation Rates',
							description: 'Yearly inflation rates from 2010 to 2024 for major global economies.',
							category: 'Finance & Economics',
							link: env.R2_ENDPOINT + '/inflation_rates.json',
						},
						{
							label: 'Cryptocurrency Trends',
							description: 'Daily price trends for major cryptocurrencies like BTC and ETH over the past month.',
							category: 'Finance & Economics',
							link: env.R2_ENDPOINT + '/crypto_trends.json',
						},
						{
							label: 'Population Growth',
							description: 'Yearly population data from 2000 to 2024 for several major countries.',
							category: 'Demographics & Society',
							link: env.R2_ENDPOINT + '/population_growth.json',
						},
						{
							label: 'Birth and Death Rates',
							description: 'Annual birth and death rates from 2000 to 2024 across selected countries.',
							category: 'Demographics & Society',
							link: env.R2_ENDPOINT + '/birth_death_rates.json',
						},
						{
							label: 'Average Temperature',
							description: 'Average yearly temperature (in Celsius) in global cities from 2000 to 2024.',
							category: 'Environment & Nature',
							link: env.R2_ENDPOINT + '/avg_temperature.json',
						},
						{
							label: 'Rainfall by Region',
							description: 'Monthly rainfall data (in millimeters) for various geographic regions.',
							category: 'Environment & Nature',
							link: env.R2_ENDPOINT + '/rainfall.json',
						},
						{
							label: 'Student Grades',
							description: 'Simulated grades for students across four subjects: Math, Science, History, and English.',
							category: 'Education & Learning',
							link: env.R2_ENDPOINT + '/student_grades.json',
						},
						{
							label: 'Test Scores Over Time',
							description: 'Average test scores by subject from 2010 to 2024.',
							category: 'Education & Learning',
							link: env.R2_ENDPOINT + '/test_scores.json',
						},
						{
							label: 'Fitness Tracking',
							description: 'Simulated daily fitness stats for users, including steps, calories burned, and active minutes.',
							category: 'Fun Ideas',
							link: env.R2_ENDPOINT + '/fitness_tracking.json',
						},
						{
							label: 'Music Listening Stats',
							description: 'Daily music listening stats for users including number of songs played, minutes listened, and top genre.',
							category: 'Fun Ideas',
							link: env.R2_ENDPOINT + '/music_listening_stats.json',
						},
						{
							label: 'Retail Transactions',
							description: 'Simulated retail transactions for users across different categories.',
							category: 'Large Files',
							link: env.R2_ENDPOINT + '/retail_transactions.json',
						},
					],
				}),
				{
					headers: {
						'Content-Type': 'application/json',
						'Access-Control-Allow-Origin': '*',
					},
				}
			);
		}

		if (request.method === 'GET' && new URL(request.url).pathname === '/api/generate-upload-urls') {
			const folderId = nanoid();

			const dataKey = `${folderId}/data.json`;
			const configKey = `${folderId}/config.json`;

			const signer = new S3RequestPresigner({
				region: env.R2_REGION,
				credentials: {
					accessKeyId: env.R2_ACCESS_KEY_ID,
					secretAccessKey: env.R2_SECRET_ACCESS_KEY,
				},
				sha256: Hash.bind(null, 'sha256'),
			});

			const createSignedUrl = async (key: string) => {
				const request = new HttpRequest({
					method: 'PUT',
					protocol: 'https:',
					hostname: env.R2_ENDPOINT,
					headers: {
						host: env.R2_ENDPOINT,
					},
				});

				const signed = await signer.presign(request, { expiresIn: 900 }); // 15 min
				return formatUrl(signed);
			};

			const dataSignedUrl = await createSignedUrl(dataKey);
			const configSignedUrl = await createSignedUrl(configKey);

			return new Response(
				JSON.stringify({
					data: {
						dataFileUploadURI: dataSignedUrl,
						configFileUploadURI: configSignedUrl,
						sharedWorkspaceId: folderId,
					},
				}),
				{
					headers: {
						'Content-Type': 'application/json',
						'Access-Control-Allow-Origin': '*',
					},
				}
			);
		}

		return new Response('Not Found', {
			status: 404,
			headers: {
				'Access-Control-Allow-Origin': '*',
			},
		});
	},
} satisfies ExportedHandler<Env>;
