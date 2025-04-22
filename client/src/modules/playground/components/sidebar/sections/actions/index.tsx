// components
import { Button } from "@/common/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/common/components/ui/dropdown-menu";

// icons
import { Download, Share2 } from "lucide-react";

// constants
import { EVENTS } from "@/modules/playground/constants/events";

// hooks
import { useDependencyInjector } from "@/modules/playground/contexts/dependency-injector.context";

export default function ActionsSidebarSection() {
  const { eventManager } = useDependencyInjector();

  const handleExportChartsAsPNG = () => {
    eventManager.emit(EVENTS.EXPORT_CHARTS_AS_PNG);
  };

  const handleExportChartsAsSVG = () => {
    eventManager.emit(EVENTS.EXPORT_CHARTS_AS_SVG);
  };

  const handleExportChartsAsPDF = () => {
    eventManager.emit(EVENTS.EXPORT_CHARTS_AS_PDF);
  };

  return (
    <div className="flex flex-col">
      <h3 className="font-semibold mb-2 text-foreground">Actions</h3>
      <div className="flex flex-col gap-2">
        <Button variant="default">
          <Share2 className="mr-2 h-4 w-4" />
          Share
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="default">
              <Download className="mr-2 h-4 w-4" />
              Export charts
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-full">
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={handleExportChartsAsPNG}
            >
              Export as PNG
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={handleExportChartsAsSVG}
            >
              Export as SVG
            </DropdownMenuItem>
            <DropdownMenuItem
              disabled
              className="cursor-pointer"
              onClick={handleExportChartsAsPDF}
            >
              Export as PDF
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
