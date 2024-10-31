import { FC } from "react";
import { useMenu } from "hooks";
import { EmployerMenu, FooterDesktop, JobHunterSectionDesktop, HeaderDesktop2, PageMeta } from "components";

const JobHunterDesktop: FC = () => {
  const { menuOpen, toggleMenu } = useMenu();

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      <PageMeta title="Job Hunter Dashboard" />
      {/* Full-screen Menu */}
      <EmployerMenu isOpen={menuOpen} />

      {/* Header */}
      <HeaderDesktop2 onToggleMenu={toggleMenu} />
      
      {/* Main content */}
      <main className="flex flex-col bg-[#242625] mt-12">
        <JobHunterSectionDesktop />
      </main>

      {/* Footer */}
      <FooterDesktop />
    </div>
  );
};

export { JobHunterDesktop }