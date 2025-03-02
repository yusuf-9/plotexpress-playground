import { useCallback, useState } from "react";

// lib
import axios from "@/common/services/axios";

// types
import { ParsedData } from "@/modules/playground/types";
import { FileUploadState } from "../types";

type Props = {
  setParsedData: (data: ParsedData) => void;
};

export default function useFile(props: Props) {
  const { setParsedData } = props;

  const [fileUploadState, setFileUploadState] = useState<FileUploadState>({
    isUploading: false,
    error: null,
    isUploaded: false,
    uploadProgress: 0,
    fileName: "",
  });

  const maxFileSizeInMB = 10 * 1024 * 1024;

  const handleFileUpload = useCallback(
    async (file: File) => {
      if (!file) throw new Error("No file has been selected! Please select a file");

      // Client-side validation: Check file type
      const validFileTypes = ["csv", "json", "xlsx"];
      const fileExtension = file.name.split(".").pop()?.toLowerCase();

      if (!fileExtension || !validFileTypes.includes(fileExtension)) {
        throw new Error("Invalid file type! Only CSV, JSON, and Excel files are allowed.");
      }

      // File size validation: Check if file size is under the limit allowed by the user's tier
      const fileSizeInMB = file.size; // Convert bytes to MB
      if (fileSizeInMB > maxFileSizeInMB) {
        throw new Error(`File size exceeds the limit of ${maxFileSizeInMB} bytes.`);
      }

      // Prepare form data for the API
      const formData = new FormData();
      formData.append("file", file);

      // Upload the file to the API
      const response = await axios.post<ParsedData>("/parse", formData, {
        onUploadProgress: progressEvent => {
          const uploadProgress = Math.round((progressEvent.loaded / progressEvent.loaded) * 100);
          setFileUploadState(prev => ({ ...prev, uploadProgress }));
        },
      });

      setParsedData(response?.data?.data);
    },
    [maxFileSizeInMB, setParsedData]
  );

  const onFileDrop = useCallback(
    async (acceptedFiles: File[]) => {
      try {
        setFileUploadState(prev => ({
          ...prev,
          error: null,
          isUploading: true,
          isUploaded: false,
        }));
        await handleFileUpload(acceptedFiles[0]);
        setFileUploadState(prev => ({
          ...prev,
          isUploading: false,
          error: null,
          isUploaded: true,
          uploadProgress: 0,
          fileName: acceptedFiles[0].name,
        }));
      } catch (error) {
        setFileUploadState(prev => ({
          ...prev,
          error: error instanceof Error ? error.message : "Failed to upload file",
          isUploading: false,
          isUploaded: false,
        }));
      }
    },
    [handleFileUpload]
  );

  return {
    onFileDrop,
    fileUploadState,
  };
}
