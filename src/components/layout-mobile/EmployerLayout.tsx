import { FC } from "react";
import { Header, Footer, EmployerFcm } from "components";
import { useMenu } from "hooks";

interface EmployerLayout {
  children: React.ReactNode;
}

const EmployerLayout: FC<EmployerLayout> = ({ children }) => {
  const { menuOpen, toggleMenu } = useMenu();

  return (
    <div className={`min-h-screen flex flex-col bg-gray-900 text-white`}>
      {/* Header */}
      <Header onMenuToggle={toggleMenu} />

      {/* Full-screen Menu */}
      <EmployerFcm isOpen={menuOpen} />

      {/* Main Content */}
      <main className="flex-grow p-6 bg-[#263238] overflow-x-hidden">
        {children}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export { EmployerLayout };
