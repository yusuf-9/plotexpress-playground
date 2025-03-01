import { useCallback, useEffect, useMemo, useRef } from "react";

// echarts
import EChartsReact from "echarts-for-react";
import { EChartsOption } from "echarts";

// types
import { Chart } from "@/modules/playground/types";

// models
import LineChartModel from "@/modules/playground/models/line-chart";
import ScatterChartModel from "@/modules/playground/models/scatter-chart";
import BarChartModel from "@/modules/playground/models/bar-chart";
import AreaChartModel from "@/modules/playground/models/area-chart";

// store
import { useUnreactiveStore } from "@/modules/playground/contexts/store.context";

// constants
import { CHART_TYPES } from '@/modules/playground/constants/charts';

type Props = {
  chart: Chart;
  setRef: (instance: EChartsReact, chartId: string) => void;
  chartAPI: EChartsReact | null;
};

export default function useChartConfig(props: Props) {
  const { chart, setRef, chartAPI } = props;

  const { i: id, tracesConfig, type, chartSettings } = chart;

  const useStoreRef = useUnreactiveStore();

  const chartModelType = useMemo(() => {
    switch (type) {
      case CHART_TYPES.LINE:
        return new LineChartModel(useStoreRef);
      case CHART_TYPES.AREA:
        return new AreaChartModel(useStoreRef);
      case CHART_TYPES.SCATTER:
        return new ScatterChartModel(useStoreRef);
      case CHART_TYPES.BAR:
        return new BarChartModel(useStoreRef);
      default:
        return new LineChartModel(useStoreRef);
    }
  }, [type, useStoreRef]);

  const chartModelRef = useRef(chartModelType);
  const chartModel = chartModelRef.current;

  const chartConfig: EChartsOption = useMemo(() => {
    return chartModel.getChartConfig(tracesConfig, chartSettings);
  }, [chartModel, tracesConfig, chartSettings]);

  const setChartRef = useCallback(
    (instance: EChartsReact) => {
      setRef(instance, id);
    },
    [id, setRef]
  );

  // Effects ----------------------------------------------------------

  /**
   * Effect to update the chart config whenever any change is made to the chart
   */
  useEffect(() => {
    if (!chartAPI) return;

    const chartInstance = chartAPI.getEchartsInstance();
    chartInstance.setOption(
      chartConfig,
      { notMerge: true }
    );
  }, [chartAPI, chartConfig]);

  return { chartConfig, setChartRef, chartModel };
}
