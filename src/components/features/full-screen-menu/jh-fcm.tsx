import { FC } from "react";
import { Button } from "components";
import { GraduationCap } from "lucide-react";

interface FullScreenMenuProps {
  isOpen: boolean;
}

const JobHunterFcm: FC<FullScreenMenuProps> = ({ isOpen }) => {
  return (
    <div
      className={`fixed inset-0 bg-black text-white z-50 transition-transform duration-500 ease-in-out ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
      style={{ top: "73px" }}
    >
      <nav className="p-4">
        <ul className="space-y-0">
          <MenuItem>
            <span className="bg-[#F5722E] w-2 h-2 rounded-full mr-2"></span>
            NOTIFICATIONS
          </MenuItem>
          <MenuItem>EDIT PROFILE</MenuItem>
          <MenuItem>ACCOUNT SETTINGS</MenuItem>
          <MenuItem>BOOKMARKED JOBS</MenuItem>
          <MenuItem>INTERVIEWS</MenuItem>
          <MenuItem>HELP & SUPPORT</MenuItem>
          <li className="py-3 border-b border-white">
            <div className="flex items-center text-[#F5722E] justify-end">
              <GraduationCap className="mr-2" size={14} />
              <span className="text-sm font-normal">
                AKAZA ACADEMY - COMING SOON
              </span>
            </div>
          </li>
          <MenuItem>SIGN OUT</MenuItem>
        </ul>
      </nav>
    </div>
  );
};

const MenuItem: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <li className="border-b border-white">
    <Button variant="ghost" className="w-full justify-end text-sm font-normal">
      {children}
    </Button>
  </li>
);

export { JobHunterFcm };
