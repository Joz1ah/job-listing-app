import { FC } from "react";
import { MapPin, Bookmark } from "lucide-react";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "components";
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
  bookmarked?: boolean;
}

import gmeet from 'images/google-meet.svg?url'

interface InterviewCardProps {
  interview: Interview;
  onAccept?: () => void;
  onReschedule?: () => void;
  onDecline?: () => void;
  onBookmark?: () => void;
}

const BookmarkButton: FC<{ 
  bookmarked: boolean; 
  onBookmark: () => void; 
  className?: string;
}> = ({ bookmarked, onBookmark, className = "" }) => (
  <Bookmark
    className={`cursor-pointer ${
      bookmarked ? "fill-orange-500" : ""
    } text-orange-500 ${className}`}
    size={26}
    onClick={(e) => {
      e.stopPropagation();
      onBookmark();
    }}
  />
);

const PendingCard: FC<InterviewCardProps> = ({
  interview,
  onAccept,
  onReschedule,
  onDecline,
  onBookmark = () => {},
}) => {
  return (
    <Card className="bg-[#FFFFFF] border-none w-full md:w-[436px] h-auto md:h-[275px]">
      <CardHeader className="flex flex-col justify-between items-start pb-0">
        <div className="flex flex-row -mt-4 justify-between w-full">
          <div className="h-[20px]"> {/* Fixed height container */}
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
          <h3 className="text-[14px] font-semibold pr-8">{interview.position}</h3>
          <BookmarkButton 
            bookmarked={interview.bookmarked || false}
            onBookmark={onBookmark}
            className="absolute top-0 right-[-8px]"
          />
          <p className="text-[13px] text-black underline">{interview.company}</p>
          <div className="flex flex-row items-center">
            <MapPin size={14} className="text-orange-500" />
            <p className="text-[13px] font-light mt-0 ml-2">Based in {interview.location}</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-1">
        <div className="flex flex-col gap-1">
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
          <div className="flex items-center gap-1">
            <img src={gmeet} alt="gmeet"/>
            <span className="text-[13px] text-gray-400 cursor-pointer">
              {interview.meetingLink}
            </span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex flex-row justify-center pt-2 space-x-6">
        <Button
          onClick={onAccept}
          className="text-[13px] font-semibold w-[100px] h-[32px] bg-orange-500 hover:bg-orange-600 text-white"
        >
          Accept
        </Button>
        <Button
          onClick={onReschedule}
          variant="outline"
          className="text-[13px] font-semibold w-[100px] h-[32px] text-orange-500 border-2 border-orange-500 hover:bg-orange-500 hover:text-white"
        >
          Reschedule
        </Button>
        <Button
          onClick={onDecline}
          variant="outline"
          className="text-[13px] font-semibold w-[100px] h-[32px] bg-red-500 text-white hover:bg-red-600 hover:text-white"
        >
          Decline
        </Button>
      </CardFooter>
    </Card>
  );
};

export { PendingCard };