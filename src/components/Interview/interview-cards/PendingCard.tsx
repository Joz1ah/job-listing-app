import { FC, useState } from "react";
import {
  MapPin,
  Bookmark,
  X,
  Check,
  CircleX,
  LoaderCircle,
} from "lucide-react";
import { Card, CardHeader, CardContent, CardFooter } from "components";
import { Button } from "components";
import { RescheduleModal } from "../modals/RescheduleModal";
import { useNavigate } from "react-router-dom";
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
import { CandidatePreviewModal } from "../modals/CandidatePreviewModal";
import { JobInterviewPreviewModal } from "../modals/JobInterviewPreviewModal";
import { Interview } from "mockData/employer-interviews-data";

import gmeet from "images/google-meet.svg?url";

interface AcceptData {
  confirmed: boolean;
  interviewId?: string;
}

interface DeclineData {
  reason: string;
  message: string;
  interviewId?: string;
}

interface RescheduleData {
  date: string;
  time: string;
  interviewId?: string;
}

interface DeclineReason {
  value: string;
  label: string;
}

const employerDeclineReasons: DeclineReason[] = [
  { value: "position_filled", label: "Position Filled by Another Candidate" },
  { value: "found_candidate", label: "Found a Candidate Through Another Source" },
  { value: "changed_job", label: "Changed Job Requirements or Hiring Priorities" },
  { value: "role_misalignment", label: "Role Misalignment with Applicant's Qualifications" },
  { value: "scheduling_constraints", label: "Unable to Proceed Due to Scheduling Constraints" },
];

const jobHunterDeclineReasons: DeclineReason[] = [
  { value: "role_misalignment", label: "Role Misalignment" },
  { value: "salary_expectations", label: "Salary Expectations" },
  { value: "not_actively_seeking", label: "Not Actively Seeking" },
  { value: "change_career", label: "Change in Career Direction" },
  { value: "already_accepted", label: "Already Accepted Another Job" },
  { value: "other_reason", label: "Important Other Personal Reasons" },
];

interface PendingCardProps {
  interview: Interview;
  variant: "employer" | "job-hunter";
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
  variant,
  onAccept,
  onReschedule,
  onDecline,
}) => {
  const [activeModal, setActiveModal] = useState<
    "accept" | "decline" | "reschedule" | null
  >(null);
  const [modalView, setModalView] = useState<"accept" | "decline" | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isAccepted, setIsAccepted] = useState(false);
  const [isDeclined, setIsDeclined] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const formik = useFormik<FormValues>({
    initialValues: {
      reason: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      setIsLoading(true);
      onDecline?.({
        reason: values.reason,
        interviewId: interview.id,
      } as DeclineData);

      await new Promise((resolve) => setTimeout(resolve, 2000));
      setIsLoading(false);
      setIsDeclined(true);

      setTimeout(() => {
        navigate(
          variant === "employer"
            ? "/dashboard/interviews/declined"
            : "/dashboard/interviews/declined",
        );
      }, 1000);
    },
  });

  const handleAccept = async () => {
    setIsLoading(true);
    onAccept?.({ confirmed: true, interviewId: interview.id } as AcceptData);

    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsLoading(false);
    setIsAccepted(true);

    setTimeout(() => {
      navigate(
        variant === "employer"
          ? "/dashboard/interviews/accepted"
          : "/dashboard/interviews/accepted",
      );
    }, 1000);
  };

  const { values, touched, errors, handleSubmit, setFieldValue, resetForm } =
    formik;

  const handleClose = () => {
    setModalView(null);
    resetForm();
  };

  const renderHeaderTitle = () => {
    if (variant === "employer") {
      return (
        <>
          <h3
            className="text-[14px] font-semibold pr-8 cursor-pointer hover:underline text-[#263238]"
            onClick={() => setIsPreviewOpen(true)}
          >
            {interview.candidate}
          </h3>
          <p className="text-[13px] text-[#263238] underline">
            {interview.position}
          </p>
        </>
      );
    }
    return (
      <>
        <h3
          className="text-[14px] font-semibold pr-8 cursor-pointer hover:underline text-[#263238]"
          onClick={() => setIsPreviewOpen(true)}
        >
          {interview.position}
        </h3>
        <p className="text-[13px] text-[#263238] underline">
          {interview.company}
        </p>
      </>
    );
  };

  const StandardHeader = () => (
    <CardHeader className="flex flex-col justify-between items-start pb-0">
      <div className="flex flex-row -mt-4 justify-between w-full">
        <div className="h-[20px]">
          {interview.isNew && (
            <span className="absolute text-[13px] text-[#F5722E] font-bold italic">
              ★ NEW
            </span>
          )}
        </div>
        <div className="flex flex-col items-end relative">
          <span className="text-[12px] font-light text-[#717171] -mr-2">
            Received {interview.receivedTime}
          </span>
          <div className="absolute top-6 -right-2">
            <Bookmark className="w-6 h-6 text-[#F5722E]" />
          </div>
        </div>
      </div>
      <div className="w-full relative mt-2">
        {renderHeaderTitle()}
        <div className="flex flex-row items-center">
          <MapPin size={14} className="text-[#F5722E]" />
          <p className="text-[13px] font-light mt-0 ml-2 text-[#263238]">
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
      <span className="w-full flex justify-center text-xs md:text-[15px] text-[#F5722E] absolute left-1/2 -translate-x-1/2 top-0">
        You are accepting the interview invitation.
      </span>
      <div className="w-full mt-2">
        <div className="flex flex-row justify-between relative">
          <h4 className="text-[14px] font-semibold pt-1 text-[#263238]">
            {variant === "employer" ? interview.candidate : interview.position}
          </h4>
          <span className="text-[12px] font-light text-[#717171] -mr-2">
            Received {interview.receivedTime}
          </span>
        </div>
        <p className="text-[13px] text-[#263238] underline">
          {variant === "employer" ? interview.position : interview.company}
        </p>
        <div className="flex flex-row items-center">
          <MapPin size={14} className="text-[#F5722E]" />
          <p className="text-[13px] font-light mt-0 ml-2 text-[#263238]">
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
      <h3 className="w-full flex justify-center text-xs md:text-[15px] text-[#E53835] absolute left-1/2 -translate-x-1/2 top-0">
        You are declining the interview below:
      </h3>
      <div className="w-full mt-2">
        <div className="flex flex-row justify-between relative">
          <h4 className="text-[14px] font-semibold pt-1 text-[#263238]">
            {variant === "employer" ? interview.candidate : interview.position}
          </h4>
          <span className="text-[12px] font-light text-[#717171] -mr-2">
            Received {interview.receivedTime}
          </span>
        </div>
        <p className="text-[13px] text-[#263238] underline">
          {variant === "employer" ? interview.position : interview.company}
        </p>
        <div className="flex flex-row items-center">
          <MapPin size={14} className="text-[#F5722E]" />
          <p className="text-[13px] font-light mt-0 ml-2 text-[#263238]">
            Based in {interview.location}
          </p>
        </div>
      </div>
    </CardHeader>
  );

  const StandardContent = () => (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-1">
        <span className="text-[13px] min-w-[40px] text-[#263238]">Date:</span>
        <span className="text-[13px] font-medium px-1 rounded-[2px] bg-[#184E77] text-white w-[135px] h-[17px] flex justify-center items-center">
          {interview.date}
        </span>
      </div>
      <div className="flex items-center gap-1">
        <span className="text-[13px] min-w-[40px] text-[#263238]">Time:</span>
        <span className="text-[13px] font-medium px-1 rounded-[2px] bg-[#168AAD] text-white w-[135px] h-[17px] flex justify-center items-center">
          {interview.time}
        </span>
      </div>
      <div className="flex items-center gap-1">
        <img src={gmeet} alt="gmeet" />
        <span className="text-xs text-[#F5722E] font-light">
          via Google meet
        </span>
      </div>
    </div>
  );

  const DecliningContent = () => (
    <div className="flex flex-col gap-1 pb-0">
      <div className="flex items-center gap-1">
        <span className="text-[13px] min-w-[40px] text-[#263238]">Date:</span>
        <span className="text-[13px] font-medium px-1 rounded-[2px] bg-[#184E77] text-white w-[135px] h-[17px] flex justify-center items-center">
          {interview.date}
        </span>
      </div>
      <div className="flex items-center gap-1">
        <span className="text-[13px] min-w-[40px] text-[#263238]">Time:</span>
        <span className="text-[13px] font-medium px-1 rounded-[2px] bg-[#168AAD] text-white w-[135px] h-[17px] flex justify-center items-center">
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
            <SelectTrigger className="w-full border-2 rounded-[10px] bg-transparent h-[40px] border-[#263238]">
              <SelectValue placeholder="Select A Reason" />
            </SelectTrigger>
            <SelectContent className="bg-[#F5F5F7] p-0 [&>*]:px-0 border-none rounded-none max-h-[200px] truncate">
              <SelectGroup>
                {(variant === "employer" ? employerDeclineReasons : jobHunterDeclineReasons).map((reason) => (
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
    <CardFooter className="flex flex-row justify-center pt-2 space-x-4 md:space-x-6">
      <Button
        onClick={() => setModalView("accept")}
        className="text-[13px] font-semibold w-[100px] h-[32px] bg-[#F5722E] hover:bg-[#F5722E]/90 text-white"
      >
        Accept
      </Button>
      <Button
        onClick={() => setActiveModal("reschedule")}
        variant="outline"
        className="text-[13px] font-semibold w-[100px] h-[32px] text-[#F5722E] border-2 border-[#F5722E] hover:bg-[#F5722E] hover:text-white"
      >
        Reschedule
      </Button>
      <Button
        onClick={() => setModalView("decline")}
        variant="outline"
        className="text-[13px] font-semibold w-[100px] h-[32px] text-[#F5722E] border-2 border-[#F5722E] hover:bg-[#F5722E] hover:text-white"
      >
        Decline
      </Button>
    </CardFooter>
  );

  const AcceptingFooter = () => (
    <CardFooter className="flex flex-row justify-start pt-2 space-x-4">
      {isLoading ? (
        <div className="flex items-center gap-2 pt-2 text-[#F5722E]">
          <LoaderCircle className="w-5 h-5 animate-spin" />
          <span className="text-sm font-medium">Accepting interview...</span>
        </div>
      ) : isAccepted ? (
        <div className="flex items-center gap-2 pt-2 text-[#4BAF66]">
          <Check className="w-5 h-5" />
          <span className="text-sm font-medium">
            You've successfully accepted the interview!
          </span>
        </div>
      ) : (
        <Button
          onClick={handleAccept}
          className="text-[13px] font-semibold w-[100px] h-[32px] bg-[#F5722E] hover:bg-[#F5722E]/90 text-white"
        >
          Accept
        </Button>
      )}
    </CardFooter>
  );

  const DecliningFooter = () => (
    <CardFooter className="flex flex-row justify-start space-x-4">
      {isLoading ? (
        <div className="flex items-center gap-2 text-[#E53835]">
          <LoaderCircle className="w-5 h-5 animate-spin" />
          <span className="text-sm font-medium">Declining interview...</span>
        </div>
      ) : isDeclined ? (
        <div className="flex items-center gap-2 text-[#E53835]">
          <CircleX className="w-5 h-5 text-white fill-[#E53835]" />
          <span className="text-sm font-medium">
            You've successfully declined this interview!
          </span>
        </div>
      ) : (
        <Button
          onClick={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          className="text-[13px] font-semibold w-[100px] h-[32px] bg-[#E53835] hover:bg-[#E53835] text-white disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Decline
        </Button>
      )}
    </CardFooter>
  );

  const PreviewModal =
    variant === "employer" ? CandidatePreviewModal : JobInterviewPreviewModal;

  return (
    <>
      {/* Overlay */}
      {modalView && (
        <div className="fixed inset-0 bg-black/50 z-40" onClick={handleClose} />
      )}

      {/* Card */}
      <Card
        className={`bg-[#FFFFFF] border-none w-full md:w-[436px] h-auto md:h-[275px] relative ${
          modalView ? "z-50" : ""
        }`}
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

      {/* Modals */}
      <RescheduleModal
        isOpen={activeModal === "reschedule"}
        onClose={() => setActiveModal(null)}
        interview={interview}
        onReschedule={(data) => {
          onReschedule?.(data);
        }}
        variant={variant === "employer" ? "employer" : "job-hunter"}
      />

      <PreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        interview={interview}
      />
    </>
  );
};

export { PendingCard };
