import { FC, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Check, Clock, CheckCircle, RotateCcw, X } from "lucide-react";
/* import { Info } from "lucide-react";
import verifiedIcon from 'images/verified.svg?url' */
import userCheck from "images/user-check.svg?url";
import { useJobHunterContext } from "components";
import { useAuth } from "contexts/AuthContext/AuthContext";

interface MenuItem {
  icon: JSX.Element;
  label: string;
  path: string;
}

interface InterviewSidebarJobHunterProps {
  userName: string;
  userType: "employer" | "job-hunter";
  className?: string;
}

const InterviewSidebarJobHunter: FC<InterviewSidebarJobHunterProps> = ({
  userName,
  userType,
  className = "",
}) => {
  const location = useLocation();
  const baseRoute = userType === "employer" ? "/dashboard" : "/dashboard";
  const { subscriptionPlan } = useJobHunterContext();
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

  const interviewMenu: MenuItem[] = [
    {
      icon: <Clock className="w-5 h-5" />,
      label: "Pending Interview",
      path: `${baseRoute}/interviews/pending`,
    },
    {
      icon: <CheckCircle className="w-5 h-5" />,
      label: "Accepted Interviews",
      path: `${baseRoute}/interviews/accepted`,
    },
    {
      icon: <X className="w-5 h-5" />,
      label: "Declined Interviews",
      path: `${baseRoute}/interviews/declined`,
    },
    {
      icon: <RotateCcw className="w-5 h-5" />,
      label: "Reschedule Requests",
      path: `${baseRoute}/interviews/reschedule`,
    },
    {
      icon: <Check className="w-5 h-5" />,
      label: "Completed Interviews",
      path: `${baseRoute}/interviews/completed`,
    },
  ];

  const userInfo = (
    <div className="mb-8">
      <div className="flex items-start">
        <div className="flex-1">
          <h2
            className="text-[30px] font-normal text-white break-all md:break-words line-clamp-1 max-w-full"
            title={userName}
          >
            {userName}
          </h2>
        </div>
        {/*         <div className="flex-shrink-0 ml-2 mt-2">
          {subscriptionPlan === 'freeTrial' ? (
            <Info className="w-7 h-7 fill-[#D6D6D6] text-[#212529]" />
          ) : (
            <img src={verifiedIcon} className="w-7 h-7" />
          )}
        </div> */}
      </div>
      <p className="text-[17px] text-white mt-1 flex items-center gap-2">
        {displayPlan === "freeTrial" ? (
          <>
            <span>Freemium</span>
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
            {interviewMenu.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center justify-center transition-colors ${
                  location.pathname === item.path
                    ? "text-[#F5722E]"
                    : "text-white hover:text-[#F5722E]"
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
        <div className="px-8 top-0 pt-6">
          {userInfo}
          <div className="space-y-1">
            <span className="text-[#F5722E] text-[24px] font-normal mb-4 block">
              Interviews
            </span>
            {interviewMenu.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 py-2 text-[15px] ${
                  location.pathname === item.path
                    ? "text-[#F5722E]"
                    : "text-white hover:text-[#F5722E]"
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

export { InterviewSidebarJobHunter };
