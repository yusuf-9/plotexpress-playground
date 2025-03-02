import { PieChart } from "lucide-react";
import { Button } from "@/common/components/ui/button";

type Props = {
  openChartEditor: () => void;
};

export default function ChartSidebarSection(props: Props) {
  const { openChartEditor } = props;
  return (
    <div className="flex flex-col">
      <h3 className="font-semibold mb-2 text-foreground">Plotting</h3>
      <Button
        variant="default"
        onClick={openChartEditor}
      >
        <PieChart className="mr-2 h-4 w-4" />
        Create Chart
      </Button>
    </div>
  );
}
