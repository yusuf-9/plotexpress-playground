"use client"

import { INDEXED_DB_STORES } from "../../constants";

export default class IndexedDBService {
  private db: IDBDatabase | null = null;
  private initialized: Promise<void>;

  constructor() {
    this.initialized = this.initialize();
  }

  /**
   * Wait for the database to be initialized
   */
  public async waitForInitialization(): Promise<void> {
    await this.initialized;
  }

  /**
   * Initialize the database and create object stores if needed
   */
  private initialize(): Promise<void> {
    return new Promise((resolve, reject) => {
      if(typeof window === "undefined") return;
      
      const request = indexedDB.open("playground", 1);

      request.onupgradeneeded = event => {
        const db = (event.target as IDBOpenDBRequest).result;

        Object.values(INDEXED_DB_STORES).forEach(storeName => {
          if (!db.objectStoreNames.contains(storeName)) {
            db.createObjectStore(storeName, { keyPath: "id" }); // Assumes `id` as the key path
          }
        });
      };

      request.onsuccess = event => {
        this.db = (event.target as IDBOpenDBRequest).result;
        console.log("IndexedDB initialized successfully.");
        resolve();
      };

      request.onerror = event => {
        console.error("Failed to initialize IndexedDB: ", (event.target as IDBRequest).error);
        reject((event.target as IDBRequest).error);
      };
    });
  }

  // Methods for upsertData, getData, deleteData, getAllData
  public async upsertData(storeName: string, data: Record<string, any>): Promise<void> {
    await this.waitForInitialization();

    return new Promise((resolve, reject) => {
      if (!this.db) {
        return reject("Database not initialized.");
      }

      const transaction = this.db.transaction(storeName, "readwrite");
      const objectStore = transaction.objectStore(storeName);
      const request = objectStore.put(data);

      request.onsuccess = () => resolve();
      request.onerror = event => reject((event.target as IDBRequest).error);
    });
  }

  public async getData(storeName: string, key: string): Promise<Record<string, any> | null> {
    await this.waitForInitialization();

    return new Promise((resolve, reject) => {
      if (!this.db) {
        return reject("Database not initialized.");
      }

      const transaction = this.db.transaction(storeName, "readonly");
      const objectStore = transaction.objectStore(storeName);
      const request = objectStore.get(key);

      request.onsuccess = () => resolve(request.result || null);
      request.onerror = event => reject((event.target as IDBRequest).error);
    });
  }

  public async deleteData(storeName: string, key: string): Promise<void> {
    await this.waitForInitialization();

    return new Promise((resolve, reject) => {
      if (!this.db) {
        return reject("Database not initialized.");
      }

      const transaction = this.db.transaction(storeName, "readwrite");
      const objectStore = transaction.objectStore(storeName);
      const request = objectStore.delete(key);

      request.onsuccess = () => resolve();
      request.onerror = event => reject((event.target as IDBRequest).error);
    });
  }

  public async getAllData(storeName: string): Promise<Record<string, any>[]> {
    await this.waitForInitialization();

    return new Promise((resolve, reject) => {
      if (!this.db) {
        return reject("Database not initialized.");
      }

      const transaction = this.db.transaction(storeName, "readonly");
      const objectStore = transaction.objectStore(storeName);
      const request = objectStore.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = event => reject((event.target as IDBRequest).error);
    });
  }
}
