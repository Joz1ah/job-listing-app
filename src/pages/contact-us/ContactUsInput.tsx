import React, { forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";

const inputVariants = cva(
  "w-full px-4 py-2 rounded-md text-sm focus:outline-none",
  {
    variants: {
      variant: {
        default: "bg-white border border-gray-300 focus:border-blue-500",
        secondary: "bg-transparent border-2 border-black focus:border-[#F5722E] placeholder:text-[#AEADAD]",
        error: "bg-transparent border-2 border-[#E63946] focus:border-[#E63946] placeholder:text-[#AEADAD]",
      },
      inputSize: { // Renamed from 'size' to 'inputSize' to avoid conflict
        default: "h-10",
        sm: "h-8 text-xs",
        lg: "h-12 text-base",
        custom: "h-[56px]",
      },
    },
    defaultVariants: {
      variant: "default",
      inputSize: "default",
    },
  }
);

export interface ContactUsInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>, // Omit the HTML 'size' attribute
    VariantProps<typeof inputVariants> {
  hasError?: boolean;
}

const ContactUsInput = forwardRef<HTMLInputElement, ContactUsInputProps>(
  ({ className, variant = "secondary", inputSize = "custom", hasError = false, ...props }, ref) => {
    return (
      <input
        className={inputVariants({ variant: hasError ? "error" : variant, inputSize, className })}
        ref={ref}
        {...props}
      />
    );
  }
);

ContactUsInput.displayName = "ContactUsInput";

export { ContactUsInput };