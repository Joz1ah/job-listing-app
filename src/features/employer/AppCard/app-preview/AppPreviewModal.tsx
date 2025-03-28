import { FC, useState, useEffect } from "react";
import { MapPin } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "components";
import { Button } from "components";
import { ScheduleInterviewModal } from "features/employer";
//import { Match } from "mockData/job-hunter-data";
import { Match } from "contexts/PerfectMatch/types";
import { useAuth } from "contexts/AuthContext/AuthContext";

interface AppPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSchedule?: (e: React.MouseEvent) => void;
  app: Match;
}

const AppPreviewModal: FC<AppPreviewModalProps> = ({
  isOpen,
  onClose,
  onSchedule,
  app,
}) => {
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [maxHeight, setMaxHeight] = useState("90vh");
  const {user, userSettings} = useAuth();

  useEffect(() => {
    function updateHeight() {
      const vh = window.innerHeight;
      const calculatedHeight = Math.min(vh * 0.9, 670);
      setMaxHeight(`${calculatedHeight}px`);
    }

    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="w-full max-w-2xl p-0 flex flex-col"
        style={{ height: maxHeight }}
      >
        <div className="flex flex-col h-full">
          {/* Scrollable Content Area */}
          <div className="flex-1 overflow-y-auto">
            <DialogHeader className="p-6">
              <div className="space-y-3">
                {/* Applicant Name */}
                <div className="flex flex-col items-start">
                  <DialogTitle className="text-3xl font-semibold text-[#263238]">
                    {`${app.firstName} ${app.lastName}`}
                  </DialogTitle>
                </div>

                {/* Job Role */}
                <div className="text-[17px] text-[#263238] underline">
                  {app.position}
                </div>

                {/* Location */}
                <div className="flex items-center gap-2 text-[#263238]">
                  <MapPin className="h-4 w-4 text-[#F5722E]" />
                  <span className="text-[17px]">Based in {app.country}</span>
                </div>

                {/* Core Skills */}
                <div className="flex flex-col gap-2">
                  <h4 className="text-[17px] font-normal text-[#263238]">
                    Core Skills:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {app.coreSkills.map((skill, index) => (
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
                  <h4 className="text-[17px] font-normal text-[#263238]">
                    Experience:
                  </h4>
                  <span className="text-[#F5722E] border border-[#F5722E] px-2 rounded-sm">
                    {app.experience}
                  </span>
                </div>

                {/* Employment Preference */}
                <div className="flex items-center gap-2">
                  <h4 className="text-[17px] font-normal text-[#263238]">
                    Looking For:
                  </h4>
                  <div className="flex gap-2">
                    {app.lookingFor.map((pref) => (
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
                    {app.salaryExpectation}
                  </span>
                </div>

                {/* Languages */}
                <div className="flex items-center gap-2">
                  <h4 className="text-[17px] font-normal text-[#263238]">
                    Languages:
                  </h4>
                  <div className="flex gap-2">
                    {app.language.map((lang) => (
                      <span
                        key={lang}
                        className="text-[#F5722E] border border-[#F5722E] px-2 rounded-sm"
                      >
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Education */}
                <div className="flex items-center gap-2">
                  <h4 className="text-[17px] font-normal text-[#263238]">
                    Education:
                  </h4>
                  <span className="text-[#F5722E] border border-[#F5722E] px-2 rounded-sm">
                    {app.education}
                  </span>
                </div>

                {/* Interpersonal Skills */}
                {app.interpersonalSkills &&
                  app.interpersonalSkills.length > 0 && (
                    <div className="flex flex-col gap-2">
                      <h4 className="text-[17px] font-normal text-[#263238]">
                        Interpersonal Skills:
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {app.interpersonalSkills.map((skill, index) => (
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

                {/* Certificates */}
                {app.certificates && app.certificates.length > 0 && (
                  <div className="flex flex-col gap-2">
                    <h4 className="text-[17px] font-normal text-[#263238]">
                      Certificates:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {app.certificates.map((cert) => (
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
            jobId={app.jobId}
            jobHunterId={app.id}
            employerId={user?.data.user.id}
            timezone={userSettings?.data.timeZone}
            position={app.position}
            coreSkills={app.coreSkills}
            certificate={app.certificates}
            candidateName={`${app.firstName} ${app.lastName}`}
            country={app.country}
        />
      </DialogContent>
    </Dialog>
  );
};

export { AppPreviewModal };
