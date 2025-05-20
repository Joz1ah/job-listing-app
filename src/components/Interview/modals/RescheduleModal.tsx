import { FC, useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "components";
import { Button } from "components";
import { MapPin, LoaderCircle, Check } from "lucide-react";
import { EmployerInterviewCalendarModal } from "../modals/EmployerInterviewCalendarModal";
import { HunterInterviewCalendarModal } from "../modals/HunterInterviewCalendarModal";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "components";

import { useFormik } from "formik";
import * as Yup from "yup";
import { DatePicker } from "components";
import gmeet from "images/google-meet.svg?url";
import { InputField } from "components";
import { useNavigate } from "react-router-dom";
import { Interview } from "contexts/Interviews/types";

interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  interview: Interview;
  variant: "employer" | "job-hunter";
}

interface RescheduleReason {
  id: string;
  label: string;
}

interface RescheduleData {
  reason: string;
  date: string;
  time: string;
  interviewId?: string;
}

const rescheduleReasons: RescheduleReason[] = [
  { id: "Health Issues", label: "Health Issues" },
  { id: "Schedule Conflicts", label: "Schedule Conflicts" },
  { id: "Personal/Family Emergency", label: "Personal/Family Emergency" },
  {
    id: "Unforseen Circumstances (e.g.outage/weather/traveling)",
    label: "Unforseen Circumstances (e.g.outage/weather/traveling)",
  },
  { id: "Other", label: "Other" },
];

interface RescheduleModalProps extends BaseModalProps {
  onReschedule: (data: RescheduleData) => void;
}

interface FormValues {
  reason: string | undefined;
  interviewDate: Date | undefined;
  interviewTime: string | undefined;
}

const validationSchema = Yup.object().shape({
  reason: Yup.string()
    .required("Please select a reason")
    .oneOf(
      rescheduleReasons.map((reason) => reason.id),
      "Please select a valid reason",
    ),
  interviewDate: Yup.date()
    .required("Please select a date")
    .min(new Date(new Date().setHours(0, 0, 0, 0)), "Cannot select a past date")
    .max(
      new Date(new Date().setMonth(new Date().getMonth() + 2)),
      "Cannot select a date more than 2 months",
    )
    .typeError("Please select a valid date"),
  interviewTime: Yup.string()
    .required("Please select a time")
    .typeError("Please select a valid time"),
});

const RescheduleModal: FC<RescheduleModalProps> = ({
  isOpen,
  onClose,
  interview,
  onReschedule,
  variant,
}) => {
  const [isDatePickerOpen, setIsDatePickerOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRescheduled, setIsRescheduled] = useState(false);
  const [isCalendarModalOpen, setIsCalendarModalOpen] =
    useState<boolean>(false);
  const [isMobileView, setIsMobileView] = useState<boolean>(false);
  const dateInputRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Check viewport size
  useEffect(() => {
    const checkViewportSize = () => {
      setIsMobileView(window.innerWidth < 640);
    };

    checkViewportSize();
    window.addEventListener("resize", checkViewportSize);

    return () => {
      window.removeEventListener("resize", checkViewportSize);
    };
  }, []);

  // Generate time slots for 24 hours (48 half-hour slots)
  const timeSlots: string[] = Array.from({ length: 48 }, (_, i) => {
    const hour = Math.floor(i / 2);
    const minutes = i % 2 === 0 ? "00" : "30";
    const ampm = hour >= 12 ? "PM" : "AM";
    const formattedHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${formattedHour}:${minutes} ${ampm}`;
  });

  const formik = useFormik<FormValues>({
    initialValues: {
      reason: undefined,
      interviewDate: undefined,
      interviewTime: undefined,
    },
    validationSchema,
    onSubmit: async (values) => {
      setIsLoading(true);
      onReschedule({
        reason: values.reason || "",
        date: values.interviewDate?.toISOString() ?? "",
        time: values.interviewTime ?? "",
        interviewId: interview.id,
      });

      // Wait for 2 seconds to show the loading spinner
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setIsLoading(false);
      setIsRescheduled(true);

      // Close the modal after 1 second and navigate based on variant
      setTimeout(() => {
        onClose();
        navigate("/dashboard/interviews/reschedule", { replace: true });
      }, 1000);
    },
  });

  const { values, touched, errors, handleSubmit, setFieldValue, resetForm } =
    formik;

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen && !isLoading && !isRescheduled) {
      resetForm();
      setIsDatePickerOpen(false);
    }
  }, [isOpen, resetForm, isLoading, isRescheduled]);

  const handleDateSelect = (selectedDate: Date): void => {
    setFieldValue("interviewDate", selectedDate);
    setIsDatePickerOpen(false);
  };

  // Handle modal close with cleanup
  const handleModalClose = () => {
    resetForm();
    setIsDatePickerOpen(false);
    onClose();
  };

  // Determine which fields to show based on variant
  const primaryField =
    variant === "employer" ? interview.candidate : interview.position;
  const secondaryField =
    variant === "employer" ? interview.position : interview.company;

  const InterviewCalendarModal =
    variant === "employer"
      ? EmployerInterviewCalendarModal
      : HunterInterviewCalendarModal;

  // Completely redesigned approach using a modal-like overlay
  const renderDatePicker = () => {
    if (!isDatePickerOpen) return null;

    // The calendar position depends on whether it's mobile or desktop
    let calendarPosition;

    if (isMobileView) {
      // Center the calendar on mobile
      calendarPosition = (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-auto">
          <div className="pointer-events-auto">
            <DatePicker
              isOpen={isDatePickerOpen}
              onClose={() => setIsDatePickerOpen(false)}
              onDateSelect={handleDateSelect}
              initialDate={values.interviewDate}
              variant="secondary"
              disablePastDates={true}
            />
          </div>
        </div>
      );
    } else {
      // Desktop positioning - align with input field
      const inputRect = dateInputRef.current?.getBoundingClientRect();

      if (!inputRect) {
        // Fallback to center positioning if input field not found
        calendarPosition = (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-auto">
            <div className="pointer-events-auto">
              <DatePicker
                isOpen={isDatePickerOpen}
                onClose={() => setIsDatePickerOpen(false)}
                onDateSelect={handleDateSelect}
                initialDate={values.interviewDate}
                variant="secondary"
                disablePastDates={true}
              />
            </div>
          </div>
        );
      } else {
        // Position relative to the input field
        const calendarHeight = 310;

        // Calculate available space
        const viewportBottom = window.innerHeight;
        const spaceBelow = viewportBottom - inputRect.bottom - 16; // 16px margin
        const spaceAbove = inputRect.top - 16;

        let top: number;

        // Prioritize displaying below if there's enough space
        if (spaceBelow >= calendarHeight) {
          // Position below
          top = inputRect.bottom + 8;
        } else if (spaceAbove >= calendarHeight) {
          // Position above if not enough space below
          top = inputRect.top - calendarHeight - 8;
        } else {
          // If not enough space either way, center it
          top = Math.max(8, (viewportBottom - calendarHeight) / 2);
        }

        calendarPosition = (
          <div
            className="fixed pointer-events-auto"
            style={{
              left: `${inputRect.left}px`,
              top: `${top}px`,
              zIndex: 9999,
            }}
          >
            <DatePicker
              isOpen={isDatePickerOpen}
              onClose={() => setIsDatePickerOpen(false)}
              onDateSelect={handleDateSelect}
              initialDate={values.interviewDate}
              variant="secondary"
              disablePastDates={true}
            />
          </div>
        );
      }
    }

    // Return a modal-like structure with a semi-transparent overlay
    return (
      <>
        {/* Semi-transparent overlay that catches all clicks outside the calendar */}
        <div
          className="fixed inset-0 z-[9998] pointer-events-auto"
          onClick={() => setIsDatePickerOpen(false)}
          style={{ backgroundColor: "rgba(0, 0, 0, 0)" }}
        />
        {/* Calendar positioned according to the rules above */}
        {calendarPosition}
      </>
    );
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleModalClose}>
        <DialogContent
          className="w-[calc(100%-2rem)] md:w-full max-w-3xl h-auto p-0 flex flex-col mt-0 translate-y-12 top-4 sm:top-6 max-h-[90vh] overflow-visible"
          closeOnOutsideClick={false}
        >
          <div
            className="flex flex-col h-full"
            onClick={(e: React.MouseEvent<HTMLDivElement>) =>
              e.stopPropagation()
            }
          >
            <DialogHeader className="p-6 pb-4 text-left">
              <DialogTitle className="sr-only">
                Reschedule Interview
              </DialogTitle>
              <div className="text-center">
                <p className="text-sm font-medium text-[#FF6B35]">
                  You are requesting to reschedule the interview below
                </p>
              </div>
            </DialogHeader>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit(e);
              }}
              className="flex flex-col flex-1"
            >
              <div className="px-6 flex-1 overflow-auto">
                {/* Job Details */}
                <div className="mb-4">
                  <div className="flex flex-wrap justify-between items-start gap-2">
                    <h3 className="text-sm font-medium break-words text-[#263238]">
                      {primaryField}
                    </h3>
                    <span className="text-xs text-[#717171] font-light">
                      Received {interview.receivedTime}
                    </span>
                  </div>
                  <p className="text-sm text-[#263238] underline cursor-pointer break-words">
                    {secondaryField}
                  </p>
                  <div className="flex items-center mt-1">
                    <MapPin className="text-[#F5722E]" size={12} />
                    <p className="text-xs text-[#263238] break-words">
                      Based in {interview.country}
                    </p>
                  </div>
                </div>

                {/* Time Details */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs min-w-[40px] text-[#263238]">
                      Date:
                    </span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-sm bg-[#184E77] text-white min-w-[135px] text-center">
                      {interview.date}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs min-w-[40px] text-[#263238]">
                      Time:
                    </span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-sm bg-[#168AAD] text-white min-w-[135px] text-center">
                      {interview.time}
                    </span>
                  </div>
                  <div className="mt-4 flex items-center gap-2">
                    <img src={gmeet} alt="Google Meet" className="h-4 w-4" />
                    <span className="text-xs text-[#F5722E] font-light">
                      via Google meet
                    </span>
                  </div>
                </div>

                {/* Reschedule Form */}
                <div className="w-full max-w-2xl space-y-4 mt-8">
                  <div className="space-y-2">
                    <InputField
                      label="Reschedule Reason"
                      variant="secondary"
                      size="sm"
                      error={errors.reason}
                      touched={touched.reason}
                    >
                      <Select
                        value={values.reason}
                        onValueChange={(value) =>
                          setFieldValue("reason", value)
                        }
                      >
                        <SelectTrigger className="w-full border-2 rounded-[10px] bg-transparent h-[56px] border-[#263238]">
                          <SelectValue placeholder="Select A Reason" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#F5F5F7] p-0 [&>*]:px-0 border-none rounded-none max-h-[200px]">
                          {rescheduleReasons.map((reason) => (
                            <SelectItem
                              key={reason.id}
                              value={reason.id}
                              className="rounded-none justify-start pl-3 h-[55px]"
                            >
                              {reason.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </InputField>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8">
                    <InputField
                      label="Date"
                      variant="secondary"
                      size="sm"
                      error={errors.interviewDate}
                      touched={touched.interviewDate}
                    >
                      <div className="relative">
                        <div
                          ref={dateInputRef}
                          className="w-full border-2 rounded-[10px] bg-transparent h-[56px] px-3 flex items-center cursor-pointer border-[#263238] text-sm"
                          onClick={() => setIsDatePickerOpen(true)}
                        >
                          {values.interviewDate
                            ? values.interviewDate.toLocaleDateString()
                            : "Select a date"}
                        </div>
                      </div>
                    </InputField>

                    <InputField
                      label="Time"
                      variant="secondary"
                      size="sm"
                      error={errors.interviewTime}
                      touched={touched.interviewTime}
                    >
                      <Select
                        value={values.interviewTime}
                        onValueChange={(value) =>
                          setFieldValue("interviewTime", value)
                        }
                      >
                        <SelectTrigger className="w-full border-2 rounded-[10px] bg-transparent h-[56px] border-[#263238]">
                          <SelectValue placeholder="Select a Time" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#F5F5F7] p-0 [&>*]:px-0 border-none rounded-none max-h-[200px]">
                          {timeSlots.map((time) => (
                            <SelectItem
                              key={time}
                              value={time}
                              className="rounded-none justify-center pl-3 h-[55px]"
                            >
                              {time}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </InputField>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-6 mt-auto">
                <div className="flex flex-wrap gap-3 justify-start">
                  {isLoading ? (
                    <div className="flex items-center gap-2 text-[#F5722E]">
                      <LoaderCircle className="w-5 h-5 animate-spin" />
                      <span className="text-sm font-medium">
                        Rescheduling interview...
                      </span>
                    </div>
                  ) : isRescheduled ? (
                    <div className="flex items-center gap-2 text-[#4BAF66]">
                      <Check className="w-5 h-5" />
                      <span className="text-sm font-medium">
                        Your request to reschedule the interview is sent!
                      </span>
                    </div>
                  ) : (
                    <>
                      <Button
                        type="submit"
                        className="text-[13px] font-normal h-[32px] px-6 bg-[#FF6B35] hover:bg-[#ff855b] text-white"
                      >
                        Reschedule
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>

      {/* DatePicker - rendered outside the modal structure */}
      {renderDatePicker()}

      <InterviewCalendarModal
        isOpen={isCalendarModalOpen}
        onClose={() => setIsCalendarModalOpen(false)}
      />
    </>
  );
};

export { RescheduleModal };
