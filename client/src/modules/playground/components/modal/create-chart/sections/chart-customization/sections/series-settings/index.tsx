import { memo, useState, useMemo } from "react";

// types
import { Chart } from "@/modules/playground/types";
import { Input } from "@/common/components/ui/input";
import { DEFAULT_SERIES_SETTING_OPTIONS } from "../../constants";
import { renderInput } from "../../utils/render-inputs";

interface Props {
  onTraceSettingsChange: (item: keyof Chart["tracesConfig"][number]["settings"], value: any) => void;
  traces: Chart["tracesConfig"];
}

const SeriesSettings: React.FC<Props> = props => {
  const { traces } = props;

  const [selectedTraceId, setSelectedTraceId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTraces = useMemo(() => {
    return traces.filter(trace => trace.settings.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [traces, searchQuery]);

  const selectedTrace = useMemo(() => traces.find(trace => trace.id === selectedTraceId), [traces, selectedTraceId]);

  console.log({ traces, selectedTraceId });

  return (
    <div className="flex-grow flex overflow-y-auto">
      {/* Left panel - Trace list */}
      <div className="flex-1 flex flex-col space-y-4 pl-3 pr-6 border-r-2 border-secondary">
        <Input
          type="text"
          placeholder="Search traces..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="sticky top-0 bg-background shadow-sm"
        />
        <div className="flex flex-col space-y-2 overflow-y-auto">
          {filteredTraces.map(trace => (
            <div
              key={trace.id}
              className={`
                flex items-center space-x-3 p-2 rounded-lg
                transition-colors duration-200 ease-in-out
                cursor-pointer hover:bg-primary/20
                bg-secondary/40
                ${selectedTraceId === trace.id ? "!bg-primary/80 !text-background !font-medium shadow-sm" : ""}
              `}
              onClick={() => setSelectedTraceId(trace.id)}
            >
              <div
                className="w-4 h-4 rounded-full shadow-sm"
                style={{ backgroundColor: trace.settings.color }}
              />
              <span className="text-sm">{trace.settings.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel - Settings */}
      <div className="flex-1 flex flex-col space-y-4 pl-6 pr-6 overflow-y-auto">
        {!selectedTraceId && (
          <div className="h-full flex items-center justify-center text-muted-foreground">
            <span className="text-sm">Select a trace on the left to edit its settings</span>
          </div>
        )}
        {selectedTrace &&
          DEFAULT_SERIES_SETTING_OPTIONS.map(inputConfig => {
            const inputConfigWithDefaults = {
              ...inputConfig,
              defaultValue: selectedTrace.settings[inputConfig.id as keyof Chart["tracesConfig"][number]["settings"]],
              onChangeValue: (value: any) =>
                props.onTraceSettingsChange(inputConfig.id as keyof Chart["tracesConfig"][number]["settings"], value),
            };

            return renderInput(inputConfigWithDefaults);
          })}
      </div>
    </div>
  );
};

export default memo(SeriesSettings);
