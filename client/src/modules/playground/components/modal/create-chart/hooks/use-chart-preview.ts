import EChartsReact from "echarts-for-react";
import { useCallback, useState } from "react";

export default function useChartPreview() {
  const [chartAPI, setChartAPI] = useState<EChartsReact | null>(null);

  const setRef = useCallback((instance: EChartsReact) => {
    setChartAPI(instance);
  }, []);

  return {
    chartAPI,
    setChartPreviewRef: setRef,
  };
}
