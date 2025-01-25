import { useLanding } from "../useLanding";
import styles from "./../landing.module.scss";
import jobhunter_icon from "assets/jobhunter-icon.png";
import employer_icon from "assets/employer-icon.png";

const JobHunterEmployerSelection = () => {
  const { setDataStates, setModalState, modalStates, modalState } =
    useLanding();

  const handleBtnClick = (type: "job_hunter" | "employer") => {
    setDataStates((state) => ({ ...state, selectedUserType: type }));
    setModalState(modalStates.SIGNUP_STEP2);
  };

  return (
    <div
      className={`${styles["modal-content"]}`}
      hidden={modalState !== modalStates.SIGNUP_SELECT_USER_TYPE}
    >
      <div className={`${styles["modal-title"]}`}>What best describes you?</div>
      <div className={`${styles["selection-items"]}`}>
        <div>
          <img src={jobhunter_icon}></img>
          <button
            onClick={() => handleBtnClick("job_hunter")}
            className={`${styles["button-custom"]}`}
          >
            Job Hunter
          </button>
        </div>
        <div>
          <img src={employer_icon}></img>
          <button
            onClick={() => handleBtnClick("employer")}
            className={`${styles["button-custom"]}`}
          >
            Employer
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobHunterEmployerSelection;
