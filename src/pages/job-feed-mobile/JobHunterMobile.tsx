import { FC } from "react";
import { Header, Footer, JobHunterFcm, JobHunterSectionMobile } from "components";
import { useMenu } from "hooks";


const JobHunterMobile: FC = () => {
  const { menuOpen, toggleMenu } = useMenu();

  return (
    <div className={`min-h-screen flex flex-col bg-gray-900 text-white`}>
      {/* Header */}
      <Header onMenuToggle={toggleMenu} />

      {/* Full-screen Menu */}
      <JobHunterFcm isOpen={menuOpen} />

      {/* Main Content */}
      <main className="flex-grow p-6 bg-[#263238] overflow-x-hidden">
        <JobHunterSectionMobile />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export { JobHunterMobile };
