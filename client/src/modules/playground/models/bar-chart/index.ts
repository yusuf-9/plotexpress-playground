import { EChartsOption } from "echarts";

// models
import BaseChartModel from "../chart";

// types
import { BarChartConfig } from "../../types";

interface BarChartModelType {
  getChartConfig: (tracesConfig: BarChartConfig["tracesConfig"], chartSettings: BarChartConfig["chartSettings"]) => EChartsOption;
  getSeriesData: (tracesConfig: BarChartConfig["tracesConfig"]) => [xAxisData: Array<string | number>, yAxisData: Array<(string | number)[]>];
}

class BarChartModel extends BaseChartModel implements BarChartModelType {
  constructor(props: any) {
    super(props);
  }

  /**
   * Retrieves series data for the chart based on the trace configuration.
   *
   * @param traces - The configuration of the chart traces.
   * @returns An array having array members, each having arrays of tuples, each representing an x and y data point for the series.
   */
  getSeriesData(traces: BarChartConfig["tracesConfig"]): [xAxisData: Array<string | number>, yAxisData: Array<(string | number)[]>] {
    const uploadedFiles = this.storeRef.getState().files;

    // validate that the x axis columns are all the same
    const xAxisColumns = traces.map(traceConfig => traceConfig.x?.column);
    if (new Set(xAxisColumns).size > 1) {
      throw new Error("All x axis columns must be the same");
    }

    const seriesData = traces.reduce(
      (acc: Record<"x" | "y", any>, traceConfig) => {
        if (!traceConfig.x || !traceConfig.y) return acc;

        const fileX = uploadedFiles[traceConfig.x.fileId];
        const fileY = uploadedFiles[traceConfig.y.fileId];

        if (!fileX || !fileY) return acc;

        if (!acc["x"]) {
          const dataX = fileX.data.map(dataObject => {
            return dataObject[traceConfig.x!.column];
          });
          acc["x"] = dataX;
        }

        const dataY = fileY.data.map(dataObject => {
          return dataObject[traceConfig.y!.column];
        });
        acc["y"].push(dataY);
        return acc;
      },
      { x: null, y: [] }
    );

    return [seriesData.x ?? [], seriesData.y];
  }

  /**
   * Generates the full chart configuration for ECharts.
   *
   * @param traces - The configuration of the chart traces.
   * @returns The ECharts option object configured for the bar chart.
   */
  getChartConfig(traces: BarChartConfig["tracesConfig"], chartSettings: BarChartConfig["chartSettings"]): EChartsOption {
    const [xCategories, yDataSets] = this.getSeriesData(traces);
    const seriesConfig = yDataSets.map((dataSet, index) => ({
      data: dataSet,
      id: traces[index]?.id,
      ...traces[index]?.settings,
    }));

    return {
      grid: {
        left: 50,
        right: 50,
        top: 50,
        bottom: 50,
      },
      title: {
        show: false,
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow", // Emphasizes the bar hovered over
        },
      },
      legend: {
        show: chartSettings.legendVisibility,
        data: seriesConfig.map(series => series.name),
        bottom: chartSettings.legendPosition === "bottom" ? 0 : undefined,
        top: chartSettings.legendPosition === "top" ? 0 : undefined,
      },
      xAxis: {
        type: "category", // TODO: set this dynamically for timeseries, logging, etc kinds of data
        data: xCategories,
        name: chartSettings?.xAxisLabel,
        min: chartSettings?.xAxisLimits.min ? parseFloat(chartSettings?.xAxisLimits.min) : undefined,
        max: chartSettings?.xAxisLimits.max ? parseFloat(chartSettings?.xAxisLimits.max) : undefined,
      },
      yAxis: {
        type: "value",
        name: chartSettings?.yAxisLabel,
        min: chartSettings?.yAxisLimits.min ? parseFloat(chartSettings?.yAxisLimits.min) : undefined,
        max: chartSettings?.yAxisLimits.max ? parseFloat(chartSettings?.yAxisLimits.max) : undefined,
      },
      series: seriesConfig.map(series => ({
        name: series.name,
        type: "bar",
        data: series.data,
        itemStyle: {
          color: series.color,
          opacity: series.visibility ? Number(series.opacity) / 10 : 0,
        },
        lineStyle: {
          color: series.color,
        },
        barWidth: series.binWidth + "%",
        id: series.id,
      })),
    };
  }
}

export default BarChartModel;
