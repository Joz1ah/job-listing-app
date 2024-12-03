import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "components";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "components";
import { Button } from "components";
import gmeet from "images/google-meet.svg?url";
import { InputField } from "components";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "components";

interface ScheduleInterviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobTitle: string;
  skills: Array<{ name: string; isMatch: boolean }>;
  certificate?: string;
}

const ScheduleInterviewModal: React.FC<ScheduleInterviewModalProps> = ({
  isOpen,
  onClose,
  jobTitle,
}) => {
  const [date, setDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<string>();
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  // Generate time slots for 24 hours (48 half-hour slots)
const timeSlots = Array.from({ length: 48 }, (_, i) => {
  const hour = Math.floor(i / 2);
  const minutes = i % 2 === 0 ? "00" : "30";
  const ampm = hour >= 12 ? "PM" : "AM";
  const formattedHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  return `${formattedHour}:${minutes} ${ampm}`;
});

  const handleDateSelect = (selectedDate: Date) => {
    setDate(selectedDate);
    setIsCalendarOpen(false); // Close calendar popover after selection
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-3xl h-[90vh] md:h-[822px] p-0 flex flex-col">
        <div className="flex flex-col h-full">
          <div className="flex-1 overflow-y-auto">
            <DialogHeader className="p-4 md:p-6">
              {/* Header Title */}
              <DialogTitle className="text-center mb-8">
                Schedule an interview for the{" "}
                <span className="text-orange-500">({jobTitle})</span> position
              </DialogTitle>

              <div className="space-y-6">
                {/* Name and Skills Grid */}
                <div className="grid grid-cols-2">
                  {/* Left Column - Name and Location */}
                  <div>
                    <span className="text-sm block mb-2">
                      Name of Job Hunter
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-orange-500">*</span>
                      <span className="text-sm text-black">
                        Based in (Country)
                      </span>
                    </div>
                  </div>

                  {/* Right Column - Skills and Certificate */}
                  <div className="space-y-4">
                    <div>
                      <span className="text-sm block mb-2">Core Skills:</span>
                      <div className="flex flex-wrap gap-1.5">
                        <span className="bg-[#184E77] text-white px-2 py-0.5 text-xs rounded">
                          Angular
                        </span>
                        <span className="bg-[#168AAD] text-white px-2 py-0.5 text-xs rounded">
                          Javascript
                        </span>
                        <span className="bg-[#184E77] text-white px-2 py-0.5 text-xs rounded">
                          Flutter
                        </span>
                        <span className="bg-[#168AAD] text-white px-2 py-0.5 text-xs rounded">
                          Node.JS
                        </span>
                        <span className="bg-[#184E77] text-white px-2 py-0.5 text-xs rounded">
                          HTML5
                        </span>
                      </div>
                    </div>

                    <div>
                      <span className="text-sm block mb-2">Certificate:</span>
                      <span className="text-orange-500 border border-orange-500 px-2 py-0.5 text-xs rounded">
                        Microsoft Certified: Azure Developer Associate
                      </span>
                    </div>
                  </div>
                </div>

                {/* Date and Time Selection */}
                <div className="grid grid-cols-2 gap-4 mt-8">
                  <div>
                  <InputField label="Date" variant="secondary">
                      <div className="relative" tabIndex={-1}>
                        <Button
                          variant="outline"
                          tabIndex={-1}
                          className="w-full border-2 rounded bg-transparent border-black h-[56px] justify-start text-left font-normal text-black hover:bg-transparent hover:border-black focus:outline-none focus:border-orange-500"
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsCalendarOpen(!isCalendarOpen);
                          }}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {date ? format(date, "PPP") : "Select a date"}
                        </Button>
                        {isCalendarOpen && (
                          <div
                            className="absolute z-50 mt-1 left-1/2 -translate-x-1/2"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Calendar
                              onDateSelect={handleDateSelect}
                              variant="secondary"
                              isOpen={isCalendarOpen}
                              onClose={() => setIsCalendarOpen(false)}
                            />
                          </div>
                        )}
                      </div>
                    </InputField>
                  </div>

                  <div>
                  <InputField label="Time" variant="secondary">
                      <Select value={selectedTime} onValueChange={setSelectedTime}>
                        <SelectTrigger className="w-full border-2 rounded bg-transparent border-black h-[56px]">
                          <SelectValue placeholder="Select a time" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#F5F5F7] p-0 [&>*]:p-0 border-none rounded-none max-h-[200px]">
                          {timeSlots.map((time) => (
                            <SelectItem
                              key={time}
                              value={time}
                              className="rounded-none justify-start pl-3 h-[55px]"
                            >
                              {time}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </InputField>
                  </div>
                </div>

                {/* Meeting Link */}
                <div className="flex items-center gap-2 mt-4">
                  <img src={gmeet} alt="Meet icon" className="w-4 h-4" />
                  <span className="text-sm text-gray-500">
                    https://meet.google.com/xxx-xxxx-xxx
                  </span>
                </div>
              </div>
            </DialogHeader>
          </div>

          {/* Fixed Button Area */}
          <div className="p-4 md:p-6">
            <div className="flex gap-2">
              <Button className="bg-gray-400 hover:bg-gray-500 text-white text-[16px]">
                Send Invite
              </Button>
              <Button
                variant="outline"
                className="text-orange-500 border-orange-500 hover:bg-orange-50 text-[16px]"
                onClick={onClose}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export { ScheduleInterviewModal };
