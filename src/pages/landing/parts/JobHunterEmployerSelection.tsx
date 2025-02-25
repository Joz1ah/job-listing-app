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
      className={`p-4 flex flex-col items-center justify-center ${modalState !== MODAL_STATES.SIGNUP_SELECT_USER_TYPE ? "hidden" : ""}`}
    >
      <div className="text-center text-lg flex justify-center items-center font-light">
        What best describes you?
      </div>
      <div
        id="imgs-btns-wrapper"
        className="flex justify-around items-center pt-14 h-full sm:h-auto gap-[10px] md:gap-[50px]"
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
