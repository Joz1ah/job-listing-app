import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from 'lib/utils';

interface CalendarProps {
  className?: string;
  onDateSelect?: (date: Date) => void;
  variant?: 'default' | 'secondary';
  onClose?: () => void;
  isOpen?: boolean;
}

const Calendar: React.FC<CalendarProps> = ({
  className,
  onDateSelect,
  variant = 'default',
  onClose,
  isOpen = true
}) => {
  const today = new Date();
  const [currentDate, setCurrentDate] = useState<Date>(today);
  const [selectedDate, setSelectedDate] = useState<Date>(today);
  const calendarRef = useRef<HTMLDivElement>(null);
  
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
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

  const daysInMonth: number = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();
  
  const firstDayOfMonth: number = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay();
  
  const monthNames: string[] = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  
  const dayNames: string[] = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  
  const previousMonth = (e: React.MouseEvent): void => {
    e.stopPropagation();
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };
  
  const nextMonth = (e: React.MouseEvent): void => {
    e.stopPropagation();
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const isSelectedDate = (date: Date): boolean => {
    return selectedDate &&
           date.getDate() === selectedDate.getDate() &&
           date.getMonth() === selectedDate.getMonth() &&
           date.getFullYear() === selectedDate.getFullYear();
  };

  const isToday = (date: Date): boolean => {
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };

  const handleDateSelect = (e: React.MouseEvent, date: Date): void => {
    e.stopPropagation();
    setSelectedDate(date);
    onDateSelect?.(date);
  };
  
  const generateDays = (): JSX.Element[] => {
    const days: JSX.Element[] = [];
    const totalDays: number = firstDayOfMonth + daysInMonth;
    const totalCells: number = Math.ceil(totalDays / 7) * 7;
    
    for (let i = 0; i < totalCells; i++) {
      const dayNumber: number = i - firstDayOfMonth + 1;
      const isCurrentMonth: boolean = dayNumber > 0 && dayNumber <= daysInMonth;
      const currentDayDate: Date = new Date(
        currentDate.getFullYear(), 
        currentDate.getMonth(), 
        dayNumber
      );
      
      if (isCurrentMonth) {
        const isCurrentDateToday = isToday(currentDayDate);
        const isSelected = isSelectedDate(currentDayDate);

        const dayClasses = cn(
          "h-8 w-8 text-sm rounded-full flex items-center justify-center cursor-pointer",
          variant === 'default' ? [
            isSelected && "bg-orange-500 text-white",
            !isSelected && "text-gray-100",
            isCurrentDateToday && !isSelected && "ring-2 ring-orange-500 ring-offset-2 ring-offset-zinc-900"
          ] : [
            isSelected && "bg-orange-500 text-white",
            !isSelected && "text-gray-900",
            isCurrentDateToday && !isSelected && "ring-2 ring-orange-500 ring-offset-2"
          ]
        );

        days.push(
          <div
            key={i}
            onClick={(e) => handleDateSelect(e, currentDayDate)}
            className={dayClasses}
          >
            {dayNumber}
          </div>
        );
      } else {
        days.push(<div key={i} className="h-8 w-8" />);
      }
    }
    return days;
  };

  const variantStyles = {
    default: "bg-[#263238] text-gray-100",
    secondary: "bg-white text-gray-900 shadow-md"
  };

  const navigationStyles = {
    default: "p-1 rounded-lg cursor-pointer",
    secondary: "p-1 rounded-lg cursor-pointer"
  };

  const dayNameStyles = {
    default: "text-gray-400",
    secondary: "text-gray-500"
  };

  if (!isOpen) return null;

  return (
    <div 
      ref={calendarRef}
      className={cn(
        "w-[300px] h-[310px] p-4 rounded-lg",
        variantStyles[variant],
        className
      )}
    >
      <div className="flex items-center justify-between mb-4">
        <div
          onClick={previousMonth}
          className={cn(navigationStyles[variant])}
          aria-label="Previous month"
        >
          <ChevronLeft className="w-5 h-5" />
        </div>
        
        <h2 className="text-sm font-medium">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h2>
        
        <div
          onClick={nextMonth}
          className={cn(navigationStyles[variant])}
          aria-label="Next month"
        >
          <ChevronRight className="w-5 h-5" />
        </div>
      </div>
      
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map(day => (
          <div
            key={day}
            className={cn(
              "h-8 flex items-center justify-center text-xs font-medium",
              dayNameStyles[variant]
            )}
          >
            {day}
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-1">
        {generateDays()}
      </div>
    </div>
  );
};

export { Calendar }