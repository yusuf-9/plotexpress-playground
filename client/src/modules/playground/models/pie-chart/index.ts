import { EChartsOption } from "echarts";

// models
import BaseChartModel from "../chart";

// types
import { Chart } from "../../types";

interface PieChartModelType {
  getChartConfig: (tracesConfig: Chart["tracesConfig"]) => EChartsOption;
  getSeriesData: (tracesConfig: Chart["tracesConfig"]) => Array<Array<{ name: string; value: number }>>;
}

class PieChartModel extends BaseChartModel implements PieChartModelType {
  constructor(props: any) {
    super(props);
  }

  /**
   * Retrieves series data for the pie chart based on the trace configuration.
   *
   * @param tracesConfig - The configuration of the chart traces.
   * @returns An array of arrays, each containing objects representing categories and their corresponding values for each trace.
   */
  getSeriesData(tracesConfig: Chart["tracesConfig"]): Array<Array<{ name: string; value: number }>> {
    const uploadedFiles = this.storeRef.getState().files;

    // Map each trace to a set of data formatted for the pie chart
    return tracesConfig.map(traceConfig => {
      if (!traceConfig.x || !traceConfig.y) return [];

      const fileX = uploadedFiles[traceConfig.x.fileId];
      const fileY = uploadedFiles[traceConfig.y.fileId];

      if (!fileX || !fileY) return [];

      const dataX = fileX.data.map(dataObject => dataObject[traceConfig.x!.column]);
      const dataY = fileY.data.map(dataObject => dataObject[traceConfig.y!.column]);

      // Format data for pie chart
      return dataX.map((category, index) => ({
        name: category,
        value: dataY[index],
      }));
    });
  }

  /**
   * Generates the full chart configuration for ECharts.
   *
   * @param tracesConfig - The configuration of the chart traces.
   * @returns The ECharts option object configured for the pie chart.
   */
  getChartConfig(tracesConfig: Chart["tracesConfig"]): EChartsOption {
    const seriesData = this.getSeriesData(tracesConfig);

    // Currently only uses the first trace, but is structured to support multiple in the future.
    const seriesConfig = seriesData.map((dataSet, index) => ({
      name: tracesConfig[index]?.settings.name,
      color: tracesConfig[index]?.settings.color,
      data: dataSet,
    }));

    return {
      title: {
        text: "Pie Chart",
        left: "center",
      },
      tooltip: {
        trigger: "item",
      },
      legend: {
        orient: "vertical",
        left: "left",
        data: seriesConfig.map(series => series.name),
      },
      series: seriesConfig.map(series => ({
        name: series?.name,
        data: series?.data,
        type: "pie",
        radius: "50%",
        itemStyle: {
          color: series?.color,
          borderColor: "#ffffff", // Adds a white border for separation
          borderWidth: 2, // Sets the border width for visibility
        },
        labelLine: {
          show: false,
        },
      })),
    };
  }
}

export default PieChartModel;
