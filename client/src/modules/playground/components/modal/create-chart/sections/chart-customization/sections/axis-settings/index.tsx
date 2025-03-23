import { memo } from "react";

// components
import { Input } from "@/common/components/ui/input";
import { Label } from "@/common/components/ui/label";

// types
import { Chart } from "@/modules/playground/types";

interface Props {
  chartSettings: Chart["chartSettings"];
  onSettingChange: (item: keyof Chart["chartSettings"], value: any) => void;
}

const AxisSettings: React.FC<Props> = props => {
  const { chartSettings, onSettingChange } = props;

  const updateAxisLimit = (axis: "x" | "y", limit: "min" | "max", value: string) => {
    if (axis === "x") {
      onSettingChange("xAxisLimits", {
        ...chartSettings.xAxisLimits,
        [limit]: value,
      });
      return;
    }

    onSettingChange("yAxisLimits", {
      ...chartSettings.yAxisLimits,
      [limit]: value,
    });
  };

  return (
    <div className="flex-grow flex overflow-y-auto">
      <div className="flex-1 flex flex-col space-y-4 pl-3 pr-6 border-r-2 border-secondary">
        <div className="flex items-center gap-5 justify-between">
          <Label
            htmlFor="x-axis-label"
            className="text-sm font-medium"
          >
            X axis label
          </Label>
          <Input
            type="text"
            id="x-axis-label"
            placeholder="X axis label"
            className="flex-1 border-b-2 border-secondary rounded-md p-2"
            defaultValue={chartSettings.xAxisLabel}
            onChange={e => {
              onSettingChange("xAxisLabel", e.target.value);
            }}
          />
        </div>
        <div className="flex items-center gap-5 justify-between">
          <Label
            htmlFor="x-axis-limits"
            className="text-sm font-medium"
          >
            X axis limits
          </Label>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Label
                htmlFor="y-axis-limits-min"
                className="text-sm font-medium"
              >
                Min
              </Label>
              <Input
                type="text"
                placeholder="Min"
                className="flex-1 border-b-2 border-secondary rounded-md p-2"
                defaultValue={chartSettings.xAxisLimits?.min}
                onChange={e => {
                  updateAxisLimit("x", "min", e.target.value);
                }}
              />
            </div>
            <div className="flex items-center gap-2">
              <Label
                htmlFor="y-axis-limits-min"
                className="text-sm font-medium"
              >
                Max
              </Label>
              <Input
                type="text"
                placeholder="Max"
                className="flex-1 border-b-2 border-secondary rounded-md p-2"
                defaultValue={chartSettings.xAxisLimits?.max}
                onChange={e => {
                  updateAxisLimit("x", "max", e.target.value);
                }}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="flex-1 flex flex-col space-y-4 pl-3 pr-6">
        <div className="flex items-center gap-5 justify-between">
          <Label
            htmlFor="y-axis-label"
            className="text-sm font-medium"
          >
            Y axis label
          </Label>
          <Input
            type="text"
            id="y-axis-label"
            placeholder="Y axis label"
            className="flex-1 border-b-2 border-secondary rounded-md p-2"
            defaultValue={chartSettings.yAxisLabel}
            onChange={e => {
              onSettingChange("yAxisLabel", e.target.value);
            }}
          />
        </div>
        <div className="flex items-center gap-5 justify-between">
          <Label
            htmlFor="y-axis-limits"
            className="text-sm font-medium"
          >
            Y axis limits
          </Label>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Label
                htmlFor="y-axis-limits-min"
                className="text-sm font-medium"
              >
                Min
              </Label>
              <Input
                type="number"
                placeholder="Min"
                className="flex-1 border-b-2 border-secondary rounded-md p-2"
                defaultValue={chartSettings.yAxisLimits?.min}
                onChange={e => {
                  updateAxisLimit("y", "min", e.target.value);
                }}
              />
            </div>

            <div className="flex items-center gap-2">
              <Label
                htmlFor="y-axis-limits-min"
                className="text-sm font-medium"
              >
                Max
              </Label>
              <Input
                type="number"
                placeholder="Max"
                className="flex-1 border-b-2 border-secondary rounded-md p-2"
                defaultValue={chartSettings.yAxisLimits?.max}
                onChange={e => {
                  updateAxisLimit("y", "max", e.target.value);
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(AxisSettings);
