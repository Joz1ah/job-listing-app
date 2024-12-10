import React, { useState } from "react";
import { ChevronLeft, BadgeCheck, Video } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "components";
import { Calendar } from "components";

interface DayInfo {
  dayNum: number;
  dayName: string;
  date: Date;
}

interface TimeSlot {
  date: string;
  startTime: string;
  endTime: string;
}

interface Meeting {
  id: string;
  candidateName: string;
  position: string;
  timeSlot: TimeSlot;
}

type DayName = "Sun" | "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat";

interface InterviewCalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  existingMeetings?: Meeting[];
}

const InterviewCalendarModal: React.FC<InterviewCalendarModalProps> = ({
  isOpen,
  onClose,
  existingMeetings = [
    {
      id: "1",
      candidateName: "Ash Ketchup",
      position: "Pokemon Trainer",
      timeSlot: {
        date: "2024-12-08",
        startTime: "8:00",
        endTime: "9:00",
      },
    },
    {
      id: "2",
      candidateName: "Tyson Fury",
      position: "Professional Boxer",
      timeSlot: {
        date: "2024-12-11",
        startTime: "14:00",
        endTime: "15:00",
      },
    },
    {
      id: "3",
      candidateName: "JJ Olatunji",
      position: "Youtuber/Streamer",
      timeSlot: {
        date: "2024-12-13",
        startTime: "9:30",
        endTime: "10:30",
      },
    },
  ],
}) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const currentDate = new Date("2024-12-10"); // Set current date as December 10, 2024

  const hours: string[] = Array.from({ length: 24 }, (_, i) => {
    return `${String(i).padStart(2, "0")}:00`;
  });

  const getDaysOfWeek = (): DayInfo[] => {
    const days: DayInfo[] = [];
    const startDate = new Date(selectedDate);
    const daysSinceMonday = startDate.getDay();
    startDate.setDate(startDate.getDate() - daysSinceMonday);

    const dayNames: DayName[] = [
      "Sun",
      "Mon",
      "Tue",
      "Wed",
      "Thu",
      "Fri",
      "Sat",
    ];

    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      days.push({
        dayNum: date.getDate(),
        dayName: dayNames[date.getDay()],
        date: new Date(date),
      });
    }
    return days;
  };

  const getMeetingTimePosition = (time: string): number => {
    const [hours, minutes] = time.split(":").map(Number);
    const hourHeight = 56;
    const position = hours * hourHeight + (minutes / 60) * hourHeight;
    return position;
  };

  const getMeetingHeight = (startTime: string, endTime: string): number => {
    const [startHours, startMinutes] = startTime.split(":").map(Number);
    const [endHours, endMinutes] = endTime.split(":").map(Number);

    const totalStartMinutes = startHours * 60 + startMinutes;
    const totalEndMinutes = endHours * 60 + endMinutes;
    const durationInMinutes = totalEndMinutes - totalStartMinutes;

    return (durationInMinutes / 60) * 56;
  };

  const isSameDay = (date1: Date, date2: Date): boolean => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  const isPastMeeting = (meetingDate: Date): boolean => {
    const meetingStart = new Date(meetingDate);
    meetingStart.setHours(0, 0, 0, 0);

    const currentStart = new Date(currentDate);
    currentStart.setHours(0, 0, 0, 0);

    return meetingStart < currentStart;
  };

  const getFormattedDate = (date: Date): string => {
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const daysOfWeek = getDaysOfWeek();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[1370px] h-[770px] p-0 overflow-auto max-w-[95vw] max-h-[95vh]">
        <DialogHeader className="sr-only">
          <DialogTitle>Interview Calendar</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr,400px] min-h-full bg-white">
          <div className="flex flex-col min-w-0 border-b lg:border-b-0 lg:border-r">
            <div className="flex flex-col border-b flex-shrink-0 bg-white sticky top-0 z-10">
              <div className="flex items-center p-4">
                <button
                  className="p-2 hover:bg-gray-100 rounded-md"
                  type="button"
                  onClick={onClose}
                >
                  <ChevronLeft className="w-5 h-5 text-gray-600" />
                </button>
                <h1 className="ml-2 text-xl font-medium">Interview Calendar</h1>
              </div>
              <span className="px-6 pb-4 text-gray-600">
                {getFormattedDate(selectedDate)}
              </span>
            </div>

            <div className="flex flex-col flex-1">
              <div className="grid grid-cols-8 border-b border-gray-100 bg-white sticky top-[105px] z-10">
                <div className="p-2 text-center">
                  <div className="text-sm text-black">Week</div>
                </div>
                {daysOfWeek.map((day, index) => {
                  const isSelected = isSameDay(day.date, selectedDate);
                  return (
                    <div
                      key={index}
                      className={`p-2 text-center relative ${
                        isSelected ? "bg-orange-50" : ""
                      }`}
                    >
                      <div
                        className={`text-sm font-medium ${
                          isSelected ? "text-orange-600" : ""
                        }`}
                      >
                        {day.dayNum}
                      </div>
                      <div
                        className={`text-xs ${
                          isSelected ? "text-orange-600" : "text-gray-500"
                        }`}
                      >
                        {day.dayName}
                      </div>
                      {isSelected && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500" />
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="grid grid-cols-8">
                <div className="sticky left-0 bg-white">
                  {hours.map((hour) => (
                    <div
                      key={hour}
                      className="h-14 border-b border-gray-100 px-4 py-2 flex items-center justify-center"
                    >
                      <div className="text-sm text-gray-500">{hour}</div>
                    </div>
                  ))}
                </div>

                {daysOfWeek.map((currentDay, dayIndex) => {
                  const isSelected = isSameDay(currentDay.date, selectedDate);
                  return (
                    <div
                      key={dayIndex}
                      className={`relative ${
                        isSelected ? "bg-orange-50/30" : ""
                      }`}
                    >
                      {hours.map((hourIndex) => (
                        <div
                          key={`${dayIndex}-${hourIndex}`}
                          className="h-14 border-b border-gray-100"
                        />
                      ))}

                      {existingMeetings
                        .filter((meeting) => {
                          const meetingDate = new Date(meeting.timeSlot.date);
                          return isSameDay(meetingDate, currentDay.date);
                        })
                        .map((meeting, index) => {
                          const meetingDate = new Date(meeting.timeSlot.date);
                          const isPast = isPastMeeting(meetingDate);
                          const startPosition = getMeetingTimePosition(
                            meeting.timeSlot.startTime,
                          );
                          const height = getMeetingHeight(
                            meeting.timeSlot.startTime,
                            meeting.timeSlot.endTime,
                          );

                          return (
                            <div
                              key={index}
                              className={`absolute left-0 right-0 px-1.5 py-0.5 mx-1 overflow-hidden shadow-sm hover:shadow rounded-sm border-l-2 ${
                                isPast
                                  ? "bg-red-50 border-red-500"
                                  : "bg-orange-50 border-orange-500"
                              }`}
                              style={{
                                top: `${startPosition}px`,
                                height: `${height}px`,
                                transform: "translateY(-1px)",
                              }}
                            >
                              <div
                                className={`text-[10px] ${
                                  isPast ? "text-red-500" : "text-gray-500"
                                } leading-tight`}
                              >
                                {meeting.candidateName}
                              </div>
                              <div
                                className={`text-[10px] font-medium ${
                                  isPast ? "text-red-900" : "text-gray-900"
                                } leading-tight`}
                              >
                                {meeting.position}
                              </div>
                              <div
                                className={`text-[9px] ${
                                  isPast ? "text-red-400" : "text-gray-400"
                                } flex items-center gap-0.5 leading-tight`}
                              >
                                <Video className="w-2.5 h-2.5" />
                                <span>
                                  {meeting.timeSlot.startTime} -{" "}
                                  {meeting.timeSlot.endTime}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="flex flex-col bg-gray-50 p-4 gap-4">
            <div className="w-full">
              <div className="bg-white rounded-lg shadow-sm p-3 w-full max-w-sm mx-auto mt-6">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">ABC Incorporated</span>
                  <BadgeCheck className="w-4 h-4 text-orange-500 flex-shrink-0" />
                </div>
              </div>
            </div>

            <div className="w-full flex justify-center">
              <Calendar
                variant="secondary"
                initialDate={selectedDate}
                onDateSelect={(date: Date) => setSelectedDate(date)}
                className="bg-white rounded-lg shadow-sm w-full max-w-sm"
                meetings={existingMeetings}
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export { InterviewCalendarModal };
