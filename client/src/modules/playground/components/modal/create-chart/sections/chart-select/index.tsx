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
      <h2 className="text-3xl font-medium text-foreground my-8 text-center tracking-normal">Select Chart Type</h2>
      <div className="flex-grow w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 pt-20">
        {chartTypes.map(chart => (
          <Button
            key={chart.label}
            variant="outline"
            className={cn(
              "h-52 flex flex-col items-center justify-center gap-4 bg-gradient-to-br transition-all duration-300 shadow-sm hover:shadow-md",
              "from-white to-primary/10 hover:from-white hover:to-primary/30",
              "dark:from-secondary dark:to-primary/30 dark:hover:to-primary/80",
              selectedChartType === chart.key &&
                "from-primary-light to-primary/50 dark:from-primary/40 dark:to-primary/80 shadow-md"
            )}
            onClick={() => onChartSelect(chart.key)}
          >
            <chart.icon className="!h-16 !w-16 mb-2 text-primary" />
            <span className="font-medium text-2xl text-foreground">{chart.label}</span>
          </Button>
        ))}
      </div>
    </TabsContent>
  );
};

export default memo(ChartSelectSection);
