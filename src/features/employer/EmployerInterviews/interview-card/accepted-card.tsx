import { FC, useState } from "react";
import { MapPin, Info, Check, Bookmark } from "lucide-react";
import { Card, CardHeader, CardContent, CardFooter } from "components";
import { Button } from "components";
import { Tooltip } from "components";
import { Interview } from "mockData/employer-interviews-data";
import { CandidatePreviewModal } from "./preview/CandidatePreviewModal";

import gmeet from "images/google-meet.svg?url";

interface InterviewCardProps {
  interview: Interview;
  onJoinInterview?: () => void;
  onPreviewJob?: () => void;
}

const AcceptedCard: FC<InterviewCardProps> = ({
  interview,
  onJoinInterview,
}) => {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  return (
    <>
      <Card className="bg-[#FFFFFF] border-none w-full md:w-[436px] h-auto md:h-[275px] relative">
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
            <h3
              className="text-[14px] font-semibold text-[#263238]"
            >
              {interview.candidate}
            </h3>
            <p className="text-[13px] text-[#263238] underline">
              {interview.position}
            </p>
            <div className="flex flex-row items-center">
              <MapPin size={14} className="text-[#F5722E]" />
              <p className="text-[13px] font-light mt-0 ml-2 text-[#263238]">
                Based in {interview.location}
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-1">
          <div className="flex flex-col gap-1">
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
          </div>
        </CardContent>

        <CardFooter className="flex flex-col items-start space-y-4">
          <div className="flex flex-row justify-start space-x-6 w-full">
            <div className="flex items-center gap-1">
              {" "}
              {/* Add this wrapper div */}
              <Button
                onClick={onJoinInterview}
                className="text-xs w-[118px] h-[32px] font-normal bg-[#AEADAD] hover:bg-gray-500 text-white p-0 rounded-sm"
              >
                <img src={gmeet} alt="google meet" />
                Join Interview
              </Button>
              <Tooltip content="The meeting link will be accesible on the day of the interview">
                <Info className="w-3 h-3 fill-[#F5722E] mb-6 text-white" />
              </Tooltip>
            </div>
            <Button
              onClick={() => setIsPreviewOpen(true)}
              variant="outline"
              className="text-xs w-[108px] h-[32px] font-normal text-[#F5722E] border-2 border-[#F5722E] hover:bg-[#F5722E] hover:text-white rounded-sm"
            >
              Preview Job
            </Button>
          </div>
          <div className="flex flex-row justify-start w-full items-center">
            <span className="text-sm text-[#263238] font-normal flex items-center gap-1">
              Status: <Check className="w-4 h-4 text-[#4BAF66] inline" />{" "}
              <span className="text-[#4BAF66]">Accepted</span>
            </span>
          </div>
        </CardFooter>
      </Card>

      <CandidatePreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        interview={interview}
      />
    </>
  );
};

export { AcceptedCard };
