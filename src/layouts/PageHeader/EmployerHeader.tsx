import { FC } from "react";
import { Building } from "lucide-react";
import { useLocation } from "react-router-dom";
import { Tooltip } from "components";
import { Info } from "lucide-react";
//import verifiedIcon from "images/verified.svg?url";
import { useEmployerContext } from "components";
import { useAuth } from "contexts/AuthContext/AuthContext";

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

const EmployerHeader: FC = () => {
  const { subscriptionPlan } = useEmployerContext();
  const location = useLocation();
  const hideOnPagesMobile = [
    "/dashboard/job-listing",
    "/dashboard/employer-profile",
  ];
  const hideOnPagesDesktop = ["/dashboard/employer-profile"];

  const hideOnMobile = hideOnPagesMobile.includes(location.pathname);
  const hideOnDesktop = hideOnPagesDesktop.includes(location.pathname);
  const { user } = useAuth();
  const businessName = user?.data?.user?.relatedDetails?.businessName || "Company Name";

  return (
    <div
      className={`w-full pt-8 pb-6 ${
        hideOnMobile ? "hidden md:block" : "block"
      } ${hideOnDesktop ? "md:hidden" : ""}`}
    >
      <div className="flex flex-col items-center md:flex-row md:justify-between md:items-start">
        <div className="flex flex-col space-y-2 md:space-y-4 px-4 md:px-0">
          <div className="flex items-start">
            <div className="flex-1">
              <h1 
                className="text-3xl text-white font-normal break-all md:break-words line-clamp-1 max-w-full"
                title={businessName}
              >
                {businessName}
              </h1>
            </div>
            {/* <div className="flex-shrink-0 ml-2">
              {subscriptionPlan === "freeTrial" ? (
                <Tooltip
                  content={
                    <div className="flex flex-col gap-2">
                      <div className="text-xs">
                        Subscribe to unlock your verification status.
                      </div>
                      <div className="flex items-center text-sm">
                        {businessName}
                        <img
                          src={verifiedIcon}
                          className="ml-1 w-4 h-4 text-orange-500"
                        />
                      </div>
                    </div>
                  }
                >
                  <Info
                    className="fill-[#F5F5F7] text-[#263238]"
                    size={34}
                  />
                </Tooltip>
              ) : (
                <img
                  src={verifiedIcon}
                  className="w-8 h-8"
                  alt="Verified"
                />
              )}
            </div> */}
          </div>

          <div className="flex flex-col space-y-3">
            <div className="flex items-center space-x-2 text-white font-light">
              <Building className="fill-[#D6D6D6] text-[#263238]" size={19} />
              <span className="text-[15px]">
                {user?.data?.user?.relatedDetails?.city}, {user?.data?.user?.relatedDetails?.state}, {user?.data?.user?.relatedDetails?.country}
              </span>
            </div>

            {subscriptionPlan !== "freeTrial" && (
              <DesktopTooltip content="This is how job hunters rated your interview">
                <div className="hidden md:flex items-center space-x-2">
                  <div className="border-2 border-dotted border-[#F5722E] text-white text-[15px] px-2 py-1 border-opacity-70 whitespace-nowrap">
                    Your interview ratings from Job Hunters
                  </div>
                  <Info className="fill-[#D6D6D6] text-[#263238]" size={14} />
                </div>
              </DesktopTooltip>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export { EmployerHeader };