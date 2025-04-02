import React, { useEffect, useRef } from 'react';
import { Calendar } from 'components';

interface DatePickerProps {
  className?: string;
  onDateSelect?: (date: Date) => void;
  variant?: 'default' | 'secondary';
  initialDate?: Date;
  isOpen?: boolean;
  onClose?: () => void;
  disablePastDates?: boolean;
  disableFutureDates?: Date | null;
}

const DatePicker: React.FC<DatePickerProps> = ({
  className,
  onDateSelect,
  variant = 'default',
  initialDate,
  isOpen = true,
  onClose,
  disablePastDates = false,
  disableFutureDates = null
}) => {
  const pickerRef = useRef<HTMLDivElement>(null);

  // Add click outside handler to close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        pickerRef.current && 
        !pickerRef.current.contains(event.target as Node)
      ) {
        onClose?.();
      }
    };

    if (isOpen) {
      // Small delay to prevent the same click that opens the calendar from closing it
      const timeoutId = setTimeout(() => {
        document.addEventListener('mousedown', handleClickOutside);
      }, 100);
      
      return () => {
        clearTimeout(timeoutId);
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
    
    return undefined;
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Forward date selection to parent but don't automatically close
  const handleDateSelect = (date: Date) => {
    if (onDateSelect) {
      onDateSelect(date);
    }
  };

  // Capture clicks to prevent them from reaching elements underneath
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div 
      ref={pickerRef}
      className={`bg-white rounded-lg ${className || ''}`}
      style={{
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
      }}
      onClick={handleClick} // Important: Stop propagation to prevent clicks from reaching underneath elements
    >
      <Calendar
        onDateSelect={handleDateSelect}
        initialDate={initialDate}
        variant={variant}
        disablePastDates={disablePastDates}
        disableFutureDates={disableFutureDates}
      />
    </div>
  );
};

export { DatePicker };