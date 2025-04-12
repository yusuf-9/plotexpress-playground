import { Input } from "@/common/components/ui/input";
import { Label } from "@/common/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/common/components/ui/select";
import { Switch } from "@/common/components/ui/switch";

export function renderInput(inputConfig: {
  id: string;
  inputType: string;
  label: string;
  placeholder: string;
  options?: {
    label: string;
    value: string;
  }[];
  defaultValue?: any;
  onChangeValue: (value: any) => void;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
}) {
  switch (inputConfig.inputType) {
    case "text":
      return (
        <div
          className="flex items-center gap-5 justify-between"
          key={inputConfig.id}
        >
          <Label
            htmlFor={inputConfig.id}
            className="text-sm font-medium"
          >
            {inputConfig.label}
          </Label>
          <Input
            type="text"
            id={inputConfig.id}
            placeholder={inputConfig.placeholder}
            className="flex-1 border-b-2 border-secondary rounded-md p-2"
            defaultValue={inputConfig.defaultValue}
            onChange={e => {
              inputConfig.onChangeValue(e.target.value);
            }}
            {...inputConfig.inputProps}
          />
        </div>
      );
    case "number":
      return (
        <div
          className="flex items-center gap-5 justify-between"
          key={inputConfig.id}
        >
          <Label
            htmlFor={inputConfig.id}
            className="text-sm font-medium"
          >
            {inputConfig.label}
          </Label>
          <Input
            type="number"
            id={inputConfig.id}
            placeholder={inputConfig.placeholder}
            className="flex-1 border-b-2 border-secondary rounded-md p-2"
            defaultValue={inputConfig.defaultValue}
            onChange={e => {
              // Ensure value doesn't exceed max if specified
              const maxValue = inputConfig.inputProps?.max;
              if (maxValue !== undefined) {
                const value = Math.min(Number(e.target.value), Number(maxValue));
                inputConfig.onChangeValue(value.toString());
                // Update input value to reflect clamped value
                e.target.value = value.toString();
                return;
              }
              inputConfig.onChangeValue(e.target.value);
            }}
            {...inputConfig.inputProps}
          />
        </div>
      );
    case "switch":
      return (
        <div
          className="flex items-center gap-5 justify-between"
          key={inputConfig.id}
        >
          <Label
            htmlFor={inputConfig.id}
            className="text-sm font-medium"
          >
            {inputConfig.label}
          </Label>
          <Switch
            id={inputConfig.id}
            defaultChecked={inputConfig.defaultValue}
            onCheckedChange={value => {
              inputConfig.onChangeValue(value);
            }}
          />
        </div>
      );
    case "select":
      return (
        <div
          className="flex items-center gap-5 justify-between"
          key={inputConfig.id}
        >
          <Label
            htmlFor="legend-position-select"
            className="text-sm font-medium "
          >
            Legend position
          </Label>
          <Select
            defaultValue={inputConfig.defaultValue}
            onValueChange={value => {
              inputConfig.onChangeValue(value);
            }}
          >
            <SelectTrigger
              id={inputConfig.id}
              className="w-[100px]"
            >
              <SelectValue placeholder="Select position" />
            </SelectTrigger>
            <SelectContent>
              {inputConfig.options?.map(option => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      );
    case "color":
      return (
        <div
          className="flex items-center gap-5 justify-between"
          key={inputConfig.id}
        >
          <Label
            htmlFor={inputConfig.id}
            className="text-sm font-medium"
          >
            {inputConfig.label}
          </Label>
          <Input
            type="color"
            id={inputConfig.id}
            placeholder={inputConfig.placeholder}
            className="flex-1 border-b-2 border-secondary rounded-md p-2"
            defaultValue={inputConfig.defaultValue}
            onChange={e => {
              inputConfig.onChangeValue(e.target.value);
            }}
            {...inputConfig.inputProps}
          />
        </div>
      );
    default:
      return null;
  }
}

export function renderAxisInput(inputConfig: {
  id: string;
  label: string;
  placeholderMin?: string;
  placeholderMax?: string;
  defaultValueMin?: any;
  defaultValueMax?: any;
  onChangeMin: (value: any) => void;
  onChangeMax: (value: any) => void;
}) {
  return (
    <div className="flex items-center gap-5 justify-between">
      <Label
        htmlFor="x-axis-limits"
        className="text-sm font-medium"
      >
        {inputConfig.label}
      </Label>
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <Label
            htmlFor={`${inputConfig.id}-min`}
            className="text-sm font-medium"
          >
            Min
          </Label>
          <Input
            type="text"
            placeholder="Min"
            className="flex-1 border-b-2 border-secondary rounded-md p-2"
            defaultValue={inputConfig.defaultValueMin}
            onChange={e => {
              inputConfig.onChangeMin(e.target.value);
            }}
          />
        </div>
        <div className="flex items-center gap-2">
          <Label
            htmlFor={`${inputConfig.id}-max`}
            className="text-sm font-medium"
          >
            Max
          </Label>
          <Input
            type="text"
            placeholder="Max"
            className="flex-1 border-b-2 border-secondary rounded-md p-2"
            defaultValue={inputConfig.defaultValueMax}
            onChange={e => {
              inputConfig.onChangeMax(e.target.value);
            }}
          />
        </div>
      </div>
    </div>
  );
}
