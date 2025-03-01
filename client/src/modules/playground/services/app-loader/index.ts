"use client";

import { StoreApi, UseBoundStore } from "zustand";

import IndexedDBService from "../indexed-db";

// types
import { PlaygroundStore } from "../../store/playground.store";
import { Chart, IndexedDBCachedFile } from "../../types";
import { FileData } from "../../types";

import { INDEXED_DB_STORES } from "../../constants";

export default class AppLoader {
  protected storeRef: UseBoundStore<StoreApi<PlaygroundStore>>;
  private indexedDbManager: IndexedDBService;

  constructor(storeRef: UseBoundStore<StoreApi<PlaygroundStore>>, indexedDbManager: IndexedDBService) {
    this.storeRef = storeRef;
    this.indexedDbManager = indexedDbManager;
  }

  public async loadCachedFilesAndCharts({ onProgress }: { onProgress: (percentage: number) => void }) {
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