import { FC, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "components";
import { Button } from "components";
import { MapPin } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "components";

import { BaseModalProps, DeclineData } from "features/job-hunter/types";
import gmeet from "images/google-meet.svg?url";

import { InputField } from "components";

interface DeclineModalProps extends BaseModalProps {
  onDecline: (data: DeclineData) => void;
}

export const DeclineModal: FC<DeclineModalProps> = ({
  isOpen,
  onClose,
  interview,
  onDecline,
}) => {
  const [formData, setFormData] = useState<DeclineData>({
    reason: "",
    message: "",
    interviewId: interview.id,
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[600px] w-[90%] h-[450px] p-0 overflow-hidden bg-white rounded-lg">
        <DialogHeader className="p-6 pb-4 text-left">
          <DialogTitle className="sr-only">
            Decline Interview Invitation
          </DialogTitle>
          <div className="text-center">
            <p className="text-sm font-medium">
              You are declining the interview invitation.
            </p>
            <p className="text-xs text-gray-500">Here are the details:</p>
          </div>
        </DialogHeader>

        <div className="px-6 flex-1 overflow-auto">
          {/* Job Details */}
          <div className="mb-4">
            <div className="flex flex-wrap justify-between items-start gap-2">
              <h3 className="text-sm font-medium break-words">
                {interview.position}
              </h3>
              <span className="text-xs text-gray-400">
                Received {interview.receivedTime}
              </span>
            </div>
            <p className="text-sm text-black underline cursor-pointer break-words">
              {interview.company}
            </p>
            <div className="flex items-center mt-1">
              <MapPin className="text-orange-500" size={12} />
              <p className="text-xs text-gray-600 break-words">
                Based in {interview.location}
              </p>
            </div>
          </div>

          {/* Time Details */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs min-w-[40px]">Date:</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-sm bg-[#184E77] text-white min-w-[135px] text-center">
                {interview.date}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs min-w-[40px]">Time:</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-sm bg-[#168AAD] text-white min-w-[135px] text-center">
                {interview.time}
              </span>
            </div>
          </div>

          {/* Meeting Link */}
          <div className="mt-4 flex items-center gap-2">
            <img src={gmeet} alt="Google Meet" className="h-4 w-4" />
            <span className="text-xs text-gray-400 hover:underline cursor-pointer break-all">
              {interview.meetingLink}
            </span>
          </div>

          {/* Decline Form */}
          <div className="mt-6 space-y-4">
            <div className="space-y-2">
              <InputField
                label="Provide a Reason"
                variant="secondary"
                size="sm"
              >
                <Select
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, reason: value }))
                  }
                >
                  <SelectTrigger className="w-full bg-transparent h-[56px] text-[#979797]">
                    <SelectValue placeholder="Select A Reason" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#F5F5F7] p-0 [&>*]:p-0 border-none rounded-none">
                    <SelectItem value="schedule-conflict" className="rounded-none justify-start pl-3 h-[55px]">
                      Schedule Conflict
                    </SelectItem>
                    <SelectItem value="not-interested" className="rounded-none justify-start pl-3 h-[55px]">
                      Not Interested
                    </SelectItem>
                    <SelectItem value="accepted-other" className="rounded-none justify-start pl-3 h-[55px]">
                      Accepted Another Offer
                    </SelectItem>
                    <SelectItem value="other" className="rounded-none justify-start pl-3 h-[55px]">Other</SelectItem>
                  </SelectContent>
                </Select>
              </InputField>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 mt-auto">
          <div className="flex justify-start">
            <Button
              onClick={() => {
                onDecline(formData);
                onClose();
              }}
              className="w-[135px] text-xs font-semibold h-[32px] bg-red-500 hover:bg-red-600 text-white"
            >
              Decline
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
