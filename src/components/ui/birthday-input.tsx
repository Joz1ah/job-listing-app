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

  const handleMonthChange = (month: string) => {
    const monthNumber = months.indexOf(month) + 1;
    
    // If the current day is greater than the days in the newly selected month,
    // adjust it to the last day of the new month
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

  return (
    <div className="flex items-center justify-between h-[56px] px-4 py-2 bg-transparent border-2 border-[#AEADAD] rounded-md focus-within:border-orange-500">
      <Select
        onValueChange={handleMonthChange}
        value={currentMonth ? months[parseInt(currentMonth) - 1] : undefined}
      >
        <SelectTrigger className="w-full border-none bg-transparent focus:ring-0 text-[17px]">
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
      >
        <SelectTrigger className="w-full border-none bg-transparent focus:ring-0 text-[17px]">
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