import { StoreApi, UseBoundStore } from "zustand";

// types
import { PlaygroundStore } from "../../store/playground.store";
import { Chart, ChartConfig, ParsedData } from "../../types";

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

    // 1. Load the file data into the store
    const newFileUUID = addFileInStore(fileName, fileData);

    // 2. Upload the file to the object bucket using a signed URL with retry logic
    this.indexedDbManager.upsertData(INDEXED_DB_STORES.FILES, {
      id: newFileUUID,
      name: fileName,
      data: fileData,
      lastUpdated: new Date().getTime(),
    });
  }

  /*
   * Public method for handling file updates in the workspace
   */
  public async updateFile(fileId: string, fileData: ParsedData): Promise<void> {
    /**
     * Update the file data in the store
     * Get a change log of the file data by comparing the old and new file data
     * Upload the change log to the server, to get the latest file's updated at
     * Update the data in the indexed DB
     */

    const updateFileInStore = this.storeRef.getState().updateFileData;
    updateFileInStore(fileId, fileData);
    this.indexedDbManager.upsertData(INDEXED_DB_STORES.FILES, {
      id: fileId,
      name: this.storeRef.getState().files[fileId]?.name,
      data: fileData,
      lastUpdated: new Date().getTime(),
    });
  }

  /**
   * Public method for handling file deletion in the workspace
   * Remove the file from the store
   * Delete the file from the indexedDB
   */
  public async deleteFile(fileId: string): Promise<void> {
    const removeFileFromStore = this.storeRef.getState().removeFileData;
    removeFileFromStore(fileId);
    this.indexedDbManager.deleteData(INDEXED_DB_STORES.FILES, fileId);
  }

  /**
   * Public method to handle chart creation
   * Creates a new chart in the store
   */
  public async addChart(newChartConfig: ChartConfig) {
    const addChartInStore = this.storeRef.getState().addChart;
    addChartInStore(newChartConfig);
  }

  /**
   * Public method to handle chart updates
   * Updates the chart in the store
   */
  public async updateChart(chartId: string, updatedChart: Chart) {
    const updateChartInStore = this.storeRef.getState().updateChart;
    const setEditChartId = this.storeRef.getState().setChartToBeEditedId;

    updateChartInStore(chartId, updatedChart);
    setEditChartId("");
  }

  /**
   * Public method to handle chart deletion
   * Deletes the chart from the store
   */
  public async deleteChart(chartId: string) {
    const removeChartFromStore = this.storeRef.getState().removeChart;
    removeChartFromStore(chartId);
  }
}
