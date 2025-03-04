import React, { useState, ReactNode } from "react";
import warning_icon from 'assets/warning-feature.svg?url'

interface TooltipWrapperProps {
  children: ReactNode;
  disabled?: boolean;
}

const TooltipWrapper: React.FC<TooltipWrapperProps> = ({
  children,
  disabled = false,
}) => {
  const [isTooltipVisible, setIsTooltipVisible] = useState<boolean>(false);

  const showTooltip = disabled && isTooltipVisible;

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsTooltipVisible(true)}
      onMouseLeave={() => setIsTooltipVisible(false)}
    >
      {children}

      {showTooltip && (
        <div className="absolute -top-24 left-1/2 transform -translate-x-1/2 w-[280px] md:w-[320px] h-[83px] bg-[#FFFFFF] px-4 pt-1 z-10">
          <div className="flex items-start gap-3">
            <img src={warning_icon} className="w-4 h-4"/>
            <div>
              <h3 className="text-orange-500 font-medium mb-1 text-[13px]">
                Downgrade Not Available
              </h3>
              <p className="text-[#263238] text-[8px] mb-2">
                Yearly plans can't be downgraded to monthly. Your subscription
                stays active until the billing cycle ends.
              </p>
              <p className="text-[8px] text-[#263238]">
                Email us at{" "}
                <a href="mailto:support@akaza.io" className="text-orange-500">
                  support@akaza.io
                </a>{" "}
                we're happy to assist!
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TooltipWrapper;
