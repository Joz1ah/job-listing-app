import { FC } from "react";
import { Link, useLocation } from "react-router-dom";
import { User, CreditCard, Shield, Info } from "lucide-react";
import verifiedIcon from 'images/verified.svg?url'
import userCheck from 'images/user-check.svg?url'
import { useEmployerContext } from "components";

interface MenuItem {
  icon: JSX.Element;
  label: string;
  path: string;
}

interface SettingsSidebarProps {
  userName: string;
  userType: 'employer' | 'job-hunter';
  className?: string;
}

const SettingsSidebar: FC<SettingsSidebarProps> = ({ 
  userName,
  userType,
  className = ''
}) => {
  const location = useLocation();
  const baseRoute = userType === 'employer' ? '/dashboard' : '/dashboard';
  const { subscriptionPlan } = useEmployerContext();

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
      icon: <span className="text-2xl leading-none mr-1">✦</span>,
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
      <div className="flex items-start">
        <div className="flex-1">
          <span className="text-[30px] font-normal text-white line-clamp-2">
            {userName}
          </span>
        </div>
        <div className="flex-shrink-0 ml-2 mt-2">
          {subscriptionPlan === 'freeTrial' ? (
            <Info className="w-7 h-7 fill-[#D6D6D6] text-[#212529]" />
          ) : (
            <img src={verifiedIcon} className="w-7 h-7" />
          )}
        </div>
      </div>
      <p className="text-[17px] text-white mt-1 flex items-center gap-2">
        {subscriptionPlan === "freeTrial" ? (
          <>
            <span>Free Trial</span>
          </>
        ) : subscriptionPlan === "monthlyPlan" ? (
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
              Account Settings
            </span>
            {settingsMenu.map((item) => (
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

export { SettingsSidebar };