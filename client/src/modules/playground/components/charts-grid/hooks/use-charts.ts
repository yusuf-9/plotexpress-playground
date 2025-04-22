import { useDependencyInjector } from "@/modules/playground/contexts/dependency-injector.context";
import { useStore } from "@/modules/playground/contexts/store.context";
import EChartsReact from "echarts-for-react";
import { useMemo, useCallback, useRef } from "react";

export default function useCharts() {
  const charts = useStore(state => state.charts);
  const setEditChartId = useStore(state => state.setChartToBeEditedId);
  const setIsChartEditorModalOpen = useStore(state => state.setIsChartEditorModalOpen);

  const chartsRefs = useRef<Record<string, null | EChartsReact>>({});

  const setChartRef = useCallback((instance: EChartsReact, chartId: string) => {
    chartsRefs.current[chartId] = instance;
  }, []);

  const { dataManager } = useDependencyInjector();

  const chartRefsInitial = useMemo(() => {
    return charts.reduce((acc: Record<string, any>, chart) => {
      acc[chart.i] = null;
      return acc;
    }, {});
  }, [charts]);

  const handleEditChart = useCallback(
    (chartId: string) => {
      setEditChartId(chartId);
      setIsChartEditorModalOpen(true);
    },
    [setEditChartId, setIsChartEditorModalOpen]
  );

  return {
    charts,
    dataManager,
    handleEditChart,
    chartRefsInitial,
    setChartRef,
    chartsRefs,
  };
}
