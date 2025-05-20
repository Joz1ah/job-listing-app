import { FC, useState, useEffect } from "react";
import { MapPin } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "components";
import { Button } from "components";
import { ScheduleInterviewModal } from "features/job-hunter";
import { MatchJH } from "contexts/PerfectMatch/types";
import { useAuth } from "contexts/AuthContext/AuthContext";

interface JobPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSchedule?: (e: React.MouseEvent) => void;
  job: MatchJH;
}

// Improved helper function to format employment preference
const formatEmploymentPreference = (pref: string): string => {
  // Handle the case where pref might be null or undefined
  if (!pref) return "";
  
  // Remove any hyphens and convert to lowercase for case-insensitive comparison
  const normalizedPref = pref.toLowerCase().replace(/-/g, " ");
  
  // Check against normalized strings (without hyphens)
  switch (normalizedPref) {
    case "full time":
    case "fulltime":
      return "Full Time";
    case "part time":
    case "parttime":
      return "Part Time";
    case "contract":
    case "contract only":
      return "Contract Only";
    default:
      // Capitalize each word as a fallback
      // First replace any hyphens with spaces, then capitalize
      return pref.replace(/-/g, " ")
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
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
  const {userSettings} = useAuth();

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
        className="w-[calc(100%-2rem)] md:w-full md:min-w-[758px] p-0 flex flex-col"
        style={{ height: maxHeight }}
      >
        <div className="flex flex-col h-full">
          {/* Scrollable Content Area */}
          <div className="flex-1 overflow-y-auto">
            <DialogHeader className="px-6 pt-10">
              <div className="space-y-3">
                {/* Job Title */}
                <div className="flex flex-col items-start">
                  <DialogTitle className="text-[17px] md:text-xl font-semibold text-[#263238]">
                    {job.position}
                  </DialogTitle>
                </div>

                {/* Company */}
                <div className="flex flex-col items-start">
                  <span className="text-sm md:text-[17px] text-[#263238] underline">
                    {job.company}
                  </span>
                </div>

                {/* Location */}
                <div className="flex items-center gap-2 text-[#263238]">
                  <MapPin className="h-4 w-4 text-[#F5722E]" />
                  <span className="text-sm md:text-[17px]">
                    Based in {job.country}
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
                        } text-white px-2 text-sm md:text-[17px] rounded font-medium`}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Experience */}
                <div className="flex items-center gap-2">
                  <h4 className="text-sm md:text-[17px] font-normal text-[#263238]">
                    Experience:
                  </h4>
                  <span className="text-sm md:text-[17px] text-[#F5722E] border border-[#F5722E] px-2 rounded-sm">
                    {job.experience}
                  </span>
                </div>

                {/* Education */}
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

                {/* Certifications */}
                <div className="flex flex-col md:flex-row gap-2">
                  <h4 className="text-sm md:text-[17px] font-normal text-[#263238] text-left">
                    Certifications:
                  </h4>
                  {(!job.certificates || job.certificates.length === 0) ? (
                    <span className="text-[#F5722E] border border-[#F5722E] px-2 rounded-sm text-left">
                      N/A
                    </span>
                  ) : (
                    <div className="flex flex-wrap gap-2 text-left">
                      {job.certificates.map((cert) => (
                        <span
                          key={cert}
                          className="text-sm md:text-[17px] text-[#F5722E] border border-[#F5722E] px-2 rounded-sm"
                        >
                          {cert}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Employment Preference - FIXED SECTION */}
                <div className="flex flex-col md:flex-row gap-2">
                  <h4 className="text-sm md:text-[17px] font-normal text-[#263238] text-left">
                    Employment Preference:
                  </h4>
                  <div className="flex flex-wrap gap-2 text-left">
                    {job.lookingFor.map((pref) => (
                      <span
                        key={pref}
                        className="text-sm md:text-[17px] bg-[#F5722E] text-white px-2 rounded-sm"
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
                  <span className="text-sm md:text-[17px] bg-[#8C4227] text-white px-2 rounded-sm">
                    {job.salaryExpectation}
                  </span>
                </div>

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
                            } text-white px-2 text-sm md:text-[17px] rounded font-medium`}
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
                  <div className="border rounded p-4 max-h-[200px] overflow-y-auto">
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
            timezone={userSettings?.data.timeZone}
            jobTitle={job.position}
            coreSkills={job.coreSkills}
            company={job.company}
            country={job.country}
            certificate={job.certificates}
            jobId={job.jobId}
        />
      </DialogContent>
    </Dialog>
  );
};

export { JobPreviewModal };