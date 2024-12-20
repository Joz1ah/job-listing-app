import { useState } from 'react';
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from 'components';

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const getDaysInMonth = (month: string): number[] => {
  if (!month) return [];
  
  const daysMap: { [key: string]: number } = {
    'January': 31,
    'February': 29,
    'March': 31,
    'April': 30,
    'May': 31,
    'June': 30,
    'July': 31,
    'August': 31,
    'September': 30,
    'October': 31,
    'November': 30,
    'December': 31
  };
  
  return Array.from({ length: daysMap[month] || 31 }, (_, i) => i + 1);
};

interface BirthdayInputProps {
  name: string;
  value: string;
  onChange: (name: string, value: string) => void;
}

const BirthdayInput: React.FC<BirthdayInputProps> = ({ name, value, onChange }) => {
  // Parse the current value in Month Day format
  const [monthName, day] = value?.split(' ') || ['', ''];
  
  const [isActive, setIsActive] = useState(false);
  const [isMonthOpen, setIsMonthOpen] = useState(false);
  const [isDayOpen, setIsDayOpen] = useState(false);

  const handleMonthChange = (selectedMonth: string) => {
    if (day) {
      const daysInNewMonth = getDaysInMonth(selectedMonth).length;
      const adjustedDay = parseInt(day) > daysInNewMonth ? daysInNewMonth : day;
      onChange(name, `${selectedMonth} ${adjustedDay}`);
    } else {
      onChange(name, selectedMonth);
    }
  };

  const handleDayChange = (selectedDay: string) => {
    if (monthName) {
      onChange(name, `${monthName} ${selectedDay}`);
    }
  };

  return (
    <div 
      className={`flex items-center justify-between h-14 px-4 py-2 bg-transparent border-2 rounded-[10px] cursor-pointer transition-colors outline-none ${
        isActive || isMonthOpen || isDayOpen ? 'border-[#F5722E]' : 'border-[#AEADAD]'
      }`}
    >
      <Select
        onValueChange={handleMonthChange}
        value={monthName || undefined}
        onOpenChange={(open) => {
          setIsMonthOpen(open);
          setIsActive(open);
        }}
      >
        <SelectTrigger 
          className="w-full border-none bg-transparent focus:ring-0 text-sm"
          onFocus={() => setIsActive(true)}
          onBlur={() => !isMonthOpen && !isDayOpen && setIsActive(false)}
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
        value={day || undefined}
        disabled={!monthName}
        onOpenChange={(open) => {
          setIsDayOpen(open);
          setIsActive(open);
        }}
      >
        <SelectTrigger 
          className={`w-full border-none bg-transparent focus:ring-0 text-sm ${!monthName ? 'cursor-not-allowed opacity-50' : ''}`}
          onFocus={() => setIsActive(true)}
          onBlur={() => !isMonthOpen && !isDayOpen && setIsActive(false)}
        >
          <SelectValue placeholder="Day" />
        </SelectTrigger>
        <SelectContent>
          {getDaysInMonth(monthName).map((day) => (
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