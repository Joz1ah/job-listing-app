import { FC } from "react";
import { useMenu } from "hooks";
import { Outlet } from "react-router-dom";
import { PageMeta, ScrollArea } from "components";
import { jobHunterDesktopMenu, jobHunterMobileMenu } from "mockData/nav-menus";
import { JobHunterContext } from "components";
import { JobHunterMenu, Footer } from "layouts";
import { BookmarkSidebar } from "features/job-hunter";

const BookmarkedJobs: FC = () => {
  const { menuOpen, toggleMenu } = useMenu();
  const isFreeTrial = true;

  return (
    <JobHunterContext.Provider value={{ isFreeTrial }}>
      <div className="flex flex-col h-screen bg-[#212529]">
        <PageMeta title="Bookmarked Jobs" />
        <JobHunterMenu
          isMenuOpen={menuOpen}
          onToggleMenu={toggleMenu}
          desktopMenuItems={jobHunterDesktopMenu}
          mobileMenuItems={jobHunterMobileMenu}
          isFreeTrial={isFreeTrial}
        />

        <ScrollArea className="flex-1">
          <div className="flex flex-col min-h-full">
            <main className="flex-1 flex flex-col w-full lg:flex-row md:py-16 py-6 bg-[#212529]">
              <div className="flex justify-center w-full max-w-screen-xl mx-auto">
                <div className="flex flex-col lg:flex-row w-full pt-8">
                  <BookmarkSidebar
                    userName="John Doe"
                    subscriptionType="Free Trial"
                    isFreeTrial={isFreeTrial}
                    className="w-[395px]"
                  />
                  <div className="flex-1 m-4">
                    <Outlet />
                  </div>
                </div>
              </div>
            </main>
            <Footer />
          </div>
        </ScrollArea>
      </div>
    </JobHunterContext.Provider>
  );
};

export { BookmarkedJobs };
