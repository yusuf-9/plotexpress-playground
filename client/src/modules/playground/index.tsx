// components
import PlaygroundHeader from "./components/header";
import PlaygroundSidebar from "./components/sidebar";
import ChartsGrid from "./components/charts-grid";
import CreateChartModal from "./components/modal/create-chart";
import DataUploadModal from "./components/modal/data-upload";
import PlaygroundLoader from "./components/loader";

// contexts
import StoreProvider from "./contexts/store.context";
import DependencyInjector from "./contexts/dependency-injector.context";

export default function Playground() {
  return (
    <StoreProvider>
      <DependencyInjector>
        <PlaygroundLoader>
          <div className="flex flex-col h-screen bg-primary-foreground">
            {/* Header */}
            <PlaygroundHeader />

            {/* Main content area */}
            <div className="flex flex-1 overflow-hidden">
              {/* Sidebar */}
              <PlaygroundSidebar />

              {/* Main chart area */}
              <ChartsGrid />
            </div>
          </div>
          {/* Modals */}
          <CreateChartModal />
          <DataUploadModal />
        </PlaygroundLoader>
      </DependencyInjector>
    </StoreProvider>
  );
}
