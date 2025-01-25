import { useMenu } from "hooks";
import { BaseMenu } from "layouts";
import ButtonNav from "./ButtonNav";
import { useLanding } from "../useLanding";

const NavigationHeader = () => {
  const { menuOpen, toggleMenu } = useMenu();
  const { handleSetState } = useLanding();

  return (
    <BaseMenu
      isAuthenticated={false}
      isMenuOpen={menuOpen}
      onToggleMenu={toggleMenu}
      ButtonLoginNav={() => (
        <ButtonNav
          handleSetState={() => handleSetState("login")}
          btnFor="login"
        />
      )}
      ButtonSignUpNav={() => (
        <ButtonNav
          handleSetState={() => handleSetState("signup")}
          btnFor="signup"
        />
      )}
    />
  );
};

export default NavigationHeader;
