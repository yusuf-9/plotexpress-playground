import { useState } from "react";

export default function useDataSelectUi() {

  const [isFileColumnCollapsed, setIsFileColumnCollapsed] = useState(false);
  const [isChartColumnCollapsed, setIsChartColumnCollapsed] = useState(false);

  return {
    isFileColumnCollapsed,
    setIsFileColumnCollapsed,
    isChartColumnCollapsed,
    setIsChartColumnCollapsed,
  };
}
