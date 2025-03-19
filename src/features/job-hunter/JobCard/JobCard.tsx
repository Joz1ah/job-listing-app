import { FC, useState, useRef } from "react";
import { MoreVertical, MapPin, Bookmark } from "lucide-react";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
} from "components";
import { Button } from "components";
import { SkillsWithEllipsis } from "components";
import { JobPreviewModal } from "features/job-hunter";
import { useBookmarks } from "components";
import { ScheduleInterviewModal } from "features/job-hunter";
import { MatchJH } from "contexts/PerfectMatch/types";
import { useJobHunterContext } from "components";
import { AdDialogWrapper } from "components";

interface JobCardProps {
  jobId: number;
  match: MatchJH;
  popupImage?: string;
  adImage?: string; // Add adImage prop
  timerDuration?: number; // Add timer duration prop
}

interface SecureCompanyDisplayProps {
  company: string;
}

// Helper function to convert employment type values to labels
const getEmploymentTypeLabel = (value: string): string => {
  const employmentTypeMap: Record<string, string> = {
    "full-time": "Full Time",
    "part-time": "Part Time",
    "contract": "Contract only",
  };

  return employmentTypeMap[value.trim()] || value.trim();
};

// Updated to be case-insensitive for more reliability
const getAvailabilityStyle = (type: string) => {
  return type.toLowerCase().includes("part time") ? "bg-[#BF532C]" : "bg-[#F5722E]";
};

const SecureCompanyDisplay: FC<SecureCompanyDisplayProps> = ({ company }) => {
  const { subscriptionPlan } = useJobHunterContext();

  if (subscriptionPlan === "freeTrial") {
    return (
      <div className="relative">
        <div className="select-none pointer-events-none">
          <div className="relative">
            <div className="absolute inset-0 blur-[8px] text-sm font-semibold bg-clip-text">
              {Array(company.length).fill("X").join("")}
            </div>
          </div>
        </div>
        <div className="h-4" />
      </div>
    );
  }

  return (
    <p className="text-[13px] text-[#263238] font-light mt-0 underline">
      {company}
    </p>
  );
};

const generateCardId = (match: MatchJH): string => {
  return `${match.position}-${match.company}-${match.location}`
    .toLowerCase()
    .replace(/\s+/g, "-");
};

const BookmarkButton: FC<{
  cardId: string;
  className?: string;
}> = ({ cardId, className = "" }) => {
  const { isBookmarked, handleBookmarkToggle } = useBookmarks();
  const bookmarked = isBookmarked(cardId);

  return (
    <Bookmark
      className={`cursor-pointer ${
        bookmarked ? "fill-[#F5722E]" : ""
      } text-[#F5722E] ${className}`}
      size={26}
      onClick={(e) => {
        e.stopPropagation();
        handleBookmarkToggle(cardId);
      }}
    />
  );
};

const JobCard: FC<JobCardProps> = ({ match, popupImage, adImage }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const cardId = generateCardId(match);
  const { subscriptionPlan } = useJobHunterContext();

  // Ref for the AdDialogWrapper
  const adDialogRef = useRef<HTMLDivElement>(null);

  const handleCardClick = () => {
    if (subscriptionPlan === "freeTrial") return;
    if (!isScheduleModalOpen) {
      setIsModalOpen(true);
    }
  };

  const handleInterested = (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }

    if (subscriptionPlan === "freeTrial") {
      // Trigger the AdDialogWrapper click instead of opening a different dialog
      if (adDialogRef.current) {
        const clickEvent = new MouseEvent("click", {
          bubbles: true,
          cancelable: true,
          view: window,
        });
        adDialogRef.current.dispatchEvent(clickEvent);
      }
      return;
    }

    setIsScheduleModalOpen(true);
    setIsModalOpen(false);
  };

  return (
    <>
      <Card
        className={`bg-[#FFFFFF] border-none w-full max-w-[436px] h-[350px] sm:h-[275px] relative transition-shadow duration-200 ${
          subscriptionPlan === "freeTrial"
            ? "cursor-default"
            : "cursor-pointer hover:shadow-lg"
        }`}
        onClick={handleCardClick}
      >
        <CardHeader className="flex flex-col justify-between items-start pb-0">
          <div className="flex flex-row -mt-4 justify-between w-full">
            <div className="h-5">
              {match.isNew && (
                <span className="text-[13px] text-[#F5722E] font-bold italic">
                  ☆ NEW
                </span>
              )}
            </div>
            <div className="flex flex-col items-end">
              <span className="text-[11px] font-light text-[#717171] -mr-2">
                Posted {match.posted}
              </span>
            </div>
          </div>
          <div className="w-full relative">
            <CardTitle className="text-sm font-semibold text-[#263238]">
              {match.position}
            </CardTitle>
            <BookmarkButton
              cardId={cardId}
              className="absolute top-0 right-[-8px]"
            />
            <SecureCompanyDisplay company={match.company} />
            <div className="flex flex-row items-center gap-1">
              <MapPin size={14} className="text-[#F5722E]" />
              <p className="text-[13px] font-light mt-0 text-[#263238]">
                Based in {match.location}
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="h-auto md:h-[60px]">
            <SkillsWithEllipsis skills={match.coreSkills} />
          </div>

          <div className="flex flex-col gap-1 mt-2">
            <div className="flex gap-2 flex-wrap">
              <span className="text-[13px] font-light text-[#263238]">
                Experience:
              </span>
              <span className="text-[12px] text-[#F5722E] font-light rounded-[4px] px-1.5 border border-[#F5722E]">
                {match.experience}
              </span>
            </div>
            <div className="flex gap-2 gap-y-0 flex-wrap">
              <span className="text-[13px] font-light text-[#263238]">
                Available for:
              </span>
              {match.lookingFor.map((type, index) => {
                // First get the formatted label
                const formattedLabel = getEmploymentTypeLabel(type);
                // Then determine style based on the formatted label
                const styleClass = getAvailabilityStyle(formattedLabel);
                
                return (
                  <span
                    key={index}
                    className={`${styleClass} text-white rounded-[4px] text-[12px] px-1.5 h-[18px] flex justify-center items-center`}
                  >
                    {formattedLabel}
                  </span>
                );
              })}
            </div>
            <div className="flex gap-2 flex-wrap">
              <span className="text-[13px] font-light text-[#263238]">
                Salary:
              </span>
              <span className="bg-[#F5722E] text-white rounded-[4px] text-[12px] px-1.5 flex justify-center items-center">
                {match.salaryExpectation}
              </span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="absolute bottom-0 right-0 flex flex-row justify-end items-center space-x-1 p-2">
          <Button
            className="text-[12px] font-semibold px-0 w-[133px] h-[27px] bg-[#F5722E] hover:bg-[#F5722E]/90"
            onClick={(e) => handleInterested(e)}
          >
            Schedule Interview
          </Button>
          <MoreVertical
            size={12}
            className="text-[#717171]"
            onClick={(e) => {
              e.stopPropagation();
              if (subscriptionPlan === "freeTrial") return;
              // Handle more options
            }}
          />
        </CardFooter>
      </Card>

      {/* Hidden AdDialogWrapper for free trial users */}
      {subscriptionPlan === "freeTrial" && (
        <div className="hidden">
          <AdDialogWrapper
            ref={adDialogRef}
            adImage={adImage}
            popupImage={popupImage}
          />
        </div>
      )}

      {/* Only show these modals for paid users */}
      {subscriptionPlan !== "freeTrial" && (
        <>
          <JobPreviewModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            job={match}
            onSchedule={handleInterested}
          />
          <ScheduleInterviewModal
            isOpen={isScheduleModalOpen}
            onClose={() => setIsScheduleModalOpen(false)}
            jobTitle={match.position}
            coreSkills={match.coreSkills}
            company={match.company}
            location={match.location}
            certificate={match.certificates}
            jobId={match.jobId}
          />
        </>
      )}
    </>
  );
};

export { JobCard };