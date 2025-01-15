import { useState, useEffect, useRef, ReactNode } from 'react';
import styles from './modalcontext.module.scss';
import akazalogo_dark from 'assets/akazalogo-dark.svg?url';
import close_icon from 'assets/close.svg?url';

// Modal header types
const MODAL_HEADER_TYPE = {
  WITH_LOGO_AND_CLOSE: 1,
  WITH_CLOSE: 2,
};

// Custom hook to manage modal state
const useModal = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedModalHeader, setSelectedModalHeader] = useState(MODAL_HEADER_TYPE.WITH_LOGO_AND_CLOSE);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // Modal header component
  const ModalHeader = () => {
    const closeModalRef = useRef<HTMLImageElement>(null);

    const handleClose = () => {
      setSelectedModalHeader(MODAL_HEADER_TYPE.WITH_LOGO_AND_CLOSE);
      closeModal();
    };

    useEffect(() => {
      if (closeModalRef.current) {
        closeModalRef.current.onclick = handleClose;
      }
    }, []);

    return (
      <div className={`${styles['modal-header-wrapper']}`}>
        {selectedModalHeader === MODAL_HEADER_TYPE.WITH_LOGO_AND_CLOSE && (
          <>
            <div className={`${styles['modal-header']}`}>
              <img src={akazalogo_dark} alt="Akaza Logo" />
              <img
                ref={closeModalRef}
                className={`${styles['close-modal']}`}
                src={close_icon}
                alt="Close"
                style={{ width: '24px', height: '24px', marginLeft: 'auto' }}
              />
            </div>
            <div className={`${styles['modal-divider']}`}></div>
          </>
        )}
        {selectedModalHeader === MODAL_HEADER_TYPE.WITH_CLOSE && (
          <div className={`${styles['modal-header']}`}>
            <img
              ref={closeModalRef}
              className={`${styles['close-modal']}`}
              src={close_icon}
              alt="Close"
              style={{ width: '24px', height: '24px' }}
            />
          </div>
        )}
      </div>
    );
  };

  // Modal wrapper component
  const Modal = ({ children }: { children: ReactNode }) => {
    return (
      isModalOpen && (
        <div className={`${styles['mask-overlay']} ${styles['requires-no-scroll']}`}>
          <div className={styles['mask_overlay']}>
            <div className={`${styles['modal-container-wrapper']}`}>
              <div className={`${styles['modal-container']}`}>
                <div className={`${styles['modal-item']}`}>
                  <ModalHeader />
                  <div className={`${styles['modal-content-wrapper']}`}>
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

  return {
    isModalOpen,
    selectedModalHeader,
    setSelectedModalHeader,
    openModal,
    closeModal,
    Modal,
  };
};

export default useModal;
