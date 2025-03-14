import { memo, useMemo } from "react";

// Components
import { Button } from "@/common/components/ui/button";
import { Input } from "@/common/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/common/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/common/components/ui/tabs";

// Hooks
import useDebouncedCallback from "@/common/hooks/use-debounced-callback";

// Utils
import { cn } from "@/common/utils";

// Types
import { AxisTypes, FileData, TraceConfig } from "@/modules/playground/types";

// Icons
import { Edit, Trash2, Check } from "lucide-react";

type Props = {
  activeAxis: AxisTypes;
  axisOptions: AxisTypes[];
  onAxisOptionClick: (axisOption: AxisTypes) => void;
  traces: TraceConfig[];
  uploadedFiles: FileData;
  selectedTraceIndex: number | null;
  onTraceEdit: (traceIndex: number | null) => void;
  onTraceDelete: (traceIndex: number) => void;
  onTraceSettingsItemEdit: (newValue: string, traceIndex: number, item: keyof TraceConfig["settings"]) => void;
};

const DataSummary = (props: Props) => {
  const {
    activeAxis,
    axisOptions,
    selectedTraceIndex,
    onTraceEdit,
    onAxisOptionClick,
    traces,
    uploadedFiles,
    onTraceDelete,
    onTraceSettingsItemEdit
  } = props;

  const debouncedOnTraceSettingsItemEdit = useDebouncedCallback(onTraceSettingsItemEdit, 1000);

  const tracesJsx = useMemo(() => {
    if (!traces.length) {
      return (
        <>
          <h3 className="text-lg font-semibold mb-0">Traces</h3>
          <p className="text-sm text-accent-foreground">Your selections will appear here</p>
        </>
      );
    }

    return traces.map((traceConfig, index) => (
      <div
        key={index}
        className={cn(
          "flex flex-col bg-background-light p-3 rounded-lg border",
          index === selectedTraceIndex ? "border-primary" : ""
        )}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-3">
            <input
              type="color"
              className="w-4 h-4 aspect-square flex-shrink-0 rounded-full cursor-pointer"
              defaultValue={traceConfig.settings.color}
              onChange={e => debouncedOnTraceSettingsItemEdit(e.target.value, index, "color")}
            />
            <Input
              defaultValue={traceConfig.settings.name}
              onChange={e => debouncedOnTraceSettingsItemEdit(e.target.value, index, "name")}
              className="font-medium bg-transparent border-none p-0 focus:ring-0"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
            >
              {index === selectedTraceIndex ? (
                <Check
                  onClick={() => onTraceEdit(null)}
                  className="h-4 w-4"
                />
              ) : (
                <Edit
                  onClick={() => onTraceEdit(index)}
                  className="h-4 w-4"
                />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
            >
              <Trash2
                onClick={() => onTraceDelete(index)}
                className="h-4 w-4"
              />
            </Button>
          </div>
        </div>
        {traceConfig?.x && (
          <div className="text-sm text-accent-foreground">
            <span className="font-semibold">X: </span>
            <span className="text-primary">
              {uploadedFiles[traceConfig?.x?.fileId ?? ""]?.name?.slice(0, 10) + "..."} :{" "}
            </span>
            <span style={{ color: traceConfig.settings.color }}>{traceConfig?.x?.column}</span>
          </div>
        )}
        {traceConfig?.y && (
          <div className="text-sm text-accent-foreground">
            <span className="font-semibold">Y: </span>
            <span className="text-primary">
              {uploadedFiles[traceConfig?.y?.fileId ?? ""]?.name?.slice(0, 10) + "..."} :{" "}
            </span>
            <span style={{ color: traceConfig.settings.color }}>{traceConfig?.y?.column}</span>
          </div>
        )}
      </div>
    ));
  }, [onTraceDelete, onTraceEdit, debouncedOnTraceSettingsItemEdit, selectedTraceIndex, traces, uploadedFiles]);

  return (
    <div className="h-[135px] flex bg-background-light border-b-2 rounded-lg rounded-b-none">
      <div className={cn("w-3/4 p-2 h-auto overflow-y-auto", traces.length && "grid grid-cols-1 gap-2 md:grid-cols-2")}>
        {tracesJsx}
      </div>
      <div className="w-1/4 border-l flex flex-col justify-between gap-5 p-2">
        <Tabs
          value={activeAxis}
          onValueChange={newValue => onAxisOptionClick(newValue as AxisTypes)}
          className="w-full"
        >
          <TabsList className="w-full flex">
            {axisOptions.map(axis => (
              <TabsTrigger
                key={axis}
                value={axis}
                className="capitalize w-full"
              >
                {axis}-axis
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <div>
          <label
            htmlFor="algorithm-select"
            className="block text-sm font-medium text-foreground mb-1"
          >
            Auto Selection Algorithm
          </label>
          <Select value={""}>
            <SelectTrigger
              id="algorithm-select"
              className="w-full"
            >
              <SelectValue placeholder="Select algorithm" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="linear">Linear</SelectItem>
              <SelectItem value="logarithmic">Logarithmic</SelectItem>
              <SelectItem value="exponential">Exponential</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default memo(DataSummary);