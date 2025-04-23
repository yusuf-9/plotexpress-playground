import EChartsReact from "echarts-for-react";
import { useCallback, useEffect } from "react";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { nanoid } from "nanoid";

// constants
import { EVENTS } from "@/modules/playground/constants/events";

// types
import { Chart } from "@/modules/playground/types";

// hooks
import { useDependencyInjector } from "@/modules/playground/contexts/dependency-injector.context";

export default function useChartExports({
  charts,
  chartsRefs,
}: {
  charts: Chart[];
  chartsRefs: Record<string, null | EChartsReact>;
}) {
  const { eventManager } = useDependencyInjector();

  const getChartAsSVG = useCallback(
    async (chart: Chart): Promise<{ name: string; data: string }> => {
      const chartInstance = chartsRefs[chart.i];
      if (!chartInstance) return { name: "", data: "" };

      const svgURL = chartInstance.getEchartsInstance().getDataURL({ type: "svg" });
      return {
        name: `${chart.chartSettings.title || nanoid()}.svg`,
        data: svgURL,
      };
    },
    [chartsRefs]
  );

  const getChartAsPNG = useCallback(
    async (chart: Chart): Promise<{ name: string; data: string }> => {
      const chartInstance = chartsRefs[chart.i];
      if (!chartInstance) return { name: "", data: "" };

      const imageObjectURL = chartInstance.getEchartsInstance().getDataURL()
      if (!imageObjectURL) return { name: "", data: "" };

      return {
        name: `${chart.chartSettings.title || nanoid()}.png`,
        data: imageObjectURL,
      };
    },
    [chartsRefs]
  );

  const handleExportAllChartsWithZip = useCallback(
    async (exportFn: typeof getChartAsSVG | typeof getChartAsPNG) => {
      const zip = new JSZip();

      const exportPromises = charts.map(chart => exportFn(chart));
      const results = await Promise.all(exportPromises);

      results.forEach(result => {
        if (result.name && result.data) {
          zip.file(result.name, result.data.split("base64,")[1], { base64: true });
        }
      });

      const zipBlob = await zip.generateAsync({ type: "blob" });
      saveAs(zipBlob, "charts.zip");
    },
    [charts]
  );

  const handleExportChart = useCallback(
    async (exportFn: typeof getChartAsSVG | typeof getChartAsPNG, chartId: Chart['i']) => {
      const chartToBeExported = charts.find(chart => chart.i === chartId);
      if (!chartToBeExported) return null;

      const chartImageData = await exportFn(chartToBeExported)

      const linkElement = document.createElement("a")
      linkElement.href = chartImageData.data;
      linkElement.download = chartImageData.name;
      linkElement.click()
    },
    [charts]
  );

  const handleExportAllChartsAsSVG = useCallback(
    () => handleExportAllChartsWithZip(getChartAsSVG),
    [handleExportAllChartsWithZip, getChartAsSVG]
  );

  const handleExportAsPDF = useCallback(() => { }, []);

  const handleExportAllChartsAsPNG = useCallback(
    () => handleExportAllChartsWithZip(getChartAsPNG),
    [handleExportAllChartsWithZip, getChartAsPNG]
  );

  const handleExportChartAsSVG = useCallback(
    (chartId: Chart['i']) => handleExportChart(getChartAsSVG, chartId),
    [handleExportChart, getChartAsSVG]
  );

  const handleExportChartAsPNG = useCallback(
    (chartId: Chart['i']) => handleExportChart(getChartAsPNG, chartId),
    [handleExportChart, getChartAsPNG]
  );

  useEffect(() => {
    eventManager.subscribe(EVENTS.EXPORT_CHARTS_AS_PNG, handleExportAllChartsAsPNG);
    eventManager.subscribe(EVENTS.EXPORT_CHARTS_AS_SVG, handleExportAllChartsAsSVG);
    eventManager.subscribe(EVENTS.EXPORT_CHARTS_AS_PDF, handleExportAsPDF);

    return () => {
      eventManager.unsubscribe(EVENTS.EXPORT_CHARTS_AS_PNG, handleExportAllChartsAsPNG);
      eventManager.unsubscribe(EVENTS.EXPORT_CHARTS_AS_SVG, handleExportAllChartsAsSVG);
      eventManager.unsubscribe(EVENTS.EXPORT_CHARTS_AS_PDF, handleExportAsPDF);
    };
  }, [eventManager, handleExportAllChartsAsPNG, handleExportAllChartsAsSVG, handleExportAsPDF]);

  return {
    handleExportAllChartsAsSVG,
    handleExportAllChartsAsPNG,
    handleExportChartAsPNG,
    handleExportChartAsSVG
  };
}
