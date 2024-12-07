import { FC, useState } from "react";
import { MapPin, X, Bookmark } from "lucide-react";
import { Card, CardHeader, CardContent } from "components";
import { Interview } from "features/job-hunter/types";
import { CompanyPreviewModal } from "./preview/CompanyPreviewModal";

interface InterviewCardProps {
  interview: Interview;
}

const DeclinedCard: FC<InterviewCardProps> = ({ interview }) => {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  return (
    <>
      <Card className="bg-white border-none w-full md:w-[436px] h-auto md:h-[275px]">
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
                Sent {interview.sentTime}
              </span>
              <div className="absolute top-6 -right-2">
                <Bookmark className="w-6 h-6 text-orange-500" />
              </div>
            </div>
          </div>

          <div className="flex items-center px-2 py-1 bg-red-100 rounded w-fit">
            <X className="w-4 h-4 text-red-500" />
            <span className="text-xs text-red-500 font-medium italic">
              Declined
            </span>
          </div>

          <div className="space-y-1">
            <p className="text-xs text-gray-600">{interview.reason}</p>
            <p
              className="text-sm font-medium cursor-pointer hover:underline"
              onClick={() => setIsPreviewOpen(true)}
            >
              {interview.position}
            </p>
            <p className="text-sm text-gray-700 underline">
              {interview.company}
            </p>
            <div className="flex items-center mt-1">
              <MapPin size={14} className="text-orange-500" />
              <p className="text-xs text-gray-600 ml-1">
                Based in {interview.location}
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-1">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="text-[13px] min-w-[40px]">Date:</span>
              <span className="text-[13px] font-semibold px-1 rounded-[2px] bg-[#184E77] text-white w-[135px] h-[17px] flex justify-center">
                {interview.date}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[13px] min-w-[40px]">Time:</span>
              <span className="text-[13px] font-semibold px-1 rounded-[2px] bg-[#168AAD] text-white w-[135px] h-[17px] flex justify-center">
                {interview.time}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
      <CompanyPreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        interview={interview}
      />
    </>
  );
};

export { DeclinedCard };
