import { useRef, memo, useCallback, useContext } from "react";
import { ModalContext } from "components/modal/modalContext"; // Adjust the import path as necessary
import styles from "./../landing.module.scss";
import { useModal } from "components/modal/useModal";

type ButtonNavProps = {
  btnFor: "login" | "signup";
  handleSetState: () => void;
};

const ButtonNav = ({ btnFor, handleSetState }: ButtonNavProps) => {
  const { toggleModal, isOpen } = useContext(ModalContext);

  const { handleSetSelectedModalHeader } = useModal();
  const elementRef = useRef<HTMLButtonElement>(null);
  const toggleLogin = useCallback(() => {
    console.log(">>isModalOpen", { isOpen });
    if (isOpen) {
      // We're switching modals, so don't toggle the mask
      handleSetSelectedModalHeader(1);
      handleSetState();
      toggleModal();
    } else {
      // Normal opening of modal
      handleSetSelectedModalHeader(1);
      handleSetState();
      toggleModal();
    }
  }, [isOpen]);

  const className =
    btnFor === "login"
      ? styles.button
      : `${styles.button} ${styles["button-signup"]}`;

  const id = btnFor === "login" ? "btn_login_nav" : "btn_signup_nav";

  return (
    <button
      ref={elementRef}
      onClick={toggleLogin}
      id={id}
      className={className}
    >
      {btnFor === "login" ? "Login" : "Sign up"}
    </button>
  );
};

export default memo(ButtonNav);
