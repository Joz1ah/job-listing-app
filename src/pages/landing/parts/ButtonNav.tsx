import { useRef, memo, useCallback } from "react";
import styles from "./../landing.module.scss";
import { useModal } from "components/modal/useModal";
import { MODAL_HEADER_TYPE } from "store/modal/modal.types";

type ButtonNavProps = {
  btnFor: "login" | "signup";
  onClick?: () => void;
  handleSetState: () => void;
};

const ButtonNav = ({ btnFor, handleSetState, onClick }: ButtonNavProps) => {
  const { handleSetSelectedModalHeader, isModalOpen, toggleModal } = useModal();
  const elementRef = useRef<HTMLButtonElement>(null);
  const handleButtonClick = useCallback(() => {
    toggleLogin();
    onClick?.();
  }, [onClick]);
  const toggleLogin = useCallback(() => {
    if (isModalOpen) {
      // We're switching modals, so don't toggle the mask
      handleSetSelectedModalHeader(MODAL_HEADER_TYPE.WITH_LOGO_AND_CLOSE);
      handleSetState();
      toggleModal();
    } else {
      // Normal opening of modal
      handleSetSelectedModalHeader(MODAL_HEADER_TYPE.WITH_LOGO_AND_CLOSE);
      handleSetState();
      toggleModal();
    }
  }, [isModalOpen]);

  const className =
    btnFor === "login"
      ? styles.button
      : `${styles.button} ${styles["button-signup"]}`;

  const id = btnFor === "login" ? "btn_login_nav" : "btn_signup_nav";

  return (
    <button
      ref={elementRef}
      onClick={handleButtonClick}
      id={id}
      className={className}
    >
      {btnFor === "login" ? "Login" : "Sign up"}
    </button>
  );
};

export default memo(ButtonNav);
