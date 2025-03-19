import { FC, useState, useEffect, useRef } from "react";
import { SkillsWithEllipsis } from "components";
import { Bookmark, MoreVertical, MapPin } from "lucide-react";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
} from "components";
import { Button } from "components";
import { useBookmarks } from "contexts/BookmarkContext";
import { AppPreviewModal } from "features/employer";
import { ScheduleInterviewModal } from "features/employer";
import { Match } from "contexts/PerfectMatch/types";
import { useEmployerContext } from "components";
import { useAuth } from "contexts/AuthContext/AuthContext";
import { AdDialogWrapper } from "components";

// Function to format the date string for display
const formatTimeAgo = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();

  // Convert to minutes, hours, days
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 60) {
    return "just now";
  } else if (diffHours < 24) {
    return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  } else {
    return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
  }
};

// Function to check if a post is new (less than 24 hours old)
const isNewPost = (dateString: string): boolean => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);

  return diffHours < 24;
};

interface AppCardProps {
  jobId: number;
  match: Match;
  bookmarked?: boolean;
  onBookmark?: () => void;
  popupImage?: string;
  adImage?: string; // Add adImage prop
  timerDuration?: number; // Add timer duration prop
}

interface SecureNameDisplayProps {
  realName: string;
}

// Helper function to convert employment type values to labels
const getEmploymentTypeLabel = (value: string): string => {
  const employmentTypeMap: Record<string, string> = {
    "full-time": "Full Time",
    "part-time": "Part Time",
    "contract": "Contract only",
  };

  return employmentTypeMap[value] || value;
};

const SecureNameDisplay: FC<SecureNameDisplayProps> = ({ realName }) => {
  const { subscriptionPlan } = useEmployerContext();

  if (subscriptionPlan === "freeTrial") {
    return (
      <div className="relative">
        <div className="select-none pointer-events-none">
          <div className="relative">
            <div className="absolute inset-0 blur-[8px] text-sm font-semibold bg-clip-text">
              {Array(realName.length).fill("X").join("")}
            </div>
          </div>
        </div>
        <div className="h-4" />
      </div>
    );
  }

  return (
    <CardTitle className="text-sm font-semibold text-[#263238]">
      {realName}
    </CardTitle>
  );
};

const getAvailabilityStyle = (type: string) => {
  return type.toLowerCase() === "part time" ? "bg-[#BF532C]" : "bg-[#F5722E]";
};

const generateCardId = (match: Match): string => {
  return `${match.firstName}-${match.lastName}-${match.position}-${match.location}`
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

const LanguageTag: FC<{ language: string }> = ({ language }) => (
  <span className="text-[12px] text-[#F5722E] font-light border border-[#F5722E] items-center rounded-sm px-1">
    {language}
  </span>
);

const AppCard: FC<AppCardProps> = ({ match, popupImage, adImage }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [formattedPostDate, setFormattedPostDate] = useState("N/A");
  const [shouldShowNew, setShouldShowNew] = useState(false);
  const { user } = useAuth();
  const cardId = generateCardId(match);
  const { subscriptionPlan } = useEmployerContext();
  console.log(match)

  // Ref for the AdDialogWrapper
  const adDialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (match.posted) {
      setFormattedPostDate(formatTimeAgo(match.posted));
      setShouldShowNew(isNewPost(match.posted));
    }
  }, [match.posted]);

  const handleCardClick = () => {
    if (subscriptionPlan === "freeTrial") return;
    if (!isScheduleModalOpen) {
      setIsModalOpen(true);
    }
  };

  const handleScheduleInterview = (e: React.MouseEvent) => {
    e.stopPropagation();

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
          <div className="flex flex-row -mt-4 justify-between w-full relative">
            <div className="h-5">
              {shouldShowNew && (
                <span className="text-[13px] text-[#F5722E] font-bold italic">
                  ☆ NEW
                </span>
              )}
            </div>
            <div className="flex flex-col items-end">
              <span className="text-[11px] font-light text-[#717171] -mr-2">
                Posted {formattedPostDate}
              </span>
            </div>
          </div>
          <div className="w-full relative">
            <SecureNameDisplay
              realName={`${match.firstName} ${match.lastName}`}
            />
            <BookmarkButton
              cardId={cardId}
              className="absolute top-0 right-[-8px]"
            />
            <div className="flex flex-row items-center">
              <MapPin size={14} className="text-[#F5722E]" />
              <p className="text-[13px] font-light mt-0 text-[#263238]">
                Based in {match.country}
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="h-auto md:h-[60px]">
            <SkillsWithEllipsis skills={match.coreSkills} />
          </div>

          <div className="flex flex-col gap-1 mt-2">
            <div className="flex gap-2">
              <span className="text-[13px] font-light text-[#263238]">
                Experience:
              </span>
              <span className="text-[12px] text-[#F5722E] font-light border border-[#F5722E] items-center rounded-[2px] px-1">
                {match.experience}
              </span>
            </div>
            <div className="flex gap-2 gap-y-0 flex-wrap">
              <span className="text-[13px] font-light text-[#263238]">
                Looking for:
              </span>
              {match.lookingFor.map((type, index) => (
                <span
                  key={index}
                  className={`${getAvailabilityStyle(getEmploymentTypeLabel(type))} text-white rounded-[4px] text-[12px] px-1.5 h-[18px] flex justify-center items-center`}
                >
                  {getEmploymentTypeLabel(type)}
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <span className="text-[13px] font-light text-[#263238]">
                Salary:
              </span>
              <span className="bg-[#F5722E] text-white rounded-[4px] text-[12px] px-1.5 h-[18px] flex justify-center items-center">
                {match.salaryExpectation}
              </span>
            </div>
            <div className="flex gap-2 flex-wrap">
              <span className="text-[13px] font-light text-[#263238]">
                Language:
              </span>
              {match.language.map((lang, index) => (
                <LanguageTag key={index} language={lang} />
              ))}
            </div>
          </div>
        </CardContent>

        <CardFooter className="absolute bottom-0 right-0 flex flex-row justify-end items-center space-x-1 p-2">
          <Button
            className="text-[12px] font-semibold px-0 w-[133px] h-[27px] bg-[#F5722E] hover:bg-[#F5722E]/90"
            onClick={handleScheduleInterview}
          >
            Schedule Interview
          </Button>
          <MoreVertical
            size={12}
            className="text-gray-700 cursor-pointer"
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
          <AppPreviewModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            app={match}
            onSchedule={handleScheduleInterview}
          />
          <ScheduleInterviewModal
            isOpen={isScheduleModalOpen}
            onClose={() => setIsScheduleModalOpen(false)}
            jobId={match.jobId}
            jobHunterId={match.id}
            employerId={user?.data.user.id}
            position={match.position}
            coreSkills={match.coreSkills}
            certificate={match.certificates}
            candidateName={`${match.firstName} ${match.lastName}`}
            country={match.country}
          />
        </>
      )}
    </>
  );
};

export { AppCard };
