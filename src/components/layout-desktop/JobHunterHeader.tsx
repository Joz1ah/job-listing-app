import { FC } from "react";
import {BriefcaseBusiness, DollarSign, Info, Star, MapPin } from "lucide-react";

const JobHunterHeader: FC = () => {
  const rating = 4.5;
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;

  return (
    <div className="w-full px-6 md:pt-16 mt-8 md:mt-16 md:pl-16">
      <div className="flex flex-col items-start">
        <div className="flex items-center text-3xl md:text-3xl text-white font-normal">
          <span>Welcome to your dashboard, Michael!</span>
        </div>
      </div>
      <div className="flex flex-row md:flex-col items-center md:items-start mt-2 justify-between space-y-2 md:space-y-0">
        <div className="flex items-center space-x-2 text-white font-light pt-2 md:pt-0 md:pb-2">
          <MapPin className="text-[#F5722E]" size={19} />
          <span className="text-[13px] md:text-[15px]">Philippines</span>
        </div>
        <span className="md:hidden text-[#AEADAD]">•</span>

        {/* Mobile view - shown on small screens */}
        <div className="md:hidden flex items-center text-[13px] text-white">
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
                    <Star size={16} className="text-[#F5722E] fill-[#F5722E]" />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Desktop view - hidden on small screens, shown on md and up */}
        <div className="hidden md:flex flex-col items-start mt-2 mx-0">
          <div className="flex items-center space-x-1 text-[11px] font-light text-white">
            <span className="border-2 border-dotted border-orange-500 text-white text-[15px] px-2 py-1 border-opacity-70">
              Your interview from rating employers
            </span>
            <Info className="fill-[#D6D6D6] text-[#263238] mb-4" size={13} />
          </div>
        </div>
      </div>
      <div className="flex flex-col items-start mt-2 space-y-2">
        <div className="flex items-center space-x-2 text-[11px] font-light text-white">
          <DollarSign className="text-orange-500" size={14} strokeWidth={4} />
          <span className="text-[13px] md:text-[15px]">Expected Salary: </span>
          <span className="outline outline-1 outline-orange-500 underline text-orange-500 px-1 font-semibold sm:text-[10px] md:text-[15px] rounded-[2px]">
            $100,000
          </span>
          <span className="outline outline-1 outline-white px-1 ml-1 sm:text-[10px] md:text-[15px] rounded-[2px]">
            per year
          </span>
        </div>
      </div>
      <div className="flex flex-col items-start mt-2 space-y-2">
        <div className="flex items-center space-x-2 text-[11px] font-light text-white">
          <BriefcaseBusiness
            className="fill-orange-500 text-[#263238]"
            size={14}
          />
          <span className="text-[13px] md:text-[15px]">
            Employment Preference:{" "}
          </span>
          <span className="outline outline-1 outline-orange-500 text-orange-500 px-1 sm:text-[10px] md:text-[15px] rounded-[2px]">
            Full Time
          </span>
          <span className="outline outline-1 outline-orange-500 text-orange-500 px-1 sm:text-[10px] md:text-[15px] rounded-[2px]">
            Part Time
          </span>
        </div>
      </div>
    </div>
  );
};

export { JobHunterHeader };
