import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "components";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "components";
import { Button } from "components";
import gmeet from "images/google-meet.svg?url";
import { InputField } from "components";

interface ScheduleInterviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobTitle: string;
  skills: Array<{ name: string; isMatch: boolean }>;
  certificate?: string;
}

const ScheduleInterviewModal: React.FC<ScheduleInterviewModalProps> = ({
  isOpen,
  onClose,
  jobTitle,
  skills,
  certificate,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-3xl h-[90vh] md:h-[822px] p-0 flex flex-col">
        <div className="flex flex-col h-full">
          <div className="flex-1 overflow-y-auto">
            <DialogHeader className="p-4 md:p-6">
              {/* Header Title */}
              <DialogTitle className="text-center text-orange-500 mb-8 mt-2">
                Schedule an interview for the candidate below for the{" "}
                <span className="text-orange-500">{jobTitle}</span> position
              </DialogTitle>

              <div className="space-y-6">
                {/* Name and Skills Grid */}
                <div className="grid grid-cols-2">
                  {/* Left Column - Name and Location */}
                  <div>
                    <span className="text-sm block mb-2">
                      Name of Job Hunter
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-orange-500">*</span>
                      <span className="text-sm text-black">
                        Based in (Country)
                      </span>
                    </div>
                  </div>

                  {/* Right Column - Skills and Certificate */}
                  <div className="space-y-4">
                    <div>
                      <span className="text-sm block mb-2">Core Skills:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {skills.map((skill, index) => (
                          <span
                            key={index}
                            className={`${
                              index % 2 === 0 ? "bg-[#184E77]" : "bg-[#168AAD]"
                            } text-white px-2 py-0.5 text-xs rounded`}
                          >
                            {skill.name}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <span className="text-sm block mb-2">Certificate:</span>
                      <span className="text-orange-500 border border-orange-500 px-2 py-0.5 text-xs rounded">
                        {certificate ||
                          "Microsoft Certified: Azure Developer Associate"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Date and Time Selection */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <InputField label="Date" variant="secondary">
                      <Select>
                        <SelectTrigger className="w-full border-2 rounded bg-transparent border-black h-[56px]">
                          <SelectValue placeholder="Select A Date" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#F5F5F7] p-0 [&>*]:p-0 border-none rounded-none">
                          <SelectItem
                            value="date1"
                            className="rounded-none justify-start pl-3 h-[55px]"
                          >
                            Date 1
                          </SelectItem>
                          <SelectItem
                            value="date2"
                            className="rounded-none justify-start pl-3 h-[55px]"
                          >
                            Date 2
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </InputField>
                  </div>

                  <div>
                    <InputField label="Time" variant="secondary">
                      <Select>
                        <SelectTrigger className="w-full border-2 rounded bg-transparent border-black h-[56px]">
                          <SelectValue placeholder="Select a time" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#F5F5F7] p-0 [&>*]:p-0 border-none rounded-none">
                          <SelectItem
                            value="time1"
                            className="rounded-none justify-start pl-3 h-[55px]"
                          >
                            9:00 AM
                          </SelectItem>
                          <SelectItem
                            value="time2"
                            className="rounded-none justify-start pl-3 h-[55px]"
                          >
                            10:00 AM
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </InputField>
                  </div>
                </div>

                {/* Meeting Link */}
                <div className="flex items-center gap-2">
                  <img src={gmeet} alt="Meet icon" className="w-4 h-4" />
                  <span className="text-sm text-gray-500">
                    https://meet.google.com/xxx-xxxx-xxx
                  </span>
                </div>
              </div>
            </DialogHeader>
          </div>

          {/* Fixed Button Area */}
          <div className="p-4 md:p-6">
            <div className="flex gap-2">
              <Button className="bg-gray-400 hover:bg-gray-500 text-white text-[16px]">
                Send Invite
              </Button>
              <Button
                variant="outline"
                className="text-[#F5722E] border-[#F5722E] hover:bg-orange-50 text-[16px]"
                onClick={onClose}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export { ScheduleInterviewModal };
