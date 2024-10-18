import { FC } from "react";
import { NavLink } from "react-router-dom";
import { Button } from "components/ui/buttons";

interface FullScreenMenuProps {
  isOpen: boolean;
}

const JobHunterFcm: FC<FullScreenMenuProps> = ({ isOpen }) => {

  const navItems = [
    { name: 'EDIT APPLICATION CARD', path: '#' },
    { name: 'ACCOUNT SETTINGS', path: '#' },
    { name: 'BOOKMARKED JOBS', path: '#' },
    { name: 'INTERVIEWS', path: '#'},
    { name: 'FAQ', path: '#'}
  ];

  return (
    <div
      className={`fixed inset-0 bg-black text-white z-50 transition-transform duration-500 ease-in-out ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
      style={{ top: "73px" }}
    >
      <nav className="flex flex-col text-white w-full h-full overflow-hidden pt-12">
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
        
        {/* Bottom section */}
        <div className="mt-auto mb-20">
          <div className="flex justify-center space-x-4 mb-4">
            <NavLink to="/about" className="hover:text-[#F5722E] text-sm">
              ABOUT US
            </NavLink>
            <NavLink to="/contact" className="hover:text-[#F5722E] text-sm">
              CONTACT US
            </NavLink>
          </div>
          <div className="flex justify-center">
            <Button
              className="bg-black text-white text-sm hover:bg-[#F5722E] outline outline-1 outline-white"
              onClick={() => {/* Add sign out logic here */}}
            >
              SIGN OUT
            </Button>
          </div>
        </div>
      </nav>
    </div>
  );
};

export { JobHunterFcm };
