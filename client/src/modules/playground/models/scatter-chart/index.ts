import { EChartsOption } from "echarts";

// models
import BaseChartModel from "../chart";

// types
import { ScatterChartConfig } from "../../types";

interface ScatterChartModelType {
  getChartConfig: (tracesConfig: ScatterChartConfig["tracesConfig"], chartSettings: ScatterChartConfig["chartSettings"]) => EChartsOption;
  getSeriesData: (tracesConfig: ScatterChartConfig["tracesConfig"]) => Array<Array<[xPoint: any, yPoint: any]>>;
}

class ScatterChartModel extends BaseChartModel implements ScatterChartModelType {
  constructor(props: any) {
    super(props);
  }

  /**
   * Retrieves series data for the chart based on the trace configuration.
   *
   * @param traces - The configuration of the chart traces.
   * @returns An array having array members, each having arrays of tuples, each representing an x and y data point for the series.
   */
  getSeriesData(traces: ScatterChartConfig["tracesConfig"]): Array<Array<[xPoint: any, yPoint: any]>> {
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
   * @returns The ECharts option object configured for the scatter chart.
   */
  getChartConfig(traces: ScatterChartConfig["tracesConfig"], chartSettings: ScatterChartConfig["chartSettings"]): EChartsOption {
    const seriesData = this.getSeriesData(traces);
    const seriesConfig = seriesData.map((dataSet, index) => ({
      ...traces[index]?.settings,
      name: traces[index]?.settings.name,
      data: dataSet,
      id: traces[index]?.id,
    }));

    return {
      title: {
        show: false,
      },
      tooltip: {
        trigger: "item",
        formatter: (params: any) => {
          const color = params.color; // Get the color of the current series
          const traceName = params.seriesName;
          const x = params.value[0];
          const y = params.value[1];

          // Format the tooltip with trace name, color marker, and data values
          return `
          <div class="flex flex-col space-y-1">
            <div class="flex items-center space-x-2">
              <span class="inline-block w-2 h-2 rounded-full" style="background-color: ${color};"></span>
              <span class="font-semibold text-foreground">${traceName}</span>
            </div>
            <div class="text-sm text-accent-foreground"><b>X</b>: ${x}, <b>Y</b>: ${y}</div>
          </div>
        `;
        },
      },
      legend: {
        show: chartSettings.legendVisibility,
        data: seriesConfig.map(series => series.name),
        bottom: chartSettings.legendPosition === "bottom" ? 0 : undefined,
        top: chartSettings.legendPosition === "top" ? 0 : undefined,
      },
      xAxis: {
        type: "value", // TODO: set this dynamically for timeseries, logging, etc kinds of data
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
        type: "scatter",
        data: series.data,
        symbol: series.markerType,
        symbolSize: series.markerWidth,
        itemStyle: {
          opacity: series.visibility ? Number(series.opacity) / 10 : 0,
          color: series.color,
        },
        id: series.id,
      })),
    };
  }
}

export default ScatterChartModel;
