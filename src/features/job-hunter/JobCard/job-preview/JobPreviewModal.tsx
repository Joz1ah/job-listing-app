import { FC, useState } from "react";
import { MapPin } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "components";
import { Button } from "components";
import { ScheduleInterviewModal } from "features/job-hunter";
import { Match } from "mockData/jobs-data";

interface JobPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSchedule: (e: React.MouseEvent) => void;
  job: Match;
}

const JobPreviewModal: FC<JobPreviewModalProps> = ({
  isOpen,
  onClose,
  onSchedule,
  job,
}) => {
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-3xl h-[90vh] md:h-[822px] p-0 flex flex-col">
        <div className="flex flex-col h-full">
          {/* Scrollable Content Area */}
          <div className="flex-1 overflow-y-auto">
            <DialogHeader className="p-4 md:p-6">
              <div className="space-y-3">
                {/* Job Title and Bookmark */}
                <div className="flex flex-col items-start">
                  <DialogTitle className="text-base md:text-[17px] text-black font-bold mb-1">
                    Job Title
                  </DialogTitle>

                  <p className="text-base md:text-[17px] font-normal break-words max-w-[80%]">
                    {job.position}
                  </p>
                </div>

                {/* Company */}
                <div className="flex flex-col items-start">
                  <h4 className="text-base md:text-[17px] text-black mb-1 underline">
                    Company Name
                  </h4>
                  <p className="text-sm md:text-base break-words">
                    {job.company}
                  </p>
                </div>

                {/* Location */}
                <div className="flex items-start gap-2 text-black">
                  <MapPin className="h-4 w-4 flex-shrink-0 mt-1 text-[#F5722E]" />
                  <span className="text-base md:text-[17px]">
                    Based in {job.location}
                  </span>
                </div>

                {/* Core Skills */}
                <div className="flex flex-col items-start">
                  <h4 className="text-base md:text-[17px] text-black">
                    Core Skills:
                  </h4>
                  <div className="flex flex-wrap gap-1 items-start">
                    {job.coreSkills.map((skill, index) => (
                      <span
                        key={index}
                        className={`${
                          index % 2 === 0 ? "bg-[#184E77]" : "bg-[#168AAD]"
                        } text-white px-1.5 py-0.5 font-semibold text-sm md:text-[17px] rounded inline-block`}
                      >
                        {skill}
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
                    {job.experience}
                  </span>
                </div>

                {/* Employment Preference */}
                <div className="flex flex-wrap items-start gap-2">
                  <h4 className="text-base md:text-[17px] text-black">
                    Employment Preference:
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {job.lookingFor.map((item, index) => (
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
                    {job.salaryExpectation}
                  </span>
                </div>

                {/* Certificates */}
                {job.certificates && job.certificates.length > 0 && (
                  <div className="flex flex-wrap items-start gap-2">
                    <h4 className="text-base md:text-[17px] text-black">
                      Certificate:
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {job.certificates.map((cert, index) => (
                        <span
                          key={index}
                          className="px-1 text-sm md:text-[17px] text-[#F5722E] outline outline-1 outline-[#F5722E] rounded"
                        >
                          {cert}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Interpersonal Skills */}
                {job.interpersonalSkills && job.interpersonalSkills.length > 0 && (
                  <div className="flex flex-col items-start">
                    <h4 className="text-base md:text-[17px] text-black">
                      Interpersonal Skills:
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {job.interpersonalSkills.map((skill, index) => (
                        <span
                          key={index}
                          className={`${
                            index % 2 === 0 ? "bg-[#184E77]" : "bg-[#168AAD]"
                          } text-white px-1.5 py-0.5 font-semibold text-sm md:text-[17px] rounded inline-block`}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Job Description */}
                <div className="flex flex-col items-start">
                  <h4 className="text-base md:text-[17px] text-black mb-2">
                    Job Description:
                  </h4>
                  <div className="border rounded p-3 md:p-4 w-full">
                    <p className="text-xs md:text-[13px] text-black leading-relaxed">
                      {job.description}
                    </p>
                  </div>
                </div>
              </div>
            </DialogHeader>
          </div>

          {/* Fixed Button Area */}
          <div className="p-4 md:p-6">
            <Button
              className="bg-[#F5722E] w-[133px] hover:bg-orange-600 text-white text-xs md:text-[12px] h-8 p-0"
              onClick={onSchedule}
            >
              Schedule Interview
            </Button>
          </div>
        </div>

        <ScheduleInterviewModal
          isOpen={isScheduleModalOpen}
          onClose={() => setIsScheduleModalOpen(false)}
          jobTitle={job.position}
          coreSkills={job.coreSkills}
          company={job.company}
          location={job.location}
          certificate={job.certificates}
        />
      </DialogContent>
    </Dialog>
  );
};

export { JobPreviewModal };