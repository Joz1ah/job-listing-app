import { FC } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "components";
import { Button } from "components";
import { MapPin } from "lucide-react";

import { BaseModalProps, AcceptData } from "features/shared/types";
import gmeet from "images/google-meet.svg?url";

interface AcceptModalProps extends BaseModalProps {
  onAccept: (data: AcceptData) => void;
}

const AcceptModal: FC<AcceptModalProps> = ({
  isOpen,
  onClose,
  interviewData,
  onAccept,
}) => {
  const handleAccept = () => {
    onAccept({
      confirmed: true,
      interviewId: interviewData.id,
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[600px] w-[90%] h-[px] p-0 overflow-hidden bg-white rounded-lg">
        <DialogHeader className="p-6 pb-4 text-left">
          <DialogTitle className="sr-only">
            Accept Interview Invitation
          </DialogTitle>
          <div className="text-center">
            <p className="text-sm font-medium">
              You are accepting the interview invitation.
            </p>
            <p className="text-xs text-gray-500">Here are the details:</p>
          </div>
        </DialogHeader>

        {/* Content Section */}
        <div className="px-6 flex-1 overflow-auto">
          {/* Job Details */}
          <div className="mb-4">
            <div className="flex flex-wrap justify-between items-start gap-2">
              <h3 className="text-sm font-medium break-words">
                {interviewData.position}
              </h3>
              <span className="text-xs text-gray-400">
                Received {interviewData.receivedTime}
              </span>
            </div>
            <p className="text-sm text-black underline cursor-pointer break-words">
              {interviewData.company}
            </p>
            <div className="flex items-center mt-1">
              <MapPin className="text-orange-500" size={12} />
              <p className="text-xs text-gray-600 break-words">
                Based in {interviewData.location}
              </p>
            </div>
          </div>

          {/* Time Details */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs min-w-[40px]">Date:</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-sm bg-[#184E77] text-white min-w-[135px] text-center">
                {interviewData.date}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs min-w-[40px]">Time:</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-sm bg-[#168AAD] text-white min-w-[135px] text-center">
                {interviewData.time}
              </span>
            </div>
          </div>

          {/* Meeting Link */}
          <div className="mt-4 flex items-center gap-2">
            <img src={gmeet} alt="Google Meet" className="h-4 w-4" />
            <span className="text-xs text-gray-400 hover:underline cursor-pointer break-all">
              {interviewData.meetingLink}
            </span>
          </div>
        </div>

        {/* Footer Section */}
        <div className="p-6 mt-auto">
          <div className="flex flex-wrap gap-3 justify-start">
            <Button
              variant="outline"
              onClick={() => {}}
              className="text-xs font-semibold h-[32px] px-6 bg-white"
            >
              View Calendar
            </Button>
            <Button
              onClick={handleAccept}
              className="text-xs font-semibold h-[32px] px-6 bg-[#FF6B35] hover:bg-[#ff855b] text-white"
            >
              Accept
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export { AcceptModal }