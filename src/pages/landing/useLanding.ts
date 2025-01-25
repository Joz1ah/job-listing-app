import { useCallback, useState } from "react";

export const useLanding = () => {
  const [modalState, setModalState] = useState(12);

  const modalStates = {
    LOGIN: 1,
    SIGNUP_SELECT_USER_TYPE: 2,
    SIGNUP_STEP2: 3,
    SIGNUP_STEP3: 4,
    SIGNUP_STEP4: 5,
    SIGNUP_STEP4_EMPLOYER: 6,
    SIGNUP_STEP5: 7,
    LOADING: 8,
    SIGNUP_CONGRATULATIONS: 9,
    AUTHNET_PAYMENT: 10,
    PERFECT_MATCH_RESULTS: 11,
    AUTHNET_PAYMENT_FULL: 12,
    FORGOT_PASSWORD_EMAIL: 13,
    FORGOT_PASSWORD_NEW_PASSWORD: 14,
    FORGOT_PASSWORD_OTP: 15,
  } as const;

  const heroStates = {
    PERFECT_MATCH_ALGO: 1,
    JOB_TITLE_EMPLOYER: 2,
    SKILLSETS_EMPLOYER: 3,
    YEARS_OF_EXPERIENCE_EMPLOYER: 4,
    SKILLSETS_JOBHUNTER: 5,
    YEARS_OF_EXPERIENCE_JOBHUNTER: 6,
    LOADING: 7,
    PERFECT_MATCH_RESULTS: 8,
  } as const;

  const PLAN_SELECTION_ITEMS = {
    FREE: 1,
    MONTHLY: 2,
    ANNUAL: 3,
  } as const;

  const handleSetState = useCallback((btn: "signup" | "login") => {
    console.log(">>btn", { btn });
    if (btn === "signup") {
      setModalState(modalStates.SIGNUP_SELECT_USER_TYPE);
    } else {
      setModalState(modalStates.LOGIN);
    }
  }, []);

  return {
    modalStates,
    heroStates,
    PLAN_SELECTION_ITEMS,
    handleSetState,
    modalState,
    setModalState,
  };
};
