import { FC } from "react";
import { Button } from "components";
import akazaLogoWhite from "images/akaza-logo-white.png";
import menuButton from "images/menu-button.png";

interface HeaderProps {
  onMenuToggle: () => void;
}

const Header: FC<HeaderProps> = ({ onMenuToggle }) => {
  return (
    <header className="bg-black py-4 px-2 flex justify-between items-center">
      <img src={akazaLogoWhite} alt="Akaza Logo" className="h-8" />
      <Button
        variant="custom"
        className="text-[#F5722E] bg-black"
        size="icon"
        onClick={onMenuToggle}
        aria-label="Toggle menu"
      >
        <img src={menuButton} className="h-12 w-12 ml-4 mt-2" />
      </Button>
    </header>
  );
};

export { Header };
