import { FC, useState } from "react";
import { MapPin } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "components";
import { Button } from "components";
import { ScheduleInterviewModal } from "features/job-hunter";
import { Match } from "mockData/jobs-data";

interface JobPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSchedule?: (e: React.MouseEvent) => void;
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
      <DialogContent className="w-full max-w-2xl h-[90vh] md:h-[670px] p-0 flex flex-col">
        <div className="flex flex-col h-full">
          {/* Scrollable Content Area */}
          <div className="flex-1 overflow-y-auto">
            <DialogHeader className="p-6">
              <div className="space-y-3">
                {/* Job Title */}
                <div className="flex flex-col items-start">
                  <DialogTitle className="text-3xl font-semibold text-[#263238]">
                    {job.position}
                  </DialogTitle>
                </div>

                {/* Company */}
                <div className="flex flex-col gap-1">
                  <span className="text-[17px] text-[#263238] underline">
                    {job.company}
                  </span>
                </div>

                {/* Location */}
                <div className="flex items-center gap-2 text-[#263238]">
                  <MapPin className="h-4 w-4 text-[#F5722E]" />
                  <span className="text-[17px]">
                    Based in {job.location}
                  </span>
                </div>

                {/* Core Skills */}
                <div className="flex flex-col gap-2">
                  <h4 className="text-[17px] font-normal text-[#263238]">Core Skills:</h4>
                  <div className="flex flex-wrap gap-2">
                    {job.coreSkills.map((skill, index) => (
                      <span
                        key={skill}
                        className={`${
                          index % 2 === 0 ? "bg-[#184E77]" : "bg-[#168AAD]"
                        } text-white px-2 text-[17px] rounded font-medium`}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Experience */}
                <div className="flex items-center gap-2">
                  <h4 className="text-[17px] font-normal text-[#263238]">Experience:</h4>
                  <span className="text-[#F5722E] border border-[#F5722E] px-2 rounded-sm">
                    {job.experience}
                  </span>
                </div>

                {/* Employment Preference */}
                <div className="flex items-center gap-2">
                  <h4 className="text-[17px] font-normal text-[#263238]">
                    Employment Preference:
                  </h4>
                  <div className="flex gap-2">
                    {job.lookingFor.map((pref) => (
                      <span
                        key={pref}
                        className="bg-[#F5722E] text-white px-2 rounded-sm"
                      >
                        {pref}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Salary Range */}
                <div className="flex items-center gap-2">
                  <h4 className="text-[17px] font-normal text-[#263238]">
                    Salary Expectation:
                  </h4>
                  <span className="bg-[#8C4227] text-white px-2 rounded-sm">
                    {job.salaryExpectation}
                  </span>
                </div>

                {/* Certificates */}
                {job.certificates && job.certificates.length > 0 && (
                  <div className="flex flex-col gap-2">
                    <h4 className="text-[17px] font-normal text-[#263238]">Certificates:</h4>
                    <div className="flex flex-wrap gap-2">
                      {job.certificates.map((cert) => (
                        <span
                          key={cert}
                          className="text-[#F5722E] border border-[#F5722E] px-2 rounded-sm"
                        >
                          {cert}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Interpersonal Skills */}
                {job.interpersonalSkills && job.interpersonalSkills.length > 0 && (
                  <div className="flex flex-col gap-2">
                    <h4 className="text-[17px] font-normal text-[#263238]">
                      Interpersonal Skills:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {job.interpersonalSkills.map((skill, index) => (
                        <span
                          key={skill}
                          className={`${
                            index % 2 === 0 ? "bg-[#184E77]" : "bg-[#168AAD]"
                          } text-white px-2 text-[17px] rounded font-medium`}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Job Description */}
                <div className="flex flex-col gap-2">
                  <h4 className="text-[17px] font-normal text-[#263238]">
                    Job Description:
                  </h4>
                  <div className="border rounded p-4">
                    <p className="text-[13px] text-[#263238] leading-relaxed">
                      {job.description}
                    </p>
                  </div>
                </div>
              </div>
            </DialogHeader>
          </div>

          {/* Fixed Button Area */}
          <div className="p-6 flex justify-start">
            <Button
              className="bg-[#F5722E] hover:bg-[#BF532C] text-white"
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