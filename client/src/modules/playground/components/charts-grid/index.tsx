import { useCallback, useMemo, useRef } from "react";
import { Responsive, WidthProvider } from "react-grid-layout";
import EChartsReact from "echarts-for-react";

// store
import { useStore } from "../../contexts/store.context";

// components
import GridItem from "../grid-item";
import Chart from "../chart";

// css
import "react-resizable/css/styles.css";
import "react-grid-layout/css/styles.css";

// hooks
import { useDependencyInjector } from "../../contexts/dependency-injector.context";

const ResponsiveGridLayout = WidthProvider(Responsive);

export default function ChartsGrid() {
  const charts = useStore(state => state.charts);
  const setEditChartId = useStore(state => state.setChartToBeEditedId);
  const setIsChartEditorModalOpen = useStore(state => state.setIsChartEditorModalOpen);

  const { dataManager } = useDependencyInjector();

  const chartRefsInitial = useMemo(() => {
    return charts.reduce((acc: Record<string, any>, chart) => {
      acc[chart.i] = null;
      return acc;
    }, {});
  }, [charts]);

  const chartsRefs = useRef<Record<string, null | EChartsReact>>(chartRefsInitial);

  const setChartRef = useCallback((instance: EChartsReact, chartId: string) => {
    chartsRefs.current[chartId] = instance;
  }, []);

  const handleEditChart = useCallback(
    (chartId: string) => {
      setEditChartId(chartId);
      setIsChartEditorModalOpen(true);
    },
    [setEditChartId, setIsChartEditorModalOpen]
  );

  const gridItemsJSX = useMemo(() => {
    return charts.map(chart => (
      <div key={chart?.i}>
        <GridItem
          onDelete={() => dataManager.deleteChart(chart?.i)}
          onEdit={() => handleEditChart(chart?.i)}
          title={
            chart?.chartSettings?.titleVisibility
              ? chart?.chartSettings?.title
              : ""
          }
        >
          <Chart
            chart={chart}
            setRef={setChartRef}
            chartAPI={chartsRefs.current[chart.i]}
          />
        </GridItem>
      </div>
    ));
  }, [charts, chartsRefs, dataManager, handleEditChart, setChartRef]);

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
