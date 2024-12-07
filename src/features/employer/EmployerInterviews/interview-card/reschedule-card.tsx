import { FC, useState } from "react";
import {
  MapPin,
  Calendar,
  Check,
  X,
  RefreshCcw,
  Clock,
  Bookmark,
} from "lucide-react";
import { Card, CardHeader, CardContent } from "components";
import { Button } from "components";
import { Tooltip } from "components";
import { Interview } from "features/employer/types";
import { CandidatePreviewModal } from "./preview/CandidatePreviewModal";

interface RescheduleCardProps {
  interview: Interview;
  onAccept?: () => void;
  onDecline?: () => void;
  onReschedule?: () => void;
}

const RescheduleCard: FC<RescheduleCardProps> = ({
  interview,
  onAccept,
  onDecline,
  onReschedule,
}) => {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  return (
    <>
      <Card className="bg-white border border-gray-200 w-full md:w-[436px] h-[275px] relative">
        {/* NEW label - absolute positioned */}
        {interview.isNew && (
          <span className="absolute top-2 left-4 text-[13px] text-orange-500 font-semibold italic">
            ★ NEW
          </span>
        )}

        <CardHeader className="flex flex-col justify-between items-start pb-0 pt-8">
          <div className="flex flex-col gap-1">
            <span className="bg-orange-100 text-orange-500 px-2 py-0.5 rounded text-xs flex items-center justify-center gap-1 italic">
              <Clock className="w-3 h-3" />
              Pending
            </span>
          </div>

          <div className="w-full mt-2">
            <span className="text-[13px] text-orange-500 font-semibold">
              {interview.isRequesterMe
                ? "You Requested Reschedule to:"
                : "Requested Reschedule by:"}
            </span>
            <h3
              className="text-[14px] font-semibold mt-1 cursor-pointer hover:underline"
              onClick={() => setIsPreviewOpen(true)}
            >
              {interview.name}
            </h3>
            <p className="text-[13px] text-black underline">
              {interview.position}
            </p>
            <div className="flex items-center mt-1">
              <MapPin size={14} className="text-orange-500" />
              <p className="text-[13px] text-gray-600 ml-1">
                Based in {interview.location}
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-2">
          <div className="flex flex-col gap-2">
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

            <div className="flex justify-center mt-3 w-full">
              {interview.isRequesterMe ? (
                // My request layout
                <div className="flex items-center gap-2 flex-wrap justify-center">
                  {interview.hasRescheduled ? (
                    <Tooltip content="You've already exceeded the limit to reschedule">
                      <Button
                        onClick={onReschedule}
                        variant="outline"
                        disabled={interview.hasRescheduled}
                        className="h-7 rounded text-xs bg-gray-100 text-gray-400 cursor-not-allowed"
                      >
                        <RefreshCcw className="w-4 h-4 mr-1" />
                        Reschedule
                      </Button>
                    </Tooltip>
                  ) : (
                    <Button
                      onClick={onReschedule}
                      variant="outline"
                      className="border-2 h-7 rounded text-xs border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white"
                    >
                      <RefreshCcw className="w-4 h-4 mr-1" />
                      Reschedule
                    </Button>
                  )}
                  <Calendar className="w-4 h-4 text-blue-500" />
                </div>
              ) : (
                // Their request layout
                <div className="flex items-center gap-2">
                  <Button
                    onClick={onAccept}
                    variant="outline"
                    className="border-2 border-green-500 text-green-500 hover:bg-green-500 hover:text-white h-[26px] min-w-[100px] rounded text-xs flex items-center justify-center gap-1"
                  >
                    <Check className="w-4 h-4" />
                    Accept
                  </Button>
                  <Button
                    onClick={onDecline}
                    variant="outline"
                    className="border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white h-[26px] min-w-[100px] rounded text-xs flex items-center justify-center gap-1"
                  >
                    <X className="w-4 h-4" />
                    Decline
                  </Button>
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={onReschedule}
                      variant="outline"
                      className="border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white h-[26px] min-w-[100px] rounded text-xs flex items-center justify-center gap-1"
                    >
                      <RefreshCcw className="w-4 h-4" />
                      Reschedule
                    </Button>
                    <Calendar className="w-4 h-4 text-blue-500" />
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>

        <div className="absolute top-2 right-4 flex flex-col items-end">
          <span className="text-[12px] text-gray-400">
            {interview.isRequesterMe
              ? `Sent ${interview.sentTime}`
              : `Received ${interview.receivedTime}`}
          </span>
          <Bookmark className="w-6 h-6 text-orange-500 mt-1" />
        </div>
      </Card>

      <CandidatePreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        interview={interview}
      />
    </>
  );
};

export { RescheduleCard };
