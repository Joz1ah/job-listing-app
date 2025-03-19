import { FC, useState, useEffect } from "react";
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

// Helper function to format employment preference
const formatEmploymentPreference = (pref: string): string => {
  switch (pref) {
    case "full-time":
      return "Full Time";
    case "part-time":
      return "Part Time";
    case "contract":
      return "Contract Only";
    default:
      return pref; // Return original value if no match
  }
};

const JobPreviewModal: FC<JobPreviewModalProps> = ({
  isOpen,
  onClose,
  onSchedule,
  job,
}) => {
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [maxHeight, setMaxHeight] = useState("90vh");

  useEffect(() => {
    function updateHeight() {
      const vh = window.innerHeight;
      const calculatedHeight = Math.min(vh * 0.9, 822);
      setMaxHeight(`${calculatedHeight}px`);
    }

    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="w-full md:min-w-[758px] p-0 flex flex-col"
        style={{ height: maxHeight }}
      >
        <div className="flex flex-col h-full">
          {/* Scrollable Content Area */}
          <div className="flex-1 overflow-y-auto">
            <DialogHeader className="px-6 pt-14">
              <div className="space-y-3">
                {/* Job Title */}
                <div className="flex flex-col items-start">
                  <DialogTitle className="text-sm md:text-[17px]  font-semibold text-[#263238]">
                    {job.position}
                  </DialogTitle>
                </div>

                {/* Company */}
                <div className="flex flex-col gap-1">
                  <span className="text-sm md:text-[17px]  text-[#263238] underline">
                    {job.company}
                  </span>
                </div>

                {/* Location */}
                <div className="flex items-center gap-2 text-[#263238]">
                  <MapPin className="h-4 w-4 text-[#F5722E]" />
                  <span className="text-sm md:text-[17px] ">
                    Based in {job.location}
                  </span>
                </div>

                {/* Core Skills */}
                <div className="flex flex-col gap-2">
                  <h4 className="text-sm md:text-[17px] flex justify-start font-normal text-[#263238]">
                    Core Skills:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {job.coreSkills.map((skill, index) => (
                      <span
                        key={skill}
                        className={`${
                          index % 2 === 0 ? "bg-[#184E77]" : "bg-[#168AAD]"
                        } text-white px-2 text-sm md:text-[17px]  rounded font-medium`}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Experience */}
                <div className="flex items-center gap-2">
                  <h4 className="text-sm md:text-[17px]  font-normal text-[#263238]">
                    Experience:
                  </h4>
                  <span className="text-[#F5722E] border border-[#F5722E] px-2 rounded-sm">
                    {job.experience}
                  </span>
                </div>

                {/* Education - Added this section */}
                {job.education && (
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm md:text-[17px] font-normal text-[#263238]">
                      Education:
                    </h4>
                    <span className="text-[#F5722E] border border-[#F5722E] px-2 rounded-sm">
                      {job.education}
                    </span>
                  </div>
                )}

                {/* Employment Preference */}
                <div className="flex items-center gap-2">
                  <h4 className="text-sm md:text-[17px] flex justify-start font-normal text-[#263238]">
                    Employment Preference:
                  </h4>
                  <div className="flex gap-2">
                    {job.lookingFor.map((pref) => (
                      <span
                        key={pref}
                        className="bg-[#F5722E] text-white px-2 rounded-sm"
                      >
                        {formatEmploymentPreference(pref)}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Salary Range */}
                <div className="flex items-center gap-2">
                  <h4 className="text-sm md:text-[17px] flex justify-start font-normal text-[#263238]">
                    Salary Expectation:
                  </h4>
                  <span className="bg-[#8C4227] text-white px-2 rounded-sm">
                    {job.salaryExpectation}
                  </span>
                </div>

                {/* Certificates - Updated this section */}
                {job.certificates && job.certificates.length > 0 && (
                  <div className="flex flex-col gap-2">
                    <h4 className="text-sm md:text-[17px] flex justify-start font-normal text-[#263238]">
                      Certificates:
                    </h4>
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
                {job.interpersonalSkills &&
                  job.interpersonalSkills.length > 0 && (
                    <div className="flex flex-col gap-2">
                      <h4 className="text-sm md:text-[17px] flex justify-start font-normal text-[#263238]">
                        Interpersonal Skills:
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {job.interpersonalSkills.map((skill, index) => (
                          <span
                            key={skill}
                            className={`${
                              index % 2 === 0 ? "bg-[#184E77]" : "bg-[#168AAD]"
                            } text-white px-2 text-sm md:text-[17px]  rounded font-medium`}
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                {/* Job Description */}
                <div className="flex flex-col gap-2">
                  <h4 className="text-sm md:text-[17px] flex justify-start font-normal text-[#263238]">
                    Job Description:
                  </h4>
                  <div className="border rounded p-4 max-h-[135px] overflow-y-auto">
                    <p className="text-[10px] text-[#263238] leading-relaxed">
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
              className="bg-[#F5722E] hover:bg-[#BF532C] h-[27px] text-white px-2 py-0"
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
