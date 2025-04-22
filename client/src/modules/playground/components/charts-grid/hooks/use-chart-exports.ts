import EChartsReact from "echarts-for-react";
import { useCallback, useEffect } from "react";
import JSZip from "jszip";
import { saveAs } from "file-saver";

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

  const exportSingleChartAsSVG = useCallback(
    async (chart: Chart): Promise<{ name: string; data: string }> => {
      const chartInstance = chartsRefs[chart.i];
      if (!chartInstance) return { name: "", data: "" };

      const svgURL = chartInstance.getEchartsInstance().getDataURL({ type: "svg" });
      return {
        name: `${chart.chartSettings.title || "chart-1"}.svg`,
        data: svgURL,
      };
    },
    [chartsRefs]
  );

  const exportSingleChartAsPNG = useCallback(
    async (chart: Chart): Promise<{ name: string; data: string }> => {
      const chartInstance = chartsRefs[chart.i];
      if (!chartInstance) return { name: "", data: "" };

      const canvas = chartInstance.getEchartsInstance().getDom().querySelector("canvas");
      if (!canvas) return { name: "", data: "" };

      return {
        name: `${chart.chartSettings.title || "chart-1"}.png`,
        data: canvas.toDataURL("image/png"),
      };
    },
    [chartsRefs]
  );

  const handleExportWithZip = useCallback(
    async (exportFn: typeof exportSingleChartAsPNG | typeof exportSingleChartAsSVG) => {
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

  const handleExportAsSVG = useCallback(
    () => handleExportWithZip(exportSingleChartAsSVG),
    [handleExportWithZip, exportSingleChartAsSVG]
  );

  const handleExportAsPDF = useCallback(() => {}, []);

  const handleExportAllAsPNG = useCallback(
    () => handleExportWithZip(exportSingleChartAsPNG),
    [handleExportWithZip, exportSingleChartAsPNG]
  );

  useEffect(() => {
    eventManager.subscribe(EVENTS.EXPORT_CHARTS_AS_PNG, handleExportAllAsPNG);
    eventManager.subscribe(EVENTS.EXPORT_CHARTS_AS_SVG, handleExportAsSVG);
    eventManager.subscribe(EVENTS.EXPORT_CHARTS_AS_PDF, handleExportAsPDF);

    return () => {
      eventManager.unsubscribe(EVENTS.EXPORT_CHARTS_AS_PNG, handleExportAllAsPNG);
      eventManager.unsubscribe(EVENTS.EXPORT_CHARTS_AS_SVG, handleExportAsSVG);
      eventManager.unsubscribe(EVENTS.EXPORT_CHARTS_AS_PDF, handleExportAsPDF);
    };
  }, [eventManager, handleExportAllAsPNG, handleExportAsSVG, handleExportAsPDF]);

  return {
    exportSingleChartAsPNG,
    handleExportAsSVG,
    handleExportAsPDF,
  };
}
