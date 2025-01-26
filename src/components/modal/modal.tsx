import { ReactNode, useContext } from "react";
import styles from "./modalcontext.module.scss";
import ModalHeader from "./parts/modal-header";
import { ModalContext } from "./modalContext";

type ModalProps = {
  children: ReactNode;
};

const Modal = ({ children }: ModalProps) => {
  const { isOpen } = useContext(ModalContext);

  console.log(">>FROM MODAL", { isOpen });

  return (
    isOpen && (
      <div
        className={`${styles["mask-overlay"]} ${styles["requires-no-scroll"]}`}
      >
        <div className={styles["mask_overlay"]}>
          <div className={`${styles["modal-container-wrapper"]}`}>
            <div className={`${styles["modal-container"]}`}>
              <div className={`${styles["modal-item"]}`}>
                <ModalHeader />
                <div className={`${styles["modal-content-wrapper"]}`}>
                  {children}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default Modal;
