import { memo } from "react";
import { AlertCircle, Upload } from "lucide-react";
import { useDropzone } from "react-dropzone";

// types
import { FileUploadState } from "../../types";

// components
import { Progress } from "@/common/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/common/components/ui/alert";

type Props = {
  error: FileUploadState["error"];
  isUploading: FileUploadState["isUploading"];
  isUploaded: FileUploadState["isUploaded"];
  uploadProgress: FileUploadState["uploadProgress"];
  onFileDrop: (acceptedFiles: File[]) => Promise<void>;
};

const DataUploadSection = (props: Props) => {
  const { error, isUploading, isUploaded, uploadProgress, onFileDrop } = props;

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: onFileDrop,
    noClick: false,
    noKeyboard: false,
  });

  return (
    <>
      {error && (
        <div className="px-6">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      )}
      <div
        {...getRootProps()}
        className="m-6 border-2 flex-grow flex items-center justify-center border-dashed border-gray-300 rounded-lg p-12 text-center cursor-pointer hover:border-[#0f9d58] transition-colors"
      >
        <input {...getInputProps()} />

        {isUploading && (
          <div className="space-y-2 w-full">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Uploading file...</span>
              <span className="text-sm font-medium">{uploadProgress?.toString()}%</span>
            </div>
            <Progress
              value={uploadProgress}
              className="w-full"
            />
          </div>
        )}
        {!isUploading && !isUploaded && (
          <div>
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-lg">Drag &lsquo;n&rsquo; drop a file here, or click to select a file</p>
            <p className="mt-1 text-sm text-gray-500">Supported file types: CSV, XLS, XLSX</p>
          </div>
        )}
      </div>
    </>
  );
};

export default memo(DataUploadSection);
