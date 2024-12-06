import { FC, useState } from "react";
import { MapPin, Bookmark, X } from "lucide-react";
import { Card, CardHeader, CardContent, CardFooter } from "components";
import { Button } from "components";
import { RescheduleModal } from "features/job-hunter";
import {
  Interview,
  AcceptData,
  DeclineData,
  RescheduleData,
} from "features/job-hunter/types";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "components";

import { InputField } from "components";
import { useFormik } from "formik";
import * as Yup from "yup";

import gmeet from "images/google-meet.svg?url";

interface DeclineReason {
  value: string;
  label: string;
}

const declineReasons: DeclineReason[] = [
  { value: "role_misalignment", label: "Role Misalignment" },
  { value: "salary_expectations", label: "Salary Expectations" },
  { value: "not_actively_seeking", label: "Not Actively Seeking" },
  { value: "change_career", label: "Change in Career Direction" },
  { value: "already_accepted", label: "Already Accepted Another Job" },
  { value: "other_reason", label: "Important Other Personal Reasons" },
];

interface PendingCardProps {
  interview: Interview;
  onAccept?: (data: AcceptData) => void;
  onReschedule?: (data: RescheduleData) => void;
  onDecline?: (data: DeclineData) => void;
  onBookmark?: () => void;
  value: string;
  onValueChange: (value: string) => void;
}

interface FormValues {
  reason: string;
}

const validationSchema = Yup.object().shape({
  reason: Yup.string().required("Please select a reason for declining"),
});

const PendingCard: FC<PendingCardProps> = ({
  interview,
  onAccept,
  onReschedule,
  onDecline,
}) => {
  const [activeModal, setActiveModal] = useState<
    "accept" | "decline" | "reschedule" | null
  >(null);
  const [modalView, setModalView] = useState<"accept" | "decline" | null>(null);

  const formik = useFormik<FormValues>({
    initialValues: {
      reason: "",
    },
    validationSchema,
    onSubmit: (values) => {
      onDecline?.({ reason: values.reason } as DeclineData);
      handleClose();
    },
  });

  const { values, touched, errors, handleSubmit, setFieldValue, resetForm } = formik;

  const handleClose = () => {
    setModalView(null);
    resetForm();
  };

  const StandardHeader = () => (
    <CardHeader className="flex flex-col justify-between items-start pb-0">
      <div className="flex flex-row -mt-4 justify-between w-full">
        <div className="h-[20px]">
          {interview.isNew && (
            <span className="absolute text-[13px] text-orange-500 font-semibold italic">
              ★ NEW
            </span>
          )}
        </div>
        <div className="flex flex-col items-end relative">
          <span className="text-[12px] font-light text-gray-400 -mr-2">
            Received {interview.receivedTime}
          </span>
          <div className="absolute top-6 -right-2">
            <Bookmark className="w-6 h-6 text-orange-500" />
          </div>
        </div>
      </div>
      <div className="w-full relative mt-2">
        <h3 className="text-[14px] font-semibold pr-8">{interview.position}</h3>
        <p className="text-[13px] text-black underline">{interview.company}</p>
        <div className="flex flex-row items-center">
          <MapPin size={14} className="text-orange-500" />
          <p className="text-[13px] font-light mt-0 ml-2">
            Based in {interview.location}
          </p>
        </div>
      </div>
    </CardHeader>
  );

  const AcceptingHeader = () => (
    <CardHeader className="flex flex-col pb-0 relative">
      <button
        onClick={handleClose}
        className="absolute right-0 top-0 p-1 hover:bg-gray-100 rounded-full z-50"
      >
        <X size={18} />
      </button>
      <span className="w-full flex justify-center text-[15px] text-orange-500 absolute left-1/2 -translate-x-1/2 top-0">
        You are accepting the interview invitation.
      </span>
      <div className="w-full mt-2">
        <div className="flex flex-row justify-between relative">
          <h4 className="text-[14px] font-semibold pt-1">
            {interview.position}
          </h4>
          <span className="text-[12px] font-light text-gray-400 -mr-2">
            Received {interview.receivedTime}
          </span>
        </div>
        <p className="text-[13px] text-black underline">{interview.company}</p>
        <div className="flex flex-row items-center">
          <MapPin size={14} className="text-orange-500" />
          <p className="text-[13px] font-light mt-0 ml-2">
            Based in {interview.location}
          </p>
        </div>
      </div>
    </CardHeader>
  );

  const DecliningHeader = () => (
    <CardHeader className="flex flex-col pb-0 relative">
      <button
        onClick={handleClose}
        className="absolute right-0 top-0 p-1 hover:bg-gray-100 rounded-full z-50"
      >
        <X size={18} />
      </button>
      <h3 className="w-full flex justify-center text-[15px] text-red-500 absolute left-1/2 -translate-x-1/2 top-0">
        You are declining the interview below:
      </h3>
      <div className="w-full mt-2">
        <div className="flex flex-row justify-between relative">
          <h4 className="text-[14px] font-semibold pt-1">
            {interview.position}
          </h4>
          <span className="text-[12px] font-light text-gray-400 -mr-2">
            Received {interview.receivedTime}
          </span>
        </div>
        <p className="text-[13px] text-black underline">{interview.company}</p>
        <div className="flex flex-row items-center">
          <MapPin size={14} className="text-orange-500" />
          <p className="text-[13px] font-light mt-0 ml-2">
            Based in {interview.location}
          </p>
        </div>
      </div>
    </CardHeader>
  );

  const StandardContent = () => (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-1">
        <span className="text-[13px] min-w-[40px]">Date:</span>
        <span className="text-[13px] font-semibold px-1 rounded-[2px] bg-[#184E77] text-white w-[135px] h-[17px] flex justify-center">
          {interview.date}
        </span>
      </div>
      <div className="flex items-center gap-1">
        <span className="text-[13px] min-w-[40px]">Time:</span>
        <span className="text-[13px] font-semibold px-1 rounded-[2px] bg-[#168AAD] text-white w-[135px] h-[17px] flex justify-center">
          {interview.time}
        </span>
      </div>
      <div className="flex items-center gap-1">
        <img src={gmeet} alt="gmeet" />
        <span className="text-xs text-orange-500 font-light">
          via Google meet
        </span>
      </div>
    </div>
  );

  const DecliningContent = () => (
    <div className="flex flex-col gap-1 pb-0">
      <div className="flex items-center gap-1">
        <span className="text-[13px] min-w-[40px]">Date:</span>
        <span className="text-[13px] font-semibold px-1 rounded-[2px] bg-[#184E77] text-white w-[135px] h-[17px] flex justify-center">
          {interview.date}
        </span>
      </div>
      <div className="flex items-center gap-1">
        <span className="text-[13px] min-w-[40px]">Time:</span>
        <span className="text-[13px] font-semibold px-1 rounded-[2px] bg-[#168AAD] text-white w-[135px] h-[17px] flex justify-center">
          {interview.time}
        </span>
      </div>
      <form onSubmit={handleSubmit}>
        <InputField 
          label="Decline Reason" 
          variant="secondary" 
          size="sm"
          error={errors.reason}
          touched={touched.reason}
        >
          <Select
            value={values.reason}
            onValueChange={(value) => setFieldValue("reason", value)}
          >
            <SelectTrigger 
              className={`w-full border-2 rounded bg-transparent h-[40px] ${
                touched.reason && errors.reason ? 'border-red-500' : 'border-black'
              }`}
            >
              <SelectValue placeholder="Select A Reason" />
            </SelectTrigger>
            <SelectContent className="bg-[#F5F5F7] p-0 [&>*]:p-0 border-none rounded-none max-h-[200px]">
              <SelectGroup>
                {declineReasons.map((reason) => (
                  <SelectItem
                    key={reason.value}
                    value={reason.value}
                    className="rounded-none justify-start pl-3 h-[40px]"
                  >
                    {reason.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </InputField>
      </form>
    </div>
  );

  const StandardFooter = () => (
    <CardFooter className="flex flex-row justify-center pt-2 space-x-6">
      <Button
        onClick={() => setModalView("accept")}
        className="text-[13px] font-semibold w-[100px] h-[32px] bg-orange-500 hover:bg-orange-600 text-white"
      >
        Accept
      </Button>
      <Button
        onClick={() => setActiveModal("reschedule")}
        variant="outline"
        className="text-[13px] font-semibold w-[100px] h-[32px] text-orange-500 border-2 border-orange-500 hover:bg-orange-500 hover:text-white"
      >
        Reschedule
      </Button>
      <Button
        onClick={() => setModalView("decline")}
        variant="outline"
        className="text-[13px] font-semibold w-[100px] h-[32px] text-orange-500 border-2 border-orange-500 hover:bg-orange-500 hover:text-white"
      >
        Decline
      </Button>
    </CardFooter>
  );

  const AcceptingFooter = () => (
    <CardFooter className="flex flex-row justify-start pt-2 space-x-4">
      <Button
        onClick={() => {
          onAccept?.({} as AcceptData);
          handleClose();
        }}
        className="text-[13px] font-semibold w-[100px] h-[32px] bg-orange-500 hover:bg-orange-600 text-white"
      >
        Accept
      </Button>
      <Button
        variant="outline"
        className="border-2 text-[13px] font-semibold w-[130px] h-[32px] border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white px-1"
        onClick={() => window.open("https://calendar.google.com")}
      >
        View Calendar
      </Button>
    </CardFooter>
  );

  const DecliningFooter = () => (
    <CardFooter className="flex flex-row justify-start pt-2 space-x-4">
      <Button
        onClick={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        className="text-[13px] font-semibold w-[100px] h-[32px] bg-red-500 hover:bg-red-600 text-white disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        Decline
      </Button>
      <Button
        variant="outline"
        className="border-2 text-[13px] font-semibold w-[130px] h-[32px] border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white px-1"
        onClick={() => window.open("https://calendar.google.com")}
      >
        View Calendar
      </Button>
    </CardFooter>
  );

  return (
    <>
      {/* Overlay */}
      {modalView && (
        <div className="fixed inset-0 bg-black/50 z-40" onClick={handleClose} />
      )}

      {/* Card */}
      <Card
        className={`bg-[#FFFFFF] border-none w-full md:w-[436px] h-auto md:h-[275px] relative ${modalView ? "z-50" : ""}`}
      >
        {modalView === "accept" ? (
          <AcceptingHeader />
        ) : modalView === "decline" ? (
          <DecliningHeader />
        ) : (
          <StandardHeader />
        )}

        <CardContent className="pt-1">
          {modalView === "decline" ? <DecliningContent /> : <StandardContent />}
        </CardContent>

        {modalView === "accept" ? (
          <AcceptingFooter />
        ) : modalView === "decline" ? (
          <DecliningFooter />
        ) : (
          <StandardFooter />
        )}
      </Card>

      {/* Reschedule Modal */}
      <RescheduleModal
        isOpen={activeModal === "reschedule"}
        onClose={() => setActiveModal(null)}
        interview={interview}
        onReschedule={(data) => {
          onReschedule?.(data);
          setActiveModal(null);
        }}
      />
    </>
  );
};

export { PendingCard };
