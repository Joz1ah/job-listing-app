import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from 'lib/utils';

interface CalendarProps {
  className?: string;
  onDateSelect?: (date: Date) => void;
}

const Calendar: React.FC<CalendarProps> = ({
  className,
  onDateSelect,
}) => {
  const today = new Date();
  const [currentDate, setCurrentDate] = useState<Date>(today);
  const [selectedDate, setSelectedDate] = useState<Date>(today);
  
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
  
  const previousMonth = (): void => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };
  
  const nextMonth = (): void => {
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

  const handleDateSelect = (date: Date): void => {
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
        days.push(
          <button
            key={i}
            onClick={() => handleDateSelect(currentDayDate)}
            className={cn(
              "h-8 w-8 text-sm rounded-full flex items-center justify-center",
              "transition-colors",
              {
                "bg-orange-500 text-white hover:bg-orange-500": isSelectedDate(currentDayDate),
                "ring-2 ring-orange-500 ring-offset-2 ring-offset-zinc-900": isCurrentDateToday && !isSelectedDate(currentDayDate),
                "hover:bg-orange-500/20": !isSelectedDate(currentDayDate),
                "text-gray-100": !isSelectedDate(currentDayDate)
              }
            )}
          >
            {dayNumber}
          </button>
        );
      } else {
        days.push(<div key={i} className="h-8 w-8" />);
      }
    }
    return days;
  };

  return (
    <div className={cn(
      "w-[300px] h-[310px] p-4 bg-[#263238] rounded-lg text-gray-100",
      className
    )}>
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={previousMonth}
          className="p-1 hover:bg-zinc-800 rounded-lg"
          aria-label="Previous month"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        
        <h2 className="text-sm font-medium">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h2>
        
        <button
          onClick={nextMonth}
          className="p-1 hover:bg-zinc-800 rounded-lg"
          aria-label="Next month"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
      
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map(day => (
          <div
            key={day}
            className="h-8 flex items-center justify-center text-xs text-gray-400 font-medium"
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