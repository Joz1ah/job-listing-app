import { useMenu } from "hooks";
import { BaseMenu } from "layouts";
import ButtonNav from "./ButtonNav";
import { useLanding } from "../useLanding";
import { MODAL_STATES } from "store/modal/modal.types";

const NavigationHeader = () => {
  const { menuOpen, toggleMenu } = useMenu();
  const { handleSetModalState } = useLanding();

  return (
    <BaseMenu
      isAuthenticated={false}
      isMenuOpen={menuOpen}
      onToggleMenu={toggleMenu}
      ButtonLoginNav={() => (
        <ButtonNav
          handleSetState={() => handleSetModalState(MODAL_STATES.LOGIN)}
          btnFor="login"
        />
      )}
      ButtonSignUpNav={() => (
        <ButtonNav
          handleSetState={() =>
            handleSetModalState(MODAL_STATES.SIGNUP_SELECT_USER_TYPE)
          }
          btnFor="signup"
        />
      )}
    />
  );
};

export default NavigationHeader;
