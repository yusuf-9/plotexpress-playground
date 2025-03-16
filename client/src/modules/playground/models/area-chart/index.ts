import { EChartsOption } from "echarts";

// models
import BaseChartModel from "../chart";

// types
import { Chart } from "../../types";

interface AreaChartModelType {
  getChartConfig: (tracesConfig: Chart["tracesConfig"]) => EChartsOption;
  getSeriesData: (tracesConfig: Chart["tracesConfig"]) => Array<Array<[xPoint: any, yPoint: any]>>;
}

class AreaChartModel extends BaseChartModel implements AreaChartModelType {
  constructor(props: any) {
    super(props);
  }

  /**
   * Retrieves series data for the chart based on the trace configuration.
   *
   * @param traces - The configuration of the chart traces.
   * @returns An array having array members, each having arrays of tuples, each representing an x and y data point for the series.
   */
  getSeriesData(traces: Chart["tracesConfig"]): Array<Array<[xPoint: any, yPoint: any]>> {
    const uploadedFiles = this.storeRef.getState().files;

    const seriesData = traces.map(traceConfig => {
      if (!traceConfig.x || !traceConfig.y) return [];

      const fileX = uploadedFiles[traceConfig.x.fileId];
      const fileY = uploadedFiles[traceConfig.y.fileId];

      if (!fileX || !fileY) return [];

      const dataX = fileX.data.map(dataObject => {
        return dataObject[traceConfig.x!.column];
      });
      const dataY = fileY.data.map(dataObject => {
        return dataObject[traceConfig.y!.column];
      });

      return dataX.map((xValue, index) => [xValue, dataY[index]]);
    });

    return seriesData as Array<Array<[xPoint: any, yPoint: any]>>;
  }

  /**
   * Generates the full chart configuration for ECharts.
   *
   * @param traces - The configuration of the chart traces.
   * @returns The ECharts option object configured for the area chart.
   */
  getChartConfig(traces: Chart["tracesConfig"]): EChartsOption {
    const seriesData = this.getSeriesData(traces);
    const seriesConfig = seriesData.map((dataSet, index) => ({
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
      },
      legend: {
        data: seriesConfig.map(series => series.name),
        bottom: 0,
      },
      xAxis: {
        type: "category", // TODO: set this dynamically for timeseries, logging, etc kinds of data
        name: "X Axis", // TODO: set this dynamically for timeseries, logging, etc kinds of data
      },
      yAxis: {
        type: "value",
        name: "Y Axis",
      },
      series: seriesConfig.map(series => ({
        name: series.name,
        type: "line", // Keep type as "line" for area charts
        data: series.data,
        itemStyle: {
          color: series.color,
        },
        lineStyle: {
          color: series.color,
        },
        areaStyle: {
          color: series.color, // Set area style color to match line
          opacity: 0.1, // Adjust opacity for better visibility
        },
      })),
    };
  }
}

export default AreaChartModel;
