import { FC, useEffect } from "react";
import { NavLink } from "react-router-dom";

interface ScreenMenuProps {
  isOpen: boolean;
}

const EmployerMenu: FC<ScreenMenuProps> = ({ isOpen }) => {
  const navItems = [
    { name: 'MANAGE JOB LISTINGS', path: '#' },
    { name: 'EDIT COMPANY PROFILE', path: '#' },
    { name: 'REPORTS & ANALYTICS', path: '#' },
    { name: 'INTERVIEWS', path: '#' },
    { name: '✦ SUBSCRIPTION PLANS', path: '#' },
    { name: 'ACCOUNT SETTINGS', path: '#'},
    { name: 'SIGN OUT', path: '#'}
  ];

  useEffect(() => {
    return () => {
      document.body.style.overflow = 'visible';
    };
  }, []);

  return (
    <div className="relative">
      {/* Overlay */}
      <div 
        className={`fixed top-[72px] left-0 w-full h-full bg-black/50 transition-opacity duration-300 ${
          isOpen ? "opacity-100 z-[998]" : "opacity-0 pointer-events-none -z-10"
        }`}
      />
      
      {/* Menu */}
      <div
        className={`fixed top-0 right-0 h-screen w-[440px] bg-black text-white shadow-xl transition-transform duration-300 ease-in-out z-[999] ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ marginTop: "73px" }}
      >
        <div className="h-full overflow-y-auto">
          <nav className="flex flex-col text-white w-full pt-6">
            {navItems.map((item, index) => (
              <div key={item.path}>
                <div className="w-full text-end pr-4">
                    <NavLink
                      to={item.path}
                      className="hover:text-[#F5722E] py-2 inline-block text-sm"
                    >
                      {item.name}
                    </NavLink>
                </div>
                {index < navItems.length && (
                  <div className="flex justify-center w-full">
                    <hr className="border-t border-white w-[95%] my-0" />
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
};

export { EmployerMenu };