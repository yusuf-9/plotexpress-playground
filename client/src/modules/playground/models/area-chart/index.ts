import { EChartsOption } from "echarts";

// models
import BaseChartModel from "../chart";

// types
import { AreaChartConfig } from "../../types";

interface AreaChartModelType {
  getChartConfig: (tracesConfig: AreaChartConfig["tracesConfig"], chartSettings: AreaChartConfig["chartSettings"], theme: "light" | "dark") => EChartsOption;
  getSeriesData: (tracesConfig: AreaChartConfig["tracesConfig"]) => Array<Array<[xPoint: any, yPoint: any]>>;
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
  getSeriesData(traces: AreaChartConfig["tracesConfig"]): Array<Array<[xPoint: any, yPoint: any]>> {
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
  getChartConfig(traces: AreaChartConfig["tracesConfig"], chartSettings: AreaChartConfig["chartSettings"], theme: "light" | "dark"): EChartsOption {
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
        text: chartSettings.title,
        show: chartSettings.titleVisibility,
        top: 0,
        left: "center",
      },
      tooltip: {
        trigger: "axis",
      },
      legend: {
        show: chartSettings.legendVisibility,
        data: seriesConfig.map(series => series.name),
        bottom: 0,
      },
      xAxis: {
        type: "category", // TODO: set this dynamically for timeseries, logging, etc kinds of data
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
        type: "line", // Keep type as "line" for area charts
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
        areaStyle: {
          color: series.color, // Set area style color to match line
          opacity: series.visibility ? Number(series.fillOpacity) / 10 : 0 // Adjust opacity for better visibility
        },
        id: series.id,
      })),
      backgroundColor: theme === "dark" ? "#000" : "#FFF"
    };
  }
}

export default AreaChartModel;
