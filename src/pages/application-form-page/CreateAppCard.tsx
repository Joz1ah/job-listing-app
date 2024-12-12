import { FC } from "react";
import { useMenu } from "hooks";
import { PageMeta, ScrollArea } from "components";
import { jobHunterDesktopMenu, jobHunterMobileMenu } from "mockData/nav-menus";
import { JobHunterMenu, Footer } from "layouts";
import { ApplicationForm } from "features";

const CreateAppCard: FC = () => {
  const { menuOpen, toggleMenu } = useMenu();

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      <PageMeta title="Complete your Profile" />
      {/* Header */}
      <JobHunterMenu
        isMenuOpen={menuOpen}
        onToggleMenu={toggleMenu}
        desktopMenuItems={jobHunterDesktopMenu}
        mobileMenuItems={jobHunterMobileMenu}
        isFreeTrial={true}
      />
      
      <ScrollArea className="flex-1">
        <div className="flex flex-col min-h-full">
          {/* Main content */}
          <main className="flex-grow bg-[#242625] p-4 md:p-[60px] flex justify-center">
            <ApplicationForm />
          </main>

          {/* Footer */}
          <Footer />
        </div>
      </ScrollArea>
    </div>
  );
};

export { CreateAppCard };