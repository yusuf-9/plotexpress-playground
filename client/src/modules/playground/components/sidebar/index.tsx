import { useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

// sub-components
import IconButton from "./sub-components/icon-button";

// sections
import DataSidebarSection from "./sections/data";
import ChartSidebarSection from "./sections/chart";
import ActionsSidebarSection from "./sections/actions";

// constants
import { ICON_BUTTONS, SECTIONS } from "./constants";

// hooks
import useSidebar from "./hooks/useSidebar";

export type SectionTypes = (typeof SECTIONS)[keyof typeof SECTIONS];

export default function PlaygroundSidebar() {
  const {
    isSidebarExpanded,
    selectedSection,
    setIsChartEditorModalOpen,
    setIsSidebarExpanded,
    setSelectedSection,
    setIsDataUploadModalOpen,
  } = useSidebar();

  const iconButtons = useMemo(() => {
    return ICON_BUTTONS.map(button => (
      <IconButton
        key={button.name}
        icon={button.icon}
        label={button.label}
        onClick={() => {
          setSelectedSection(button.name);
          setIsSidebarExpanded(true);
        }}
        renderActiveState={selectedSection === button.name && isSidebarExpanded}
      />
    ));
  }, [selectedSection, isSidebarExpanded, setSelectedSection, setIsSidebarExpanded]);

  const activeSidebarSection = useMemo(() => {
    switch (selectedSection) {
      case SECTIONS.DATA:
        return <DataSidebarSection openDataEditor={() => setIsDataUploadModalOpen(true)}/>;
      case SECTIONS.CHARTS:
        return <ChartSidebarSection openChartEditor={() => setIsChartEditorModalOpen(true)} />;
      case SECTIONS.SAVE:
        return <ActionsSidebarSection />;
      default:
        return null;
    }
  }, [selectedSection, setIsChartEditorModalOpen, setIsDataUploadModalOpen]);

  return (
    <aside
      className={`bg-background border-r border-secondary transition-all duration-300 flex flex-col ${
        isSidebarExpanded ? "w-96" : "w-16"
      }`}
    >
      <nav className="flex-1 flex items-stretch">
        {/* collapsed sidebar */}
        <div className="flex-shrink-0 flex flex-col items-center w-16 py-4 space-y-4 border-r border-secondary">
          {/* sidebar trigger */}
          <IconButton
            icon={isSidebarExpanded ? <ChevronLeft /> : <ChevronRight />}
            label={`${isSidebarExpanded ? "Hide" : "Open"} sidebar`}
            onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}
            renderActiveState={false}
          />
          {/* icon buttons */}
          {iconButtons}
        </div>
        {/* expanded sidebar */}
        {isSidebarExpanded && <div className="p-4 flex-grow flex-col space-y-4 overflow-x-hidden">{activeSidebarSection}</div>}
      </nav>
    </aside>
  );
}
