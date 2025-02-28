import { MODAL_STATES } from "store/modal/modal.types";
import { useLanding } from "../useLanding";
import LoginForm from "./LoginForm";

const LoginModal = () => {
  const { modalState } = useLanding();

  return modalState && modalState == MODAL_STATES.LOGIN ? (
      <LoginForm />
  ) : (
    <></>
  );
};

export default LoginModal;
