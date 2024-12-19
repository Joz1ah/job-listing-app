import { FC } from "react";
import { Link, useLocation } from "react-router-dom";
import { Bookmark, Info } from "lucide-react";
import verifiedIcon from 'images/verified.svg?url'
import userCheck from 'images/user-check.svg?url'

interface MenuItem {
  icon: JSX.Element;
  label: string;
  path: string;
}

interface BookmarkSidebarProps {
  userName: string;
  subscriptionTier: 'freeTrial' | 'monthlyPlan' | 'yearlyPlan';
  className?: string;
}

const BookmarkSidebar: FC<BookmarkSidebarProps> = ({
  userName,
  subscriptionTier,
  className = "",
}) => {
  const location = useLocation();
  const baseRoute = "/job-hunter/bookmarked-jobs";

  const bookmarkMenu: MenuItem[] = [
    {
      icon: <Bookmark className="w-5 h-5" />,
      label: "Your Bookmarked Jobs",
      path: `${baseRoute}/bookmarked`,
    }
  ];

  const userInfo = (
    <div className="mb-8">
      <h2 className="text-[30px] font-normal flex items-center gap-2 text-white">
        {userName}{" "}
        {subscriptionTier === 'freeTrial' ? (
          <Info className="w-7 h-7 fill-[#D6D6D6] text-[#212529]" />
        ) : (
          <img src={verifiedIcon} className="w-7 h-7" />
        )}
      </h2>
      <p className="text-[17px] text-white mt-1 flex items-center gap-2">
        {subscriptionTier === 'freeTrial' ? (
          <>
            <span>Free Trial</span>
          </>
        ) : (
          <>
            <img src={userCheck} className="w-6 h-6 fill-orange-500 text-orange-500" />
            <span>Monthly Subscriber</span>
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
            {bookmarkMenu.map((item) => (
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
              Bookmarked Jobs
            </span>
            {bookmarkMenu.map((item) => (
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

export { BookmarkSidebar };