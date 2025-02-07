import { useCallback } from "react";
import { useLanding } from "../useLanding";
import { MODAL_STATES } from "store/modal/modal.types";
import { UserType } from "store/user/user.types";
import styles from "./../landing.module.scss";

const CongratulationsModal = () => {
  const { dataStates, handleSetModalState, modalState } = useLanding();

  const handleNext = useCallback(() => {
    if (dataStates.selectedUserType === UserType.JOB_HUNTER)
      handleSetModalState(MODAL_STATES.SIGNUP_STEP4);
    else if (dataStates.selectedUserType === UserType.EMPLOYER)
      handleSetModalState(MODAL_STATES.SIGNUP_STEP4_EMPLOYER);
  }, [dataStates.selectedUserType]);

  return modalState && modalState == MODAL_STATES.SIGNUP_CONGRATULATIONS ? (
    <div
      id="step_congratulations"
      className="flex flex-col items-center justify-center w-full h-full"
    >
      <div>
        <svg
          className={`${styles["checkmark"]}`}
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
      <div className="text-center text-[26px] font-semibold text-orange-500 mb-2">
        Congratulations!
      </div>
      <div className="flex flex-col w-full justify-center items-center mb-4">
        <span className="text-[15px] text-gray-700 text-center">
          You've successfully signed up.
        </span>
        <span className="text-[15px] text-gray-700 text-center">
          Welcome aboard—happy exploring!
        </span>
      </div>
      <button
        onClick={handleNext}
        className="px-6 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
      >
        Next
      </button>
    </div>
  ) : (
    <></>
  );
};

export default CongratulationsModal;
