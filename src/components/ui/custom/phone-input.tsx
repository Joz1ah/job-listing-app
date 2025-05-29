import React, { useState, useRef, useEffect } from "react";
import * as RPNInput from "react-phone-number-input";
import flags from "react-phone-number-input/flags";
import { ChevronDown } from "lucide-react";
import { Button } from "components";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "components";
import { Input } from "components";
import { Popover, PopoverContent, PopoverTrigger } from "components";
import { ScrollArea } from "components";

const cn = (...classes: (string | undefined)[]) =>
  classes.filter(Boolean).join(" ");

// Input Component
const InputComponent = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <Input
    className={cn(
      "rounded-[4px] border-none bg-transparent text-white h-full pl-2",
      "placeholder:text-white/50 focus-visible:ring-0 focus-visible:ring-offset-0",
      className,
    )}
    {...props}
    ref={ref}
  />
));
InputComponent.displayName = "InputComponent";

// Flag Component - fixed styling
const FlagComponent = ({ country, countryName }: RPNInput.FlagProps) => {
  const Flag = flags[country];
  return (
    <span className="flex h-6 w-6 overflow-hidden rounded-full relative">
      <span className="absolute inset-0 flex items-center justify-center scale-[1.8]">
        {Flag && <Flag title={countryName} />}
      </span>
    </span>
  );
};
FlagComponent.displayName = "FlagComponent";

// Country Select Component with proper positioning and search
const CountrySelect = ({
  disabled,
  value,
  onChange,
  options,
}: {
  disabled?: boolean;
  value: RPNInput.Country;
  onChange: (value: RPNInput.Country) => void;
  options: { label: string; value: RPNInput.Country }[];
}) => {
  const [searchValue, setSearchValue] = useState("");
  
  const handleSelect = React.useCallback(
    (country: RPNInput.Country) => {
      onChange(country);
      setSearchValue(""); // Clear search when country is selected
    },
    [onChange],
  );

  // Reference to the parent container
  const parentRef = useRef<HTMLDivElement | null>(null);

  // State for dropdown width
  const [dropdownWidth, setDropdownWidth] = useState(300);

  // Update width when window resizes
  useEffect(() => {
    const updateWidth = () => {
      // Get the parent element (the entire phone input)
      const parentElement = parentRef.current?.closest(
        "[data-phone-input-container]",
      );
      if (parentElement) {
        const width = parentElement.getBoundingClientRect().width;
        setDropdownWidth(Math.max(width, 280)); // Min width 280px
      }
    };

    updateWidth();
    window.addEventListener("resize", updateWidth);

    return () => {
      window.removeEventListener("resize", updateWidth);
    };
  }, []);

  // Custom filter function that only shows countries starting with the search term
  const filteredOptions = React.useMemo(() => {
    if (!searchValue) return options.filter((x) => x.value);
    
    const searchLower = searchValue.toLowerCase();
    
    // Only show countries that START with the search term
    const filtered = options.filter((x) => 
      x.value && x.label.toLowerCase().startsWith(searchLower)
    );
    
    // Sort alphabetically
    return filtered.sort((a, b) => a.label.localeCompare(b.label));
  }, [options, searchValue]);

  return (
    <div ref={parentRef}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            className={cn(
              "flex items-center gap-1 h-full px-2",
              "bg-transparent hover:bg-transparent min-w-[80px]",
              "border-none focus-visible:ring-0 focus-visible:ring-offset-0",
            )}
            disabled={disabled}
          >
            <div className="flex items-center gap-1">
              <FlagComponent country={value} countryName={value} />
              <ChevronDown className="h-4 w-4 opacity-50 text-white" />
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent
          style={{ width: `${dropdownWidth}px` }}
          className="p-0 bg-white border-[#AEADAD] z-50"
          side="bottom"
          align="start"
          sideOffset={5}
        >
          <Command 
            className="bg-white"
            shouldFilter={false} // Disable built-in filtering since we're doing custom filtering
          >
            <CommandInput
              placeholder="Search country..."
              className="text-black"
              value={searchValue}
              onValueChange={setSearchValue}
            />
            <CommandList>
              <ScrollArea className="h-72">
                {filteredOptions.length === 0 ? (
                  <CommandEmpty className="text-black">
                    No country found.
                  </CommandEmpty>
                ) : (
                  <CommandGroup>
                    {filteredOptions.map((option) => (
                      <CommandItem
                        className="gap-2 text-black"
                        key={option.value}
                        onSelect={() => handleSelect(option.value)}
                        value={option.value} // This helps with keyboard navigation
                      >
                        <FlagComponent
                          country={option.value}
                          countryName={option.label}
                        />
                        <span className="flex-1 text-sm">{option.label}</span>
                        {option.value && (
                          <span className="text-sm text-gray-500">
                            {`+${RPNInput.getCountryCallingCode(option.value)}`}
                          </span>
                        )}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )}
              </ScrollArea>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

type PhoneInputProps = {
  name: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<any>) => void;
  className?: string;
  defaultCountry?: RPNInput.Country;
} & Omit<RPNInput.Props<typeof RPNInput.default>, "onChange" | "value">;

// Main PhoneInput Component with positioning context
const PhoneInput = React.forwardRef<
  React.ElementRef<typeof RPNInput.default>,
  PhoneInputProps
>(
  (
    { className, onChange, name, value, defaultCountry = "CA", ...props },
    ref,
  ) => {
    const handlePhoneChange = (phoneValue: RPNInput.Value) => {
      // Format value with leading + for international format
      const formattedValue = phoneValue ? phoneValue.toString() : "";

      const syntheticEvent = {
        target: {
          name,
          value: formattedValue || "",
        },
        type: "change",
        preventDefault: () => {},
        stopPropagation: () => {},
        currentTarget: { name, value: formattedValue || "" },
        nativeEvent: new Event("change"),
        bubbles: true,
        cancelable: true,
        defaultPrevented: false,
        eventPhase: 0,
        isTrusted: true,
        timeStamp: Date.now(),
      } as React.ChangeEvent<HTMLInputElement>;

      onChange(syntheticEvent);
    };

    return (
      <div
        className={cn("relative w-full", className)}
        data-phone-input-container
      >
        <RPNInput.default
          ref={ref}
          className="flex bg-transparent w-full"
          flagComponent={FlagComponent}
          countrySelectComponent={CountrySelect}
          inputComponent={InputComponent}
          smartCaret={false}
          value={value?.toString()}
          onChange={handlePhoneChange}
          international
          defaultCountry={defaultCountry}
          {...props}
        />
      </div>
    );
  },
);

PhoneInput.displayName = "PhoneInput";

export { PhoneInput };