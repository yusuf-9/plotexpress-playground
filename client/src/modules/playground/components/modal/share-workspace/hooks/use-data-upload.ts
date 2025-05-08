import { useCallback, useEffect, useState } from "react";
import axiosBase from "axios"

// lib
import axiosInstance from "@/common/services/axios";

// utils
import { retryPromiseIfFails } from "@/common/utils";

// constants
import { SHARED_WORKSPACE_QUERY_PARAM_KEY, SHARED_WORKSPACE_FILE_DATA_KEY } from "@/modules/playground/constants";

// hooks
import { useStore } from "@/modules/playground/contexts/store.context";

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
    return [response.data.data.dataFileUploadURI, response.data.data.configFileUploadURI, response.data.data.sharedWorkspaceId];
  }, []);

  const uploadDataFile = useCallback(
    async (uploadURL: string) => {
      try {
        await retryPromiseIfFails(async () => {
          return await axiosBase.put(uploadURL, JSON.stringify({
            [SHARED_WORKSPACE_FILE_DATA_KEY]: files,
          }), { method: "put" });
        });
      } catch (error) {
        throw new Error("Failed to upload file: " + (error instanceof Error ? error.message : "Something went wrong"));
      }
    },
    [files]
  );

  const uploadWorkspaceConfigFile = useCallback(
    async (uploadURL: string) => {
      try {
        await retryPromiseIfFails(async () => {
          return await axiosBase.put(uploadURL, JSON.stringify({
            [SHARED_WORKSPACE_FILE_DATA_KEY]: {
              workspaceName,
              charts,
            },
          }), { method: "PUT" })
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
      setUploadStep("checking-data-size")
      checkDataSize();
      setUploadState(prev => ({
        ...prev,
        percentageCompletion: 30,
      }));

      setUploadStep("generating-signed-urls")
      const [dataFileUploadURL, configFileUploadURL, sharedWorkspaceId] = await retryPromiseIfFails(generateSignedURLs);
      setUploadState(prev => ({
        ...prev,
        percentageCompletion: 50,
      }));

      setUploadStep("uploading-files")
      await Promise.all([uploadDataFile(dataFileUploadURL), uploadWorkspaceConfigFile(configFileUploadURL)]);
      setUploadState(prev => ({
        ...prev,
        percentageCompletion: 100,
      }));

      setShareLink(`${window.location.origin}?${SHARED_WORKSPACE_QUERY_PARAM_KEY}=${sharedWorkspaceId}`);
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
