import { FC } from "react";
import { Link, useLocation } from "react-router-dom";
import { BarChart2, Users, Calendar, DollarSign, Info } from "lucide-react";
import verifiedIcon from 'images/verified.svg?url'
import userCheck from 'images/user-check.svg?url'

interface MenuItem {
  icon: JSX.Element;
  label: string;
  path: string;
}

interface AnalyticsSidebarProps {
  userName: string;
  subscriptionTier: 'freeTrial' | 'monthlyPlan' | 'yearlyPlan';
  className?: string;
}

const ReportsAnalyticsSidebar: FC<AnalyticsSidebarProps> = ({ 
  userName,
  subscriptionTier,
  className=''
}) => {
  const location = useLocation();
  const baseRoute = '/employer/reports-and-analytics';

  const analyticsMenu: MenuItem[] = [
    {
      icon: <BarChart2 className="w-5 h-5" />,
      label: "Job Performance",
      path: `${baseRoute}/job-performance`
    },
    {
      icon: <Users className="w-5 h-5" />,
      label: "Candidate Analytics",
      path: `${baseRoute}/candidates`
    },
    {
      icon: <Calendar className="w-5 h-5" />,
      label: "Interview Analytics",
      path: `${baseRoute}/interviews`
    },
    {
      icon: <DollarSign className="w-5 h-5" />,
      label: "Cost Analytics",
      path: `${baseRoute}/costs`
    }
  ];

  const userInfo = (
    <div className="mb-8">
      <span className="text-[30px] font-normal flex items-center gap-2 text-white">
        {userName} {subscriptionTier === 'freeTrial' ? 
          <Info className="w-7 h-7 fill-[#D6D6D6] text-[#212529]" /> : 
          <img src={verifiedIcon} className="w-7 h-7" />
        }
      </span>
      <p className="text-[17px] text-white mt-1 flex items-center gap-2">
      {subscriptionTier === "freeTrial" ? (
          <>
            <span>Free Trial</span>
          </>
        ) : subscriptionTier === "monthlyPlan" ? (
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
        <div className="w-full px-4 overflow-x-auto">
          <div className="flex space-x-8 md:space-x-6 min-w-max">
            {analyticsMenu.map((item) => (
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
              Reports and Analytics
            </span>
            {analyticsMenu.map((item) => (
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

export { ReportsAnalyticsSidebar };