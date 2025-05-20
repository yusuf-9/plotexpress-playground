import { useMemo } from "react";
import { Responsive, WidthProvider } from "react-grid-layout";

// components
import GridItem from "../grid-item";
import Chart from "../chart";
import ErrorBoundary from "@/common/components/error-boundary";

// css
import "react-resizable/css/styles.css";
import "react-grid-layout/css/styles.css";

// hooks
import useChartExports from "./hooks/use-chart-exports";
import useCharts from "./hooks/use-charts";

const ResponsiveGridLayout = WidthProvider(Responsive);

export default function ChartsGrid() {
  const { charts, dataManager, handleEditChart, setChartRef, chartsRefs } = useCharts();
  const { handleExportChartAsSVG, handleExportChartAsPNG } = useChartExports({
    charts,
    chartsRefs: chartsRefs.current,
  });

  const gridItemsJSX = useMemo(() => {
    return charts.map(chart => (
      <div key={chart?.i}>
        <GridItem
          onDelete={() => dataManager.deleteChart(chart?.i)}
          onEdit={() => handleEditChart(chart?.i)}
          onExportAsPNG={() => handleExportChartAsPNG(chart.i)}
          onExportAsSVG={() => handleExportChartAsSVG(chart.i)}
        >
          <ErrorBoundary>
            <Chart
              chart={chart}
              setRef={setChartRef}
              chartAPI={chartsRefs.current[chart.i]}
            />
          </ErrorBoundary>
        </GridItem>
      </div>
    ));
  }, [charts, setChartRef, chartsRefs, dataManager, handleEditChart, handleExportChartAsPNG, handleExportChartAsSVG]);

  return (
    <main className="flex-grow flex flex-col h-full overflow-y-auto overflow-x-hidden no-scrollbar">
      <ResponsiveGridLayout
        className="layout w-full"
        layouts={{ lg: charts, md: charts, sm: charts, xs: charts, xxs: charts }}
        rowHeight={100}
        margin={[20, 20]}
        draggableHandle=".draggable-region"
      >
        {gridItemsJSX}
      </ResponsiveGridLayout>
    </main>
  );
}
