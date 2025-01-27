import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { RootState } from "store/store";
import { setModalState } from "store/slices/modalSlice";
import { MODAL_STATES } from "store/types/modal.types";

export const useLanding = () => {
  const dispatch = useDispatch();
  const modalState = useSelector((state: RootState) => state.modal.modalState);

  const [tempLoginEmail, setTempLoginEmail] = useState("");
  const [tempLoginPassword, setTempLoginPassword] = useState("");
  const [currentSelectedPlan, setCurrentSelectedPlan] = useState(3);
  const [heroState, setHeroState] = useState(1);
  const [dataStates, setDataStates] = useState({
    selectedUserType: "",
    email: "",
    userId: 0,
  });
  const [rememberedSelectedSkills, setRememberedSelectedSkills] = useState<
    string[]
  >([]);

  const handleSetModalState = (state: MODAL_STATES) => {
    dispatch(setModalState(state));
  };

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
    heroStates,
    PLAN_SELECTION_ITEMS,
    modalState,
    handleSetModalState,
    dataStates,
    setDataStates,
    tempLoginEmail,
    setTempLoginEmail,
    tempLoginPassword,
    setTempLoginPassword,
    currentSelectedPlan,
    setCurrentSelectedPlan,
    createAuthNetTokenizer,
    heroState,
    setHeroState,
    rememberedSelectedSkills,
    setRememberedSelectedSkills,
  };
};
