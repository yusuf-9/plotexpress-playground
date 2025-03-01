import { cn } from "@/common/utils";
import { memo, useCallback, useState } from "react";

// sections
import GeneralSettings from "./sections/general-settings";
import AxisSettings from "./sections/axis-settings";

// constants
import { SETTING_CATEGORIES } from "./constants";

// types
import { Chart } from "@/modules/playground/types";

// hooks
import useDebouncedCallback from "@/common/hooks/use-debounced-callback";

type Props = {
  chartSettings: Chart["chartSettings"];
  setChartSettings: (settings: Chart["chartSettings"]) => void;
};

const ChartCustomizationSection = (props: Props) => {
  const { chartSettings, setChartSettings } = props;

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

  return (
    <>
      <div className="flex flex-col space-y-1 border-b-2 rounded-lg rounded-b-none p-4">
        <h3 className="text-lg font-semibold mb-0">Customize Your Chart</h3>
        <p className="text-sm text-gray-600">Customize your chart with the options below.</p>
      </div>
      <div className="flex-grow flex items-stretch overflow-hidden">
        <ul className="flex flex-col w-[200px] border-r-2">
          {Object.values(SETTING_CATEGORIES).map(category => (
            <li
              onClick={() => setSelectedSettingsCategory(category)}
              key={category.value}
              className={cn(
                "px-4 py-3 border-b-2 cursor-pointer hover:bg-gray-100",
                category.value === selectedSettingsCategory.value ? "bg-main-light hover:!bg-main/20" : ""
              )}
            >
              {category.title}
            </li>
          ))}
        </ul>
        <div className="flex-grow flex flex-col space-y-5 p-4">
          <h3 className="text-lg font-semibold mb-0">{selectedSettingsCategory.title}</h3>
          {selectedSettingsCategory.value === SETTING_CATEGORIES.GENERAL.value && (
            <GeneralSettings
              chartSettings={chartSettings}
              onSettingChange={debouncedSetChartSettings}
            />
          )}
          {selectedSettingsCategory.value === SETTING_CATEGORIES.AXIS.value && (
            <AxisSettings
              chartSettings={chartSettings}
              onSettingChange={debouncedSetChartSettings}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default memo(ChartCustomizationSection);
