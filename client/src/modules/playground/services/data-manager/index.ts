import { StoreApi, UseBoundStore } from "zustand";

// types
import { PlaygroundStore } from "../../store/playground.store";
import { Chart, BaseChartConfig, ParsedData } from "../../types";

// services
import IndexedDBService from "../indexed-db";

// constants
import { INDEXED_DB_STORES } from "../../constants";

export default class DataManager {
  protected storeRef: UseBoundStore<StoreApi<PlaygroundStore>>;
  private indexedDbManager: IndexedDBService;

  constructor(storeRef: UseBoundStore<StoreApi<PlaygroundStore>>, indexedDbManager: IndexedDBService) {
    this.storeRef = storeRef;
    this.indexedDbManager = indexedDbManager;
  }

  /*
   * Public method for handling file addition in the workspace
   */
  public async addFile(fileName: string, fileData: ParsedData): Promise<void> {
    /**
     * Load the file data into the store
     * Load the file into the indexedDB
     */
    const addFileInStore = this.storeRef.getState().addFileData;
    const isSharedWorkspace = this.storeRef.getState().isSharedWorkspace;

    // 1. Load the file data into the store
    const newFileUUID = addFileInStore(fileName, fileData);

    // 2. Upload the file to the object bucket using a signed URL with retry logic
    if (!isSharedWorkspace) {
      this.indexedDbManager.upsertData(INDEXED_DB_STORES.FILES, {
        id: newFileUUID,
        name: fileName,
        data: fileData,
        lastUpdated: new Date().getTime(),
      });
    }
  }

  /*
   * Public method for handling file updates in the workspace
   */
  public async updateFile(fileId: string, fileData: ParsedData): Promise<void> {
    /**
     * Update the file data in the store
     * Update the data in the indexed DB
     */

    const updateFileInStore = this.storeRef.getState().updateFileData;
    const isSharedWorkspace = this.storeRef.getState().isSharedWorkspace;

    updateFileInStore(fileId, fileData);
    if (!isSharedWorkspace) {
      this.indexedDbManager.upsertData(INDEXED_DB_STORES.FILES, {
        id: fileId,
        name: this.storeRef.getState().files[fileId]?.name,
        data: fileData,
        lastUpdated: new Date().getTime(),
      });
    }
  }

  /**
   * Public method for handling file deletion in the workspace
   * Remove the file from the store
   * Delete the file from the indexedDB
   */
  public async deleteFile(fileId: string): Promise<void> {
    const removeFileFromStore = this.storeRef.getState().removeFileData;
    const isSharedWorkspace = this.storeRef.getState().isSharedWorkspace;

    removeFileFromStore(fileId);

    if (!isSharedWorkspace) {
      this.indexedDbManager.deleteData(INDEXED_DB_STORES.FILES, fileId);
    }
  }

  /**
   * Public method for deleting all added files
   * Remove the files from the store
   * Delete the files from the indexedDB
   */
  public async deleteAllFiles(): Promise<void> {
    const setFilesInStore = this.storeRef.getState().setFiles;
    const isSharedWorkspace = this.storeRef.getState().isSharedWorkspace;

    if (!isSharedWorkspace) {
      this.indexedDbManager.clearDataInStore(INDEXED_DB_STORES.FILES);
    }

    setFilesInStore({});
  }

  /**
   * Public method to handle chart creation
   * Creates a new chart in the store
   * Add the chart to the indexedDB
   */
  public async addChart(newChartConfig: BaseChartConfig) {
    const addChartInStore = this.storeRef.getState().addChart;
    const isSharedWorkspace = this.storeRef.getState().isSharedWorkspace;

    const newChart = addChartInStore(newChartConfig);
    if (!isSharedWorkspace) {
      this.indexedDbManager.upsertData(INDEXED_DB_STORES.CHARTS, {
        id: newChart.i,
        ...newChart,
        lastUpdated: new Date().getTime(),
      });
    }
  }

  /**
   * Public method to handle chart updates
   * Updates the chart in the store
   * Update the chart in the indexedDB
   */
  public async updateChart(chartId: string, updatedChart: Chart) {
    const updateChartInStore = this.storeRef.getState().updateChart;
    const setEditChartId = this.storeRef.getState().setChartToBeEditedId;
    const isSharedWorkspace = this.storeRef.getState().isSharedWorkspace;

    updateChartInStore(chartId, updatedChart);
    setEditChartId("");

    if (!isSharedWorkspace) {
      this.indexedDbManager.upsertData(INDEXED_DB_STORES.CHARTS, {
        id: chartId,
        ...updatedChart,
        lastUpdated: new Date().getTime(),
      });
    }
  }

  /**
   * Public method to handle chart deletion
   * Deletes the chart from the store
   * Deletes the chart from the indexedDB
   */
  public async deleteChart(chartId: string) {
    const removeChartFromStore = this.storeRef.getState().removeChart;
    const isSharedWorkspace = this.storeRef.getState().isSharedWorkspace;

    removeChartFromStore(chartId);

    if (!isSharedWorkspace) {
      this.indexedDbManager.deleteData(INDEXED_DB_STORES.CHARTS, chartId);
    }
  }

  /**
   * Public method to delete all charts from workspace
   * Deletes the charts from the store
   * Deletes the charts from the indexedDB
   */
  public async deleteAllCharts() {
    const setChartsInStore = this.storeRef.getState().setCharts;
    const isSharedWorkspace = this.storeRef.getState().isSharedWorkspace;

    if (!isSharedWorkspace) {
      this.indexedDbManager.clearDataInStore(INDEXED_DB_STORES.CHARTS);
    }
    setChartsInStore([]);
  }
}
