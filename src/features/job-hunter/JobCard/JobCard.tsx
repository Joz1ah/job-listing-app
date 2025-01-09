import { FC, useState } from "react";
import { MoreVertical, MapPin, Bookmark } from "lucide-react";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle
} from "components";
import { Button } from "components";
import { SkillsWithEllipsis } from "components";
import { JobPreviewModal } from "features/job-hunter";
import { useBookmarks } from "components";
import { ScheduleInterviewModal } from "features/job-hunter";
import { Match } from "mockData/jobs-data";
import { useJobHunterContext } from "components";
import { useNavigate } from "react-router-dom";

interface JobCardProps {
  match: Match;
  popupImage?: string;
}

interface SecureCompanyDisplayProps {
  company: string
}

const SecureCompanyDisplay: FC<SecureCompanyDisplayProps> = ({
  company,
}) => {
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
        <div className="h-6" />
      </div>
    );
  }

  return (
    <p className="text-[13px] text-[#263238] font-light mt-0 underline">
      {company}
    </p>
  );
};

const getAvailabilityStyle = (type: string) => {
  return type.toLowerCase() === "part time" ? "bg-[#BF532C]" : "bg-[#F5722E]";
};

const generateCardId = (match: Match): string => {
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

const JobCard: FC<JobCardProps> = ({ match, popupImage }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isUpgradeDialogOpen, setIsUpgradeDialogOpen] = useState(false);
  const cardId = generateCardId(match);
  const { subscriptionPlan } = useJobHunterContext();
  const navigate = useNavigate();

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
      setIsUpgradeDialogOpen(true);
      return;
    }
    setIsScheduleModalOpen(true);
    setIsModalOpen(false);
  };

  return (
    <>
      <Card
        className={`bg-white border-none h-[275px] relative w-full max-w-[436px] transition-shadow duration-200 ${
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
                Posted {match.posted} ago
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
            <SecureCompanyDisplay
              company={match.company}
            />
            <div className="flex flex-row items-center gap-1">
              <MapPin size={14} className="text-[#F5722E]" />
              <p className="text-[13px] font-light mt-0 text-[#263238]">
                Based in {match.location}
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="h-[60px]">
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
            <div className="flex gap-x-2 gap-y-0 flex-wrap">
              <span className="text-[13px] font-light text-[#263238]">
                Available for:
              </span>
              {match.lookingFor.map((type, idx) => (
                <span
                  key={idx}
                  className={`${getAvailabilityStyle(type)} text-white rounded-[4px] text-[12px] px-1.5 h-[18px] flex justify-center items-center`}
                >
                  {type}
                </span>
              ))}
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

      {subscriptionPlan === "freeTrial" ? (
        <AlertDialog open={isUpgradeDialogOpen} onOpenChange={setIsUpgradeDialogOpen}>
          <AlertDialogContent className="bg-white p-0 border-none">
            <AlertDialogHeader>
              <AlertDialogTitle asChild>
                <img
                  src={popupImage}
                  alt="Upgrade Subscription"
                  className="w-full h-auto object-contain rounded-lg cursor-pointer"
                  onClick={() => {
                    setIsUpgradeDialogOpen(false);
                    navigate('account-settings/subscription');
                  }}
                />
              </AlertDialogTitle>
            </AlertDialogHeader>
          </AlertDialogContent>
        </AlertDialog>
      ) : (
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
          />
        </>
      )}
    </>
  );
};

export { JobCard };
