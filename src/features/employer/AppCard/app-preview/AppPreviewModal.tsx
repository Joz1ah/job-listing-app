import { FC, useState } from "react";
import { MapPin } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "components";
import { Button } from "components";
import { ScheduleInterviewModal } from "features/employer";

interface Skill {
  name: string;
  isMatch: boolean;
}

interface Match {
  name: string;
  location: string;
  job: string;
  skills: Skill[];
  appliedAgo: string;
  experience: string;
  lookingFor: string[];
  salaryExpectation: string;
  language: string[];
}

interface AppPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSchedule: (e: React.MouseEvent) => void;
  app: Match;
}

const AppPreviewModal: FC<AppPreviewModalProps> = ({
  isOpen,
  onClose,
  onSchedule,
  app,
}) => {
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-3xl h-[630px] p-0 flex flex-col">
        <div className="flex flex-col h-full">
          {/* Scrollable Content Area */}
          <div className="flex-1 overflow-y-auto">
            <DialogHeader className="p-4 md:p-6">
              <div className="space-y-3">
                {/* Applicant Name */}
                <div className="flex flex-col items-start">
                  <DialogTitle className="text-base md:text-[17px] text-black font-normal mb-1">
                    Applicant Name
                  </DialogTitle>
                  <p className="text-base md:text-xl font-bold break-words max-w-[80%]">
                    {app.name}
                  </p>
                </div>

                {/* Job Role */}
                <div className="flex items-start gap-1">
                  <p className="text-base md:text-[17px] break-words">
                    {app.job}
                  </p>
                </div>

                {/* Location */}
                <div className="flex items-start gap-2 text-black">
                  <MapPin className="h-4 w-4 flex-shrink-0 mt-1 text-orange-500" />
                  <span className="text-base md:text-[17px]">
                    Based in {app.location}
                  </span>
                </div>

                {/* Core Skills */}
                <div className="flex flex-col items-start">
                  <h4 className="text-base md:text-[17px] text-black">
                    Core Skills:
                  </h4>
                  <div className="flex flex-wrap gap-1 items-start">
                    {app.skills.map((skill, index) => (
                      <span
                        key={index}
                        className={`${
                          index % 2 === 0 ? "bg-[#184E77]" : "bg-[#168AAD]"
                        } text-white px-1.5 py-0.5 font-semibold text-sm md:text-[17px] rounded inline-block`}
                      >
                        {skill.name}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Experience */}
                <div className="flex flex-wrap items-start gap-2">
                  <h4 className="text-base md:text-[17px] text-black">
                    Experience:
                  </h4>
                  <span className="px-1 text-sm md:text-[17px] text-[#F5722E] outline outline-1 outline-[#F5722E] rounded-sm">
                    {app.experience}
                  </span>
                </div>

                {/* Employment Preference */}
                <div className="flex flex-wrap items-start gap-2">
                  <h4 className="text-base md:text-[17px] text-black">
                    Looking For:
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {app.lookingFor.map((item, index) => (
                      <span
                        key={index}
                        className="bg-[#F5722E] text-white px-1.5 py-0.5 text-sm md:text-[17px] rounded inline-block"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Salary Range */}
                <div className="flex flex-wrap items-start gap-2">
                  <h4 className="text-base md:text-[17px] text-black">
                    Salary Expectation:
                  </h4>
                  <span className="px-1 text-sm md:text-[17px] bg-[#F5722E] text-white rounded-sm">
                    {app.salaryExpectation}
                  </span>
                </div>

                {/* Languages */}
                <div className="flex flex-wrap items-start gap-2">
                  <h4 className="text-base md:text-[17px] text-black">
                    Languages:
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {app.language.map((lang, index) => (
                      <span
                        key={index}
                        className="px-1 text-sm md:text-[17px] text-[#F5722E] outline outline-1 outline-[#F5722E] rounded-sm"
                      >
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Education */}
                <div className="flex flex-wrap items-start gap-2">
                  <h4 className="text-base md:text-[17px] text-black">
                    Education:
                  </h4>
                  <span className="px-1 text-sm md:text-[17px] text-[#F5722E] outline outline-1 outline-[#F5722E] rounded">
                    Bachelor's Degree
                  </span>
                </div>

                {/* Interpersonal Skills */}
                <div className="flex flex-col items-start">
                  <h4 className="text-base md:text-[17px] text-black">
                    Interpersonal Skills:
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    <span className="bg-[#168AAD] text-white px-1.5 py-0.5 font-semibold text-sm md:text-[17px] rounded inline-block">
                      Communication
                    </span>
                    <span className="bg-[#184E77] text-white px-1.5 py-0.5 font-semibold text-sm md:text-[17px] rounded inline-block">
                      Teamwork
                    </span>
                  </div>
                </div>
              </div>
            </DialogHeader>
          </div>

          {/* Fixed Button Area */}
          <div className="flex justify-center p-4 md:p-6">
            <Button
              className="bg-[#F5722E] w-[133px] hover:bg-[#BF532C] text-white text-xs md:text-[12px] h-8 p-0"
              onClick={onSchedule} // Add onClick handler
            >
              Schedule Interview
            </Button>
          </div>
        </div>

        <ScheduleInterviewModal
          isOpen={isScheduleModalOpen}
          onClose={() => setIsScheduleModalOpen(false)}
          jobTitle={app.job}
          skills={app.skills}
          certificate="None required"
          candidateName={app.name}
          location={app.location}
        />
      </DialogContent>
    </Dialog>
  );
};

export { AppPreviewModal }
