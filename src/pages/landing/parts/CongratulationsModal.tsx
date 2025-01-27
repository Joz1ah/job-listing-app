import { useRef, useEffect } from "react";
import styles from "./../landing.module.scss";
import { useLanding } from "../useLanding";
import { MODAL_STATES } from "store/types/modal.types";

const CongratulationsModal = () => {
  const { dataStates, handleSetModalState, modalState } = useLanding();
  const nextButton = useRef<HTMLButtonElement>(null);
  const handleNext = () => {
    if (nextButton.current) {
      nextButton.current.onclick = () => {
        if (dataStates.selectedUserType == "job_hunter")
          handleSetModalState(MODAL_STATES.SIGNUP_STEP4);
        else if (dataStates.selectedUserType == "employer")
          handleSetModalState(MODAL_STATES.SIGNUP_STEP4_EMPLOYER);
      };
    }
  };

  useEffect(handleNext, []);
  return (
    <div
      id="step_congratulations"
      className={`${styles["modal-content"]}`}
      hidden={modalState !== MODAL_STATES.SIGNUP_CONGRATULATIONS}
    >
      <div className={`${styles["congratulations-container"]}`}>
        <div className={`${styles["checkmark-container"]}`}>
          <svg
            className={`${styles.checkmark}`}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 52 52"
          >
            <circle
              className={`${styles["checkmark__circle"]}`}
              cx="26"
              cy="26"
              r="25"
              fill="none"
            />
            <path
              className={`${styles["checkmark__check"]}`}
              fill="none"
              d="M14.1 27.2l7.1 7.2 16.7-16.8"
            />
          </svg>
        </div>
        <div className={`${styles["desc-container"]}`}>
          <div className={`${styles.desc1}`}>You are all set!</div>
          <div className={`${styles.desc2}`}>
            Next, let’s wrap things up by adding a few more details to complete
            your profile.
          </div>
        </div>
        <div className={`${styles["action-buttons"]}`}>
          <button
            ref={nextButton}
            className={`${styles["button-custom-orange"]}`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default CongratulationsModal;
