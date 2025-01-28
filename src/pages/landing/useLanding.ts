import { useDispatch, useSelector } from "react-redux";
import { RootState } from "store/store";
import { setModalState } from "store/modal/modal.slice";
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
  const heroState = useSelector((state: RootState) => state.hero.heroState);
  const {
    tempLoginEmail,
    tempLoginPassword,
    currentSelectedPlan,
    selectedSkills,
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

  const createAuthNetTokenizer = async () => {
    const isDevOrStaging =
      process.env.NODE_ENV === "development" ||
      window.location.origin === "https://app-sit.akaza.xyz";

    const scriptSources = {
      acceptJs: isDevOrStaging
        ? "https://jstest.authorize.net/v1/Accept.js"
        : "https://js.authorize.net/v1/Accept.js",
      acceptCore: isDevOrStaging
        ? "https://jstest.authorize.net/v1/AcceptCore.js"
        : "https://js.authorize.net/v1/AcceptCore.js",
    };

    // Check if the script already exists
    if (!document.querySelector(`script[src="${scriptSources.acceptCore}"]`)) {
      const script = document.createElement("script");
      script.src = scriptSources.acceptJs;
      script.async = true;
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
    handleSetModalState,
    dataStates,
    tempLoginEmail,
    tempLoginPassword,
    currentSelectedPlan,
    createAuthNetTokenizer,
    heroState,
    handleSetHeroState,
    selectedSkills,
    handleSetTempCredentials,
    handleSetSelectedPlan,
    handleSetSkills,
    handleSetCredentials,
  };
};
