import React, { useState } from 'react';

interface TooltipProps {
  content: string;
  delay?: number;
  children: React.ReactNode;
}

const Tooltip = ({ 
  content,
  delay = 100,
  children
}: TooltipProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

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
            text-[9px] text-black bg-white
            border border-gray-200 shadow-sm text-left
            w-[200px] h-[65px]
            -top-[70px] -right-[210px]
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