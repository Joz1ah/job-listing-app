import { FC } from "react";
import { Button } from "components";
//import { GraduationCap } from "lucide-react"; 
import { NavLink, useNavigate } from "react-router-dom";

interface FullScreenMenuProps {
  isOpen: boolean;
}

const EmployerFcm: FC<FullScreenMenuProps> = ({ isOpen }) => {

  const navItems = [
    { name: 'CREATE JOB LISTING', path: '#' },
    { name: 'MANAGE JOB LISTINGS', path: '#' },
    { name: 'REPORTS & ANALYTICS', path: '#' },
    { name: 'INTERVIEWS', path: '#' },
    { name: 'ACCOUNT SETTINGS', path: '#'},
    { name: 'SIGN OUT', path: '#'}
  ];

  const navigate = useNavigate();

  return (
    <div
      className={`fixed inset-0 bg-black text-white z-50 transition-transform duration-500 ease-in-out ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
      style={{ top: "73px" }}
    >
      <nav className="flex flex-col text-white w-full overflow-hidden pt-6">
      {navItems.map((item, index) => (
        <div key={item.path}>
          <div className="w-full text-end pr-4">
            {index === 0 ? (
              <Button
                onClick={() => navigate(item.path)}
                className="hover:text-[#F5722E] bg-[#F5722E] text-[12px] py-2 inline-block text-right mb-3 font-semibold"
              >
                {item.name}
              </Button>
            ) : (
              <NavLink
                to={item.path}
                className="hover:text-[#F5722E] py-2 inline-block"
              >
                {item.name}
              </NavLink>
            )}
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

export { EmployerFcm };
