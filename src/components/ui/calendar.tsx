import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from 'lib/utils';

interface CalendarProps {
  className?: string;
  onDateSelect?: (date: Date) => void;
  initialDate?: Date;
  variant?: 'default' | 'secondary';
}

const Calendar: React.FC<CalendarProps> = ({ 
  className, 
  onDateSelect, 
  initialDate,
  variant = 'default'
}) => {
  const today = new Date();
  const [currentDate, setCurrentDate] = useState<Date>(initialDate || today);
  const [selectedDate, setSelectedDate] = useState<Date | null>(initialDate || null);
  
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

  const isToday = (date: Date): boolean => {
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };

  const isSelected = (date: Date): boolean => {
    if (!selectedDate) return false;
    return date.getDate() === selectedDate.getDate() &&
           date.getMonth() === selectedDate.getMonth() &&
           date.getFullYear() === selectedDate.getFullYear();
  };

  const handleDateSelect = (date: Date): void => {
    setSelectedDate(date);
    if (onDateSelect) {
      onDateSelect(date);
    }
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
        const isCurrentDateSelected = isSelected(currentDayDate);
        
        const dayClasses = cn(
          'h-8 w-8 text-sm rounded-full flex items-center justify-center cursor-pointer transition-colors duration-200',
          {
            // Selected date styling - always orange for both variants
            'bg-orange-500 text-white hover:bg-orange-600': isCurrentDateSelected,
            
            // Today's date styling when not selected
            'ring-2 ring-orange-500 ring-offset-2': isCurrentDateToday && !isCurrentDateSelected,
            
            // Variant-specific styling for non-selected, non-today dates
            'text-gray-100 hover:bg-gray-700 ring-offset-zinc-900': variant === 'default' && !isCurrentDateSelected,
            'text-gray-900 hover:bg-gray-100 ring-offset-white': variant === 'secondary' && !isCurrentDateSelected,
          }
        );

        days.push(
          <div
            key={i}
            className={dayClasses}
            onClick={() => handleDateSelect(currentDayDate)}
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

  const containerClasses = cn(
    'w-[300px] h-[310px] p-4 rounded-lg',
    variant === 'default' ? 'bg-zinc-800 text-gray-100' : 'bg-white text-gray-900',
    className
  );

  const navigationButtonClasses = cn(
    'p-1 rounded-lg cursor-pointer',
    variant === 'default' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
  );

  const dayNameClasses = cn(
    'h-8 flex items-center justify-center text-xs font-medium',
    variant === 'default' ? 'text-gray-400' : 'text-gray-500'
  );

  return (
    <div className={containerClasses}>
      <div className="flex items-center justify-between mb-4">
        <div
          onClick={previousMonth}
          className={navigationButtonClasses}
          aria-label="Previous month"
        >
          <ChevronLeft className="w-5 h-5" />
        </div>
        
        <h2 className="text-sm font-medium">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h2>
        
        <div
          onClick={nextMonth}
          className={navigationButtonClasses}
          aria-label="Next month"
        >
          <ChevronRight className="w-5 h-5" />
        </div>
      </div>
      
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map(day => (
          <div key={day} className={dayNameClasses}>
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

export { Calendar };