import { cn } from "@/common/utils";
import { memo, useCallback, useMemo, useState } from "react";

// sections
import GeneralSettings from "./sections/general-settings";
import AxisSettings from "./sections/axis-settings";
import SeriesSettings from "./sections/series-settings";

// constants
import { SETTING_CATEGORIES } from "./constants";

// types
import { FinalChartConfig, Chart } from "@/modules/playground/types";

// hooks
import useDebouncedCallback from "@/common/hooks/use-debounced-callback";

// utils
import { getChartSettingsInputConfig } from "@/modules/playground/utils/chart-settings";

type Props = {
  chartSettings: Chart["chartSettings"];
  traces: Chart["tracesConfig"];
  setChartSettings: (settings: Chart["chartSettings"]) => void;
  onTraceSettingChange: (
    item: keyof FinalChartConfig["tracesConfig"][number]["settings"],
    newValue: string,
    traceIndex: number
  ) => void;
  chartType: Chart["type"];
};

const ChartCustomizationSection = (props: Props) => {
  const { chartSettings, setChartSettings, traces, onTraceSettingChange, chartType } = props;

  const [selectedSettingsCategory, setSelectedSettingsCategory] = useState<
    (typeof SETTING_CATEGORIES)[keyof typeof SETTING_CATEGORIES]
  >(SETTING_CATEGORIES.GENERAL);

  const setChartSettingItem = useCallback(
    (item: keyof Chart["chartSettings"], value: any) => {
      setChartSettings({
        ...chartSettings,
        [item]: value,
      });
    },
    [chartSettings, setChartSettings]
  );

  const debouncedSetChartSettings = useDebouncedCallback(setChartSettingItem, 1000);
  const debouncedSetTraceSettingItem = useDebouncedCallback(onTraceSettingChange, 1000);

  const chartSettingsInputConfigs = useMemo(() => getChartSettingsInputConfig(chartType), [chartType]);

  return (
    <>
      <div className="flex flex-col space-y-1 border-b-2 rounded-lg rounded-b-none p-4">
        <h3 className="text-lg font-semibold mb-0">Customize Your Chart</h3>
        <p className="text-sm text-accent-foreground">Customize your chart with the options below.</p>
      </div>
      <div className="flex-grow flex items-stretch overflow-hidden">
        <ul className="flex flex-col w-[200px] border-r-2">
          {Object.values(SETTING_CATEGORIES).map(category => (
            <li
              onClick={() => setSelectedSettingsCategory(category)}
              key={category.value}
              className={cn(
                "px-4 py-3 border-b-2 cursor-pointer hover:bg-primary/20",
                category.value === selectedSettingsCategory.value ? "bg-primary/50 hover:bg-primary/50" : ""
              )}
            >
              {category.title}
            </li>
          ))}
        </ul>
        <div className="flex-grow flex flex-col gap-5 p-4">
          <h3 className="text-lg font-semibold">{selectedSettingsCategory.title}</h3>
          {selectedSettingsCategory.value === SETTING_CATEGORIES.GENERAL.value && (
            <GeneralSettings
              chartSettings={chartSettings}
              onSettingChange={debouncedSetChartSettings}
              settingInputsConfig={chartSettingsInputConfigs.GENERAL}
            />
          )}
          {selectedSettingsCategory.value === SETTING_CATEGORIES.AXIS.value && (
            <AxisSettings
              chartSettings={chartSettings}
              onSettingChange={debouncedSetChartSettings}
              settingInputsConfig={chartSettingsInputConfigs.AXIS}
            />
          )}
          {selectedSettingsCategory.value === SETTING_CATEGORIES.SERIES.value && (
            <SeriesSettings
              onTraceSettingChange={debouncedSetTraceSettingItem}
              traces={traces}
              settingInputsConfig={chartSettingsInputConfigs.TRACE}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default memo(ChartCustomizationSection);
