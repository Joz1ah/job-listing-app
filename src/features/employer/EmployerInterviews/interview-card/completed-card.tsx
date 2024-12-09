import { FC, useState } from "react";
import { MapPin, Star, Info, Bookmark } from "lucide-react";
import { Card, CardHeader, CardContent } from "components";
import { Button } from "components";
import { Tooltip } from "components";
import { Interview } from "features/employer/types";
import { CandidatePreviewModal } from "./preview/CandidatePreviewModal";

interface InterviewCardProps {
  interview: Interview;
  onRateInterview?: () => void;
  onViewRating?: () => void;
}

const CompletedCard: FC<InterviewCardProps> = ({
  interview,
  onRateInterview,
  onViewRating,
}) => {
  const hasRatings = !!interview.rating;
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  return (
    <>
      <Card className="bg-[#FFFFFF] border-none w-full md:w-[436px] h-auto md:h-[275px]">
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
            <h3
              className="text-[14px] font-semibold cursor-pointer hover:underline"
              onClick={() => setIsPreviewOpen(true)}
            >
              {interview.candidate}
            </h3>
            <p className="text-[13px] text-black underline">
              {interview.position}
            </p>
            <div className="flex flex-row items-center">
              <MapPin size={14} className="text-orange-500" />
              <p className="text-[13px] font-light mt-0 ml-2">
                Based in {interview.location}
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-1">
          <div className="flex flex-col gap-1">
            <span className="text-[13px] text-orange-500 font-semibold">
              Interview on:
            </span>
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

            <div className="flex flex-col items-start gap-2 pt-2">
              {hasRatings ? (
                <div className="flex items-center gap-1">
                  <div className="flex items-center">
                    <span className="text-black text-sm">You rated: </span>
                    <span className="text-sm text-black ml-1">
                      {interview.rating}
                    </span>
                    <div className="flex ml-1">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <Star
                          key={index}
                          className="w-4 h-4 text-orange-500 fill-orange-500"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <div className="border border-dashed border-orange-500 px-2">
                    <span className="text-[15px] text-black">
                      No ratings submitted yet
                    </span>
                  </div>
                  <Tooltip content="Please evaluate this candidate's interview performance and help refine your hiring process.">
                    <Info className="w-4 h-4 fill-orange-500 text-white mb-4" />
                  </Tooltip>
                </div>
              )}
              <Button
                onClick={hasRatings ? onViewRating : onRateInterview}
                className={`text-xs h-[26px] w-[205px] rounded ${
                  hasRatings
                    ? "bg-white border border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white"
                    : "bg-orange-500 hover:bg-orange-600 text-white"
                }`}
              >
                {hasRatings ? "View Rating" : "Rate Interview"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      <CandidatePreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        interview={interview}
      />
    </>
  );
};

export { CompletedCard };
