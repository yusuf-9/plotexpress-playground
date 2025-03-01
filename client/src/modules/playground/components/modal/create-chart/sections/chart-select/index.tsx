import { TabsContent } from "@/common/components/ui/tabs";
import { memo } from "react";
import { chartTypes } from "../../constants";
import { Button } from "@/common/components/ui/button";
import { CHART_TYPES } from "@/modules/playground/constants/charts";
import { cn } from "@/common/utils";

type Props = {
  tabValue: string;
  onChartSelect: (chartType: (typeof CHART_TYPES)[keyof typeof CHART_TYPES]) => void;
  selectedChartType: (typeof CHART_TYPES)[keyof typeof CHART_TYPES] | undefined;
};

const ChartSelectSection = (props: Props) => {
  const { tabValue, onChartSelect, selectedChartType } = props;

  return (
    <TabsContent
      value={tabValue}
      className="flex-grow flex flex-col p-6 overflow-y-auto"
    >
      <h2 className="text-3xl font-medium text-gray-800 my-8 text-center tracking-normal">Select Chart Type</h2>
      <div className="flex-grow w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 pt-20">
        {chartTypes.map(chart => (
          <Button
            key={chart.label}
            variant="outline"
            className={cn(
              "h-52 flex flex-col items-center justify-center gap-4 bg-gradient-to-br from-white to-[#f0f9ff] hover:from-[#e6fff7] hover:to-[#ccfbf1] transition-all duration-300 shadow-sm hover:shadow-md",
              selectedChartType === chart.key && "from-[#e6fff7] to-[#ccfbf1] shadow-md"
            )}
            onClick={() => onChartSelect(chart.key)}
          >
            <chart.icon className="h-16 w-16 mb-2 text-main" />
            <span className="font-medium text-2xl">{chart.label}</span>
          </Button>
        ))}
      </div>
    </TabsContent>
  );
};

export default memo(ChartSelectSection);
