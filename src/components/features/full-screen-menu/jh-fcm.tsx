import { FC, useEffect } from "react";
import { NavLink } from "react-router-dom";

interface FullScreenMenuProps {
  isOpen: boolean;
}

const JobHunterFcm: FC<FullScreenMenuProps> = ({ isOpen }) => {

  const navItems = [
    { name: 'EDIT APPLICATION CARD', path: '#' },
    { name: 'BOOKMARKED JOBS', path: '#'},
    { name: 'INTERVIEWS', path: '#'},
    { name: 'ABOUT US', path: '#'},
    { name: 'CONTACT US', path: '#' },
    { name: '✦ SUBSCRIPTION PLANS', path: '#' },
    { name: 'FAQ', path: '#'},
    { name: 'ACCOUNT SETTINGS', path: '#'},
    { name: 'SIGN OUT', path: '#'}
  ];

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'visible';
    }

    return () => {
      document.body.style.overflow = 'visible';
    };
  }, [isOpen]);

  return (
    <div
      className={`fixed top-[73px] inset-0 bg-black text-white z-50 transition-transform duration-500 ease-in-out ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <nav className="flex flex-col text-white w-full h-full overflow-y-auto pt-12">
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
  );
};

export { JobHunterFcm };
