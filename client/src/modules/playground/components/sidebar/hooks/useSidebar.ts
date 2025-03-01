import { useState } from "react";
import { useStore } from "@/modules/playground/contexts/store.context";
import { SectionTypes } from "..";

export default function useSidebar() {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [selectedSection, setSelectedSection] = useState<SectionTypes>("data");

  const setIsChartEditorModalOpen = useStore(store => store.setIsChartEditorModalOpen);
  const setIsDataUploadModalOpen = useStore(store => store.setIsDataUploadModalOpen);

  return {
    isSidebarExpanded,
    setIsSidebarExpanded,
    selectedSection,
    setSelectedSection,
    setIsChartEditorModalOpen,
    setIsDataUploadModalOpen
  };
}
