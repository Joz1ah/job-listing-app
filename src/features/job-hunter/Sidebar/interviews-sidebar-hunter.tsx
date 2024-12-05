import { FC } from "react";
import { Link, useLocation } from "react-router-dom";
import { Check, Clock, CheckCircle, RotateCcw, Info, BadgeCheck, X } from "lucide-react";

interface MenuItem {
  icon: JSX.Element;
  label: string;
  path: string;
}

interface InterviewSidebarJobHunterProps {
  userName: string;
  subscriptionType: string;
  userType: 'employer' | 'job-hunter';
  isFreeTrial: boolean;
  className?: string;
}

const InterviewSidebarJobHunter: FC<InterviewSidebarJobHunterProps> = ({ 
  userName,
  subscriptionType,
  userType,
  isFreeTrial,
  className = ''
}) => {
  const location = useLocation();
  const baseRoute = userType === 'employer' ? '/employer' : '/job-hunter';

  const interviewMenu: MenuItem[] = [
    {
      icon: <Clock className="w-5 h-5" />,
      label: "Pending Interview",
      path: `${baseRoute}/interviews/pending`
    },
    {
      icon: <CheckCircle className="w-5 h-5" />,
      label: "Accepted Interviews",
      path: `${baseRoute}/interviews/accepted`
    },
    {
      icon: <X className="w-5 h-5" />,
      label: "Declined Interviews",
      path: `${baseRoute}/interviews/declined`
    },
    {
      icon: <RotateCcw className="w-5 h-5" />,
      label: "Reschedule Requests",
      path: `${baseRoute}/interviews/reschedule`
    },
    {
      icon: <Check className="w-5 h-5" />,
      label: "Completed Interviews",
      path: `${baseRoute}/interviews/completed`
    },
  ];

  const userInfo = (
    <div className="mb-8">
      <span className="text-[30px] font-normal flex items-center gap-1 text-white">
        {userName} {isFreeTrial ? 
          <Info className="w-7 h-7 fill-[#D6D6D6] text-[#212529]" /> : 
          <BadgeCheck className="w-7 h-7 fill-orange-500 text-[#212529]" />
        }
      </span>
      <p className="text-[17px] text-white mt-1">{subscriptionType}</p>
    </div>
  );

  return (
    <>
      {/* Mobile/Tablet View */}
      <div className="lg:hidden w-full">
        <div className="px-4 md:px-6 py-4 md:mt-6 space-y-4">
          {userInfo}
        </div>
        <div className="w-full px-4 overflow-x-auto">
          <div className="flex space-x-8 md:gap-x-4 w-full items-center justify-center">
            {interviewMenu.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center justify-center transition-colors ${
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
        <div className="px-8 top-0 pt-6">
          {userInfo}
          <div className="space-y-1">
            <span className="text-orange-500 text-[24px] font-normal mb-4 block">
              Interviews
            </span>
            {interviewMenu.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2 text-[15px] ${
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

export { InterviewSidebarJobHunter };