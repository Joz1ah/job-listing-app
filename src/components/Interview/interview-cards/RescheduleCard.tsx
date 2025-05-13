import { FC, useState } from "react";
import {
  MapPin,
  Check,
  X,
  RefreshCcw,
  Clock,
  Bookmark,
  LoaderCircle,
} from "lucide-react";
import { Card, CardHeader, CardContent } from "components";
import { Button } from "components";
//import { Tooltip } from "components";
import { CandidatePreviewModal } from "../modals/CandidatePreviewModal";
import { JobInterviewPreviewModal } from "../modals/JobInterviewPreviewModal";
import { RescheduleModal } from "../modals/RescheduleModal";
import { useNavigate } from "react-router-dom";
import { EmployerInterviewCalendarModal } from "../modals/EmployerInterviewCalendarModal";
import { HunterInterviewCalendarModal } from "../modals/HunterInterviewCalendarModal";
import { Interview } from "contexts/Interviews/types";
import linkedin_icon from "assets/linkedin.svg?url";

interface LinkedInLinkProps {
  linkedInUrl: string;
}

const LinkedInLink: FC<LinkedInLinkProps> = ({ linkedInUrl }) => {
  const handleLinkedInClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click when clicking on LinkedIn link

    // Add protocol if missing
    let url = linkedInUrl;
    if (!url.startsWith("http")) {
      url = "https://" + url;
    }

    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div
      className="flex items-center gap-1 text-[13px] font-light cursor-pointer text-[#263238] underline"
      onClick={handleLinkedInClick}
    >
      <img src={linkedin_icon} alt="LinkedIn" className="w-4 h-4" />
      <span>LinkedIn Profile</span>
    </div>
  );
};

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
  reason: string;
}

interface RescheduleCardProps {
  interview: Interview;
  variant: "employer" | "job-hunter";
  onAccept?: (data: AcceptData) => void;
  onDecline?: (data: DeclineData) => void;
  onReschedule?: (data: RescheduleData) => void;
}

const RescheduleCard: FC<RescheduleCardProps> = ({
  interview,
  variant,
  onAccept,
  onDecline,
  onReschedule,
}) => {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isAccepted, setIsAccepted] = useState(false);
  const [isDeclined, setIsDeclined] = useState(false);
  const [activeModal, setActiveModal] = useState<"reschedule" | null>(null);
  const [isCalendarModalOpen, setIsCalendarModalOpen] =
    useState<boolean>(false);
  const navigate = useNavigate();

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

  const handleDecline = async () => {
    setIsLoading(true);
    onDecline?.({
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
  };

  const handleOpenReschedule = (event: React.MouseEvent) => {
    event.preventDefault();
    setActiveModal("reschedule");
  };

  const renderTitle = () => {
    if (variant === "employer") {
      return (
        <>
          <h3
            className="text-[14px] font-semibold cursor-pointer hover:text-[#F5722E] text-[#263238]"
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
          className="text-[14px] font-semibold cursor-pointer hover:text-[#F5722E] text-[#263238]"
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

  const PreviewModal =
    variant === "employer" ? CandidatePreviewModal : JobInterviewPreviewModal;
  const InterviewCalendarModal =
    variant === "employer"
      ? EmployerInterviewCalendarModal
      : HunterInterviewCalendarModal;

  return (
    <>
      <Card className="bg-white border-none w-full sm:min-w-[436px] sm:max-w-[436px] max-w-[308px] h-[395px] sm:h-[275px] relative">
        {interview.isNew && (
          <span className="absolute top-2 left-4 text-[13px] text-[#F5722E] font-bold italic">
            ★ NEW
          </span>
        )}

        <CardHeader className="flex flex-col justify-between items-start pb-0 pt-8">
          <div className="flex flex-col gap-1">
            <span className="bg-orange-100 text-[#F5722E] outline outline-1 px-3 py-1 rounded text-xs flex items-center justify-center gap-1 italic w-[117px] h-[32px]">
              <Clock className="w-3 h-3" />
              {interview.status}
            </span>
          </div>

          <div className="w-full mt-2">
            <span className="text-[13px] text-[#F5722E] font-semibold">
              {interview.isRescheduleRequesterMe
                ? "You Requested Reschedule to:"
                : "Requested Reschedule by:"}
            </span>
            {renderTitle()}
            <div className="flex items-center mt-1">
              <MapPin size={14} className="text-[#F5722E]" />
              <p className="text-[13px] text-[#263238] ml-1">
                Based in {interview.country}
              </p>
            </div>

            {/* Add LinkedIn Link - Only for employer variant and if not on free trial */}
            {variant === "employer" && interview.linkedIn && (
              <LinkedInLink linkedInUrl={interview.linkedIn} />
            )}
          </div>
        </CardHeader>

        <CardContent className="pt-2">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1">
              <span className="text-[13px] min-w-[40px] text-[#263238]">
                Date:
              </span>
              <span className="text-[13px] font-medium px-1 rounded-[2px] bg-[#184E77] text-white w-[135px] h-[17px] flex justify-center items-center">
                {interview.date}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-[13px] min-w-[40px] text-[#263238]">
                Time:
              </span>
              <span className="text-[13px] font-medium px-1 rounded-[2px] bg-[#168AAD] text-white w-[135px] h-[17px] flex justify-center items-center">
                {interview.time}
              </span>
            </div>

            {/* Desktop layout for buttons */}
            <div className="hidden sm:flex flex-row justify-center sm:justify-start w-full gap-2">
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <LoaderCircle className="w-5 h-5 animate-spin text-[#F5722E]" />
                  <span className="text-sm font-medium text-[#F5722E]">
                    {isAccepted
                      ? "Accepting..."
                      : isDeclined
                        ? "Declining..."
                        : "Processing..."}
                  </span>
                </div>
              ) : isAccepted ? (
                <div className="flex items-center gap-2 text-[#4BAF66]">
                  <Check className="w-5 h-5" />
                  <span className="text-sm font-medium">
                    You've successfully accepted the interview!
                  </span>
                </div>
              ) : isDeclined ? (
                <div className="flex items-center gap-2 text-[#E53835]">
                  <Check className="w-5 h-5" />
                  <span className="text-sm font-medium">
                    You've successfully declined this interview!
                  </span>
                </div>
              ) : (
                !interview.isRescheduleRequesterMe && (
                  <>
                    <Button
                      onClick={handleAccept}
                      variant="outline"
                      className="border-2 border-[#4BAF66] text-[#4BAF66] hover:bg-[#4BAF66] p-0 hover:text-white h-[32px] w-[117px] rounded text-[12px] flex items-center justify-center gap-1"
                    >
                      <Check className="w-4 h-4" strokeWidth={4} />
                      <span>Accept</span>
                    </Button>
                    <Button
                      onClick={handleDecline}
                      variant="outline"
                      className="border-2 border-[#E53835] text-[#E53835] hover:bg-[#E53835] p-0 hover:text-white h-[32px] w-[117px] rounded text-[12px] flex items-center justify-center gap-1"
                    >
                      <X className="w-4 h-4" strokeWidth={4} />
                      <span>Decline</span>
                    </Button>
                    <Button
                      onClick={handleOpenReschedule}
                      variant="outline"
                      className="border-2 border-[#168AAD] text-[#168AAD] hover:bg-[#168AAD] p-0 hover:text-white h-[32px] w-[117px] rounded text-[12px] flex items-center justify-center gap-1"
                    >
                      <RefreshCcw className="w-4 h-4" strokeWidth={3} />
                      <span>Reschedule</span>
                    </Button>
                  </>
                )
              )}
            </div>

            {/* Mobile layout for buttons */}
            <div className="flex sm:hidden flex-col items-center w-full gap-1 mt-2">
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <LoaderCircle className="w-5 h-5 animate-spin text-[#F5722E]" />
                  <span className="text-sm font-medium text-[#F5722E]">
                    {isAccepted
                      ? "Accepting..."
                      : isDeclined
                        ? "Declining..."
                        : "Processing..."}
                  </span>
                </div>
              ) : isAccepted ? (
                <div className="flex items-center gap-2 text-[#4BAF66]">
                  <Check className="w-5 h-5" />
                  <span className="text-sm font-medium">
                    You've successfully accepted the interview!
                  </span>
                </div>
              ) : isDeclined ? (
                <div className="flex items-center gap-2 text-[#E53835]">
                  <Check className="w-5 h-5" />
                  <span className="text-sm font-medium">
                    You've successfully declined this interview!
                  </span>
                </div>
              ) : (
                !interview.isRescheduleRequesterMe && (
                  <>
                    <Button
                      onClick={handleAccept}
                      variant="outline"
                      className="border-2 border-[#4BAF66] text-[#4BAF66] hover:bg-[#4BAF66] hover:text-white text-[15px] w-[165px] h-[35px] rounded-[4px] flex items-center justify-center gap-2 bg-transparent"
                    >
                      <Check className="w-5 h-5" strokeWidth={4} />
                      <span>Accept</span>
                    </Button>
                    <Button
                      onClick={handleDecline}
                      variant="outline"
                      className="border-2 border-[#E53835] text-[#E53835] hover:bg-[#E53835] hover:text-white text-[15px] w-[165px] h-[35px] rounded-[4px] flex items-center justify-center gap-2 bg-transparent"
                    >
                      <X className="w-5 h-5" strokeWidth={4} />
                      <span>Decline</span>
                    </Button>
                    <Button
                      onClick={handleOpenReschedule}
                      variant="outline"
                      className="border-2 border-[#168AAD] text-[#168AAD] hover:bg-[#168AAD] hover:text-white  text-[15px] w-[165px] h-[35px] rounded-[4px] flex items-center justify-center gap-2 bg-transparent"
                    >
                      <RefreshCcw className="w-5 h-5" strokeWidth={3} />
                      <span>Reschedule</span>
                    </Button>
                  </>
                )
              )}
            </div>
          </div>
        </CardContent>

        <div className="absolute top-2 right-4 flex flex-col items-end">
          <span className="text-[12px] text-[#717171]">
            {interview.isRescheduleRequesterMe
              ? `Sent ${interview.sentTime}`
              : `Received ${interview.receivedTime}`}
          </span>
          <Bookmark className="w-6 h-6 text-[#F5722E] mt-1" />
        </div>
      </Card>

      <PreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        interview={interview}
      />

      <RescheduleModal
        isOpen={activeModal === "reschedule"}
        onClose={() => setActiveModal(null)}
        interview={interview}
        onReschedule={(data: RescheduleData) => {
          onReschedule?.(data);
        }}
        variant={variant === "employer" ? "employer" : "job-hunter"}
      />

      <InterviewCalendarModal
        isOpen={isCalendarModalOpen}
        onClose={() => setIsCalendarModalOpen(false)}
      />
    </>
  );
};

export { RescheduleCard };
