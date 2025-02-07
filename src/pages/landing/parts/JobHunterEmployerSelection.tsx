import { useLanding } from "../useLanding";
import jobhunter_icon from "assets/jobhunter-icon.png";
import employer_icon from "assets/employer-icon.png";
import { MODAL_STATES } from "store/modal/modal.types";
import { UserType } from "store/user/user.types";
import Selection from "./JobHunterEmployerSelection/Selection";

const JobHunterEmployerSelection = () => {
  const { handleSetCredentials, dataStates, handleSetModalState, modalState } =
    useLanding();

  const handleBtnClick = (type: UserType) => {
    handleSetCredentials({ ...dataStates, selectedUserType: type });
    handleSetModalState(MODAL_STATES.SIGNUP_STEP2);
  };

  return (
    <div
      className={`p-4 sm:p-2 flex flex-col items-center justify-center ${modalState !== MODAL_STATES.SIGNUP_SELECT_USER_TYPE ? "hidden" : ""}`}
    >
      <div className="text-center text-lg sm:text-xl flex justify-center items-center mt-4">
        What best describes you?
      </div>
      <div
        id="imgs-btns-wrapper"
        className="flex justify-around items-center mt-4 h-full sm:h-auto gap-2 sm:gap-2"
      >
        <Selection
          icon={jobhunter_icon}
          clickHandler={() => handleBtnClick(UserType.JOB_HUNTER)}
          label="Job Hunter"
          key={"job-hunter-selection"}
        />
        <Selection
          icon={employer_icon}
          clickHandler={() => handleBtnClick(UserType.EMPLOYER)}
          label="Employer"
          key={"employer-selection"}
        />
      </div>
    </div>
  );
};

export default JobHunterEmployerSelection;
