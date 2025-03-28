import { FC, useState } from "react";
import { MapPin, X, Bookmark } from "lucide-react";
import { Card, CardHeader, CardContent } from "components";
import { CandidatePreviewModal } from "../modals/CandidatePreviewModal";
import { JobInterviewPreviewModal } from "../modals/JobInterviewPreviewModal";
import { Interview } from "contexts/Interviews/types";

interface DeclinedCardProps {
  interview: Interview;
  variant: "employer" | "job-hunter";
}

const DeclinedCard: FC<DeclinedCardProps> = ({ interview, variant }) => {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const renderTitle = () => {
    if (variant === "employer") {
      return (
        <>
          <p
            className="text-sm font-bold cursor-pointer hover:underline text-[#263238]"
            onClick={() => setIsPreviewOpen(true)}
          >
            {interview.candidate}
          </p>
          <p className="text-sm underline text-[#263238]">
            {interview.position}
          </p>
        </>
      );
    }
    return (
      <>
        <p
          className="text-sm font-bold cursor-pointer hover:underline text-[#263238]"
          onClick={() => setIsPreviewOpen(true)}
        >
          {interview.position}
        </p>
        <p className="text-sm underline text-[#263238]">{interview.company}</p>
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
                <span className="text-[13px] text-[#F5722E] font-bold italic">
                  ★ NEW
                </span>
              )}
            </div>
            <div className="flex flex-col items-end relative">
              <span className="text-[12px] font-light text-[#717171] -mr-2">
                {interview.isRequesterMe ? 'Sent' : 'Received'} {interview.receivedTime}
              </span>
              <div className="absolute top-6 -right-2">
                <Bookmark className="w-6 h-6 text-[#F5722E]" />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <span className="bg-red-100 text-[#E53835] outline outline-1 px-3 py-1 rounded text-xs flex items-center justify-center gap-1 italic w-[117px] h-[32px]">
              <X className="w-4 h-4 text-[#E53835]" />
              {interview.status}
            </span>
          </div>

          <div className="space-y-1">
            <p className="text-xs text-[#263238] font-medium">
              Reason: {interview.reason}
            </p>
            {renderTitle()}
            <div className="flex items-center mt-1">
              <MapPin size={14} className="text-[#F5722E]" />
              <p className="text-xs ml-1 text-[#263238]">
                Based in {interview.country}
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-1">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="text-[13px] min-w-[40px] text-[#263238]">
                Date:
              </span>
              <span className="text-[13px] font-medium px-1 rounded-[2px] bg-[#184E77] text-white w-[135px] h-[17px] flex justify-center items-center">
                {interview.date}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[13px] min-w-[40px] text-[#263238]">
                Time:
              </span>
              <span className="text-[13px] font-medium px-1 rounded-[2px] bg-[#168AAD] text-white w-[135px] h-[17px] flex justify-center items-center">
                {interview.time}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <PreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        interview={interview}
      />
    </>
  );
};

export { DeclinedCard };
