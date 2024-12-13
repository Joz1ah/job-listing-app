import { FC } from "react";
import {
  BriefcaseBusiness,
  DollarSign,
  Info,
  Star,
  MapPin,
} from "lucide-react";
import { Tooltip } from "components";

const JobHunterHeader: FC = () => {
  const rating = 4.5;
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;

  const DesktopTooltip = ({
    content,
    children,
  }: {
    content: string;
    children: React.ReactNode;
  }) => (
    <>
      <div className="md:hidden">{children}</div>
      <div className="hidden md:block">
        <Tooltip content={content}>{children}</Tooltip>
      </div>
    </>
  );

  return (
    <div className="w-full px-6 md:px-16 py-8 md:mt-16">
      <div className="flex flex-col space-y-4 md:space-y-6">
        <div className="flex flex-col space-y-2 md:space-y-4">
          <h1 className="text-3xl text-white font-normal">
            Welcome to your dashboard, Michael!
          </h1>

          <div className="flex items-center justify-between md:justify-start md:gap-8">
            <div className="flex items-center space-x-2 text-white font-light">
              <MapPin className="text-[#F5722E]" size={19} />
              <span className="text-[13px] md:text-[17px]">Philippines</span>
            </div>

            {/* Mobile rating */}
            <div className="flex items-center md:hidden">
              <span className="text-[#AEADAD] mx-4">•</span>
              <div className="flex items-center text-[13px] text-white">
                <span>Employer Rating:</span>
                <div className="flex items-center ml-2">
                  {rating}
                  <div className="flex ml-1">
                    {[...Array(fullStars)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className="text-[#F5722E] fill-[#F5722E]"
                      />
                    ))}
                    {hasHalfStar && (
                      <div className="relative ml-1">
                        <Star size={16} className="text-[#F5722E]" />
                        <div className="absolute inset-0 overflow-hidden w-1/2">
                          <Star
                            size={16}
                            className="text-[#F5722E] fill-[#F5722E]"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Desktop interview rating */}
          <div className="hidden md:flex items-center space-x-2">
            <DesktopTooltip content="This is how employer rated your interview">
              <div className="flex items-center space-x-2 font-light text-white">
                <span className="border-2 border-dotted border-[#F5722E] text-[15px] px-2 py-1 border-opacity-70 whitespace-nowrap">
                  Your interview from rating employers
                </span>
                <Info className="fill-[#D6D6D6] text-[#263238]" size={14} />
              </div>
            </DesktopTooltip>
          </div>
        </div>

        <div className="flex flex-col space-y-3">
          <div className="flex items-center space-x-2 text-white">
            <DollarSign className="text-[#F5722E]" size={14} strokeWidth={4} />
            <span className="text-[13px] md:text-[15px]">
              Expected Salary:{" "}
            </span>
            <span className="outline outline-1 outline-[#F5722E] text-[#F5722E] px-1 font-semibold text-[13px] md:text-[15px] rounded-[2px]">
              $100,000 - $120,000
            </span>
          </div>

          <div className="flex items-center space-x-2 text-white">
            <BriefcaseBusiness
              className="fill-[#F5722E] text-[#263238]"
              size={14}
            />
            <span className="text-[13px] md:text-[15px]">
              Employment Preference:{" "}
            </span>
            <span className="outline outline-1 outline-[#F5722E] text-[#F5722E] px-1 text-[13px] md:text-[15px] rounded-[2px]">
              Full Time
            </span>
            <span className="outline outline-1 outline-[#F5722E] text-[#F5722E] px-1 text-[13px] md:text-[15px] rounded-[2px]">
              Part Time
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export { JobHunterHeader };
