import { FC, useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "components";
import { Button } from "components";
import { MapPin } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "components";
import { BaseModalProps, RescheduleData } from "features/employer/types";
import { useFormik } from "formik";
import * as Yup from "yup";
import { DatePicker } from "components";
import gmeet from "images/google-meet.svg?url";
import { InputField } from "components";

interface RescheduleReason {
  id: string;
  label: string;
}

const rescheduleReasons: RescheduleReason[] = [
  {
    id: "health_issues",
    label: "Health Issues",
  },
  {
    id: "schedule_conflicts",
    label: "Schedule Conflicts",
  },
  {
    id: "personal_family_emergency",
    label: "Personal/Family Emergency",
  },
  {
    id: "preparation",
    label: "Unforseen Circumstances (e.g.outage/weather/travelling)",
  }
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
  reason: Yup.string().required("Please select a reason"),
  interviewDate: Yup.date()
    .required("Please select a date")
    .min(new Date(), "Cannot select a past date")
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
}) => {
  const [isDatePickerOpen, setIsDatePickerOpen] = useState<boolean>(false);

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
    onSubmit: (values) => {
      onReschedule({
        date: values.interviewDate?.toISOString() ?? "",
        time: values.interviewTime ?? "",
        interviewId: interview.id,
      });
      onClose();
    },
  });

  const { values, touched, errors, handleSubmit, setFieldValue, resetForm } =
    formik;

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      resetForm();
      setIsDatePickerOpen(false);
    }
  }, [isOpen, resetForm]);

  const handleDateSelect = (selectedDate: Date): void => {
    setFieldValue("interviewDate", selectedDate);
    setIsDatePickerOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[700px] w-full md:w-[700px] h-[550px] p-0 bg-white rounded-lg">
        <div className="flex flex-col h-full">
          <DialogHeader className="p-6 pb-4 text-left">
            <DialogTitle className="sr-only">Reschedule Interview</DialogTitle>
            <div className="text-center">
              <p className="text-sm font-medium text-[#FF6B35]">
                You are requesting to reschedule the interview below
              </p>
            </div>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="flex flex-col flex-1">
            <div className="px-6 flex-1 overflow-auto">
              {/* Job Details */}
              <div className="mb-4">
                <div className="flex flex-wrap justify-between items-start gap-2">
                  <h3 className="text-sm font-medium break-words">
                    {interview.name}
                  </h3>
                  <span className="text-xs text-gray-500 font-light">
                    Received {interview.receivedTime}
                  </span>
                </div>
                <p className="text-sm text-black underline cursor-pointer break-words">
                  {interview.position}
                </p>
                <div className="flex items-center mt-1">
                  <MapPin className="text-orange-500" size={12} />
                  <p className="text-xs text-gray-600 break-words">
                    Based in {interview.location}
                  </p>
                </div>
              </div>

              {/* Time Details */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs min-w-[40px]">Date:</span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-sm bg-[#184E77] text-white min-w-[135px] text-center">
                    {interview.date}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs min-w-[40px]">Time:</span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-sm bg-[#168AAD] text-white min-w-[135px] text-center">
                    {interview.time}
                  </span>
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <img src={gmeet} alt="Google Meet" className="h-4 w-4" />
                  <span className="text-xs text-orange-500 font-light">
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
                      onValueChange={(value) => setFieldValue("reason", value)}
                    >
                      <SelectTrigger className="w-full border-2 rounded bg-transparent h-[56px] border-black">
                        <SelectValue placeholder="Select A Reason" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#F5F5F7] p-0 [&>*]:p-0 border-none rounded-none max-h-[200px]">
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

                <div className="grid grid-cols-2 gap-8">
                  <InputField
                    label="Date"
                    variant="secondary"
                    size="sm"
                    error={errors.interviewDate}
                    touched={touched.interviewDate}
                  >
                    <div className="relative">
                      <div
                        className="-full border-2 rounded bg-transparent h-[56px] px-3 flex items-center cursor-pointer border-black text-sm"
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
                      <SelectTrigger className="w-full border-2 rounded bg-transparent h-[56px] border-black">
                        <SelectValue placeholder="Select a Time" />
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
            </div>

            {/* Footer */}
            <div className="p-6 mt-auto">
              <div className="flex flex-wrap gap-3 justify-start">
                <Button
                  type="submit"
                  className="text-xs font-semibold h-[32px] px-6 bg-[#FF6B35] hover:bg-[#ff855b] text-white"
                >
                  Reschedule
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {}}
                  className="border-2 text-xs font-semibold h-[32px] px-6 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white"
                >
                  View Calendar
                </Button>
              </div>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export { RescheduleModal }
