import { FC } from "react";
import { NavLink } from "react-router-dom";

interface FullScreenMenuProps {
  isOpen: boolean;
}

const JobHunterFcm: FC<FullScreenMenuProps> = ({ isOpen }) => {

  const navItems = [
    { name: 'EDIT APPLICATION CARD', path: '#' },
    { name: 'ACCOUNT SETTINGS', path: '#' },
    { name: 'BOOKMARKED JOBS', path: '#' },
    { name: 'INTERVIEWS', path: '#'},
    { name: 'SIGN OUT', path: '#'}
  ];

  return (
    <div
      className={`fixed inset-0 bg-black text-white z-50 transition-transform duration-500 ease-in-out ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
      style={{ top: "73px" }}
    >
      <nav className="flex flex-col text-white w-full overflow-hidden pt-12">
      {navItems.map((item, index) => (
        <div key={item.path}>
          <div className="w-full text-end pr-4">
            <NavLink
              to={item.path}
              className="hover:text-[#F5722E] py-2 inline-block"
            >
                {index === navItems.length - 1 && (
                  <div className="pt-12"></div>
                )}
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
