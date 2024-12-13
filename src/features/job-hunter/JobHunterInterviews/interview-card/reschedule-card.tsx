import { FC, useState } from "react";
import {
  MapPin,
  //Calendar,
  Check,
  X,
  RefreshCcw,
  Clock,
  Bookmark,
  LoaderCircle,
} from "lucide-react";
import { Card, CardHeader, CardContent } from "components";
import { Button } from "components";
import { Tooltip } from "components";
import { Interview } from "features/job-hunter/types";
import { JobInterviewPreviewModal } from "./preview/JobInterviewPreviewModal";
import { RescheduleModal } from "features/job-hunter";
import { useNavigate } from "react-router-dom";
import { InterviewCalendarModal } from "features/job-hunter";

interface RescheduleData {
  date: string;
  time: string;
  interviewId?: string;
}

interface RescheduleCardProps {
  interview: Interview;
  onAccept?: () => void;
  onDecline?: () => void;
  onReschedule?: (data: RescheduleData) => void;
}

const RescheduleCard: FC<RescheduleCardProps> = ({
  interview,
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
    onAccept?.();

    // Wait for 2 seconds to show the loading spinner
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsLoading(false);
    setIsAccepted(true);

    // Wait for 1 second before redirecting
    setTimeout(() => {
      navigate("/job-hunter/interviews/accepted");
    }, 1000);
  };

  const handleDecline = async () => {
    setIsLoading(true);
    onDecline?.();

    // Wait for 2 seconds to show the loading spinner
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsLoading(false);
    setIsDeclined(true);

    // Wait for 1 second before redirecting
    setTimeout(() => {
      navigate("/job-hunter/interviews/declined");
    }, 1000);
  };

  const handleOpenReschedule = (event: React.MouseEvent) => {
    event.preventDefault();
    setActiveModal("reschedule");
  };

  return (
    <>
      <Card className="bg-white border border-gray-200 w-full md:w-[436px] h-[275px] relative">
        {interview.isNew && (
          <span className="absolute top-2 left-4 text-[13px] text-[#F5722E] font-bold italic">
            ★ NEW
          </span>
        )}

        <CardHeader className="flex flex-col justify-between items-start pb-0 pt-8">
          <div className="flex flex-col gap-1">
            <span className="bg-orange-100 text-[#F5722E] outline outline-1 px-3 py-1 rounded text-xs flex items-center justify-center gap-1 italic w-[117px] h-[32px]">
              <Clock className="w-3 h-3" />
              Pending
            </span>
          </div>

          <div className="w-full mt-2">
            <span className="text-[13px] text-[#F5722E] font-semibold">
              {interview.isRequesterMe
                ? "You Requested Reschedule to:"
                : "Requested Reschedule by:"}
            </span>
            <h3
              className="text-[14px] font-semibold mt-1 cursor-pointer hover:underline text-[#263238]"
              onClick={() => setIsPreviewOpen(true)}
            >
              {interview.position}
            </h3>
            <p className="text-[13px] text-[#263238] underline">
              {interview.company}
            </p>
            <div className="flex items-center mt-1">
              <MapPin size={14} className="text-[#F5722E]" />
              <p className="text-[13px] text-[#263238] ml-1">
                Based in {interview.location}
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-2">
          <div className="flex flex-col">
            <div className="flex items-center gap-1">
              <span className="text-[13px] min-w-[40px] text-[#263238]">Date:</span>
              <span className="text-[13px] font-semibold px-1 rounded-[2px] bg-[#184E77] text-white w-[135px] h-[17px] flex justify-center">
                {interview.date}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-[13px] min-w-[40px] text-[#263238]">Time:</span>
              <span className="text-[13px] font-semibold px-1 rounded-[2px] bg-[#168AAD] text-white w-[135px] h-[17px] flex justify-center">
                {interview.time}
              </span>
            </div>

            <div className="flex justify-start mt-4 w-full">
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
              ) : interview.isRequesterMe ? (
                // My request layout
                <div className="flex items-center gap-2 flex-wrap justify-center">
                  {interview.hasRescheduled ? (
                    <Tooltip content="You've already exceeded the limit to reschedule">
                      <Button
                        onClick={handleOpenReschedule}
                        variant="outline"
                        disabled={interview.hasRescheduled}
                        className="rounded text-[13px] bg-gray-100 text-[#717171] hover:text-white h-[32px] w-[117px] p-0 cursor-not-allowed"
                      >
                        <RefreshCcw className="w-4 h-4 mr-1" strokeWidth={3}/>
                        Reschedule
                      </Button>
                    </Tooltip>
                  ) : (
                    <Button
                      onClick={handleOpenReschedule}
                      variant="outline"
                      className="border-2 rounded text-[13px] border-[#168AAD] text-[#168AAD] hover:bg-[#168AAD]  hover:text-white h-[32px] w-[117px] p-0"
                    >
                      <RefreshCcw className="w-4 h-4 mr-1" />
                      Reschedule
                    </Button>
                  )}
                  {/* <Calendar
                    className="w-4 h-4 text-[#168AAD] hover:cursor-pointer"
                    onClick={() => setIsCalendarModalOpen(true)}
                  /> */}
                </div>
              ) : (
                // Their request layout
                <div className="flex items-center gap-2">
                  <Button
                    onClick={handleAccept}
                    variant="outline"
                    className="border-2 border-[#4BAF66] text-[#4BAF66] hover:bg-[#4BAF66] p-0 hover:text-white h-[32px] w-[117px] rounded text-[13px] flex items-center justify-center gap-1"
                  >
                    <Check className="w-4 h-4" strokeWidth={4}/>
                    Accept
                  </Button>
                  <Button
                    onClick={handleDecline}
                    variant="outline"
                    className="border-2 border-[#E53835] text-[#E53835] hover:bg-[#E53835] p-0 hover:text-white h-[32px] w-[117px] rounded text-[13px] flex items-center justify-center gap-1"                  >
                    <X className="w-4 h-4" strokeWidth={4}/>
                    Decline
                  </Button>
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={handleOpenReschedule}
                      variant="outline"
                      className="border-2 border-[#168AAD] text-[#168AAD] hover:bg-[#168AAD] p-0 hover:text-white h-[32px] w-[117px] rounded text-[13px] flex items-center justify-center gap-1"
                    >
                      <RefreshCcw className="w-4 h-4" strokeWidth={3}/>
                      Reschedule
                    </Button>
                    {/* <Calendar
                      className="w-4 h-4 text-[#168AAD] cursor-pointer"
                      onClick={() => setIsCalendarModalOpen(true)}
                    /> */}
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>

        <div className="absolute top-2 right-4 flex flex-col items-end">
          <span className="text-[12px] text-[#717171]">
            {interview.isRequesterMe
              ? `Sent ${interview.sentTime}`
              : `Received ${interview.receivedTime}`}
          </span>
          <Bookmark className="w-6 h-6 text-[#F5722E] mt-1" />
        </div>
      </Card>

      <JobInterviewPreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        interview={interview}
      />

      {/* Reschedule Modal */}
      <RescheduleModal
        isOpen={activeModal === "reschedule"}
        onClose={() => setActiveModal(null)}
        interview={interview}
        onReschedule={(data: RescheduleData) => {
          onReschedule?.(data);
        }}
      />

      <InterviewCalendarModal
        isOpen={isCalendarModalOpen}
        onClose={() => setIsCalendarModalOpen(false)}
      />
    </>
  );
};

export { RescheduleCard };
