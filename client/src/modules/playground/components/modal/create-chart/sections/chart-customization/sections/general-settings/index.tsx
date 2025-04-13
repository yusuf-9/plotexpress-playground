import { memo, useMemo } from "react";

// types
import { Chart } from "@/modules/playground/types";

// utils
import { renderInput } from "../../utils/render-inputs";

// constants
import { GENERAL_CHART_SETTINGS_INPUT_CONFIG_MAP } from "@/modules/playground/constants/charts";

interface Props {
  chartSettings: Chart["chartSettings"];
  onSettingChange: (item: keyof Chart["chartSettings"], value: any) => void;
  settingInputsConfig:
    | (typeof GENERAL_CHART_SETTINGS_INPUT_CONFIG_MAP)[keyof typeof GENERAL_CHART_SETTINGS_INPUT_CONFIG_MAP];
}

const GeneralSettings: React.FC<Props> = props => {
  const { chartSettings, onSettingChange, settingInputsConfig } = props;

  const generalSettingInputsJsx = useMemo(() => {
    const inputsConfig = settingInputsConfig.map(input => ({
      ...input,
      defaultValue: chartSettings[input.id as keyof Chart["chartSettings"]],
      onChangeValue: (value: any) => {
        onSettingChange(input.id as keyof Chart["chartSettings"], value);
      },
    }));

    return inputsConfig.map(input => renderInput(input));
  }, [chartSettings, onSettingChange, settingInputsConfig]);

  return (
    <div className="flex-grow flex overflow-y-auto">
      <div className="flex-1 flex flex-col space-y-4 pl-3 pr-6 border-r-2 border-secondary">
        {generalSettingInputsJsx}
      </div>
      <div className="flex-1 flex flex-col space-y-4 pl-3 pr-6"></div>
    </div>
  );
};

export default memo(GeneralSettings);
