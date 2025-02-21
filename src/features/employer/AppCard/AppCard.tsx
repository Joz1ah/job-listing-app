import { FC, useState } from "react";
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
//import { AdDialogWrapper } from "components";
//import { Match } from "mockData/job-hunter-data";
import { Match } from "contexts/PerfectMatch/types";
import { useEmployerContext } from "components";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle } from "components";
import { useNavigate } from "react-router-dom";

interface AppCardProps {
  match: Match;
  bookmarked?: boolean;
  onBookmark?: () => void;
  popupImage?: string;
}

interface SecureNameDisplayProps {
  realName: string;
}

const SecureNameDisplay: FC<SecureNameDisplayProps> = ({
  realName,
}) => {

  const { subscriptionPlan } = useEmployerContext();


  if (subscriptionPlan === 'freeTrial') {
    return (
      <div className="relative">
        <div className="select-none pointer-events-none">
          <div className="relative">
            <div className="absolute inset-0 blur-[8px] text-sm font-semibold bg-clip-text">
              {Array(realName.length).fill("X").join("")}
            </div>
          </div>
        </div>
        <div className="h-6" />
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

const AppCard: FC<AppCardProps> = ({ match, popupImage }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isAdDialogOpen, setIsAdDialogOpen] = useState(false);
  const cardId = generateCardId(match);
  const { subscriptionPlan } = useEmployerContext();
  const navigate = useNavigate();

  const handleCardClick = () => {
    if (subscriptionPlan === 'freeTrial') return;
    if (!isScheduleModalOpen) {
      setIsModalOpen(true);
    }
  };

  const handleScheduleInterview = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (subscriptionPlan === 'freeTrial') {
      setIsAdDialogOpen(true);
      return;
    }
    setIsScheduleModalOpen(true);
    setIsModalOpen(false);
  };

  return (
    <>
      <Card
        className={`bg-[#FFFFFF] border-none w-full max-w-[436px] h-[275px] relative transition-shadow duration-200 ${
          subscriptionPlan === 'freeTrial' ? "cursor-default" : "cursor-pointer hover:shadow-lg"
        }`}
        onClick={handleCardClick}
      >
        <CardHeader className="flex flex-col justify-between items-start pb-0">
          <div className="flex flex-row -mt-4 justify-between w-full relative">
            <div className="h-5">
              {match.isNew && (
                <span className="text-[13px] text-[#F5722E] font-bold italic">
                  ☆ NEW
                </span>
              )}
            </div>
            <div className="flex flex-col items-end">
              <span className="text-[11px] font-light text-[#717171] -mr-2">
                Posted {match.posted} ago
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
                Based in {match.location}
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="h-[55px]">
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
                  className={`${getAvailabilityStyle(type)} text-white rounded-[4px] text-[12px] px-1.5 h-[18px] flex justify-center items-center`}
                >
                  {type}
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
              if (subscriptionPlan === 'freeTrial') return;
              // Handle more options
            }}
          />
        </CardFooter>
      </Card>

      {subscriptionPlan === 'freeTrial' ? (
        <AlertDialog open={isAdDialogOpen} onOpenChange={setIsAdDialogOpen}>
          <AlertDialogContent className="bg-white p-0 border-none">
            <AlertDialogHeader>
              <AlertDialogTitle asChild>
                <img
                  src={popupImage}
                  alt="Upgrade Subscription"
                  className="w-full h-auto object-contain rounded-lg cursor-pointer"
                  onClick={() => {
                    setIsAdDialogOpen(false);
                    navigate('account-settings/subscription');
                  }}
                />
              </AlertDialogTitle>
            </AlertDialogHeader>
          </AlertDialogContent>
        </AlertDialog>
      ) : (
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
            position={match.position}
            coreSkills={match.coreSkills}
            certificate={match.certificates}
            candidateName={`${match.firstName} ${match.lastName}`}
            location={match.location}
          />
        </>
      )}
    </>
  );
};

export { AppCard };
