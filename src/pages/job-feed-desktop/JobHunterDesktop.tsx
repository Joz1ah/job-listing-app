import { FC } from "react";
import { useMenu } from "hooks";
import { FooterDesktop, JobHunterSectionDesktop, JobHunterMenuHeader, PageMeta } from "components";
import { jobHunterDesktopMenu, jobHunterMobileMenu } from "mockData/nav-menus";
import { JobHunterHeader } from "components/layout-desktop/JobHunterHeader";

const JobHunterDesktop: FC = () => {
  const { menuOpen, toggleMenu } = useMenu();

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      <PageMeta title="Job Hunter Dashboard" />
      {/* Header */}
      <JobHunterMenuHeader
      isMenuOpen={menuOpen}
      onToggleMenu={toggleMenu}
      desktopMenuItems={jobHunterDesktopMenu}
      mobileMenuItems={jobHunterMobileMenu}
    />
      
      {/* Main content */}
      <main className="flex flex-col bg-[#242625]">
        <JobHunterHeader />
        <JobHunterSectionDesktop />
      </main>

      {/* Footer */}
      <FooterDesktop />
    </div>
  );
};

export { JobHunterDesktop }