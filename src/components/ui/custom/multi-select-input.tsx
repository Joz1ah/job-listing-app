import React, { useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { Button } from 'components';
import { Badge } from 'components';
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from 'components';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from 'components';
import { cn } from 'lib/utils';

export interface EmploymentTypeOption {
  value: string;
  label: string;
}

interface EmploymentTypeSelectProps {
  value: string[];
  onChange: (value: string[]) => void;
  options: EmploymentTypeOption[];
  error?: string;
  className?: string;
  placeholder?: string;
}

const MultiSelect: React.FC<EmploymentTypeSelectProps> = ({
  value,
  onChange,
  options,
  error,
  className,
  placeholder = "Select Employment Type"
}) => {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className={cn(
            "w-full justify-between bg-transparent rounded-[10px] border-gray-300 h-14 font-normal hover:bg-transparent hover:text-white border-2",
            "focus-within:border-[#F5722E] data-[state=open]:border-[#F5722E] px-3 relative",
            error && "border-red-500",
            className
          )}
        >
          <div className="flex items-center w-[calc(100%-24px)] overflow-hidden">
            {value.length === 0 ? (
              <span className="text-white">{placeholder}</span>
            ) : (
              <div className="flex flex-nowrap gap-1 overflow-hidden">
                {value.map((val) => {
                  const option = options.find((type) => type.value === val);
                  return (
                    <Badge
                      key={val}
                      variant="secondary"
                      className={cn(
                        "font-normal text-xs md:text-sm px-2 py-1 rounded",
                        "inline-block max-w-[120px] truncate",
                        "transition-colors duration-200",
                        {
                          "bg-[#BF532C] text-white": val === "part-time",
                          "bg-[#F5722E] text-white": val !== "part-time",
                        }
                      )}
                      title={option?.label} // Shows full text on hover
                    >
                      <span className="truncate block">{option?.label}</span>
                    </Badge>
                  );
                })}
              </div>
            )}
          </div>
          <ChevronDown
            className={cn(
              "h-4 w-4 shrink-0 opacity-100 absolute right-3 transition-transform duration-200",
              { "transform rotate-180": open }
            )}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 border-none rounded-none">
        <Command className="border-0 rounded-none">
          <CommandList>
            <CommandGroup className="p-0 bg-[#F5F5F5]">
              {options.map((type) => (
                <CommandItem
                  key={type.value}
                  value={type.value}
                  data-selected={value.includes(type.value)}
                  onSelect={(currentValue) => {
                    const newValue = [...value];
                    const index = newValue.indexOf(currentValue);
                    if (index === -1) {
                      newValue.push(currentValue);
                    } else {
                      newValue.splice(index, 1);
                    }
                    onChange(newValue);
                  }}
                  className={cn(
                    "rounded-none justify-start px-2 h-14",
                    "transition-all duration-500 ease-in-out",
                    "data-[selected=true]:bg-[#F5722E] data-[selected=true]:text-white"
                  )}
                >
                  <div className="flex items-center">
                    <div
                      className={cn(
                        "mr-2 h-5 w-5 border rounded flex items-center justify-center cursor-pointer",
                        value.includes(type.value)
                          ? "border-blue-400 bg-blue-400 hover:bg-blue-500"
                          : "border-gray-400 bg-white hover:border-gray-500"
                      )}
                    >
                      {value.includes(type.value) && (
                        <Check className="h-3 w-3 text-white" />
                      )}
                    </div>
                    {type.label}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export { MultiSelect }