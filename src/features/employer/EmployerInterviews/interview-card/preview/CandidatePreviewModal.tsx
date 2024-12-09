import { FC } from "react";
import { MapPin } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "components";
import { Interview } from "features/employer/types";

interface CandidatePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  interview: Interview;
}

const CandidatePreviewModal: FC<CandidatePreviewModalProps> = ({
  isOpen,
  onClose,
  interview,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full md:min-w-[760px] h-[640px] p-0 flex flex-col">
        <div className="flex flex-col h-full">
          {/* Scrollable Content Area */}
          <div className="flex-1 overflow-y-auto">
            <DialogHeader className="p-6">
              <div className="space-y-4">
                {/* Name */}
                <div className="flex flex-col items-start">
                  <DialogTitle className="text-xl font-semibold text-black mb-1">
                    {interview.candidate}
                  </DialogTitle>
                </div>

                {/* Location */}
                <div className="flex items-center gap-2 text-black">
                  <MapPin className="h-4 w-4 text-[#F5722E]" />
                  <span className="text-base">
                    Based in {interview.location}
                  </span>
                </div>

                {/* Core Skills */}
                <div className="flex flex-col gap-2">
                  <h4 className="text-base font-medium">Core Skills:</h4>
                  <div className="flex flex-wrap gap-2">
                    {interview.coreSkills?.map((skill, index) => (
                      <span
                        key={skill}
                        className={`${
                          index % 2 === 0 ? "bg-[#184E77]" : "bg-[#168AAD]"
                        } text-white px-3 py-1 text-sm rounded`}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Experience */}
                {interview.experience && (
                  <div className="flex items-center gap-2">
                    <h4 className="text-base font-medium">Experience:</h4>
                    <span className="text-[#F5722E] border border-[#F5722E] px-2 py-0.5 rounded-sm">
                      {interview.experience}
                    </span>
                  </div>
                )}

                {/* Employment Preference */}
                {interview.employmentPreference && (
                  <div className="flex items-center gap-2">
                    <h4 className="text-base font-medium">
                      Employment Preference:
                    </h4>
                    <div className="flex gap-2">
                      {interview.employmentPreference.map((pref) => (
                        <span
                          key={pref}
                          className="bg-[#F5722E] text-white px-2 py-0.5 rounded-sm"
                        >
                          {pref}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Salary Expectation */}
                {interview.salaryExpectation && (
                  <div className="flex items-center gap-2">
                    <h4 className="text-base font-medium">
                      Salary Expectation:
                    </h4>
                    <span className="text-[#F5722E] border border-[#F5722E] px-2 py-0.5 rounded-sm">
                      {interview.salaryExpectation}
                    </span>
                  </div>
                )}

                {/* Language */}
                {interview.languages && (
                  <div className="flex items-center gap-2">
                    <h4 className="text-base font-medium">Language:</h4>
                    <div className="flex gap-2">
                      {interview.languages.map((lang) => (
                        <span
                          key={lang}
                          className="text-[#F5722E] border border-[#F5722E] px-2 py-0.5 rounded-sm"
                        >
                          {lang}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Education */}
                {interview.education && (
                  <div className="flex items-center gap-2">
                    <h4 className="text-base font-medium">Education:</h4>
                    <span className="text-[#F5722E] border border-[#F5722E] px-2 py-0.5 rounded-sm">
                      {interview.education}
                    </span>
                  </div>
                )}

                {/* Certificate */}
                {interview.certificate && (
                  <div className="flex items-center gap-2">
                    <h4 className="text-base font-medium">Certificate:</h4>
                    <span className="text-[#F5722E] border border-[#F5722E] px-2 py-0.5 rounded-sm">
                      {interview.certificate}
                    </span>
                  </div>
                )}

                {/* Interpersonal Skills */}
                {interview.interpersonalSkills && (
                  <div className="flex flex-col gap-2">
                    <h4 className="text-base font-medium">
                      Interpersonal Skills:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {interview.interpersonalSkills.map((skill, index) => (
                        <span
                          key={skill}
                          className={`${
                            index % 2 === 0 ? "bg-[#184E77]" : "bg-[#168AAD]"
                          } text-white px-3 py-1 text-sm rounded`}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </DialogHeader>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export { CandidatePreviewModal };
