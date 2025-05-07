import { parseCSV, parseExcel, validateFileType, validateFileSize, convertToArrayOfObjects } from './utils';
import { AwsClient } from 'aws4fetch';
import { nanoid } from 'nanoid';

export interface Env {
	R2_BASE_URL: string;
	R2_ACCESS_KEY_ID: string;
	R2_SECRET_ACCESS_KEY: string;
	R2_BUCKET_NAME: string;
	R2_REGION: string;
	R2_ACCOUNT_ID: string;
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
							fileName: 'stock_prices.json',
						},
						{
							label: 'Inflation Rates',
							description: 'Yearly inflation rates from 2010 to 2024 for major global economies.',
							category: 'Finance & Economics',
							fileName: 'inflation_rates.json',
						},
						{
							label: 'Cryptocurrency Trends',
							description: 'Daily price trends for major cryptocurrencies like BTC and ETH over the past month.',
							category: 'Finance & Economics',
							fileName: 'crypto_trends.json',
						},
						{
							label: 'Population Growth',
							description: 'Yearly population data from 2000 to 2024 for several major countries.',
							category: 'Demographics & Society',
							fileName: 'population_growth.json',
						},
						{
							label: 'Birth and Death Rates',
							description: 'Annual birth and death rates from 2000 to 2024 across selected countries.',
							category: 'Demographics & Society',
							fileName: 'birth_rates.json',
						},
						{
							label: 'Average Temperature',
							description: 'Average yearly temperature (in Celsius) in global cities from 2000 to 2024.',
							category: 'Environment & Nature',
							fileName: 'avg_temperature.json',
						},
						{
							label: 'Rainfall by Region',
							description: 'Monthly rainfall data (in millimeters) for various geographic regions.',
							category: 'Environment & Nature',
							fileName: 'rainfall.json',
						},
						{
							label: 'Student Grades',
							description: 'Simulated grades for students across four subjects: Math, Science, History, and English.',
							category: 'Education & Learning',
							fileName: 'student_grades.json',
						},
						{
							label: 'Test Scores Over Time',
							description: 'Average test scores by subject from 2010 to 2024.',
							category: 'Education & Learning',
							fileName: 'test_scores.json',
						},
						{
							label: 'Fitness Tracking',
							description: 'Simulated daily fitness stats for users, including steps, calories burned, and active minutes.',
							category: 'Fun Ideas',
							fileName: 'fitness_tracking.json',
						},
						{
							label: 'Music Listening Stats',
							description: 'Daily music listening stats for users including number of songs played, minutes listened, and top genre.',
							category: 'Fun Ideas',
							fileName: 'music_listening_stats.json',
						},
						{
							label: 'Retail Transactions',
							description: 'Simulated retail transactions for users across different categories.',
							category: 'Large Files',
							fileName: 'retail_transactions.json',
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
			const folderId = nanoid()
			const region = env.R2_REGION || 'auto';
			const baseURL = env.R2_ENDPOINT;
			const expirationSeconds = 15 * 60; // 15 minutes

			const aws = new AwsClient({
				accessKeyId: env.R2_ACCESS_KEY_ID,
				secretAccessKey: env.R2_SECRET_ACCESS_KEY,
				service: 's3',
				region,
			});

			const dataKey = `${folderId}/data.json`;
			const configKey = `${folderId}/config.json`;

			const signedDataUrl = (
				await aws.sign(
					new Request(`${baseURL}/${dataKey}?X-Amz-Expires=${expirationSeconds}`, {
						method: 'PUT',
					}),
					{ aws: { signQuery: true } }
				)
			).url.toString();

			const signedConfigUrl = (
				await aws.sign(
					new Request(`${baseURL}/${configKey}?X-Amz-Expires=${expirationSeconds}`, {
						method: 'PUT',
					}),
					{ aws: { signQuery: true } }
				)
			).url.toString();

			return new Response(
				JSON.stringify({
					data: {
						dataFileUploadURI: signedDataUrl,
						configFileUploadURI: signedConfigUrl,
						sharedWorkspaceId: folderId,
					}
				}),
				{
					headers: {
						'Content-Type': 'application/json',
						'Access-Control-Allow-Origin': '*',
					},
				}
			);
		}

		if (request.method === 'GET' && new URL(request.url).pathname === '/api/generate-file-access-url') {
			const region = env.R2_REGION || 'auto';
			const baseURL = env.R2_ENDPOINT;
			const expirationSeconds = 15 * 60; // 15 minutes

			const aws = new AwsClient({
				accessKeyId: env.R2_ACCESS_KEY_ID,
				secretAccessKey: env.R2_SECRET_ACCESS_KEY,
				service: 's3',
				region,
			});

			// Parse the URL and get the query parameter
			const url = new URL(request.url);
			const fileNameParam = url.searchParams.get('file_name');

			if (!fileNameParam) {
				return new Response(JSON.stringify({ error: 'Missing file_name query parameter' }), {
					status: 400,
					headers: { 'Content-Type': 'application/json' },
				});
			}

			// Decode URI component to allow slashes and other safe characters
			const fileKey = decodeURIComponent(fileNameParam);

			const signedUrl = (
				await aws.sign(
					new Request(`${baseURL}/${fileKey}?X-Amz-Expires=${expirationSeconds}`, {
						method: 'GET',
					}),
					{ aws: { signQuery: true } }
				)
			).url.toString();

			return new Response(
				JSON.stringify({
					data: signedUrl,
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
