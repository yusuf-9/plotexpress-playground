import axiosInstance from "@/common/services/axios";
import { retryPromiseIfFails } from "@/common/utils";
import { UPLOADED_FILE_DATA_KEY } from "@/modules/playground/constants";
import { useStore } from "@/modules/playground/contexts/store.context";
import { useCallback, useEffect, useState } from "react";

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB in bytes

export default function useDataUpload() {
  const [uploadStep, setUploadStep] = useState<
    "checking-data-size" | "generating-signed-urls" | "uploading-files" | "completed"
  >("checking-data-size");
  const [shareLink, setShareLink] = useState("");
  const [uploadState, setUploadState] = useState<{
    percentageCompletion: number;
    error: string | null;
  }>({
    percentageCompletion: 0,
    error: null,
  });

  const files = useStore(store => store.files);
  const workspaceName = useStore(store => store.workspace.name);
  const charts = useStore(store => store.charts);

  const checkDataSize = useCallback(() => {
    const filesString = JSON.stringify(files);
    const filesSizeInBytes = new TextEncoder().encode(filesString).length;

    if (filesSizeInBytes > MAX_FILE_SIZE) {
      throw new Error(
        `Total file size (${(filesSizeInBytes / (1024 * 1024)).toFixed(2)}MB) exceeds the maximum limit of 100MB`
      );
    }
  }, [files]);

  const generateSignedURLs = useCallback(async () => {
    const response = await axiosInstance.get<{
      dataFileUploadURI: string;
      configFileUploadURI: string;
      sharedWorkspaceId: string;
    }>("/generate-upload-urls");
    return [response.data.data.dataFileUploadURI, response.data.data.configFileUploadURI];
  }, []);

  const uploadDataFile = useCallback(
    async (uploadURL: string) => {
      try {
        await retryPromiseIfFails(async () => {
          return await fetch(uploadURL, {
            method: "PUT",
            body: JSON.stringify({
              [UPLOADED_FILE_DATA_KEY]: files,
            }),
          });
        });
      } catch (error) {
        throw new Error("Failed to upload files: " + (error instanceof Error ? error.message : "Something went wrong"));
      }
    },
    [files]
  );

  const uploadWorkspaceConfigFile = useCallback(
    async (uploadURL: string) => {
      try {
        await retryPromiseIfFails(async () => {
          return await fetch(uploadURL, {
            method: "PUT",
            body: JSON.stringify({
              [UPLOADED_FILE_DATA_KEY]: {
                workspaceName,
                charts,
              },
            }),
          });
        });
      } catch (error) {
        throw new Error(
          "Failed to upload workspace config: " + (error instanceof Error ? error.message : "Something went wrong")
        );
      }
    },
    [charts, workspaceName]
  );

  const handleCreateSharedWorkspace = useCallback(async () => {
    try {
      checkDataSize();
      setUploadState(prev => ({
        ...prev,
        percentageCompletion: 30,
      }));
      const [dataFileUploadURL, configFileUploadURL, sharedWorkspaceId] = await retryPromiseIfFails(generateSignedURLs);
      setUploadState(prev => ({
        ...prev,
        percentageCompletion: 50,
      }));
      await Promise.all([uploadDataFile(dataFileUploadURL), uploadWorkspaceConfigFile(configFileUploadURL)]);
      setUploadState(prev => ({
        ...prev,
        percentageCompletion: 100,
      }));
      setShareLink(`${window.location.origin}?sid${sharedWorkspaceId}`);
      setTimeout(() => {
        setUploadStep("completed");
      }, 500);
    } catch (error) {
      console.error(error);
      setUploadState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : "Failed to create share link. Please try again later",
      }));
    }
  }, [checkDataSize, generateSignedURLs, uploadDataFile, uploadWorkspaceConfigFile]);

  useEffect(() => {
    handleCreateSharedWorkspace();
  }, [handleCreateSharedWorkspace]);

  return {
    uploadStep,
    shareLink,
    uploadState,
  };
}
