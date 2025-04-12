import { memo, useMemo } from "react";

// types
import { Chart } from "@/modules/playground/types";

// constants
import { DEFAULT_GENERAL_SETTING_OPTIONS } from "../../constants";

// utils
import { renderInput } from "../../utils/render-inputs";

interface Props {
  chartSettings: Chart["chartSettings"];
  onSettingChange: (item: keyof Chart["chartSettings"], value: any) => void;
}

const GeneralSettings: React.FC<Props> = props => {
  const { chartSettings, onSettingChange } = props;

  const generalSettingInputsJsx = useMemo(() => {
    const inputsConfig = DEFAULT_GENERAL_SETTING_OPTIONS.map(input => ({
      ...input,
      defaultValue: chartSettings[input.id as keyof Chart["chartSettings"]],
      onChangeValue: (value: any) => {
        onSettingChange(input.id as keyof Chart["chartSettings"], value);
      },
    }));

    return inputsConfig.map(input => renderInput(input));
  }, [chartSettings, onSettingChange]);

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