import React, { memo, useMemo } from "react";

// echarts
import ReactECharts from "echarts-for-react";
import EChartsReact from "echarts-for-react";

// hooks
import useChartConfig from "./hooks/useChartConfig";

// types
import { Chart as ChartType } from "../../types";

type Props = {
  chart: ChartType
  setRef: (instance: EChartsReact, chartId: string) => void;
  chartAPI: EChartsReact | null;
};

const Chart = memo((props: Props) => {
  const { chart, setRef, chartAPI } = props;

  const { chartConfig, setChartRef } = useChartConfig({
    chart,
    setRef,
    chartAPI,
  });

  const chartJsx = useMemo(() => {
    return (
      <ReactECharts
        option={chartConfig}
        ref={setChartRef}
        style={{height: '100%', width: '100%'}}
      />
    );
  }, [chartConfig, setChartRef]);

  return (
    <div className="flex-grow w-full h-full">
      {chartJsx}
    </div>
  );
});

Chart.displayName = "Chart";

export default Chart;
