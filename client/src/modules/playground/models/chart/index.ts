import { StoreApi, UseBoundStore } from "zustand";

// types
import { PlaygroundStore } from "@/client/modules/playground/store/playground.store";

interface BaseChartModelType {}

class BaseChartModel implements BaseChartModelType {
  protected storeRef: UseBoundStore<StoreApi<PlaygroundStore>>;

  constructor(storeRef: UseBoundStore<StoreApi<PlaygroundStore>>) {
    this.storeRef = storeRef;
  }
}

export default BaseChartModel;
