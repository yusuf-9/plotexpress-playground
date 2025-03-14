const express = require('express');
const multer = require('multer');
const Papa = require('papaparse');
const XLSX = require('xlsx');
const cors = require('cors');

// Initialize express app
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

const upload = multer({
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

class FileUploadService {
  // Utility function to validate the file type
  static validateFileType(fileName) {
    if (fileName.endsWith('.csv')) {
      return 'csv';
    } else if (fileName.endsWith('.json')) {
      return 'json'; 
    } else if (fileName.endsWith('.xlsx')) {
      return 'excel';
    }
    return null; // Unsupported file type
  }

  // File size validation (10 MB limit)
  static async validateFileSize(fileSize) {
    const fileSizeLimit = 10 * 1024 * 1024;

    if (fileSize > fileSizeLimit) {
      const error = new Error(`File size exceeds the limit of ${fileSizeLimit} bytes.`);
      error.status = 400;
      throw error;
    }
  }

  // CSV parsing using PapaParse
  static async parseCSV(content) {
    return new Promise((resolve, reject) => {
      Papa.parse(content, {
        header: false, // Parse without headers to manually handle
        complete: result => resolve(result.data),
        error: error => reject(error)
      });
    });
  }

  // Excel parsing using XLSX
  static parseExcel(content) {
    const workbook = XLSX.read(content, { type: 'array' });
    const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
    return XLSX.utils.sheet_to_json(firstSheet, { header: 1 }); // Parse to 2D array
  }

  // Convert 2D array to array of objects with headers
  static convertToArrayOfObjects(data) {
    const headers = data[0]; // Assume first row contains headers
    return data.slice(1).map(row => {
      const rowData = {};
      headers.forEach((header, index) => {
        rowData[header] = row[index];
      });
      return rowData;
    });
  }

  // Main method to handle file parsing
  static async handleParseFile(file) {
    // Validate file type
    const fileType = this.validateFileType(file.originalname);
    if (!fileType) {
      const error = new Error('Invalid file type. Only CSV, JSON, and Excel (.xlsx) are supported.');
      error.status = 400;
      throw error;
    }

    let parsedData;

    try {
      if (fileType === 'csv') {
        const fileContent = file.buffer.toString();
        const csvData = await this.parseCSV(fileContent);
        parsedData = this.convertToArrayOfObjects(csvData);
      } else if (fileType === 'json') {
        const fileContent = file.buffer.toString();
        parsedData = JSON.parse(fileContent);
      } else if (fileType === 'excel') {
        const excelData = this.parseExcel(file.buffer);
        parsedData = this.convertToArrayOfObjects(excelData);
      }

      return parsedData;
    } catch (error) {
      const err = new Error(`Failed to parse file: ${error.message}`);
      err.status = 500;
      throw err;
    }
  }
}

// File upload endpoint
app.post('/api/parse', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    await FileUploadService.validateFileSize(req.file.size);
    const parsedData = await FileUploadService.handleParseFile(req.file);
    
    res.status(200).json({ data: parsedData });
  } catch (error) {
    console.error(error);
    res.status(error.status || 500).json({ 
      error: error.message || 'Something went wrong'
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
