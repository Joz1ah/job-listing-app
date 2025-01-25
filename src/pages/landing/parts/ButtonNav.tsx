import { useModal } from "components/modal/useModal";
import { useRef, memo, useCallback } from "react";
import styles from "./../landing.module.scss";

type ButtonNavProps = {
  btnFor: "login" | "signup";
  handleSetState: () => void;
};

const ButtonNav = ({ btnFor, handleSetState }: ButtonNavProps) => {
  const { toggleModal, isModalOpen, handleSetSelectedModalHeader } = useModal();

  const elementRef = useRef<HTMLButtonElement>(null);
  const toggleLogin = useCallback(() => {
    console.log(">>isModalOpen", { isModalOpen });
    if (isModalOpen) {
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
  }, [isModalOpen]);

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
      Logindawdawd
    </button>
  );
};

export default memo(ButtonNav);
