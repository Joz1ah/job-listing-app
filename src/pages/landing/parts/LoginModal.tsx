import { useLanding } from "../useLanding";
import styles from "./../landing.module.scss";
import LoginForm from "./LoginForm";

const LoginModal = () => {
  const { modalState, modalStates } = useLanding();
  console.log(">>MODAL STATE HERE", { modalState });
  return (
    <div
      id="step_login"
      className={`${styles["modal-content"]}`}
      hidden={modalState !== modalStates.LOGIN}
    >
      <div className={`${styles["login-container"]}`}>
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginModal;
