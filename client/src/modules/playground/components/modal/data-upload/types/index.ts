export type FileUploadState = {
  isUploading: boolean;
  uploadProgress: number;
  error: string | null;
  isUploaded: boolean;
  fileName: string;
};
