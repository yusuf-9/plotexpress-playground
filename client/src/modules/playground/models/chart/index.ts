import { StoreApi, UseBoundStore } from "zustand";

// types
import { PlaygroundStore } from "@/modules/playground/store/playground.store";

class BaseChartModel {
  protected storeRef: UseBoundStore<StoreApi<PlaygroundStore>>;

  constructor(storeRef: UseBoundStore<StoreApi<PlaygroundStore>>) {
    this.storeRef = storeRef;
  }
}

export default BaseChartModel;
