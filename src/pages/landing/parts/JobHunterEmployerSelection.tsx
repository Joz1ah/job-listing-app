import { useLanding } from "../useLanding";
import jobhunter_icon from "assets/jobhunter-icon.png";
import employer_icon from "assets/employer-icon.png";
import { MODAL_STATES } from "store/modal/modal.types";
import { UserType } from "store/user/user.types";

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
      <div className="text-center text-lg sm:text-xl flex justify-center items-center mt-4 gap-8">
        What best describes you?
      </div>
      <div
        id="imgs-btns-wrapper"
        className="flex justify-around items-center mt-4 h-full sm:h-auto gap-4 sm:gap-4"
      >
        <div className="flex flex-col items-center w-full sm:w-auto h-full sm:h-auto justify-center">
          <div className="flex flex-col items-center">
            <img
              src={jobhunter_icon}
              className="h-modal-image-h w-modal-image-w mb-2 transform transition-transform duration-300 hover:scale-110"
              alt="Job Hunter Icon"
            />
            <button
              onClick={() => handleBtnClick(UserType.JOB_HUNTER)} 
              className="mt-6 border border-3 border-orange-500 rounded-md flex w-44 h-10 sm:w-64 sm:h-16 p-2 justify-center items-center bg-gray-100 text-orange-500 font-semibold sm:text-lg border-3 text-base hover:bg-orange-500 hover:text-white"
            >
              Job Hunter
            </button>
          </div>
        </div>
        <div className="flex flex-col items-center w-full sm:w-auto h-full sm:h-auto justify-center">
          <div className="flex flex-col items-center">
            <img
              src={employer_icon}
              className="h-modal-image-h w-modal-image-w mb-2 transform transition-transform duration-300 hover:scale-110"
              alt="Employer Icon"
            />
            <button
              onClick={() => handleBtnClick(UserType.EMPLOYER)}
              className="mt-6 border border-3 border-orange-500 rounded-md flex w-44 h-10 sm:w-64 sm:h-16 p-2 justify-center items-center bg-gray-100 text-orange-500 font-semibold sm:text-lg border-3 text-base hover:bg-orange-500 hover:text-white"
            >
              Employer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobHunterEmployerSelection;
