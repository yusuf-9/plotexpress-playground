import { memo } from "react";

// components
import { Input } from "@/common/components/ui/input";
import { Label } from "@/common/components/ui/label";
import { Switch } from "@/common/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/common/components/ui/select";

// types
import { Chart } from "@/modules/playground/types";

interface Props {
  chartSettings: Chart["chartSettings"];
  onSettingChange: (item: keyof Chart["chartSettings"], value: any) => void;
}

const GeneralSettings: React.FC<Props> = props => {
  const { chartSettings, onSettingChange } = props;

  return (
    <div className="flex-grow flex overflow-y-auto">
      <div className="flex-1 flex flex-col space-y-4 pl-3 pr-6 border-r-2 border-secondary">
        <div className="flex items-center gap-5 justify-between">
          <Label
            htmlFor="chart-title"
            className="text-sm font-medium"
          >
            Chart title
          </Label>
          <Input
            type="text"
            id="chart-title"
            placeholder="Chart title"
            className="flex-1 border-b-2 border-secondary rounded-md p-2"
            defaultValue={chartSettings.title}
            onChange={e => {
              onSettingChange("title", e.target.value);
            }}
          />
        </div>
        <div className="flex items-center gap-5 justify-between">
          <Label
            htmlFor="chart-caption"
            className="text-sm font-medium"
          >
            Chart title visibility
          </Label>
          <Switch
            id="chart-caption"
            defaultChecked={chartSettings.titleVisibility}
            onCheckedChange={value => {
              onSettingChange("titleVisibility", value);
            }}
          />
        </div>
        <div className="flex items-center gap-5 justify-between">
          <Label
            htmlFor="chart-legend-visibility"
            className="text-sm font-medium"
          >
            Legend visibility
          </Label>
          <Switch
            id="chart-legend-visibility"
            defaultChecked={chartSettings.legendVisibility}
            onCheckedChange={value => {
              onSettingChange("legendVisibility", value);
            }}
          />
        </div>
        <div className="flex items-center gap-5 justify-between">
          <Label
            htmlFor="legend-position-select"
            className="text-sm font-medium "
          >
            Legend position
          </Label>
          <Select
            defaultValue={chartSettings.legendPosition}
            onValueChange={value => {
              onSettingChange("legendPosition", value);
            }}
          >
            <SelectTrigger
              id="legend-position-select"
              className="w-[100px]"
            >
              <SelectValue placeholder="Select position" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="top">Top</SelectItem>
              <SelectItem value="bottom">Bottom</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex-1 flex flex-col space-y-4 pl-3 pr-6"></div>
    </div>
  );
};

export default memo(GeneralSettings);
