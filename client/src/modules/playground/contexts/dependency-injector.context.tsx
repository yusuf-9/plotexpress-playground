import { createContext, PropsWithChildren, useContext, useMemo } from "react";

// services
import AppLoader from "../services/app-loader";
import DataManager from "../services/data-manager";
import IndexedDBService from "../services/indexed-db";
import EventManager from "@/common/services/event-manager";

// contexts
import { useUnreactiveStore } from "./store.context";

// Define the context with the correct type
const PlaygroundDependencyInjectorContext = createContext<{
  appLoader: AppLoader;
  dataManager: DataManager;
  eventManager: EventManager;
} | null>(null);

export const useDependencyInjector = () => {
  const context = useContext(PlaygroundDependencyInjectorContext);
  if (!context) {
    throw new Error("useDependencyInjector must be used within a DependencyInjector");
  }
  return context;
};

// StoreProvider component
export const DependencyInjector = (props: PropsWithChildren) => {
  const { children } = props;

  const storeAPI = useUnreactiveStore();

  const indexedDbManager = useMemo(() => new IndexedDBService(), []);
  const appLoader = useMemo(() => new AppLoader(storeAPI, indexedDbManager), [indexedDbManager, storeAPI]);
  const dataManager = useMemo(() => new DataManager(storeAPI, indexedDbManager), [indexedDbManager, storeAPI]);
  const eventManager = useMemo(() => new EventManager(), []);

  return (
    <PlaygroundDependencyInjectorContext.Provider
      value={{
        appLoader,
        dataManager,
        eventManager,
      }}
    >
      {children}
    </PlaygroundDependencyInjectorContext.Provider>
  );
};

export default DependencyInjector;
