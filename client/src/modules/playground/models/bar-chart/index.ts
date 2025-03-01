import { EChartsOption } from "echarts";

// models
import BaseChartModel from "../chart";

// types
import { Chart } from "../../types";

interface BarChartModelType {
  getChartConfig: (tracesConfig: Chart["tracesConfig"]) => EChartsOption;
  getSeriesData: (
    tracesConfig: Chart["tracesConfig"]
  ) => [xAxisData: Array<string | number>, yAxisData: Array<(string | number)[]>];
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
  getSeriesData(
    traces: Chart["tracesConfig"]
  ): [xAxisData: Array<string | number>, yAxisData: Array<(string | number)[]>] {
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
  getChartConfig(traces: Chart["tracesConfig"]): EChartsOption {
    const [xCategories, yDataSets] = this.getSeriesData(traces);
    const seriesConfig = yDataSets.map((dataSet, index) => ({
      name: traces[index]?.settings.name,
      color: traces[index]?.settings.color,
      data: dataSet,
    }));

    return {
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
        data: seriesConfig.map(series => series.name),
        bottom: 0,
      },
      xAxis: {
        type: "category", // TODO: set this dynamically for timeseries, logging, etc kinds of data
        data: xCategories,
        name: "X Axis", // TODO: set this dynamically for timeseries, logging, etc kinds of data
      },
      yAxis: {
        type: "value",
        name: "Y Axis",
      },
      series: seriesConfig.map(series => ({
        name: series.name,
        type: "bar",
        data: series.data,
        itemStyle: {
          color: series.color,
        },
      })),
    };
  }
}

export default BarChartModel;
