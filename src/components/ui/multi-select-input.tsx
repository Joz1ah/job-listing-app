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
            "w-full justify-between bg-transparent border-gray-300 h-14 font-normal hover:bg-transparent hover:text-white border-2",
            "focus-within:border-orange-500 data-[state=open]:border-orange-500 px-3 relative",
            error && "border-red-500",
            className
          )}
        >
          <div className="flex items-center w-[calc(100%-24px)] overflow-hidden">
            {value.length === 0 ? (
              <span className="text-white">{placeholder}</span>
            ) : (
              <div className="flex flex-nowrap overflow-hidden gap-1">
                {value.map((val) => (
                  <Badge
                    key={val}
                    variant="secondary"
                    className={cn(
                      "font-normal text-[13px] rounded-sm whitespace-nowrap overflow-hidden text-ellipsis max-w-[120px]",
                      {
                        "bg-orange-600 text-white": val === "contract",
                        "bg-orange-500 text-white": val !== "contract",
                      }
                    )}
                  >
                    {options.find((type) => type.value === val)?.label}
                  </Badge>
                ))}
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
                    "rounded-none justify-start px-2 h-[55px]",
                    "transition-all duration-500 ease-in-out",
                    "data-[selected=true]:bg-orange-500 data-[selected=true]:text-white"
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