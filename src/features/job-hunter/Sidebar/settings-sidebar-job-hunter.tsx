import { FC } from "react";
import { Link, useLocation } from "react-router-dom";
import { User, CreditCard, Package, Shield, BadgeCheck, Info } from "lucide-react";

interface MenuItem {
  icon: JSX.Element;
  label: string;
  path: string;
}

interface SettingsSidebarProps {
  userName: string;
  subscriptionType: string;
  userType: 'employer' | 'job-hunter';
  isFreeTrial: boolean;
  className?: string;
}

const SettingsSidebar: FC<SettingsSidebarProps> = ({ 
  userName,
  subscriptionType,
  userType,
  isFreeTrial,
  className = ''
}) => {
  const location = useLocation();
  const baseRoute = userType === 'employer' ? '/employer' : '/job-hunter';

  const settingsMenu: MenuItem[] = [
    {
      icon: <User className="w-5 h-5" />,
      label: "General",
      path: `${baseRoute}/account-settings/general`
    },
    {
      icon: <CreditCard className="w-5 h-5" />,
      label: "Billing & Information",
      path: `${baseRoute}/account-settings/billing`
    },
    {
      icon: <Package className="w-5 h-5" />,
      label: "Your Subscription",
      path: `${baseRoute}/account-settings/subscription`
    },
    {
      icon: <Shield className="w-5 h-5" />,
      label: "Privacy & Security",
      path: `${baseRoute}/account-settings/privacy`
    }
  ];

  const userInfo = (
    <div className="mb-8">
      <h2 className="text-[30px] font-normal flex items-center gap-2 text-white">
        {userName} {isFreeTrial ? 
          <Info className="w-7 h-7 fill-[#D6D6D6] text-[#212529]" /> : 
          <BadgeCheck className="w-7 h-7 fill-[#F5722E] text-[#212529]" />
        }
      </h2>
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
            {settingsMenu.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center transition-colors ${
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
        <div className="top-0 pt-6 px-8">
          {userInfo}
          <div className="space-y-1">
            <span className="text-[#F5722E] text-[24px] font-normal mb-4 block">
              Account Settings
            </span>
            {settingsMenu.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2 text-[15px] ${
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

export { SettingsSidebar };