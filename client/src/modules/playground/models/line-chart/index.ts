import { EChartsOption } from "echarts";

// models
import BaseChartModel from "../chart";

// types
import { LineChartConfig } from "../../types";

interface LineChartModelType {
  getChartConfig: (tracesConfig: LineChartConfig["tracesConfig"], chartSettings: LineChartConfig["chartSettings"]) => EChartsOption;
  getSeriesData: (tracesConfig: LineChartConfig["tracesConfig"]) => Array<Array<[xPoint: any, yPoint: any]>>;
}

class LineChartModel extends BaseChartModel implements LineChartModelType {
  constructor(props: any) {
    super(props);
  }

  /**
   * Retrieves series data for the chart based on the trace configuration.
   *
   * @param traces - The configuration of the chart traces.
   * @returns An array having array members, each having arrays of tuples, each representing an x and y data point for the series.
   */
  getSeriesData(traces: LineChartConfig["tracesConfig"]): Array<Array<[xPoint: any, yPoint: any]>> {
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
   * @returns The ECharts option object configured for the line chart.
   */
  getChartConfig(traces: LineChartConfig["tracesConfig"], chartSettings: LineChartConfig["chartSettings"]): EChartsOption {
    const seriesData = this.getSeriesData(traces);
    const seriesConfig = seriesData.map((dataSet, index) => ({
      ...traces[index]?.settings,
      data: dataSet,
      id: traces[index]?.id,
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
      },
      legend: {
        show: chartSettings.legendVisibility,
        data: seriesConfig.map(series => series.name),
        bottom: chartSettings.legendPosition === "bottom" ? 0 : undefined,
        top: chartSettings.legendPosition === "top" ? 0 : undefined,
      },
      xAxis: {
        type: "category", // TODO: set this dynamically for timeseries, logging, etc kinds of data
        name: chartSettings?.xAxisLabel,
        boundaryGap: false,
        // axisLine: {
        //   show: true,
        //   lineStyle: {
        //     type: "dashed",
        //   },
        // },
      },
      yAxis: {
        type: "value",
        name: chartSettings?.yAxisLabel,
        min: chartSettings?.yAxisLimits.min ? parseFloat(chartSettings?.yAxisLimits.min) : undefined,
        max: chartSettings?.yAxisLimits.max ? parseFloat(chartSettings?.yAxisLimits.max) : undefined,
        // axisLine: {
        //   show: true,
        //   lineStyle: {
        //     type: "dashed"
        //   },
        // },
      },
      series: seriesConfig.map(series => ({
        name: series.name,
        type: "line",
        data: series.data,
        symbol: series.markerType,
        symbolSize: series.markerWidth,
        showSymbol: series.markerVisibility,
        itemStyle: {
          color: series.color,
        },
        lineStyle: {
          color: series.color,
          width: series.traceWidth,
          opacity: series.visibility ? Number(series.opacity) / 10 : 0,
        },
        id: series.id,
      })),
    };
  }
}

export default LineChartModel;
