import { FC, useState } from "react";
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
import { Match } from "mockData/jobs-data";

interface JobCardProps {
  match: Match;
  isFreeTrial?: boolean;
}

const SecureCompanyDisplay: FC<{ isFreeTrial: boolean; company: string }> = ({
  isFreeTrial,
  company,
}) => {
  if (isFreeTrial) {
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

  return <p className="text-[13px] font-light mt-0 underline">{company}</p>;
};

const getAvailabilityStyle = (type: string) => {
  return type.toLowerCase() === "part time" ? "bg-orange-700" : "bg-orange-500";
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
        bookmarked ? "fill-orange-500" : ""
      } text-orange-500 ${className}`}
      size={26}
      onClick={(e) => {
        e.stopPropagation();
        handleBookmarkToggle(cardId);
      }}
    />
  );
};

const JobCard: FC<JobCardProps> = ({ match, isFreeTrial = false }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const cardId = generateCardId(match);

  const handleCardClick = () => {
    if (isFreeTrial) return;
    // Only open preview if schedule modal isn't open
    if (!isScheduleModalOpen) {
      setIsModalOpen(true);
    }
  };

  const handleInterested = (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    if (isFreeTrial) return;
    setIsScheduleModalOpen(true);
    setIsModalOpen(false);
  };

  return (
    <>
      <Card
        className={`bg-white border-none h-[275px] relative w-full max-w-[436px] transition-shadow duration-200 ${
          isFreeTrial ? "cursor-not-allowed" : "cursor-pointer hover:shadow-lg"
        }`}
        onClick={handleCardClick}
      >
        <CardHeader className="flex flex-col justify-between items-start pb-0">
          <div className="flex flex-row -mt-4 justify-between w-full">
            <span className="text-[13px] text-orange-500 font-semibold">
              ☆ NEW
            </span>
            <div className="flex flex-col items-end">
              <span className="text-[11px] font-light text-gray-400 -mr-2">
                Applied {match.appliedAgo}
              </span>
            </div>
          </div>
          <div className="w-full relative">
            <CardTitle className="text-sm font-semibold">
              {match.position}
            </CardTitle>
            <BookmarkButton
              cardId={cardId}
              className="absolute top-0 right-[-8px]"
            />
            <SecureCompanyDisplay
              isFreeTrial={isFreeTrial}
              company={match.company}
            />
            <div className="flex flex-row items-center gap-1">
              <MapPin size={14} className="text-orange-500" />
              <p className="text-[13px] font-light mt-0">
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
              <span className="text-[13px] font-light">Experience:</span>
              <span className="text-[12px] text-orange-500 font-light rounded-[4px] px-1.5 border border-orange-500">
                {match.experience}
              </span>
            </div>
            <div className="flex gap-x-2 gap-y-0 flex-wrap">
              <span className="text-[13px] font-light">Available for:</span>
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
              <span className="text-[13px] font-light">Salary:</span>
              <span className="bg-orange-500 text-white rounded-[4px] text-[12px] px-1.5 flex justify-center items-center">
                {match.salaryExpectation}
              </span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="absolute bottom-0 right-0 flex flex-row justify-end items-center space-x-1 p-2">
          <Button
            className="text-[10px] sm:text-[12px] font-semibold px-0 w-[100px] sm:w-[133px] h-[24px] sm:h-[27px] bg-orange-500"
            onClick={(e) => handleInterested(e)}
          >
            Schedule Interview
          </Button>
          <MoreVertical
            size={12}
            onClick={(e) => {
              e.stopPropagation();
              if (isFreeTrial) return;
              // Handle more options
            }}
          />
        </CardFooter>
      </Card>

      {!isFreeTrial && (
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
