import { FC } from "react";
import { BadgeCheck, Building, Info, Star } from "lucide-react";
import { useLocation } from "react-router-dom";
import { Tooltip } from "components";

interface Props {
  isFreeTrial?: boolean;
}

const DesktopTooltip = ({ content, children }: { content: string, children: React.ReactNode }) => (
  <>
    <div className="md:hidden">{children}</div>
    <div className="hidden md:block">
      <Tooltip content={content}>{children}</Tooltip>
    </div>
  </>
);

const EmployerHeader: FC<Props> = ({ isFreeTrial = false }) => {
  const rating = 4.5;
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;

  const location = useLocation();
  const hideOnPagesMobile = [
    "/job-feed-employer/job-listing",
    "/job-feed-employer/employer-profile",
  ];
  const hideOnPagesDesktop = ["/job-feed-employer/employer-profile"];

  const hideOnMobile = hideOnPagesMobile.includes(location.pathname);
  const hideOnDesktop = hideOnPagesDesktop.includes(location.pathname);

  const VerificationIcon = isFreeTrial ? Info : BadgeCheck;

  return (
    <div
      className={`w-full pt-8 pb-6 ${
        hideOnMobile ? "hidden md:block" : "block"
      } ${hideOnDesktop ? "md:hidden" : ""}`}
    >
      <div className="flex flex-col items-center md:items-start">
        <div className="flex items-center text-3xl md:text-3xl text-white font-normal">
          <span>ABC Incorporated</span>
          <VerificationIcon
            className={`${
              isFreeTrial
                ? "fill-[#F5F5F7] text-[#263238]"
                : "fill-[#F5722E] text-[#263238]"
            }`}
            size={34}
          />
        </div>
      </div>
      
      <div className="flex flex-col items-center md:items-start mt-2 justify-between space-y-2 md:space-y-0">
        <div className="flex flex-col md:space-y-2">
          <div className="flex items-center space-x-2 text-white font-light pt-2 md:pt-0 md:pb-2">
            <Building className="fill-[#D6D6D6] text-[#263238]" size={19} />
            <span className="text-[15px]">
              Germany, South Africa, and China
            </span>
          </div>

          {/* Desktop view - interview rating */}
          <DesktopTooltip content="This is how job hunters rated your interview">
          <div className="hidden md:flex items-center space-x-2">
            <span className="border-2 border-dotted border-orange-500 text-white text-[15px] px-2 py-1 border-opacity-70">
              Your interview from rating employers
            </span>
            <Info className="fill-[#D6D6D6] text-[#263238] mb-4" size={14}/>
          </div>
          </DesktopTooltip>
        </div>

        {/* Mobile view - star rating (hidden on job creation page) */}
        {!hideOnMobile && (
          <div className="md:hidden flex items-center text-[15px] text-white">
            <div className="flex items-center">
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
            <span className="pl-2">Job Hunter Rating</span>
          </div>
        )}
      </div>
    </div>
  );
};

export { EmployerHeader };