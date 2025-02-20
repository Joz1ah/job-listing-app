import { ChevronDown } from "lucide-react";
import { cn } from "lib/utils";
import { Button } from "components";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "components";
import { Popover, PopoverContent, PopoverTrigger } from "components";
import { memo, useState } from "react";
import countries from 'constants/countries';

interface CountrySelectProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  className?: string;
  popoverClassName?: string;
  placeholder?: string;
}

const CountrySelect = ({
  value,
  onChange,
  error,
  className,
  popoverClassName,
}: CountrySelectProps) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative w-full">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              "w-full justify-between bg-transparent px-0 font-normal",
              "border-0 rounded-none shadow-none hover:bg-transparent hover:no-underline focus:ring-0 focus:ring-offset-0",
              "text-[14px] text-[#263238] font-medium h-[38px]",
              error ? "border-red-500" : "",
              className,
            )}
          >
          <span className="truncate">
            {value
              ? countries.find((country) => country.name.toLowerCase() === value.toLowerCase())?.name || "Country not found"
              : "Select country..."}
          </span>

            <ChevronDown className="h-4 w-4 opacity-50 flex-shrink-0 mr-2.5" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className={cn(
            "p-0 rounded-none w-[var(--radix-popover-trigger-width)] max-w-[410px] min-w-[280px]",
            popoverClassName
          )}
          align="start"
          side="bottom"
          avoidCollisions={false}
          collisionPadding={0}
        >
          <Command>
            <CommandInput placeholder="Search country..." className="h-9" />
            <CommandEmpty>No country found.</CommandEmpty>
            <CommandGroup className="max-h-64 overflow-auto">
              {countries.map((country) => (
                <CommandItem
                  key={country.name}
                  value={country.name}
                  onSelect={(currentValue) => {
                    onChange(currentValue === value ? "" : currentValue);
                    setOpen(false);
                  }}
                  className={cn(
                    "relative flex items-center px-4 py-2 text-[14px] font-normal",
                    "hover:bg-[#F5722E] hover:text-white",
                    value.toLowerCase() === country.name.toLowerCase() &&
                      "bg-[#F5722E] text-white",
                  )}
                >
                  {value.toLowerCase() === country.name.toLowerCase() && (
                    <span className="absolute left-0 top-1/2 transform -translate-y-1/2 inline-block h-full w-2 bg-[#8C4227]" />
                  )}
                  <span className="truncate">{country.name}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
      {error && (
        <div className="absolute text-red-500 text-[10px] mt-1 font-light bottom-0 right-0">
          {error}
        </div>
      )}
    </div>
  );
};

export default memo(CountrySelect);