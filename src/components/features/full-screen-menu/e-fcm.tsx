import { FC, useEffect } from "react";
import { Button } from "components";
import { NavLink, useNavigate } from "react-router-dom";

interface FullScreenMenuProps {
  isOpen: boolean;
}

const EmployerFcm: FC<FullScreenMenuProps> = ({ isOpen }) => {
  const navItems = [
    { name: 'CREATE JOB LISTING', path: '#' },
    { name: 'MANAGE JOB LISTINGS', path: '#' },
    { name: 'EDIT COMPANY PROFILE', path: '#' },
    { name: 'REPORTS & ANALYTICS', path: '#' },
    { name: 'INTERVIEWS', path: '#' },
    { name: 'ABOUT US', path: '#'},
    { name: 'CONTACT US', path: '#'},
    { name: '✦ SUBSCRIPTION PLANS', path: '#' },
    { name: 'ACCOUNT SETTINGS', path: '#'},
    { name: 'SIGN OUT', path: '#'}
  ];

  const navigate = useNavigate();

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
      <nav className="flex flex-col text-white w-full h-full overflow-y-auto pt-6">
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
                  className="hover:text-[#F5722E] py-2 inline-block text-sm"
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