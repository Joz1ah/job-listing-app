import React from 'react';
import { Label } from "components";
import { AlertTriangle, CircleAlert } from 'lucide-react';
import { Tooltip } from 'components';
import { cva, type VariantProps } from "class-variance-authority";

const inputWrapperVariants = cva(
  "relative pt-4 w-full",
  {
    variants: {
      variant: {
        default: "",
        primary: "",
        secondary: "",
        payment: "",
        tulleGray: "",
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);

const labelVariants = cva(
  "font-normal",
  {
    variants: {
      variant: {
        default: "text-white",
        primary: "text-white",
        secondary: "text-[#263238]",
        payment: "text-[#263238]",
        tulleGray: "text-[#263238]"
      },
      size: {
        sm: "text-sm",
        md: "text-base",
        lg: "text-lg"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "md"
    }
  }
);

const labelWrapperVariants = cva(
  "absolute -top-3 left-4 px-2 z-20",
  {
    variants: {
      variant: {
        default: "bg-[#242625] md:bg-[#2D3A41]",
        primary: "bg-[#2D3A41]",
        secondary: "bg-white",
        payment: "bg-[#F9E2CE]",
        tulleGray: "bg-[#F5F5F7]"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);

const alertIconVariants = cva(
  "fill-[#E63946]",
  {
    variants: {
      variant: {
        default: "text-[#242625] md:text-[#2D3A41]",
        primary: "text-[#2D3A41]",
        secondary: "text-white",
        payment: "bg-[#F5F5F7]",
        tulleGray: "bg-[#F5F5F7]"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);

const tooltipIconVariants = cva(
  "relative -top-1 cursor-pointer",
  {
    variants: {
      variant: {
        default: "text-[#2D3A41] fill-[#AEADAD]",
        primary: "text-primary fill-[#AEADAD]",
        secondary: "text-gray-600 fill-gray-400",
        payment: "text-gray-600 fill-gray-400",
        tulleGray: "text-gray-600 fill-gray-400"
      },
      size: {
        sm: "",
        md: "",
        lg: ""
      }
    },
    defaultVariants: {
      variant: "default",
      size: "md"
    }
  }
);

interface InputFieldProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof inputWrapperVariants> {
  label: string;
  error?: string | string[];
  touched?: boolean;
  showIcon?: boolean;
  showAlertIcon?: boolean;
  tooltipContent?: string | React.ReactNode;
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

const InputField = React.forwardRef<HTMLDivElement, InputFieldProps>(
  ({ 
    label,
    children,
    className,
    variant,
    size = "md",
    error,
    touched,
    showIcon,
    showAlertIcon = true,
    tooltipContent,
    ...props
  }, ref) => {
    const showError = touched && error;
    const errorMessage = Array.isArray(error) ? error[0] : error;

    // Icon sizes based on the size prop
    const iconSizes = {
      sm: 12,
      md: 14,
      lg: 16
    };

    return (
      <div
        ref={ref}
        className={inputWrapperVariants({ variant, className })}
        {...props}
      >
        <div className="relative">
          <div className={labelWrapperVariants({ variant })}>
            <div className="flex items-center gap-2">
              <Label className={labelVariants({ variant, size })}>
                {label}
              </Label>
              {showIcon && tooltipContent && (
                <Tooltip content={tooltipContent} delay={100}>
                  <CircleAlert
                    className={tooltipIconVariants({ variant, size })}
                    strokeWidth={1.5}
                    size={iconSizes[size]}
                  />
                </Tooltip>
              )}
            </div>
          </div>
          
          <div className="relative">
            {children}
            {showError && showAlertIcon && (
              <div className="absolute -right-6 top-1/2 -translate-y-1/2">
                <AlertTriangle
                  className={alertIconVariants({variant})}
                  size={20}
                />
              </div>
            )}
          </div>
        </div>
        
        {showError && (
          <div className="absolute right-1 text-xs italic text-[#E63946] mt-1">
            {errorMessage}
          </div>
        )}
      </div>
    );
  }
);

InputField.displayName = "InputField";

export { InputField };