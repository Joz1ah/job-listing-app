import { FC } from "react";
import { Link, useLocation } from "react-router-dom";
import { CheckCircle2, FileText, History, XCircle, Info, BadgeCheck } from "lucide-react";

interface MenuItem {
  icon: JSX.Element;
  label: string;
  path: string;
}

interface ManageJobsSidebarProps {
  userName: string;
  subscriptionType: string;
  isFreeTrial: boolean;
}

const ManageJobListingsSidebar: FC<ManageJobsSidebarProps> = ({ 
  userName,
  subscriptionType,
  isFreeTrial
}) => {
  const location = useLocation();
  const baseRoute = '/employer/manage-job-listings';

  const jobListingsMenu: MenuItem[] = [
    {
      icon: <CheckCircle2 className="w-5 h-5" />,
      label: "Active Listings",
      path: `${baseRoute}/active`
    },
    {
      icon: <FileText className="w-5 h-5" />,
      label: "Draft Listings",
      path: `${baseRoute}/drafts`
    },
    {
      icon: <History className="w-5 h-5" />,
      label: "Expired Listings",
      path: `${baseRoute}/expired`
    },
    {
      icon: <XCircle className="w-5 h-5" />,
      label: "Closed Listings",
      path: `${baseRoute}/closed`
    }
  ];

  const userInfo = (
    <div className="mb-8">
      <h2 className="text-[30px] font-normal flex items-center gap-2 text-white">
        {userName} {isFreeTrial ? 
          <Info className="w-7 h-7 fill-[#D6D6D6] text-[#212529]" /> : 
          <BadgeCheck className="w-7 h-7 fill-orange-500 text-[#212529]" />
        }
      </h2>
      <p className="text-[17px] text-white mt-1">{subscriptionType}</p>
    </div>
  );

  return (
    <>
      {/* Mobile/Tablet View */}
      <div className="lg:hidden">
        <div className="px-6 py-4 md:mt-6 space-y-4">
          {userInfo}
        </div>
        <div className="w-full px-4 overflow-x-auto">
          <div className="flex space-x-8 md:space-x-6 min-w-max">
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
      <div className="hidden lg:block w-[395px] h-full pt-10 px-2 xl:px-10">
        {userInfo}
        <div className="space-y-1">
          <span className="text-orange-500 text-[24px] font-normal mb-4">
            Manage Jobs
          </span>
          {jobListingsMenu.map((item) => (
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
    </>
  );
};

export { ManageJobListingsSidebar };