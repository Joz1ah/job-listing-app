import { useState } from 'react';
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from 'components';

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const getDaysInMonth = (month?: number) => {
  if (!month) return Array.from({ length: 31 }, (_, i) => i + 1);
  
  const daysMap = {
    1: 31, 2: 29, 3: 31, 4: 30, 5: 31, 6: 30,
    7: 31, 8: 31, 9: 30, 10: 31, 11: 30, 12: 31
  };
  return Array.from({ length: daysMap[month as keyof typeof daysMap] }, (_, i) => i + 1);
};

interface BirthdayInputProps {
  name: string;
  value: string;
  onChange: (name: string, value: string) => void;
}

const BirthdayInput: React.FC<BirthdayInputProps> = ({ name, value, onChange }) => {
  // Parse the current value into month and day
  const [currentMonth, currentDay] = value?.split('/') || ['', ''];
  const [isActive, setIsActive] = useState(false);
  const [isMonthOpen, setIsMonthOpen] = useState(false);
  const [isDayOpen, setIsDayOpen] = useState(false);

  const handleMonthChange = (month: string) => {
    const monthNumber = months.indexOf(month) + 1;
    
    if (currentDay) {
      const daysInNewMonth = getDaysInMonth(monthNumber).length;
      const adjustedDay = parseInt(currentDay) > daysInNewMonth ? daysInNewMonth : currentDay;
      onChange(name, `${monthNumber}/${adjustedDay}`);
    } else {
      onChange(name, `${monthNumber}/`);
    }
  };

  const handleDayChange = (day: string) => {
    const monthPart = currentMonth || '';
    const newValue = monthPart ? `${monthPart}/${day}` : `/${day}`;
    onChange(name, newValue);
  };

  const handleContainerFocus = () => {
    setIsActive(true);
  };

  const handleContainerBlur = (e: React.FocusEvent) => {
    if (!e.currentTarget.contains(e.relatedTarget) && !isMonthOpen && !isDayOpen) {
      setIsActive(false);
    }
  };

  return (
    <div 
      className={`flex items-center justify-between h-14 px-4 py-2 bg-transparent border-2 rounded-md cursor-pointer transition-colors ${
        isActive || isMonthOpen || isDayOpen ? 'border-orange-500' : 'border-[#AEADAD]'
      }`}
      onClick={handleContainerFocus}
      onFocus={handleContainerFocus}
      onBlur={handleContainerBlur}
      tabIndex={0}
    >
      <Select
        onValueChange={handleMonthChange}
        value={currentMonth ? months[parseInt(currentMonth) - 1] : undefined}
        onOpenChange={(open) => {
          setIsMonthOpen(open);
          if (open) setIsActive(true);
        }}
      >
        <SelectTrigger 
          className="w-full border-none bg-transparent focus:ring-0 text-sm"
          onFocus={() => setIsActive(true)}
        >
          <SelectValue placeholder="Month" />
        </SelectTrigger>
        <SelectContent>
          {months.map((month) => (
            <SelectItem key={month} value={month}>
              {month}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="text-white">|</div>

      <Select
        onValueChange={handleDayChange}
        value={currentDay}
        onOpenChange={(open) => {
          setIsDayOpen(open);
          if (open) setIsActive(true);
        }}
      >
        <SelectTrigger 
          className="w-full border-none bg-transparent focus:ring-0 text-sm"
          onFocus={() => setIsActive(true)}
        >
          <SelectValue placeholder="Day" />
        </SelectTrigger>
        <SelectContent>
          {getDaysInMonth(currentMonth ? parseInt(currentMonth) : undefined).map((day) => (
            <SelectItem key={day} value={day.toString()}>
              {day}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export { BirthdayInput }