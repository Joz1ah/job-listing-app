import { FC, useState } from "react";
import { MapPin, Star, Info, Bookmark } from "lucide-react";
import { Card, CardHeader, CardContent } from "components";
import { Button } from "components";
import { Tooltip } from "components";
import { CandidatePreviewModal } from "../modals/CandidatePreviewModal";
import { JobInterviewPreviewModal } from "../modals/JobInterviewPreviewModal";
import { RatingModal } from "features/employer";
import { Interview } from "contexts/Interviews/types";

interface RatingData {
  rating: number;
  feedback: string;
}

interface CompletedCardProps {
  interview: Interview;
  variant: "employer" | "job-hunter";
  onRateInterview?: (data: RatingData) => void;
}

const CompletedCard: FC<CompletedCardProps> = ({
  interview,
  variant,
  onRateInterview,
}) => {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);

  const handleRatingSubmit = (data: RatingData) => {
    onRateInterview?.(data);
    setIsRatingModalOpen(false);
  };

  const renderStars = (rating: number | undefined) => {
    if (!rating) return renderStars(0);
    return Array.from({ length: 5 }).map((_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 text-[#F5722E] ${
          index < rating ? "fill-[#F5722E]" : "fill-transparent"
        }`}
      />
    ));
  };

  const renderTitle = () => {
    if (variant === "employer") {
      return (
        <>
          <h3
            className="text-[14px] font-semibold text-[#263238] cursor-pointer hover:underline"
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
          className="text-[14px] font-semibold text-[#263238] cursor-pointer hover:underline"
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

  return (
    <>
      <Card className="bg-white border-none w-full sm:min-w-[436px] max-w-[436px] h-[275px]">
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
            {renderTitle()}
            <div className="flex flex-row items-center">
              <MapPin size={14} className="text-[#F5722E]" />
              <p className="text-[13px] font-light mt-0 ml-2 text-[#263238]">
                Based in {interview.country}
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-1">
          <div className="flex flex-col gap-1">
            <span className="text-[13px] text-[#F5722E] font-semibold">
              Interview on:
            </span>
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

            <div className="flex flex-col items-start gap-2 pt-2">
              {interview.rated ? (
                <div className="flex items-center gap-1 pt-3">
                  <div className="flex items-center">
                    <span className="text-[#263238] text-sm">You rated: </span>
                    <span className="text-sm text-[#263238] ml-1">
                      {interview.rating}
                    </span>
                    <div className="flex ml-1">
                      {renderStars(interview.rating)}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <div className="border border-dashed border-[#F5722E] px-2">
                    <span className="text-[15px] text-[#263238]">
                      No ratings submitted yet
                    </span>
                  </div>
                  <Tooltip content="Please evaluate this interview performance to help refine the process.">
                    <Info className="w-4 h-4 fill-[#F5722E] text-white mb-4" />
                  </Tooltip>
                </div>
              )}
              <Button
                onClick={() => setIsRatingModalOpen(true)}
                className={`text-xs h-[26px] w-[205px] rounded ${
                  interview.rated
                    ? "bg-white border border-[#F5722E] text-[#F5722E] hover:bg-[#F5722E] hover:text-white"
                    : "bg-[#F5722E] hover:bg-[#F5722E]/90 text-white"
                }`}
              >
                {interview.rated ? "View Rating" : "Rate Interview"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <PreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        interview={interview}
      />

      <RatingModal
        isOpen={isRatingModalOpen}
        onClose={() => setIsRatingModalOpen(false)}
        interview={interview}
        mode={interview.rated ? "view" : "create"}
        onSubmit={handleRatingSubmit}
        variant={variant === "employer" ? "employer" : "job-hunter"}
      />
    </>
  );
};

export { CompletedCard };