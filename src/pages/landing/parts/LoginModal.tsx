import { MODAL_STATES } from "store/modal/modal.types";
import { useLanding } from "../useLanding";
import styles from "./../landing.module.scss";
import LoginForm from "./LoginForm";
const LoginModal = () => {
  const { modalState } = useLanding();

  return (
    modalState && modalState == MODAL_STATES.LOGIN ?
    <div
      id="step_login"
      className={`${styles["modal-content"]}`}
    >
      <div className={`${styles["login-container"]}`}>
        <LoginForm />
      </div>
    </div>
    : <></>
  );
};

export default LoginModal;
