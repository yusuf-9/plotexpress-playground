import { useCallback, useEffect, useState } from "react";
import axiosBase from "axios"

// types
import { ParsedData } from "@/modules/playground/types";
import { TestFile } from "@/modules/playground/types/files";
import { FileProcessingState } from "../types";

// store
import { useStore } from "@/modules/playground/contexts/store.context";

// utils
import { retryPromiseIfFails } from "@/common/utils";

// lib
import axios from "@/common/services/axios";

type Props = {
  setParsedData: (data: ParsedData) => void;
};

export default function useFile(props: Props) {
  const { setParsedData } = props;

  const testFiles = useStore(store => store.testFiles);
  const setTestFiles = useStore(store => store.setTestFiles);

  const [fileProcessingState, setFileProcessingState] = useState<FileProcessingState>({
    isProcessing: false,
    error: null,
    isProcessed: false,
    processingProgress: 0,
    fileName: "",
    processType: "upload",
  });
  const [selectedTestFile, setSelectedTestFile] = useState<TestFile | null>(null);
  const [testFileRequestState, setTestFileRequestState] = useState<{
    loading: boolean;
    error: string | null;
  }>({
    loading: false,
    error: null,
  });

  const areTestFilesLoaded = testFiles.length > 0;

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
          setFileProcessingState(prev => ({ ...prev, processingProgress: uploadProgress }));
        },
      });

      setParsedData(response?.data?.data);
    },
    [maxFileSizeInMB, setParsedData]
  );

  const onFileDrop = useCallback(
    async (acceptedFiles: File[]) => {
      try {
        setFileProcessingState(prev => ({
          ...prev,
          error: null,
          isProcessing: true,
          isProcessed: false,
          processType: "upload",
        }));
        await handleFileUpload(acceptedFiles[0]);
        setFileProcessingState(prev => ({
          ...prev,
          isProcessing: false,
          error: null,
          isProcessed: true,
          processingProgress: 0,
          fileName: acceptedFiles[0].name,
          processType: "upload",
        }));
      } catch (error) {
        setFileProcessingState(prev => ({
          ...prev,
          error: error instanceof Error ? error.message : "Failed to upload file",
          isProcessing: false,
          isProcessed: false,
          processType: "upload",
        }));
      }
    },
    [handleFileUpload]
  );

  const handleLoadTestFile = useCallback(async () => {
    try {
      if (!selectedTestFile) {
        throw new Error("No test file selected");
      }

      setFileProcessingState(prev => ({
        ...prev,
        isProcessing: true,
        error: null,
        isProcessed: false,
        processingProgress: 0,
        fileName: selectedTestFile?.label,
        processType: "loadTestFile",
      }));
      const response = await retryPromiseIfFails(async () => await axiosBase.get<ParsedData>(selectedTestFile?.link, {
        onDownloadProgress: progressEvent => {
          const downloadProgress = Math.round((progressEvent.loaded / progressEvent.loaded) * 100);
          setFileProcessingState(prev => ({ ...prev, processingProgress: downloadProgress }));
        },
      }));
      setParsedData(response?.data);
      setFileProcessingState(prev => ({
        ...prev,
        isProcessed: true,
      }));
    } catch (error) {
      console.error(error);
      setFileProcessingState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : "Failed to load test file",
      }));
    } finally {
      setFileProcessingState(prev => ({
        ...prev,
        isProcessing: false,
      }));
    }
  }, [selectedTestFile, setParsedData]);

  useEffect(() => {
    if (areTestFilesLoaded) return;

    const fetchTestFiles = async () => {
      try {
        setTestFileRequestState(() => ({
          loading: true,
          error: null,
        }));
        const response = await retryPromiseIfFails(async () => await axios.get<TestFile[]>("/test-files-metadata"));
        setTestFiles(response?.data?.data);
      } catch (error) {
        setTestFileRequestState(() => ({
          loading: false,
          error: error instanceof Error ? error.message : "Failed to fetch test files",
        }));
        console.error(error);
      } finally {
        setTestFileRequestState(prev => ({
          ...prev,
          loading: false,
        }));
      }
    };
    fetchTestFiles();
  }, [areTestFilesLoaded, setTestFiles]);

  return {
    onFileDrop,
    fileProcessingState,
    selectedTestFile,
    setSelectedTestFile,
    testFiles,
    loadingTestFiles: testFileRequestState.loading,
    errorLoadingTestFiles: testFileRequestState.error,
    handleLoadTestFile,
  };
}
