import { FC } from "react";
import { Button } from "components";
import akazaLogoWhite from "images/akaza-logo-white.png";
import menuButton from "images/menu-button.png";
import { Bell } from "lucide-react";

interface HeaderProps {
  onMenuToggle: () => void;
}

const Header: FC<HeaderProps> = ({ onMenuToggle }) => {
  return (
    <header className="bg-black py-4 px-2 flex justify-between items-center">
      <img src={akazaLogoWhite} alt="Akaza Logo" className="h-8" />
      <div className="flex items-center">
        <Bell strokeWidth={2.5} className="w-[24px] h-[30px] text-[#F5722E] mr-2 [transform:rotate(35deg)]" />
        <Button
          variant="custom"
          className="text-[#F5722E] bg-black"
          size="icon"
          onClick={onMenuToggle}
          aria-label="Toggle menu"
        >
          <img src={menuButton} className="h-12 w-12" />
        </Button>
      </div>
    </header>
  );
};

export { Header };
