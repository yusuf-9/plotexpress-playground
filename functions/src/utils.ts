import * as XLSX from 'xlsx';
import Papa from 'papaparse';

export const validateFileType = (fileName: string): 'csv' | 'json' | 'excel' | null => {
	if (fileName.endsWith('.csv')) {
		return 'csv';
	} else if (fileName.endsWith('.json')) {
		return 'json';
	} else if (fileName.endsWith('.xlsx')) {
		return 'excel';
	}
	return null;
};

export const validateFileSize = async (fileSize: number): Promise<void> => {
	const fileSizeLimit = 10 * 1024 * 1024; // 10MB limit
	if (fileSize > fileSizeLimit) {
		const error = new Error(`File size exceeds the limit of ${fileSizeLimit} bytes.`);
		(error as any).status = 400;
		throw error;
	}
};

export const parseCSV = async (content: string): Promise<string[][]> => {
	return new Promise((resolve, reject) => {
		Papa.parse(content, {
			header: false,
			complete: (result) => {
				// Cast the unknown[][] to string[][] since we know CSV data will be strings
				const data = result.data as string[][];
				resolve(data);
			},
			error: (error: Error) => reject(error),
		});
	});
};

export const parseExcel = async (content: ArrayBuffer): Promise<string[][]> => {
	const workbook = XLSX.read(content, { type: 'array' });
	const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
	return XLSX.utils.sheet_to_json(firstSheet, { header: 1 }) as string[][];
};

export const convertToArrayOfObjects = (data: string[][]): Record<string, string> [] => {
	const headers = data[0];
	return data.slice(1).map((row) => {
		const rowData: Record<string, string> = {};
		headers.forEach((header, index) => {
			rowData[header] = row[index];
		});
		return rowData;
	});
};