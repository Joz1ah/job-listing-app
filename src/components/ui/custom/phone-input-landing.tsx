import React from "react";
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
      "rounded-none border-none bg-transparent text-[#263238] h-full pr-24",
      "placeholder:text-gray-50/50 focus-visible:ring-0 focus-visible:ring-offset-0",
      className,
    )}
    {...props}
    ref={ref}
  />
));
InputComponent.displayName = "InputComponent";

// Flag Component
const FlagComponent = ({ country, countryName }: RPNInput.FlagProps) => {
  const Flag = flags[country];
  return (
    <span className="flex h-6 w-6 overflow-hidden rounded-full ml-6 relative">
      <span className="absolute inset-0 flex items-center justify-end scale-[1.8]">
        {Flag && <Flag title={countryName} />}
      </span>
    </span>
  );
};
FlagComponent.displayName = "FlagComponent";

// Country Select Component
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
  const handleSelect = React.useCallback(
    (country: RPNInput.Country) => {
      onChange(country);
    },
    [onChange],
  );

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          className={cn(
            "flex items-center gap-1 h-full px-2",
            "bg-transparent hover:bg-transparent min-w-[80px]",
            "border-none focus-visible:ring-0 focus-visible:ring-offset-0",
            "absolute right-0 top-0",
          )}
          disabled={disabled}
        >
          <div className="flex items-center gap-1">
            <FlagComponent country={value} countryName={value} />
            <ChevronDown className="h-4 w-4 opacity-50 text-white" />
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0 bg-white border-[#AEADAD]" 
          align="end" 
          side="bottom"
          avoidCollisions={false}
          collisionPadding={0}>
        <Command className="bg-white">
          <CommandInput
            placeholder="Search country..."
            className="text-black"
          />
          <CommandList>
            <ScrollArea className="h-72">
              <CommandEmpty className="text-white">
                No country found.
              </CommandEmpty>
              <CommandGroup>
                {options
                  .filter((x) => x.value)
                  .map((option) => (
                    <CommandItem
                      className="gap-2 text-black"
                      key={option.value}
                      onSelect={() => handleSelect(option.value)}
                    >
                      <FlagComponent
                        country={option.value}
                        countryName={option.label}
                      />
                      <span className="flex-1 text-sm">{option.label}</span>
                      {option.value && (
                        <span className="text-sm text-white/50">
                          {`+${RPNInput.getCountryCallingCode(option.value)}`}
                        </span>
                      )}
                    </CommandItem>
                  ))}
              </CommandGroup>
            </ScrollArea>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

type PhoneInputLandingProps = {
  name: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<any>) => void;
  className?: string;
  defaultCountry?: RPNInput.Country;
} & Omit<RPNInput.Props<typeof RPNInput.default>, "onChange" | "value">;

// Main PhoneInputLanding Component
const PhoneInputLanding = React.forwardRef<
  React.ElementRef<typeof RPNInput.default>,
  PhoneInputLandingProps
>(({ className, onChange, name, value, ...props }, ref) => {
  const handlePhoneChange = (phoneValue: RPNInput.Value) => {
    const formattedValue = phoneValue
      ? phoneValue.toString().replace(/[^\d+]/g, "")
      : "";

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
    <div className={cn("relative w-full", className)}>
      <RPNInput.default
        ref={ref}
        className="flex bg-transparent"
        flagComponent={FlagComponent}
        countrySelectComponent={CountrySelect}
        inputComponent={InputComponent}
        smartCaret={false}
        value={value?.toString()}
        onChange={handlePhoneChange}
        international
        {...props}
      />
    </div>
  );
});

PhoneInputLanding.displayName = "PhoneInput";

export { PhoneInputLanding };
