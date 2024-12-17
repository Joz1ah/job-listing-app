import { FC, useState } from "react";
import { SkillsWithEllipsis } from "components";
import { Bookmark, MoreVertical, MapPin } from "lucide-react";
import { Card, CardHeader, CardContent, CardFooter } from "components";
import { Button } from "components";
import { Match } from "mockData/jobs-data";
import { JobPreviewModal } from "../JobCard/job-preview/JobPreviewModal";

interface BookmarkCardProps {
  match: Match;
  bookmarked?: boolean;
  onBookmark?: () => void;
}

const getAvailabilityStyle = (type: string) => {
  return type.toLowerCase() === "part time" ? "bg-[#BF532C]" : "bg-[#F5722E]";
};

const BookmarkCard: FC<BookmarkCardProps> = ({ match }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCardClick = () => {
    setIsModalOpen(true);
  };

  return (
    <>
      <Card
        className="bg-[#FFFFFF] border-none w-full md:w-[436px] h-[275px] relative cursor-pointer"
        onClick={handleCardClick}
      >
        <div className="flex flex-col h-full">
          <CardHeader className="flex flex-col justify-between items-start pb-0">
            <div className="flex flex-row -mt-4 justify-between w-full">
              <div className="h-[20px]">
                <span className="absolute text-[13px] text-[#F5722E] font-bold italic">
                  ☆ NEW
                </span>
              </div>
              <div className="flex flex-col items-end relative">
                <span className="text-[12px] font-light text-[#717171] -mr-2">
                  Posted {match.posted} ago
                </span>
                <div className="absolute top-6 -right-2">
                  <Bookmark className="w-6 h-6 text-[#F5722E] " />
                </div>
              </div>
            </div>
            <div className="w-full relative mt-2">
              <h3 className="text-[14px] font-semibold text-[#263238]">
                {match.position}
              </h3>
              <p className="text-[13px] text-[#263238] underline">
                {match.company}
              </p>
              <div className="flex flex-row items-center">
                <MapPin size={14} className="text-[#F5722E]" />
                <p className="text-[13px] font-light mt-0 ml-2 text-[#263238]">
                  Based in {match.location}
                </p>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-1 flex-1">
            <div className="h-[50px]">
              <SkillsWithEllipsis skills={match.coreSkills} />
            </div>

            <div className="flex flex-col gap-2 mt-4">
              <div className="flex gap-2 items-center">
                <span className="text-[13px] font-light text-[#263238]">
                  Experience:
                </span>
                <span className="text-[12px] text-[#F5722E] font-light border border-[#F5722E] items-center rounded-[2px] px-1">
                  {match.experience}
                </span>
              </div>
              <div className="flex gap-2 items-center flex-wrap">
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
              <div className="flex gap-2 items-center">
                <span className="text-[13px] font-light text-[#263238]">
                  Salary:
                </span>
                <span className="bg-[#F5722E] text-white rounded-[4px] text-[12px] px-1.5 h-[18px] flex justify-center items-center">
                  {match.salaryExpectation}
                </span>
              </div>
            </div>
          </CardContent>

          <CardFooter className="absolute bottom-0 right-0 flex flex-row justify-end items-center space-x-1 p-2">
            <Button
              variant="outline"
              className="text-[10px] md:text-[12px] font-normal w-[60px] h-[24px] bg-[#168AAD] hover:bg-[#168AAD]/90 text-white hover:text-white rounded-sm"
            >
              Button
            </Button>
            <Button
              variant="outline"
              className="text-[10px] md:text-[12px] font-normal w-[60px] h-[24px] bg-[#168AAD] hover:bg-[#168AAD]/90 text-white hover:text-white rounded-sm"
            >
              Button
            </Button>
            <Button
              variant="outline"
              className="text-[10px] md:text-[12px] font-normal w-[60px] h-[24px] bg-[#168AAD] hover:bg-[#168AAD]/90 text-white hover:text-white rounded-sm"
            >
              Button
            </Button>
            <MoreVertical
              size={12}
              className="text-gray-700 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                // Handle more options
              }}
            />
          </CardFooter>
        </div>
      </Card>

      <JobPreviewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        job={match}
      />
    </>
  );
};

export { BookmarkCard };
