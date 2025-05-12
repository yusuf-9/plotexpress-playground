import { StoreApi, UseBoundStore } from "zustand";
import axiosBase from "axios";

// services
import IndexedDBService from "../indexed-db";

// types
import { PlaygroundStore } from "../../store/playground.store";
import { Chart, IndexedDBCachedFile } from "../../types";
import { FileData } from "../../types";

// constants
import {
  INDEXED_DB_STORES,
  SHARED_WORKSPACE_FILE_DATA_KEY,
  SHARED_WORKSPACE_FILE_NAMES,
  SHARED_WORKSPACE_QUERY_PARAM_KEY,
} from "../../constants";

// api
import { getFileAccessLink } from "../../api";

// utils
import { retryPromiseIfFails } from "@/common/utils";

export default class AppLoader {
  protected storeRef: UseBoundStore<StoreApi<PlaygroundStore>>;
  private indexedDbManager: IndexedDBService;

  constructor(storeRef: UseBoundStore<StoreApi<PlaygroundStore>>, indexedDbManager: IndexedDBService) {
    this.storeRef = storeRef;
    this.indexedDbManager = indexedDbManager;
  }

  /**
   * Public function to handle loading the app
   * Checks if the workspace is shared or not, and loads the correct appState
   */
  public async loadApp({ onProgress, setLoadingText }: {
    onProgress: (percentage: number) => void,
    setLoadingText: (text: string) => void
  }) {
    const searchParams = new URLSearchParams(window.location.search);
    const sharedWorkspaceId = searchParams.get(SHARED_WORKSPACE_QUERY_PARAM_KEY);

    const isSharedWorkspace = Boolean(sharedWorkspaceId && typeof sharedWorkspaceId === "string");
    if (isSharedWorkspace) {
      setLoadingText("Loading shared workspace")
      await this.loadSharedWorkspace(sharedWorkspaceId as string, onProgress, setLoadingText);
      return;
    }

    setLoadingText("Loading cached state")
    await this.loadCachedFilesAndCharts(onProgress);
  }

  private async loadSharedWorkspace(
    workspaceId: string,
    onProgress: (percentage: number) => void,
    setLoadingText: (text: string) => void
  ) {
    /**
     * 1. Generates signed URLs for shared workspace files
     * 2. Fetches the file data of the shared workspace and loads it into the store
     * 3. Fetches the config of the workspace along with the charts and loads it into the store
     * 4. Sets the global flag for shared workspace
     */
    try {
      onProgress(30);

      setLoadingText("Preparing Signed URLs")
      // Get signed URLs
      const [dataFileSignedURL, configFileSignedURL] = await Promise.all([
        retryPromiseIfFails(() => getFileAccessLink(workspaceId + "/" + SHARED_WORKSPACE_FILE_NAMES.DATA_FILE)),
        retryPromiseIfFails(() => getFileAccessLink(workspaceId + "/" + SHARED_WORKSPACE_FILE_NAMES.CONFIG_FILE)),
      ]);

      onProgress(60);

      setLoadingText("Fetching workspace state")
      // Fetch data using signed URLs
      const [dataFileResponse, configFileResponse] = await Promise.all([
        retryPromiseIfFails(() => axiosBase.get<{ [SHARED_WORKSPACE_FILE_DATA_KEY]: FileData }>(dataFileSignedURL)),
        retryPromiseIfFails(() =>
          axiosBase.get<{
            [SHARED_WORKSPACE_FILE_DATA_KEY]: {
              workspaceName: string;
              charts: Chart[];
            };
          }>(configFileSignedURL)
        ),
      ]);

      // Update store
      const setFiles = this.storeRef.getState().setFiles;
      const setCharts = this.storeRef.getState().setCharts;
      const setWorkspace = this.storeRef.getState().setWorkspace;
      const setIsSharedWorkspace = this.storeRef.getState().setIsSharedWorkspace;

      console.log({
        name: JSON.parse(configFileResponse.data[SHARED_WORKSPACE_FILE_DATA_KEY].workspaceName)
      })
      setFiles(dataFileResponse.data[SHARED_WORKSPACE_FILE_DATA_KEY]);
      setWorkspace({
        name: JSON.parse(configFileResponse.data[SHARED_WORKSPACE_FILE_DATA_KEY].workspaceName)
      });
      setCharts(configFileResponse.data[SHARED_WORKSPACE_FILE_DATA_KEY].charts);

      setIsSharedWorkspace(true);
      onProgress(100);
    } catch (error) {
      console.error("Error loading shared workspace:", error);
      throw error;
    }
  }

  /***
   * Private function to load cached files and charts from the indexed-db
   */
  private async loadCachedFilesAndCharts(onProgress: (percentage: number) => void) {
    try {
      const setCharts = this.storeRef.getState().setCharts;
      const setFiles = this.storeRef.getState().setFiles;
      onProgress(30);

      const [cachedFiles, cachedCharts] = await Promise.all([this.getCachedFiles(), this.getCachedCharts()]);
      onProgress(90);

      await new Promise(resolve => setTimeout(resolve, 100));

      const fileData: FileData = (cachedFiles || []).reduce<FileData>((acc: FileData, file: Record<string, any>) => {
        const cachedFile = file as IndexedDBCachedFile;
        if (!cachedFile?.id || !cachedFile?.data || !cachedFile?.name) return acc;
        acc[cachedFile.id] = { name: cachedFile.name, data: cachedFile.data };
        return acc;
      }, {} as FileData);

      setFiles(fileData);
      setCharts(cachedCharts as Chart[]);
      onProgress(100);
    } catch (error) {
      console.error("Error loading cached files and charts:", error);
    }
  }

  /**
   * Fetch cached files from IndexedDB.
   */
  private async getCachedFiles() {
    try {
      console.log("Fetching cached files from IndexedDB...");
      const files = await this.indexedDbManager.getAllData(INDEXED_DB_STORES.FILES);
      return files;
    } catch (error) {
      console.error("Error fetching cached files:", error);
      throw error;
    }
  }

  /**
   * Fetch cached charts from IndexedDB.
   */
  private async getCachedCharts() {
    try {
      console.log("Fetching cached charts from IndexedDB...");
      const charts = await this.indexedDbManager.getAllData(INDEXED_DB_STORES.CHARTS);
      return charts;
    } catch (error) {
      console.error("Error fetching cached charts:", error);
      throw error;
    }
  }
}
