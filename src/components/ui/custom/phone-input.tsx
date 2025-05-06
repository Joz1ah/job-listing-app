import React, { useState, useRef, useEffect } from "react";
import * as RPNInput from "react-phone-number-input";
import flags from "react-phone-number-input/flags";
import { ChevronDown } from "lucide-react";
import { Button } from "components";
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

// Optimized Country Select Component
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
  // Reference to the parent container
  const parentRef = useRef<HTMLDivElement | null>(null);
  
  // State for dropdown open/closed
  const [isOpen, setIsOpen] = useState(false);
  
  // State for dropdown width
  const [dropdownWidth, setDropdownWidth] = useState(300);
  
  // Search input ref
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  // State for search text
  const [searchText, setSearchText] = useState("");
  
  // Only calculate filtered options when dropdown is open
  const validOptions = options.filter(x => x.value);
  
  // Update width when window resizes
  useEffect(() => {
    const updateWidth = () => {
      const parentElement = parentRef.current?.closest(
        "[data-phone-input-container]",
      );
      if (parentElement) {
        const width = parentElement.getBoundingClientRect().width;
        setDropdownWidth(Math.max(width, 280)); // Min width 280px
      }
    };

    if (isOpen) {
      updateWidth();
      window.addEventListener("resize", updateWidth);
      
      // Focus search input when opened
      setTimeout(() => {
        if (searchInputRef.current) {
          searchInputRef.current.focus();
        }
      }, 10);
      
      return () => {
        window.removeEventListener("resize", updateWidth);
      };
    }
    
    // Reset search when dropdown is closed
    if (!isOpen) {
      setSearchText("");
    }
  }, [isOpen]);
  
  // Handle country selection
  const handleSelectCountry = (country: RPNInput.Country) => {
    onChange(country);
    setIsOpen(false);
  };
  
  // Filter countries based on search
  const getFilteredCountries = () => {
    if (!searchText) return validOptions;
    
    const query = searchText.toLowerCase();
    return validOptions.filter(option => 
      option.label.toLowerCase().startsWith(query)
    );
  };

  return (
    <div ref={parentRef}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
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
          className="p-0 bg-white border border-gray-200 rounded-md shadow-md z-50 overflow-hidden"
          side="bottom"
          align="start"
          sideOffset={5}
        >
          {isOpen && (
            <div className="bg-white">
              <div className="p-3 border-b border-gray-200">
                <input
                  ref={searchInputRef}
                  className="w-full p-2 border border-gray-300 rounded-md text-black text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Search country..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                />
              </div>
              <ScrollArea className="h-72">
                <div className="py-1">
                  {getFilteredCountries().length === 0 ? (
                    <div className="px-4 py-3 text-sm text-gray-500">No country found.</div>
                  ) : (
                    getFilteredCountries().map((option) => (
                      <button
                        key={option.value}
                        className="flex items-center gap-3 w-full px-4 py-2 text-left hover:bg-gray-100 text-black"
                        onClick={() => handleSelectCountry(option.value)}
                      >
                        <FlagComponent
                          country={option.value}
                          countryName={option.label}
                        />
                        <span className="flex-1 text-sm font-medium">{option.label}</span>
                        {option.value && (
                          <span className="text-sm text-gray-500">
                            {`+${RPNInput.getCountryCallingCode(option.value)}`}
                          </span>
                        )}
                      </button>
                    ))
                  )}
                </div>
              </ScrollArea>
            </div>
          )}
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