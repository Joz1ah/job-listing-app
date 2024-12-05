import { FC, useState } from "react";
import { MapPin, Bookmark } from "lucide-react";
import { Card, CardHeader, CardContent, CardFooter } from "components";
import { Button } from "components";
import { AcceptModal } from "features/employer";
import { DeclineModal } from "features/employer";
import { RescheduleModal } from "features/employer";
import {
  Interview,
  AcceptData,
  DeclineData,
  RescheduleData,
} from "features/employer/types";

import gmeet from "images/google-meet.svg?url";


interface PendingCardProps {
  interview: Interview;
  onAccept?: (data: AcceptData) => void;
  onReschedule?: (data: RescheduleData) => void;
  onDecline?: (data: DeclineData) => void;
  onBookmark?: () => void;
}

const PendingCard: FC<PendingCardProps> = ({
  interview,
  onAccept,
  onReschedule,
  onDecline,
}) => {
  const [activeModal, setActiveModal] = useState<
    "accept" | "decline" | "reschedule" | null
  >(null);

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
            <h3 className="text-[14px] font-semibold pr-8">
              {interview.name}
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
              <img src={gmeet} alt="gmeet" />
              <span className="text-xs text-orange-500 font-light">
                via Google meet
              </span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex flex-row justify-center pt-2 space-x-6">
          <Button
            onClick={() => setActiveModal("accept")}
            className="text-[13px] font-semibold w-[100px] h-[32px] bg-orange-500 hover:bg-orange-600 text-white"
          >
            Accept
          </Button>
          <Button
            onClick={() => setActiveModal("reschedule")}
            variant="outline"
            className="text-[13px] font-semibold w-[100px] h-[32px] text-orange-500 border-2 border-orange-500 hover:bg-orange-500 hover:text-white"
          >
            Reschedule
          </Button>
          <Button
            onClick={() => setActiveModal("decline")}
            variant="outline"
            className="text-[13px] font-semibold w-[100px] h-[32px] text-orange-500 border-2 border-orange-500 hover:bg-orange-500 hover:text-white"
          >
            Decline
          </Button>
        </CardFooter>
      </Card>

      {/* Modals */}
      <AcceptModal
        isOpen={activeModal === "accept"}
        onClose={() => setActiveModal(null)}
        interview={interview}
        onAccept={(data) => {
          onAccept?.(data);
          setActiveModal(null);
        }}
      />

      <DeclineModal
        isOpen={activeModal === "decline"}
        onClose={() => setActiveModal(null)}
        interview={interview}
        onDecline={(data) => {
          onDecline?.(data);
          setActiveModal(null);
        }}
      />

      <RescheduleModal
        isOpen={activeModal === "reschedule"}
        onClose={() => setActiveModal(null)}
        interview={interview}
        onReschedule={(data) => {
          onReschedule?.(data);
          setActiveModal(null);
        }}
      />
    </>
  );
};

export { PendingCard };
