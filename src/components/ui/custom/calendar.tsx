import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from 'lib/utils';

interface TimeSlot {
  date: string;
  startTime: string;
  endTime: string;
}

interface Meeting {
  id: string;
  companyName?: string;
  candidateName?: string;
  position: string;
  timeSlot: TimeSlot;
}

interface CalendarProps {
  className?: string;
  onDateSelect?: (date: Date) => void;
  initialDate?: Date;
  variant?: 'default' | 'secondary';
  meetings?: Meeting[];
  disablePastDates?: boolean;
  disableFutureDates?: Date | null; // Added prop to disable future dates after a specific date
}

const Calendar: React.FC<CalendarProps> = ({ 
  className, 
  onDateSelect, 
  initialDate,
  variant = 'default',
  meetings = [],
  disablePastDates = false,
  disableFutureDates // Added prop to disable future dates
}) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Normalize today's date
  
  const [currentDate, setCurrentDate] = useState<Date>(initialDate || today);
  const [selectedDate, setSelectedDate] = useState<Date>(initialDate || today);
  
  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();
  
  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay();
  
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  
  const dayNames = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  const hasMeetings = (date: Date): boolean => {
    const dateString = date.toISOString().split('T')[0];
    return meetings.some(meeting => meeting.timeSlot.date === dateString);
  };
  
  const previousMonth = (e: React.MouseEvent): void => {
    e.stopPropagation();
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };
  
  const nextMonth = (e: React.MouseEvent): void => {
    e.stopPropagation();
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const isToday = (date: Date): boolean => date.toDateString() === today.toDateString();
  const isSelected = (date: Date): boolean => date.toDateString() === selectedDate.toDateString();
  const isPastDate = (date: Date): boolean => disablePastDates && date < today;
  const isFutureDate = (date: Date): boolean => {
    if (disableFutureDates === null || disableFutureDates === undefined) {
      return false; // If `disableFutureDates` is `null` or `undefined`, we don't disable future dates
    }
    return date > disableFutureDates;
  };

  const handleDateSelect = (date: Date): void => {
    if ((disablePastDates && isPastDate(date)) || (disableFutureDates && isFutureDate(date))) return;
    setSelectedDate(date);
    onDateSelect?.(date);
  };
  
  const generateDays = (): JSX.Element[] => {
    const days: JSX.Element[] = [];
    const totalCells = Math.ceil((firstDayOfMonth + daysInMonth) / 7) * 7;
    
    for (let i = 0; i < totalCells; i++) {
      const dayNumber = i - firstDayOfMonth + 1;
      const isCurrentMonth = dayNumber > 0 && dayNumber <= daysInMonth;
      const currentDayDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), dayNumber);
      
      if (isCurrentMonth) {
        const isCurrentDateToday = isToday(currentDayDate);
        const isCurrentDateSelected = isSelected(currentDayDate);
        const hasScheduledMeetings = hasMeetings(currentDayDate);
        const pastDate = isPastDate(currentDayDate);
        const futureDate = isFutureDate(currentDayDate);
        
        days.push(
          <div
            key={i}
            className="relative select-none"
            onClick={() => handleDateSelect(currentDayDate)}
          >
            <div
              className={cn(
                'h-8 w-8 text-sm rounded-full flex flex-col items-center transition-colors duration-200',
                {
                  'bg-[#F5722E] text-white hover:bg-orange-600': isCurrentDateSelected,
                  'ring-2 ring-[#F5722E] ring-offset-2': isCurrentDateToday && !isCurrentDateSelected,
                  'text-gray-400 cursor-not-allowed': pastDate || futureDate, // Disable if past or future date
                  'text-gray-100 hover:bg-gray-700 cursor-pointer': variant === 'default' && !isCurrentDateSelected && !pastDate && !futureDate,
                  'text-gray-900 hover:bg-gray-100 cursor-pointer': variant === 'secondary' && !isCurrentDateSelected && !pastDate && !futureDate,
                }
              )}
            >
              <span className="flex items-center justify-center h-8">{dayNumber}</span>
              {hasScheduledMeetings && !isCurrentDateSelected && !pastDate && !futureDate && (
                <div className="w-1 h-1 rounded-full bg-[#F5722E] -mt-1.5" />
              )}
            </div>
          </div>
        );
      } else {
        days.push(<div key={i} className="h-8 w-8 select-none" />);
      }
    }
    return days;
  };

  return (
    <div className={cn(
      'w-[300px] h-[310px] p-4 rounded-lg select-none',
      variant === 'default' ? 'bg-zinc-800 text-gray-100' : 'bg-white text-gray-900',
      className
    )}>
      <div className="flex items-center justify-between mb-4 select-none">
        <div onClick={previousMonth} className="p-1 rounded-lg cursor-pointer hover:bg-gray-700">
          <ChevronLeft className="w-5 h-5" />
        </div>
        <h2 className="text-sm font-medium">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h2>
        <div onClick={nextMonth} className="p-1 rounded-lg cursor-pointer hover:bg-gray-700">
          <ChevronRight className="w-5 h-5" />
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map(day => (
          <div key={day} className="h-8 flex items-center justify-center text-xs font-medium text-gray-400 select-none">
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
