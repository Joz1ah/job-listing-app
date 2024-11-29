import React from 'react';
import { Label } from "components";
import { cn } from "lib/utils";
import { AlertTriangle, CircleAlert } from 'lucide-react';
import { Tooltip } from 'components';

interface InputFieldProps {
  label: string;
  children: React.ReactNode;
  className?: string;
  error?: string | string[];
  touched?: boolean;
  showIcon?: boolean;
  tooltipContent?: string | React.ReactNode;
}

const InputField = React.forwardRef<HTMLDivElement, InputFieldProps>(
  ({ 
    label, 
    children, 
    className, 
    error, 
    touched, 
    showIcon, 
    tooltipContent 
  }, ref) => {
    const showError = touched && error;
    const errorMessage = Array.isArray(error) ? error[0] : error;

    return (
      <div 
        ref={ref} 
        className={cn(
          "relative pt-4 w-full",
          className
        )}
      >
        <div className="relative">
          <div className="absolute -top-3 left-4 bg-[#242625] md:bg-[#2D3A41] px-2 z-20">
            <div className="flex items-center gap-2">
              <Label className="text-sm md:text-base font-normal text-white">
                {label}
              </Label>
              {showIcon && tooltipContent && (
                <Tooltip content={tooltipContent} delay={100}>
                  <CircleAlert
                    className="relative -top-1 cursor-pointer fill-gray-400 text-[#2D3A41]"
                    strokeWidth={1.5}
                    size={14}
                  />
                </Tooltip>
              )}
            </div>
          </div>
          
          <div className="relative">
            {children}
            {showError && (
              <div className="absolute -right-6 top-1/2 -translate-y-1/2">
                <AlertTriangle
                  className="fill-red-500 text-[#242625] md:text-[#2D3A41]"
                  size={20}
                />
              </div>
            )}
          </div>
        </div>
        
        {showError && (
          <div className="absolute text-xs md:text-sm italic text-red-500 mt-1">
            {errorMessage}
          </div>
        )}
      </div>
    );
  }
);

InputField.displayName = "InputField";

export { InputField }