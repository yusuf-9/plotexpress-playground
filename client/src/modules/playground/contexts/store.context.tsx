"use client"

import React, { createContext, useContext } from "react";
import createPlaygroundStore, { PlaygroundStore } from "../store/playground.store";

// Define the context with the correct type
const StoreContext = createContext<ReturnType<typeof createPlaygroundStore> | null>(null);

// Custom hook to use the store
export const useStore = <T,>(selector: (state: PlaygroundStore) => T): T => {
  const store = useContext(StoreContext);
  if (!store) {
    throw new Error('useStore must be used within a StoreProvider');
  }

  return store(selector);
};

// Custom hook to use unreactive store outside of react components
export const useUnreactiveStore = () => {
  const store = useContext(StoreContext);
  if (!store) {
    throw new Error('useStore must be used within a StoreProvider');
  }

  return store;
};


// StoreProvider component
export const StoreProvider = ({ children }: { children: React.ReactNode }) => {
  const store = React.useMemo(() => createPlaygroundStore(), []);

  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>;
};

export default StoreProvider;
