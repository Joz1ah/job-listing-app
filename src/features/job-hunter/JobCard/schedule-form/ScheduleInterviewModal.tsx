import React, { useState, useEffect } from "react";
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
import { InvitationSentModal } from "features/job-hunter";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useErrorModal } from "contexts/ErrorModalContext/ErrorModalContext";

interface ScheduleInterviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobTitle: string;
  coreSkills: string[];
  certificate?: string[];
  company: string;
  location: string;
}

interface FormValues {
  interviewDate: Date | undefined;
  interviewTime: string | undefined;
}

const validationSchema = Yup.object().shape({
  interviewDate: Yup.date()
    .required("Please select a date")
    .min(new Date(), "Cannot select a past date")
    .max(
      new Date(new Date().setMonth(new Date().getMonth() + 2)),
      "Cannot select a date more than 2 months"
    )
    .typeError("Please select a valid date"),
  interviewTime: Yup.string()
    .required("Please select a time")
    .typeError("Please select a valid time"),
});

const ScheduleInterviewModal: React.FC<ScheduleInterviewModalProps> = ({
  isOpen,
  onClose,
  jobTitle,
  coreSkills,
  certificate = [],
  company,
  location,
}) => {
  const [isDatePickerOpen, setIsDatePickerOpen] = useState<boolean>(false);
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
  const { showError } = useErrorModal();

  const formik = useFormik<FormValues>({
    initialValues: {
      interviewDate: undefined,
      interviewTime: undefined,
    },
    validationSchema,
    validateOnMount: true,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        // Add your invite sending logic here
        console.log("Form submitted with values:", values);
        setShowSuccessModal(true);
      } catch (error) {
        showError(
          'Interview Scheduling Failed',
          'Unable to schedule the interview. Please try again.'
        );
        console.error("Error sending invite:", error);
      } finally {
        setSubmitting(false);
      }
    },
  });

  const { values, touched, errors, handleSubmit, setFieldValue, resetForm, isValid } = formik;

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
    setIsDatePickerOpen(false);
  };

  const handleTimeSelect = (time: string): void => {
    setFieldValue("interviewTime", time);
  };

  // Button class based on validation state
  const sendInviteButtonClass = isValid
    ? "bg-[#F5722E] hover:bg-[#F5722E]/70 text-white text-[16px] font-normal"
    : "bg-[#AEADAD] hover:bg-[#AEADAD]/70 text-white text-[16px] font-normal";

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleModalClose}>
        <DialogContent className="w-full max-w-3xl h-[530px] p-0 flex flex-col">
          <div className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto">
              <DialogHeader className="p-4 md:p-6">
                {/* Header Title */}
                <DialogTitle className="text-center mb-8 mt-6">
                  Schedule an interview for the{" "}
                  <span className="text-[#F5722E]">({jobTitle})</span> position
                </DialogTitle>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name and Skills Grid */}
                  <div className="grid grid-cols-2">
                    {/* Left Column - Name and Location */}
                    <div>
                      <span className="text-sm block mb-2">{company}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-[#F5722E]">*</span>
                        <span className="text-sm text-black">
                          Based in {location}
                        </span>
                      </div>
                    </div>

                    {/* Right Column - Skills and Certificate */}
                    <div className="space-y-4">
                      <div>
                        <span className="text-sm block mb-2">Core Skills:</span>
                        <div className="flex flex-wrap gap-1.5">
                          {coreSkills.map((skill, index) => (
                            <span
                              key={index}
                              className={`${
                                index % 2 === 0
                                  ? "bg-[#184E77]"
                                  : "bg-[#168AAD]"
                              } text-white px-2 py-0.5 text-xs rounded`}
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <span className="text-sm block mb-2">Certificates:</span>
                        <div className="flex flex-wrap gap-1.5">
                          {certificate && certificate.length > 0 ? (
                            certificate.map((cert, index) => (
                              <span
                                key={index}
                                className="text-[#F5722E] border border-[#F5722E] px-2 py-0.5 text-xs rounded"
                              >
                                {cert}
                              </span>
                            ))
                          ) : (
                            <span className="text-[#717171] text-xs">
                              None required
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Date and Time Selection */}
                  <div className="grid grid-cols-2 gap-8 mt-8">
                    <div>
                      <InputField
                        label="Date"
                        variant="secondary"
                        error={errors.interviewDate}
                        touched={touched.interviewDate}
                      >
                        <div className="relative">
                          <div
                            className="w-full border-2 rounded-[10px] bg-transparent h-[56px] px-3 flex items-center cursor-pointer border-[#263238] text-sm"
                            onClick={() => setIsDatePickerOpen(true)}
                          >
                            {values.interviewDate
                              ? values.interviewDate.toLocaleDateString()
                              : "Select a date"}
                          </div>
                          {isDatePickerOpen && (
                            <div className="fixed z-50 left-[40%] md:left-[26%] -translate-x-1/2">
                              <DatePicker
                                isOpen={isDatePickerOpen}
                                onClose={() => setIsDatePickerOpen(false)}
                                onDateSelect={handleDateSelect}
                                initialDate={values.interviewDate}
                                variant="secondary"
                              />
                            </div>
                          )}
                        </div>
                      </InputField>
                    </div>

                    <div>
                      <InputField
                        label="Time"
                        variant="secondary"
                        error={errors.interviewTime}
                        touched={touched.interviewTime}
                      >
                        <Select
                          value={values.interviewTime}
                          onValueChange={handleTimeSelect}
                        >
                          <SelectTrigger className="w-full border-2 rounded-[10px] bg-transparent h-[56px] border-[#263238]">
                            <SelectValue placeholder="Select a time" />
                          </SelectTrigger>
                          <SelectContent className="bg-[#F5F5F7] p-0 [&>*]:p-0 border-none rounded-none max-h-[200px]">
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

                  {/* Meeting Link */}
                  <div className="flex items-center gap-2 mt-4">
                    <img src={gmeet} alt="Meet icon" className="w-4 h-4" />
                    <span className="text-sm text-gray-500">
                      https://meet.google.com/xxx-xxxx-xxx
                    </span>
                  </div>

                  {/* Fixed Button Area */}
                  <div className="p-4 md:p-6">
                    <div className="flex gap-2">
                      <Button
                        type="submit"
                        className={sendInviteButtonClass}
                      >
                        Send Invite
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        className="text-[#F5722E] border-[#F5722E] hover:text-white hover:bg-[#F5722E] text-[16px]"
                        onClick={handleModalClose}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </form>
              </DialogHeader>
            </div>
          </div>
        </DialogContent>
      </Dialog>

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