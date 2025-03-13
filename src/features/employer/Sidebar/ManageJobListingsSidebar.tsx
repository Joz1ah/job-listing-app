import { FC, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { List, XCircle, CircleCheck } from "lucide-react";
/* import { Info } from "lucide-react";
import verifiedIcon from "images/verified.svg?url"; */
import userCheck from "images/user-check.svg?url";
import { useEmployerContext } from "components";
import { useAuth } from "contexts/AuthContext/AuthContext";

interface MenuItem {
  icon: JSX.Element;
  label: string;
  path: string;
}

interface ManageJobsSidebarProps {
  userName: string;
  className?: string;
}

const ManageJobListingsSidebar: FC<ManageJobsSidebarProps> = ({
  userName,
  className = "",
}) => {
  const location = useLocation();
  const baseRoute = "/dashboard/manage-job-listings";
  const { subscriptionPlan } = useEmployerContext();
  const [displayPlan, setDisplayPlan] = useState(subscriptionPlan);
  const { user } = useAuth();

  useEffect(() => {
    // Get user data from context or wherever it's available
    const userData = user?.data?.user || {};
    // Access nested subscriptions array correctly
    const subscriptions = userData.subscriptions || [];

    // IMPORTANT: We want to show the plan type regardless of free trial status
    // if there are any subscriptions in the history (even inactive ones)
    if (subscriptions && subscriptions.length > 0) {
      // Sort subscriptions by ID to find the most recent one (highest ID)
      const sortedSubscriptions = [...subscriptions].sort(
        (a, b) => b.id - a.id,
      );
      const latestSubscription = sortedSubscriptions[0];

      // Convert plan value to displayPlan format - ignore subscription status
      if (latestSubscription.plan === "Monthly") {
        setDisplayPlan("monthlyPlan");
      } else if (latestSubscription.plan === "Yearly") {
        setDisplayPlan("yearlyPlan");
      }
    } else {
      // Only fall back to the current subscription plan if no subscription history
      setDisplayPlan(subscriptionPlan);
    }
  }, [subscriptionPlan, user]);

  const jobListingsMenu: MenuItem[] = [
    {
      icon: <List className="w-5 h-5" />,
      label: "All Job Listings",
      path: `${baseRoute}/all`,
    },
    {
      icon: <CircleCheck className="w-5 h-5" />,
      label: "Completed Job Listings",
      path: `${baseRoute}/expired`,
    },
    {
      icon: <XCircle className="w-5 h-5" />,
      label: "Closed Listings",
      path: `${baseRoute}/closed`,
    },
  ];

  const userInfo = (
    <div className="mb-8">
      <div className="flex items-start">
        <div className="flex-1">
          <span
            className="text-[30px] font-normal text-white break-all md:break-words line-clamp-1 max-w-full"
            title={userName}
          >
            {userName}
          </span>
        </div>
        {/* <div className="flex-shrink-0 ml-2 mt-2">
          {subscriptionPlan === "freeTrial" ? (
            <Info className="w-7 h-7 fill-[#D6D6D6] text-[#212529]" />
          ) : (
            <img src={verifiedIcon} className="w-7 h-7" />
          )}
        </div> */}
      </div>
      <p className="text-[17px] text-white mt-1 flex items-center gap-2">
        {displayPlan === "freeTrial" ? (
          <>
            <span>Free Trial</span>
          </>
        ) : displayPlan === "monthlyPlan" ? (
          <>
            <img
              src={userCheck}
              className="w-6 h-6 fill-orange-500 text-orange-500"
              alt="Monthly subscriber"
            />
            <span>Monthly Subscriber</span>
          </>
        ) : (
          <>
            <img
              src={userCheck}
              className="w-6 h-6 fill-orange-500 text-orange-500"
              alt="Yearly subscriber"
            />
            <span>Yearly Subscriber</span>
          </>
        )}
      </p>
    </div>
  );

  return (
    <>
      {/* Mobile/Tablet View */}
      <div className="lg:hidden w-full">
        <div className="px-4 md:px-6 py-4 md:mt-6 space-y-4">{userInfo}</div>
        <div className="w-full px-4">
          <div className="flex justify-center gap-10 items-center">
            {jobListingsMenu.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center transition-colors ${
                  location.pathname === item.path
                    ? "text-orange-500"
                    : "text-white hover:text-orange-500"
                }`}
              >
                <div className="flex sm:hidden items-center justify-center">
                  {item.icon}
                </div>
                <div className="hidden sm:flex items-center gap-2">
                  {item.icon}
                  <span className="text-sm font-medium">{item.label}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Desktop View */}
      <div className={`hidden lg:block h-full ${className}`}>
        <div className="top-0 pt-6 px-8">
          {userInfo}
          <div className="space-y-1">
            <span className="text-orange-500 text-[24px] font-normal mb-4 block">
              Manage Job Listings
            </span>
            {jobListingsMenu.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 py-2 text-[15px] ${
                  location.pathname === item.path
                    ? "text-orange-500"
                    : "text-white hover:text-orange-500"
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export { ManageJobListingsSidebar };
