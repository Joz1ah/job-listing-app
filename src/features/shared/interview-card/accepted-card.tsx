import { FC } from "react";
import { MapPin } from "lucide-react";
import { Card, CardHeader, CardContent, CardFooter } from "components";
import { Button } from "components";

interface Interview {
  position: string;
  company: string;
  date: string;
  time: string;
  location: string;
  meetingLink: string;
  receivedTime?: string;
  isNew?: boolean;
}

import gmeet from "images/google-meet.svg?url";

interface InterviewCardProps {
  interview: Interview;
  onJoinInterview?: () => void;
  onPreviewJob?: () => void;
}

const AcceptedCard: FC<InterviewCardProps> = ({
  interview,
  onJoinInterview,
  onPreviewJob,
}) => {
  return (
    <Card className="bg-[#FFFFFF] border-none w-full md:w-[436px] h-auto md:h-[275px]">
      <CardHeader className="flex flex-col justify-between items-start pb-0">
        <div className="flex flex-row -mt-4 justify-between w-full">
          <div className="h-[20px]">
            {interview.isNew && (
              <span className="text-[13px] text-orange-500 font-semibold">
                ★ NEW
              </span>
            )}
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[12px] font-light text-gray-400 -mr-2">
              Received {interview.receivedTime}
            </span>
          </div>
        </div>
        <div className="w-full relative mt-2">
          <h3 className="text-[14px] font-semibold">{interview.position}</h3>
          <p className="text-[13px] text-black underline">
            {interview.company}
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
          <div className="flex items-center gap-1">
            <span className="text-[13px] min-w-[40px]">Date:</span>
            <span className="text-[13px] font-semibold px-1 rounded-[2px] bg-[#184E77] text-white">
              {interview.date}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-[13px] min-w-[40px]">Time:</span>
            <span className="text-[13px] font-semibold px-1 rounded-[2px] bg-[#168AAD] text-white">
              {interview.time}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <img src={gmeet} alt="gmeet" />
            <span className="text-[13px] text-gray-400 cursor-pointer">
              {interview.meetingLink}
            </span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex flex-col space-y-4 pt-2">
        <div className="flex flex-row justify-center space-x-6 w-full">
          <Button
            onClick={onJoinInterview}
            className="text-[13px] font-semibold w-[140px] h-[32px] bg-orange-500 hover:bg-orange-600 text-white"
          >
            Join Interview
          </Button>
          <Button
            onClick={onPreviewJob}
            variant="outline"
            className="text-[13px] font-semibold w-[140px] h-[32px] text-orange-500 border-2 border-orange-500 hover:bg-orange-500 hover:text-white"
          >
            Preview Job
          </Button>
        </div>
        <div className="text-center">
          <span className="text-sm text-black font-semibold">
            Status: <span className="text-green-600">Accepted</span>
          </span>
        </div>
      </CardFooter>
    </Card>
  );
};

export { AcceptedCard };
