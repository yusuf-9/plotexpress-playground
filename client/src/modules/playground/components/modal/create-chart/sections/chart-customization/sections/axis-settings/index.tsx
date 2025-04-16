import { memo, useMemo, useCallback } from "react";
import { cn } from "@/common/utils";

// types
import { Chart } from "@/modules/playground/types";

// utils
import { renderInput } from "../../utils/render-inputs";
import { renderAxisInput } from "../../utils/render-inputs";

// constants
import { CHART_AXIS_SETTINGS_INPUT_CONFIGS_MAP } from "@/modules/playground/constants/charts";

interface Props {
  chartSettings: Chart["chartSettings"];
  onSettingChange: (item: keyof Chart["chartSettings"], value: any) => void;
  settingInputsConfig: (typeof CHART_AXIS_SETTINGS_INPUT_CONFIGS_MAP)[keyof typeof CHART_AXIS_SETTINGS_INPUT_CONFIGS_MAP];
}

const AxisSettings: React.FC<Props> = props => {
  const { chartSettings, onSettingChange, settingInputsConfig } = props;

  const updateAxisLimit = useCallback(
    (axis: "x" | "y", limit: "min" | "max", value: string) => {
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
    },
    [chartSettings.xAxisLimits, chartSettings.yAxisLimits, onSettingChange]
  );

  const axisSettingInputsJsx = useMemo(() => {
    return Object.entries(settingInputsConfig).map(([axis, axisInputs], index) => {
      const inputsOfAxisJsx = axisInputs.map(inputConfig => {
        if (inputConfig.inputType === "min/max") {
          const inputConfigWithDefaultValues = {
            ...inputConfig,
            defaultValueMin:
              (chartSettings[inputConfig.id as keyof Chart["chartSettings"]] as { min: string; max: string })?.min ||
              undefined,
            defaultValueMax:
              (chartSettings[inputConfig.id as keyof Chart["chartSettings"]] as { min: string; max: string })?.max ||
              undefined,
            onChangeMin: (value: any) => {
              updateAxisLimit(axis as "x" | "y", "min", value);
            },
            onChangeMax: (value: any) => {
              updateAxisLimit(axis as "x" | "y", "max", value);
            },
          };

          return renderAxisInput(inputConfigWithDefaultValues);
        }

        // @ts-expect-error - TS is acting dumb here ngl
        return renderInput({
          ...inputConfig,
          defaultValue: chartSettings[inputConfig.id as keyof Chart["chartSettings"]],
          onChangeValue: (value: any) => {
            onSettingChange(inputConfig.id as keyof Chart["chartSettings"], value);
          },
        });
      });

      return (
        <div
          key={axis}
          className={cn(
            "flex-1 flex flex-col space-y-4 pl-3 pr-6 border-secondary",
            index < Object.keys(settingInputsConfig).length - 1 ? "border-r-2" : ""
          )}
        >
          {inputsOfAxisJsx}
        </div>
      );
    });
  }, [chartSettings, onSettingChange, updateAxisLimit, settingInputsConfig]);

  return <div className="flex-grow flex overflow-y-auto">{axisSettingInputsJsx}</div>;
};

export default memo(AxisSettings);
