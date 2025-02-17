import React, { useState } from 'react';

interface TooltipProps {
  content: string | React.ReactNode;
  delay?: number;
  children: React.ReactNode;
}

const Tooltip = ({ 
  content,
  delay = 100,
  children
}: TooltipProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [timeoutId, setTimeoutId] = useState<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseEnter = () => {
    const id = setTimeout(() => {
      setIsVisible(true);
    }, delay);
    setTimeoutId(id);
  };

  const handleMouseLeave = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    setIsVisible(false);
  };

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      {isVisible && (
        <div 
          className="
            absolute z-50 px-4 py-3 
            text-[9px] text-[#263238] bg-white
            border border-gray-200 shadow-md
            w-52 min-h-8
            -translate-y-full -translate-x-[50%] md:-translate-x-[1%]
            left-1/2 -top-2
            break-words whitespace-normal
          "
          role="tooltip"
        >
          {content}
        </div>
      )}
    </div>
  );
};

export { Tooltip }