import { FC } from "react";
import {
  BriefcaseBusiness,
  DollarSign,
  Info,
  MapPin,
} from "lucide-react";
import { Tooltip } from "components";
import { useJobHunterContext } from "components";
import { useAuth } from "contexts/AuthContext/AuthContext";

const JobHunterHeader: FC = () => {
  const { subscriptionPlan } = useJobHunterContext();
  const { user } = useAuth();
  const relatedDetails = user?.data?.user?.relatedDetails;

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

  // Format salary range from "71-100" to "$71,000 - $100,000"
  const formatSalaryRange = (range: string) => {
    const [min, max] = range.split("-");
    return `${min},000 - ${max},000`;
  };

  // Format employment type (e.g., "full-time" to "Full Time", "contract" to "Contract Only")
  const formatEmploymentType = (type: string) => {
    const formattedType = type
      .split("-")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
    
    return formattedType === "Contract" ? "Contract Only" : formattedType;
  };

  return (
    <div className="w-full px-6 md:px-16 py-8 md:mt-16">
      <div className="flex flex-col space-y-3">
        <div className="flex flex-col space-y-2 md:space-y-4">
          <h1 className="text-3xl text-white font-normal">
            Welcome to your dashboard, {relatedDetails?.firstName}!
          </h1>

          <div className="flex items-center justify-between md:justify-start md:gap-8">
            <div className="flex items-center space-x-2 text-white font-light">
              <MapPin className="text-[#F5722E]" size={20} />
              <span className="text-[13px] md:text-[17px]">{relatedDetails?.country}</span>
            </div>
          </div>

          {subscriptionPlan !== "freeTrial" && (
            <div className="hidden md:flex items-center space-x-2">
              <DesktopTooltip content="This shows your profile completeness">
                <div className="flex items-center space-x-2 font-light text-white">
                  <span className="border-2 border-dotted border-[#F5722E] text-[15px] px-2 py-1 border-opacity-70 whitespace-nowrap">
                    Profile Status
                  </span>
                  <Info className="fill-[#D6D6D6] text-[#263238]" size={14} />
                </div>
              </DesktopTooltip>
            </div>
          )}
        </div>

        <div className="flex flex-col space-y-3.5">
          <div className="flex items-center space-x-2 text-white">
            <DollarSign className="text-[#F5722E]" size={20} strokeWidth={4} />
            <span className="text-[13px] md:text-[15px]">
              Expected Salary:{" "}
            </span>
            <span className="outline outline-1 outline-[#F5722E] text-[#F5722E] px-1 font-semibold text-[13px] md:text-[15px] rounded-[2px]">
              {formatSalaryRange(relatedDetails?.salaryRange || "0-0")}
            </span>
          </div>

          <div className="flex items-center space-x-2 text-white">
            <BriefcaseBusiness
              className="fill-[#F5722E] text-[#263238]"
              size={20}
            />
            <span className="text-[13px] md:text-[15px]">
              Employment Preference:{" "}
            </span>
                          {relatedDetails?.employmentType?.split(",").map((type: string) => (
              <span 
                key={type}
                className="outline outline-1 outline-[#F5722E] text-[#F5722E] px-1 text-[13px] md:text-[15px] rounded-[2px]"
              >
                {formatEmploymentType(type.trim())}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export { JobHunterHeader };