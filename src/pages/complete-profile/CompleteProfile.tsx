import { FC } from "react";
import { useMenu } from "hooks";
import { FooterDesktop, ProfileCreation,  JobHunterMenuHeader, PageMeta } from "components";
import { jobHunterDesktopMenu, jobHunterMobileMenu } from "mockData/nav-menus";

const CompleteProfile: FC = () => {
  const { menuOpen, toggleMenu } = useMenu();

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      <PageMeta title="Complete your Profile" />
      {/* Header */}
      <JobHunterMenuHeader
      isMenuOpen={menuOpen}
      onToggleMenu={toggleMenu}
      desktopMenuItems={jobHunterDesktopMenu}
      mobileMenuItems={jobHunterMobileMenu}
    />
      
      {/* Main content */}
      <main className="bg-[#242625] p-4 md:p-[60px]">
        <ProfileCreation />
      </main>

      {/* Footer */}
      <FooterDesktop />
    </div>
  );
};

export { CompleteProfile }