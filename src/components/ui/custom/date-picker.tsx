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
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        onClose?.();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleDateSelect = (date: Date) => {
    onDateSelect?.(date);
    onClose?.();
  };

  return (
    <div 
      ref={pickerRef}
      className={className}
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

export { DatePicker }