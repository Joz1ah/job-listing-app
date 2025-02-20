import React, { useState, useEffect } from "react";
import { cn } from "lib/utils";
import { Label } from "components";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "components";
import { Info } from "lucide-react";
import { Tooltip } from "components";

interface TimezoneOption {
  value: string;
  label: string;
}

interface TimezoneSelectorProps {
  className?: string;
  onTimezoneChange?: (timezone: string) => void;
  defaultTimezone?: string;
  disabled?: boolean;
  onBeforeOpen?: () => boolean;
}

const POPULAR_TIMEZONES: TimezoneOption[] = [
  { value: "UTC", label: "(UTC+00:00) Coordinated Universal Time" },
  { value: "America/St_Johns", label: "(GMT-03:30) Newfoundland Time" },
  { value: "America/Halifax", label: "(GMT-04:00) Atlantic Time" },
  { value: "America/Toronto", label: "(GMT-05:00) Eastern Time - Toronto" },
  { value: "America/New_York", label: "(GMT-05:00) Eastern Time" },
  { value: "America/Winnipeg", label: "(GMT-06:00) Central Time - Winnipeg" },
  { value: "America/Regina", label: "(GMT-06:00) Central Time - Saskatchewan" },
  { value: "America/Chicago", label: "(GMT-06:00) Central Time" },
  { value: "America/Edmonton", label: "(GMT-07:00) Mountain Time - Edmonton" },
  { value: "America/Denver", label: "(GMT-07:00) Mountain Time" },
  { value: "America/Vancouver", label: "(GMT-08:00) Pacific Time - Vancouver" },
  { value: "America/Los_Angeles", label: "(GMT-08:00) Pacific Time" },
  { value: "America/Anchorage", label: "(GMT-09:00) Alaska Time" },
  { value: "Pacific/Honolulu", label: "(GMT-10:00) Hawaii Time" },
  { value: "Europe/London", label: "(GMT+00:00) London" },
  { value: "Europe/Paris", label: "(GMT+01:00) Paris" },
  { value: "Europe/Berlin", label: "(GMT+01:00) Berlin" },
  { value: "Asia/Dubai", label: "(GMT+04:00) Dubai" },
  { value: "Asia/Singapore", label: "(GMT+08:00) Singapore" },
  { value: "Asia/Tokyo", label: "(GMT+09:00) Tokyo" },
  { value: "Asia/Shanghai", label: "(GMT+08:00) China" },
  { value: "Australia/Sydney", label: "(GMT+11:00) Sydney" },
  { value: "Pacific/Auckland", label: "(GMT+13:00) Auckland" },
] as const;

const TimezoneSelector: React.FC<TimezoneSelectorProps> = ({
  className,
  onTimezoneChange,
  defaultTimezone = "UTC",
  disabled = false,
  onBeforeOpen,
}) => {
  const [currentTimezone, setCurrentTimezone] =
    useState<string>(defaultTimezone);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (defaultTimezone && defaultTimezone !== currentTimezone) {
      setCurrentTimezone(defaultTimezone);
    }
  }, [defaultTimezone]);

  const handleTimezoneChange = (newTimezone: string) => {
    setCurrentTimezone(newTimezone);
    onTimezoneChange?.(newTimezone);
  };

  const handleOpenChange = (open: boolean) => {
    if (open) {
      // If opening and onBeforeOpen returns false, prevent opening
      if (onBeforeOpen && !onBeforeOpen()) {
        return;
      }
    }
    setIsOpen(open);
  };

  return (
    <div className={cn("relative pt-4", className)}>
      <div className="relative">
        <div className="absolute -top-3 left-4 bg-[#2D3A41] px-2 z-20">
          <div className="flex items-center gap-2">
            <Label className="text-sm font-normal text-white">Time zone</Label>
            <Tooltip content="Select your preferred timezone. Times will be displayed according to this setting.">
              <Info className="w-3 h-3 text-[#2D3A41] fill-white" />
            </Tooltip>
          </div>
        </div>
        <Select
          value={currentTimezone}
          onValueChange={handleTimezoneChange}
          disabled={disabled}
          open={isOpen}
          onOpenChange={handleOpenChange}
        >
          <SelectTrigger
            className={cn(
              "bg-transparent text-white border-[#AEADAD] h-14 border-2",
              disabled && "opacity-50 cursor-not-allowed",
            )}
          >
            <SelectValue>
              {POPULAR_TIMEZONES.find((tz) => tz.value === currentTimezone)
                ?.label || "Select timezone"}
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="bg-[#F5F5F7] max-h-80 overflow-y-auto rounded-none">
            {POPULAR_TIMEZONES.map((timezone) => (
              <SelectItem
                key={timezone.value}
                value={timezone.value}
                className="text-black py-3 hover:bg-orange-500 rounded-none"
              >
                {timezone.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export { TimezoneSelector };