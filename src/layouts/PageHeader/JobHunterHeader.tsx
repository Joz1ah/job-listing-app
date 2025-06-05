import { FC } from "react";
import { BriefcaseBusiness, DollarSign, Info, MapPin } from "lucide-react";
import { Tooltip } from "components";
import { useJobHunterContext } from "components";
import { useAuth } from "contexts/AuthContext/AuthContext";

const JobHunterHeader: FC = () => {
  const { subscriptionPlan } = useJobHunterContext();
  const { user } = useAuth();
  const relatedDetails = user?.data?.user?.relatedDetails;

  // Format employment type and include Full Time, Part Time, and Contract Only
  const formatEmploymentTypes = (types: string) => {
    return types
      .split(",")
      .map((type) =>
        type
          .split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ")
          .trim(),
      )
      .filter((type) => type === "Full Time" || type === "Part Time" || type === "Contract");
  };

  return (
    <div className="w-full px-8 md:px-16 py-8 md:mt-16">
      <div className="flex flex-col space-y-3">
        <div className="flex flex-col space-y-2 md:space-y-4">
          <h1 className="text-3xl text-white font-normal">
            Welcome to your dashboard, {relatedDetails?.firstName}!
          </h1>

          <div className="flex items-center justify-between md:justify-start md:gap-8">
            <div className="flex items-center space-x-2 text-white font-light">
              <MapPin className="text-[#F5722E]" size={20} />
              <span className="text-[13px] md:text-[17px]">
                {relatedDetails?.country}
              </span>
            </div>
          </div>

          {subscriptionPlan !== "freeTrial" && (
            <div className="hidden md:flex items-center space-x-2 font-light text-white">
              <span className="border-2 border-dotted border-[#F5722E] text-[15px] px-2 py-1 border-opacity-70 whitespace-nowrap">
                Your interview rating from Employers
              </span>
              <Tooltip content="This is how employers rated your interview">
                <Info className="fill-[#D6D6D6] text-[#263238]" size={14} />
              </Tooltip>
            </div>
          )}
        </div>

        <div className="flex flex-col space-y-3.5">
          <div className="flex items-center space-x-2 text-white">
            <DollarSign className="text-[#F5722E]" size={20} strokeWidth={4} />
            <span className="text-[13px] md:text-[15px]">
              Expected Salary:{" "}
            </span>
            <span className="outline outline-1 outline-[#F5722E] text-[#F5722E] px-1 font-semibold text-[10px] md:text-[15px] rounded-[2px]">
              {relatedDetails.salaryRange}
            </span>
          </div>

          <div className="flex items-center flex-wrap text-white">
            <div className="flex items-center mr-2">
              <BriefcaseBusiness
                className="fill-[#F5722E] text-[#263238]"
                size={20}
              />
              <span className="text-[13px] md:text-[15px] ml-2">
                Employment Preference:{" "}
              </span>
            </div>

            <div className="flex gap-2">
              {formatEmploymentTypes(relatedDetails?.employmentType || "").map(
                (type: string) => (
                  <span
                    key={type}
                    className="whitespace-nowrap outline outline-1 outline-[#F5722E] text-[#F5722E] px-1 text-[10px] md:text-[15px] rounded-[2px]"
                  >
                    {type}
                  </span>
                ),
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { JobHunterHeader };