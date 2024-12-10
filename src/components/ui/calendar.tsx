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
}

const Calendar: React.FC<CalendarProps> = ({ 
  className, 
  onDateSelect, 
  initialDate,
  variant = 'default',
  meetings = []
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
    const dateString = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    ).toISOString().split('T')[0];
    
    return meetings.some(meeting => {
      const meetingDate = new Date(meeting.timeSlot.date);
      const meetingDateString = new Date(
        meetingDate.getFullYear(),
        meetingDate.getMonth(),
        meetingDate.getDate()
      ).toISOString().split('T')[0];
      
      return dateString === meetingDateString;
    });
  };
  
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
    const totalDays = firstDayOfMonth + daysInMonth;
    const totalCells = Math.ceil(totalDays / 7) * 7;
    
    for (let i = 0; i < totalCells; i++) {
      const dayNumber = i - firstDayOfMonth + 1;
      const isCurrentMonth = dayNumber > 0 && dayNumber <= daysInMonth;
      const currentDayDate = new Date(
        currentDate.getFullYear(), 
        currentDate.getMonth(), 
        dayNumber
      );
      
      if (isCurrentMonth) {
        const isCurrentDateToday = isToday(currentDayDate);
        const isCurrentDateSelected = isSelected(currentDayDate);
        const hasScheduledMeetings = hasMeetings(currentDayDate);
        
        days.push(
          <div
            key={i}
            className="relative"
            onClick={() => handleDateSelect(currentDayDate)}
          >
            <div
              className={cn(
                'h-8 w-8 text-sm rounded-full flex flex-col items-center transition-colors duration-200 cursor-pointer',
                {
                  'bg-orange-500 text-white hover:bg-orange-600': isCurrentDateSelected,
                  'ring-2 ring-orange-500 ring-offset-2': isCurrentDateToday && !isCurrentDateSelected,
                  'text-gray-100 hover:bg-gray-700 ring-offset-zinc-900': variant === 'default' && !isCurrentDateSelected,
                  'text-gray-900 hover:bg-gray-100 ring-offset-white': variant === 'secondary' && !isCurrentDateSelected,
                }
              )}
            >
              <span className="flex items-center justify-center h-8">{dayNumber}</span>
              {hasScheduledMeetings && !isCurrentDateSelected && (
                <div className="w-1 h-1 rounded-full bg-orange-500 -mt-1.5" />
              )}
            </div>
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
    {
      'hover:bg-gray-700': variant === 'default',
      'hover:bg-gray-100': variant === 'secondary'
    }
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

export { Calendar }