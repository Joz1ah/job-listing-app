import React, { useState, useEffect, useRef } from "react";
import { CustomError } from "types/errors";
import { useNavigate } from "react-router-dom";
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
import { DatePicker } from "components";
import { InvitationSentModal } from "features/employer";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useErrorModal } from "contexts/ErrorModalContext/ErrorModalContext";
import { useCreateEmployerInterviewMutation } from "api/akaza/akazaAPI";
import { combineDateAndTime } from "utils";
import { ChevronRight, MapPin } from "lucide-react";
import { getDateInTimezone } from "utils/dateTimeUtils";

interface ScheduleInterviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  timezone: string;
  jobId?: number;
  jobHunterId?: number;
  employerId?: number;
  position: string;
  coreSkills: string[];
  certificate?: string[];
  candidateName?: string;
  country?: string;
}

interface FormValues {
  interviewDate: Date | undefined;
  interviewTime: string | undefined;
  jobId: number | undefined;
  jobHunterId: number | undefined;
  employerId: number | undefined;
  location: String | "Remote";
  meetingLink: URL | string;
}

const validationSchema = Yup.object().shape({
  interviewDate: Yup.date()
    .required("Please select a date")
    .min(
      new Date(new Date().setHours(0, 0, 0, 0) + 86400000), // Add 24 hours (86400000 ms) to current date
      "Please select a future date",
    )
    .max(
      new Date(new Date().setMonth(new Date().getMonth() + 2)),
      "Cannot select a date more than 2 months",
    )
    .typeError("Please select a valid date"),
  interviewTime: Yup.string()
    .required("Please select a time")
    .typeError("Please select a valid time"),
});

const ScheduleInterviewModal: React.FC<ScheduleInterviewModalProps> = ({
  isOpen,
  onClose,
  timezone,
  jobId,
  jobHunterId,
  employerId,
  position,
  coreSkills,
  certificate = [],
  candidateName,
  country,
}) => {
  const navigate = useNavigate();
  const [isDatePickerOpen, setIsDatePickerOpen] = useState<boolean>(false);
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
  const [createInterview] = useCreateEmployerInterviewMutation();
  const { showError } = useErrorModal();
  const [isMobileView, setIsMobileView] = useState<boolean>(false);
  const dateInputRef = useRef<HTMLDivElement>(null);

  // State to track window dimensions for responsive positioning
  const [windowDimensions, setWindowDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

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

  // Add resize and scroll listeners to update dimensions without flickering
  useEffect(() => {
    if (isDatePickerOpen && !isMobileView) {
      // Debounce function to prevent excessive rerenders
      let resizeTimer: NodeJS.Timeout;

      const handleResizeOrScroll = () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
          setWindowDimensions({
            width: window.innerWidth,
            height: window.innerHeight,
          });
        }, 50); // 50ms debounce
      };

      window.addEventListener("resize", handleResizeOrScroll);
      window.addEventListener("scroll", handleResizeOrScroll, true);

      return () => {
        clearTimeout(resizeTimer);
        window.removeEventListener("resize", handleResizeOrScroll);
        window.removeEventListener("scroll", handleResizeOrScroll, true);
      };
    }
  }, [isDatePickerOpen, isMobileView]);

  const formik = useFormik<FormValues>({
    initialValues: {
      interviewDate: undefined,
      interviewTime: undefined,
      jobHunterId: jobHunterId,
      jobId: jobId,
      employerId: employerId,
      location: "Remote",
      meetingLink: "https://meet.google.com/xxx-xxxx-xxx",
    },
    validationSchema,
    validateOnMount: true,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        // Add your invite sending logic here
        const scheduleStart = combineDateAndTime(
          values.interviewDate as Date,
          values.interviewTime as string,
        );
        const scheduledEnd = scheduleStart.add(30, "minutes");
        const payload = {
          jobId: values.jobId,
          jobHunterId: values.jobHunterId,
          requestorTimezone: timezone,
          scheduledStart: scheduleStart.format("YYYY-MM-DDTHH:mm"),
          scheduledEnd: scheduledEnd.format("YYYY-MM-DDTHH:mm"),
        };
        console.log(payload);
        await createInterview(payload)
          .unwrap()
          .then(() => {
            setShowSuccessModal(true);
          });
      } catch (error) {
        const errorMessage =
          (error as CustomError).data?.message ||
          "Unable to schedule the interview. Please try again.";
        showError("Interview Scheduling Failed", errorMessage);
        console.error("Error sending invite:", error);
      } finally {
        setSubmitting(false);
      }
    },
  });

  const {
    values,
    touched,
    errors,
    handleSubmit,
    setFieldValue,
    resetForm,
    isValid,
    isSubmitting,
  } = formik;

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      resetForm();
      setIsDatePickerOpen(false);
    }
  }, [isOpen, resetForm]);

  // Handle modal close with cleanup
  const handleModalClose = () => {
    resetForm();
    setIsDatePickerOpen(false);
    onClose();
  };

  // Generate time slots for 24 hours (48 half-hour slots)
  const timeSlots: string[] = Array.from({ length: 48 }, (_, i) => {
    const hour = Math.floor(i / 2);
    const minutes = i % 2 === 0 ? "00" : "30";
    const ampm = hour >= 12 ? "PM" : "AM";
    const formattedHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${formattedHour}:${minutes} ${ampm}`;
  });

  const handleDateSelect = (selectedDate: Date): void => {
    setFieldValue("interviewDate", selectedDate);
    // Close the date picker after selecting a date
    setIsDatePickerOpen(false);
  };

  const handleTimeSelect = (time: string): void => {
    setFieldValue("interviewTime", time);
  };

  // Button class based on validation state
  const sendInviteButtonClass =
    !isValid || isSubmitting || !formik.dirty
      ? "bg-[#AEADAD] hover:bg-[#AEADAD]/70 text-white text-[16px] font-normal"
      : "bg-[#F5722E] hover:bg-[#F5722E]/70 text-white text-[16px] font-normal";

  // Completely redesigned approach using a modal-like overlay
  const renderDatePicker = () => {
    if (!isDatePickerOpen) return null;

    // The calendar position depends on whether it's mobile or desktop
    let calendarPosition;

    if (isMobileView) {
      // Center the calendar on mobile
      calendarPosition = (
        <div className="fixed z-[1002] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-auto">
          <DatePicker
            isOpen={isDatePickerOpen}
            onClose={() => setIsDatePickerOpen(false)}
            onDateSelect={handleDateSelect}
            initialDate={values.interviewDate}
            variant="secondary"
            disablePastDates={true}
            disableFutureDates={getDateInTimezone(timezone)
              .add(2, "months")
              .toDate()}
          />
        </div>
      );
    } else {
      // Desktop positioning - align with input field
      const inputRect = dateInputRef.current?.getBoundingClientRect();

      if (!inputRect) {
        // Fallback to center positioning if input field not found
        calendarPosition = (
          <div
            className="fixed z-[1002] left-1/2 transform -translate-x-1/2 pointer-events-auto"
            style={{ top: "25%" }}
          >
            <DatePicker
              isOpen={isDatePickerOpen}
              onClose={() => setIsDatePickerOpen(false)}
              onDateSelect={handleDateSelect}
              initialDate={values.interviewDate}
              variant="secondary"
              disablePastDates={true}
              disableFutureDates={getDateInTimezone(timezone)
                .add(2, "months")
                .toDate()}
            />
          </div>
        );
      } else {
        // Position relative to the input field
        const calendarHeight = 310;
        const spaceBelow = windowDimensions.height - inputRect.bottom - 8;
        const spaceAbove = inputRect.top - 8;

        let top;
        if (spaceBelow >= calendarHeight || spaceBelow >= spaceAbove) {
          top = inputRect.bottom + 8;
        } else {
          top = inputRect.top - calendarHeight - 8;
        }

        calendarPosition = (
          <div
            className="fixed z-[1002] pointer-events-auto"
            style={{
              left: `${inputRect.left}px`,
              top: `${top}px`,
            }}
          >
            <DatePicker
              isOpen={isDatePickerOpen}
              onClose={() => setIsDatePickerOpen(false)}
              onDateSelect={handleDateSelect}
              initialDate={values.interviewDate}
              variant="secondary"
              disablePastDates={true}
              disableFutureDates={getDateInTimezone(timezone)
                .add(2, "months")
                .toDate()}
            />
          </div>
        );
      }
    }

    // Return a modal-like structure with a semi-transparent overlay
    return (
      <div className="fixed inset-0 z-[1001] pointer-events-auto">
        {/* Semi-transparent overlay that catches all clicks outside the calendar */}
        <div
          className="absolute inset-0 bg-black bg-opacity-0 pointer-events-auto"
          onClick={() => setIsDatePickerOpen(false)}
        />

        {/* Calendar positioned according to the rules above */}
        {calendarPosition}
      </div>
    );
  };

  return (
    <>
      {/* Updated to use closeOnOutsideClick={false} */}
      <Dialog open={isOpen} onOpenChange={handleModalClose}>
        <DialogContent
          className={`w-[calc(100%-2rem)] md:w-full max-w-3xl h-auto p-0 flex flex-col mt-0 translate-y-12 top-4 sm:top-6 ${isMobileView ? "max-h-[90vh] overflow-y-auto" : ""}`}
          closeOnOutsideClick={false}
        >
          <div
            className="flex flex-col h-full"
            onClick={(e: React.MouseEvent<HTMLDivElement>) =>
              e.stopPropagation()
            }
          >
            <div className="flex-1 overflow-y-auto">
              <DialogHeader className="py-2 px-4 sm:px-6">
                <DialogTitle className="text-center text-orange-500 mb-4 sm:mb-8 mt-4 sm:mt-6 text-base sm:text-lg">
                  Schedule an interview for the candidate below for the
                  <span> {position}</span> position
                </DialogTitle>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name and Skills Grid - Responsive */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-0">
                  {/* Left Column */}
                  <div className="mb-4 sm:mb-0">
                    <span className="text-sm flex justify-start mb-2">
                      {candidateName || "Name of Job Hunter"}
                    </span>
                    <div className="flex items-center gap-2">
                      <MapPin className="text-[#F5722E]" />
                      <span className="text-sm text-black">
                        Based in {country || "(Country)"}
                      </span>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-4">
                    <div>
                      <span className="text-sm flex justify-start mb-2">
                        Core Skills:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {coreSkills.map((skill, index) => (
                          <span
                            key={index}
                            className={`${
                              index % 2 === 0 ? "bg-[#184E77]" : "bg-[#168AAD]"
                            } text-white px-2 py-0.5 text-xs rounded`}
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-4">
                      <div>
                        <span className="text-sm flex justify-start mb-2">
                          Core Skills:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {coreSkills.map((skill, index) => (
                            <span
                              key={index}
                              className="text-orange-500 border border-orange-500 px-2 py-0.5 text-xs rounded"
                            >
                              {cert}
                            </span>
                          ))
                        ) : (
                          <span className="text-gray-400 text-xs">
                            No certificates provided
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Date and Time Selection - Responsive */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8 mt-4 sm:mt-0">
                  <div>
                    <InputField
                      label="Date"
                      variant="secondary"
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
                  </div>

                  <div>
                    <InputField
                      label="Time"
                      variant="secondary"
                      touched={touched.interviewTime}
                      error={errors.interviewTime}
                    >
                      <Select
                        value={values.interviewTime}
                        onValueChange={handleTimeSelect}
                      >
                        {timezone} | Click to Change
                      </span>
                      <ChevronRight className="w-4 h-4 flex-shrink-0" />
                    </div>
                  </div>
                </div>

                  {/* Buttons - Responsive */}
                  <div className="p-2 sm:p-4 md:p-6">
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Button
                        type="submit"
                        className={`${sendInviteButtonClass} w-full sm:w-auto`}
                      >
                        Send Invite
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        className="text-[#F5722E] border-[#F5722E] hover:text-white hover:bg-[#F5722E] text-[16px] w-full sm:w-auto"
                        onClick={handleModalClose}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-5 select-none">
                    <span
                      className="text-xs sm:text-sm text-[#263238] cursor-pointer"
                      onClick={() => {
                        navigate("/dashboard/account-settings/general");
                      }}
                    >
                      {timezone} | Click to Change
                    </span>
                    <ChevronRight className="w-4 h-4 flex-shrink-0" />
                  </div>
                </div>

                {/* Buttons - Responsive */}
                <div className="p-2 sm:p-4 md:p-6">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button
                      type="submit"
                      className={`${sendInviteButtonClass} w-full sm:w-auto`}
                      disabled={!isValid || isSubmitting}
                    >
                      Send Invite
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="text-[#F5722E] border-[#F5722E] hover:text-white hover:bg-[#F5722E] text-[16px] w-full sm:w-auto"
                      onClick={handleModalClose}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
                <div className="h-16 md:h-0"></div>
              </form>
            </DialogHeader>
          </div>
        </DialogContent>
      </Dialog>

      {/* DatePicker - rendered outside the modal structure */}
      {renderDatePicker()}

      <InvitationSentModal
        isOpen={showSuccessModal}
        onClose={() => {
          setShowSuccessModal(false);
          handleModalClose();
        }}
      />
    </>
  );
};

export { ScheduleInterviewModal };
