import { useRef } from "react";
import { useModal } from "../useModal";
import close_icon from "assets/close.svg?url";
import akazalogo_dark from "assets/akazalogo-dark.svg?url";
import styles from "./../modalcontext.module.scss";
import { MODAL_HEADER_TYPE } from "store/modal/modal.types";

const ModalHeader = () => {
  const { selectedModalHeader, toggleModal } = useModal();
  const closeModalRef = useRef<HTMLImageElement>(null);

  return (
    <div className={`${styles["modal-header-wrapper"]}`}>
      {selectedModalHeader === MODAL_HEADER_TYPE.WITH_LOGO_AND_CLOSE && (
        <>
          <div className={`${styles["modal-header"]}`}>
            <img src={akazalogo_dark} alt="Akaza Logo" />
            <img
              ref={closeModalRef}
              className={`${styles["close-modal"]}`}
              src={close_icon}
              alt="Close"
              style={{ width: "24px", height: "24px", marginLeft: "auto" }}
              onClick={toggleModal}
            />
          </div>
          <div className={`${styles["modal-divider"]}`}></div>
        </>
      )}
      {selectedModalHeader === MODAL_HEADER_TYPE.WITH_CLOSE && (
        <div className={`${styles["modal-header"]}`}>
          <img
            ref={closeModalRef}
            className={`${styles["close-modal"]}`}
            src={close_icon}
            alt="Close"
            style={{ width: "24px", height: "24px" }}
          />
        </div>
      )}
    </div>
  );
};

export default ModalHeader;
