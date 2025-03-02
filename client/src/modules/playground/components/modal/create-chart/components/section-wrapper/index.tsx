import { Button } from "@/common/components/ui/button";
import { TabsContent } from "@/common/components/ui/tabs";
import { cn } from "@/common/utils";
import { ChartPie, ChevronLeft, ChevronRight } from "lucide-react";
import { memo, useState } from "react";

interface Props {
  tabValue: string;
  sectionJsx: React.ReactNode;
  chartPreviewJsx: React.ReactNode;
}

const SectionWrapper: React.FC<Props> = props => {
  const { tabValue, sectionJsx, chartPreviewJsx } = props;

  const [isChartColumnExpanded, setIsChartColumnExpanded] = useState(true);
  const [isChartPreviewVisible, setIsChartPreviewVisible] = useState(true);

  const handleToggleChartColumn = () => {
    const value = !isChartColumnExpanded;
    setIsChartColumnExpanded(value);
    setTimeout(() => {
      setIsChartPreviewVisible(value);
    }, 300);
  };

  return (
    <TabsContent
      value={tabValue}
      className="flex-grow flex flex-col overflow-hidden"
    >
      <div className="flex flex-grow p-6 space-x-6">
        <div
          className={cn(
            "flex-grow flex flex-col bg-background rounded-lg shadow-sm border border-gray-200 transition-all duration-300",
            !isChartColumnExpanded ? "flex-grow" : "w-2/3"
          )}
        >
          {sectionJsx}
        </div>
        <div
          className={cn(
            "bg-background py-2 px-1 space-y-6 rounded-lg shadow-sm border border-gray-200 transition-all duration-300 flex flex-col",
            !isChartColumnExpanded ? "w-16" : "w-1/3"
          )}
        >
          <div className="flex items-center p-1">
            <Button
              variant="ghost"
              className="p-2"
              onClick={handleToggleChartColumn}
            >
              {!isChartColumnExpanded ? <ChevronLeft className="h-6 w-6" /> : <ChevronRight className="h-6 w-6" />}
            </Button>
            {isChartColumnExpanded && <h4 className="font-semibold mb-0 text-xl flex-grow">Chart Preview</h4>}
          </div>
          {isChartPreviewVisible && isChartColumnExpanded && (
            <div className={cn("flex-grow flex w-full items-center relative")}>
              {!chartPreviewJsx ? (
                <div className=" absolute w-full top-1/2 -translate-y-1/2 flex flex-col items-center justify-center gap-5">
                  <ChartPie className="text-primary/50 h-20 w-20" />
                  <p className="text-accent-foreground text-center">Select traces on the left to preview chart</p>
                </div>
              ) : (
                chartPreviewJsx
              )}
            </div>
          )}
        </div>
      </div>
    </TabsContent>
  );
};

export default memo(SectionWrapper);
