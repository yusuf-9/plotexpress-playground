export type FileProcessingState = {
  isProcessing: boolean;
  error: string | null;
  isProcessed: boolean;
  fileName: string;
  processingProgress: number;
  processType: "upload" | "loadTestFile";
};
