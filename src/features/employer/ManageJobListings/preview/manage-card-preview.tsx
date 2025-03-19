import { FC, useEffect, useState } from "react";
import { MapPin } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "components";

interface Match {
  id: string;
  position: string;
  company: string;
  location: string;
  coreSkills: string[];
  experience: string;
  lookingFor: string[];
  salaryExpectation: string;
  certificates: string[];
  interpersonalSkills: string[];
  education?: string;
  description: string;
}

interface ManageCardPreviewProps {
  isOpen: boolean;
  onClose: () => void;
  job: Match;
}

const ManageCardPreview: FC<ManageCardPreviewProps> = ({
  isOpen,
  onClose,
  job,
}) => {
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
            <DialogHeader className="px-6 py-8">
              <div className="space-y-4">
                {/* Job Title */}
                <div className="flex flex-col items-start">
                  <DialogTitle className="text-[17px] font-semibold text-[#263238]">
                    {job.position}
                  </DialogTitle>
                </div>

                {/* Company with underline */}
                <div>
                  <span className="text-[17px] text-[#263238] underline">
                    {job.company}
                  </span>
                </div>

                {/* Location with pin icon */}
                <div className="flex items-center gap-2 text-[#263238]">
                  <MapPin className="h-4 w-4 text-[#F5722E]" />
                  <span className="text-[17px]">Based in {job.location}</span>
                </div>

                {/* Core Skills */}
                <div>
                  <h4 className="text-[17px] font-normal text-[#263238] mb-2">
                    Core Skills:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {job.coreSkills &&
                      job.coreSkills.map((skill, index) => (
                        <span
                          key={skill}
                          className={`${
                            index % 2 === 0 ? "bg-[#184E77]" : "bg-[#168AAD]"
                          } text-white px-2 py-0 text-[17px] rounded`}
                        >
                          {skill}
                        </span>
                      ))}
                  </div>
                </div>

                {/* Experience */}
                <div className="flex items-center gap-2">
                  <span className="text-[17px] font-normal text-[#263238] min-w-24">
                    Experience:
                  </span>
                  <span className="text-[#F5722E] text-[17px] border border-[#F5722E] px-2 py-0 rounded">
                    {job.experience}
                  </span>
                </div>

                {/* Employment Preference */}
                <div className="flex items-center gap-2">
                  <span className="text-[17px] font-normal text-[#263238] min-w-24">
                    Employment Preference:
                  </span>
                  <div className="flex gap-2">
                    {job.lookingFor.map((pref) => (
                      <span
                        key={pref}
                        className="bg-[#F5722E] text-[17px] text-white px-2 py-0 rounded"
                      >
                        {pref}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Salary Range */}
                <div className="flex items-center gap-2">
                  <span className="text-[17px] font-normal text-[#263238] min-w-24">
                    Salary Expectation:
                  </span>
                  <span className="bg-[#8C4227] text-[17px] text-white px-2 py-0 rounded">
                    {job.salaryExpectation}
                  </span>
                </div>

                {/* Education */}
                {job.education && (
                  <div className="flex items-center gap-2">
                    <span className="text-[17px] font-normal text-[#263238] min-w-24">
                      Education:
                    </span>
                    <span className="text-[#F5722E] text-[17px] border border-[#F5722E] px-2 py-0 rounded">
                      {job.education}
                    </span>
                  </div>
                )}

                {/* Certificate */}
                <div className="flex items-center gap-2">
                  <span className="text-[17px] font-normal text-[#263238] min-w-24">
                    Certificate:
                  </span>
                  {job.certificates && job.certificates.length > 0 ? (
                    <div className="flex gap-2">
                      {job.certificates.map((cert) => (
                        <span
                          key={cert}
                          className="text-[#F5722E] text-[17px] border border-[#F5722E] px-2 py-0 rounded"
                        >
                          {cert}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-[#F5722E] text-[17px] border border-[#F5722E] px-2 py-0 rounded">
                      None required
                    </span>
                  )}
                </div>

                {/* Interpersonal Skills */}
                <div>
                  <h4 className="text-[17px] font-normal text-[#263238] mb-2">
                    Interpersonal Skills:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {job.interpersonalSkills &&
                      job.interpersonalSkills.map((skill, index) => (
                        <span
                          key={skill}
                          className={`${
                            index % 2 === 0 ? "bg-[#184E77]" : "bg-[#168AAD]"
                          } text-white px-2 py-0 text-[17px] rounded`}
                        >
                          {skill}
                        </span>
                      ))}
                  </div>
                </div>

                {/* Job Description */}
                <div>
                  <h4 className="text-[17px] font-normal text-[#263238] mb-2">
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
        </div>
      </DialogContent>
    </Dialog>
  );
};

export { ManageCardPreview };
