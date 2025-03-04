import { useDispatch, useSelector } from "react-redux";
import { RootState } from "store/store";
import { setIsResetPasswordSuccesful, setModalState } from "store/modal/modal.slice";
import { setCurrentResetPasswordEmail } from 'store/user/user.slice';
import { setHeroState } from "store/hero/hero.slice";
import { MODAL_STATES } from "store/modal/modal.types";
import { HERO_STATES } from "store/hero/hero.types";

import {
  setTempCredentials,
  setSelectedPlan,
  setSkills,
  setCredentials,
} from "store/user/user.slice";
import {
  PLAN_SELECTION_ITEMS,
  UserCredentials,
  UserTempCredentials,
} from "store/user/user.types";

export const useLanding = () => {
  const dispatch = useDispatch();

  const modalState = useSelector((state: RootState) => state.modal.modalState);
  const isResetPasswordSuccesful = useSelector((state: RootState) => state.modal.isResetPasswordSuccesful);
  const heroState = useSelector((state: RootState) => state.hero.heroState);
  const {
    tempLoginEmail,
    tempLoginPassword,
    currentSelectedPlan,
    selectedSkills,
    currentResetPasswordEmail,
    ...dataStates
  } = useSelector((state: RootState) => state.user);

  const handleSetCredentials = (creds: UserCredentials) => {
    dispatch(setCredentials({ ...creds }));
  };

  const handleSetSkills = (skills: string[]) => {
    dispatch(setSkills({ selectedSkills: skills }));
  };

  const handleSetSelectedPlan = (plan: PLAN_SELECTION_ITEMS) => {
    dispatch(setSelectedPlan({ currentSelectedPlan: plan }));
  };

  const handleSetTempCredentials = (creds: UserTempCredentials) => {
    dispatch(setTempCredentials({ ...creds }));
  };

  const handleSetModalState = (state: MODAL_STATES) => {
    dispatch(setModalState(state));
  };

  const handleSetHeroState = (state: HERO_STATES) => {
    dispatch(setHeroState(state));
  };
  
  const handleSetIsResetPasswordSuccesful = (state: boolean) => {
    dispatch(setIsResetPasswordSuccesful(state));
  };

  const createExternalCookiePolicy = async () => {
    const scriptSrc = 'https://cdnapp.websitepolicies.net/widgets/cookies/uz6lppct.js';

    // Check if the script already exists
    if (!document.querySelector(`script[src="${scriptSrc}"]`)) {
      const script = document.createElement("script");
      script.src = scriptSrc;
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);

      return () => {
        // Cleanup script on component unmount if it was added
        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }
      };
    }
  };

  return {
    modalState,
    isResetPasswordSuccesful,
    currentResetPasswordEmail,
    handleSetModalState,
    dataStates,
    tempLoginEmail,
    tempLoginPassword,
    currentSelectedPlan,
    createExternalCookiePolicy,
    heroState,
    handleSetHeroState,
    selectedSkills,
    handleSetTempCredentials,
    handleSetSelectedPlan,
    handleSetSkills,
    handleSetCredentials,
    handleSetIsResetPasswordSuccesful,
    handleSetCurrentResetPasswordEmail
  };
};
