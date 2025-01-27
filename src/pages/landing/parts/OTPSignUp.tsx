import {
  useOtpVerifyMutation,
  useLoginMutation,
  useOtpGenerateMutation,
} from "api/akaza/akazaAPI";
import { useErrorModal } from "contexts/ErrorModalContext/ErrorModalContext";
import { useRef, useState, useEffect } from "react";
import styles from "./../landing.module.scss";
import { useLanding } from "../useLanding";
import { MODAL_STATES } from "store/types/modal.types";

interface AutoLoginFormValues {
  email: string;
  password: string;
}

const OTPSignUp = () => {
  const {
    setDataStates,
    dataStates,
    tempLoginEmail,
    tempLoginPassword,
    handleSetModalState,
    modalState,
  } = useLanding();
  const buttonContinue = useRef<HTMLButtonElement>(null);
  const [submitOTP] = useOtpVerifyMutation();
  const [loginSubmit] = useLoginMutation();
  const buttonPrevious = useRef<HTMLDivElement>(null);
  const ib1 = useRef<HTMLInputElement>(null);
  const ib2 = useRef<HTMLInputElement>(null);
  const ib3 = useRef<HTMLInputElement>(null);
  const ib4 = useRef<HTMLInputElement>(null);
  const ib5 = useRef<HTMLInputElement>(null);
  const ib6 = useRef<HTMLInputElement>(null);
  const { showError } = useErrorModal();

  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (values: AutoLoginFormValues) => {
    try {
      await loginSubmit(values)
        .unwrap()
        .then((res) => {
          setDataStates((state) => ({ ...state, userId: res.data.user.id }));
        });
    } catch (err: any) {
      console.log(err);
    }
  };

  const handleOnInput = (ref: any, nextRef: any) => {
    let currentInput = ref.current;
    currentInput.value = currentInput.value.replace(/[^0-9]/g, "");

    if (currentInput.value.length > currentInput.maxLength)
      currentInput.value = currentInput.value.slice(0, currentInput.maxLength);
    if (currentInput.value.length >= currentInput.maxLength)
      nextRef.current.focus();
  };

  const handleOnKeyDown = (e: any, ref: any, refFocus: any) => {
    if (e.keyCode === 8) {
      ref.current.value = "";
      refFocus.current.focus();
    }
  };

  const handleOnPaste = (e: React.ClipboardEvent, refArray: any[]) => {
    const pasteData = e.clipboardData.getData("Text").replace(/[^0-9]/g, "");
    if (pasteData.length === 6) {
      pasteData.split("").forEach((digit, index) => {
        if (refArray[index].current) {
          refArray[index].current.value = digit;
        }
      });
    } else {
      // If pasted OTP is not of 6 digits, you can show an error or clear fields
      showError("Error", "Please paste a valid 6-digit OTP.");
      refArray.forEach((ref) => {
        if (ref.current) {
          ref.current.value = "";
        }
      });
    }
    e.preventDefault(); // Prevent default paste behavior
  };

  const handleContinue = () => {
    if (buttonContinue.current) {
      buttonContinue.current.onclick = async () => {
        const otp =
          (ib1.current?.value || "") +
          (ib2.current?.value || "") +
          (ib3.current?.value || "") +
          (ib4.current?.value || "") +
          (ib5.current?.value || "") +
          (ib6.current?.value || "");

        if (otp.length !== 6) {
          alert("Please enter all 6 digits of the OTP");
          return;
        }

        try {
          setIsLoading(true);

          await submitOTP({
            email: dataStates.email,
            otp: otp,
          })
            .unwrap()
            .then(() => {
              handleLogin({
                email: tempLoginEmail,
                password: tempLoginPassword,
              }).then(() => {
                handleSetModalState(MODAL_STATES.SIGNUP_CONGRATULATIONS);
              });
            });

          setTimeout(() => {
            handleSetModalState(MODAL_STATES.SIGNUP_CONGRATULATIONS);
          }, 1000);
        } catch (err: any) {
          console.log("OTP Error details:", err); // Log full error object
          if (err?.data?.message) {
            showError(err?.data?.errors, err?.data?.message);
          }

          // Clear OTP fields on error
          [ib1, ib2, ib3, ib4, ib5, ib6].forEach((ref) => {
            if (ref.current) {
              ref.current.value = "";
            }
          });
          if (ib1.current) {
            ib1.current.focus();
          }
        } finally {
          setIsLoading(false);
        }
      };
    }
  };

  useEffect(handleContinue, []);

  const [generateOTP] = useOtpGenerateMutation();

  const resendOTP = async () => {
    try {
      await generateOTP({ email: dataStates.email })
        .unwrap()
        .then(() => {
          console.log("OTP resent successfully");
          // Optionally add success toast/notification here
        })
        .catch((error) => {
          console.error("Failed to resend OTP:", error);
          // Optionally add error toast/notification here
        });
    } catch (error) {
      console.error("Error in resendOTP:", error);
      throw error; // Propagate error to handleResendClick
    }
  };

  const [countdown, setCountdown] = useState(180);

  useEffect(() => {
    // Start the countdown when component mounts
    const timer = setInterval(() => {
      setCountdown((prevCount) => {
        if (prevCount <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prevCount - 1;
      });
    }, 1000);

    // Cleanup timer on component unmount
    return () => clearInterval(timer);
  }, [countdown]);

  const handleResendClick = async () => {
    try {
      // Add your resend OTP logic here
      await resendOTP();

      setCountdown(180);
    } catch (error) {
      // Handle error
      console.error("Failed to resend OTP:", error);
    }
  };

  useEffect(() => {
    if (buttonPrevious.current) {
      buttonPrevious.current.onclick = () => {
        [ib1, ib2, ib3, ib4, ib5, ib6].forEach((ref) => {
          if (ref.current) {
            ref.current.value = "";
          }
        });
        handleSetModalState(MODAL_STATES.SIGNUP_STEP2);
      };
    }
  }, []);

  const formatTime = (timeInSeconds: number): string => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div
      id="step3_signup"
      className={`${styles["modal-content"]}`}
      hidden={modalState !== MODAL_STATES.SIGNUP_STEP3}
    >
      <div className={`${styles["verify-container"]}`}>
        <div className={`${styles.desc1}`}>Verify with One Time Password</div>
        <div className={`${styles.desc2}`}>
          To ensure your security, please enter the One - Time Password
        </div>
        <div className={`${styles.desc2}`}>
          (OTP) sent to your registered email below.
        </div>

        <div className={`${styles["otp-input-fields"]}`}>
          <div>
            <input
              onInput={() => handleOnInput(ib1, ib2)}
              onKeyDown={(e) => handleOnKeyDown(e, ib1, ib1)}
              ref={ib1}
              type="number"
              pattern="[0-9]*"
              maxLength={1}
              onPaste={(e) => handleOnPaste(e, [ib1, ib2, ib3, ib4, ib5, ib6])}
            />
          </div>
          <div>
            <input
              onInput={() => handleOnInput(ib2, ib3)}
              onKeyDown={(e) => handleOnKeyDown(e, ib2, ib1)}
              ref={ib2}
              type="number"
              pattern="[0-9]*"
              maxLength={1}
              onPaste={(e) => handleOnPaste(e, [ib1, ib2, ib3, ib4, ib5, ib6])}
            />
          </div>
          <div>
            <input
              onInput={() => handleOnInput(ib3, ib4)}
              onKeyDown={(e) => handleOnKeyDown(e, ib3, ib2)}
              ref={ib3}
              type="number"
              pattern="[0-9]*"
              maxLength={1}
              onPaste={(e) => handleOnPaste(e, [ib1, ib2, ib3, ib4, ib5, ib6])}
            />
          </div>
          <div>
            <input
              onInput={() => handleOnInput(ib4, ib5)}
              onKeyDown={(e) => handleOnKeyDown(e, ib4, ib3)}
              ref={ib4}
              type="number"
              pattern="[0-9]*"
              maxLength={1}
              onPaste={(e) => handleOnPaste(e, [ib1, ib2, ib3, ib4, ib5, ib6])}
            />
          </div>
          <div>
            <input
              onInput={() => handleOnInput(ib5, ib6)}
              onKeyDown={(e) => handleOnKeyDown(e, ib5, ib4)}
              ref={ib5}
              type="number"
              pattern="[0-9]*"
              maxLength={1}
              onPaste={(e) => handleOnPaste(e, [ib1, ib2, ib3, ib4, ib5, ib6])}
            />
          </div>
          <div>
            <input
              onInput={() => handleOnInput(ib6, ib6)}
              onKeyDown={(e) => handleOnKeyDown(e, ib6, ib5)}
              ref={ib6}
              type="number"
              pattern="[0-9]*"
              maxLength={1}
              onPaste={(e) => handleOnPaste(e, [ib1, ib2, ib3, ib4, ib5, ib6])}
            />
          </div>
        </div>

        <div className={`${styles["action-buttons"]}`}>
          <button
            ref={buttonContinue}
            className={`${styles["button-custom-orange"]} ${isLoading ? styles["loading"] : ""}`}
            disabled={isLoading}
          >
            {isLoading ? "Verifying..." : "Continue"}
          </button>
          <button
            onClick={() => {
              [ib1, ib2, ib3, ib4, ib5, ib6].forEach((ref) => {
                if (ref.current) {
                  ref.current.value = "";
                }
              });
              handleSetModalState(MODAL_STATES.SIGNUP_STEP2);
            }}
            className={`${styles["button-custom-basic"]}`}
          >
            Cancel
          </button>
        </div>

        <div className={`${styles["resend-container"]}`}>
          <label className={`${styles["resend-label1"]}`}>
            Didn't receive the email?
          </label>
          {countdown > 0 ? (
            <>
              <label className={`${styles["resend-label2"]}`}>
                Click to resend in{" "}
              </label>
              <label className={`${styles["resend-label3"]}`}>
                {formatTime(countdown)}
              </label>
            </>
          ) : (
            <label
              onClick={handleResendClick}
              className={`${styles["resend-button"]}`}
            >
              Click to resend
            </label>
          )}
        </div>

        <div
          ref={buttonPrevious}
          id="btn_signup_step3_previous"
          className={`${styles["previous-button-container"]}`}
          onClick={() => {
            [ib1, ib2, ib3, ib4, ib5, ib6].forEach((ref) => {
              if (ref.current) {
                ref.current.value = "";
              }
            });
            handleSetModalState(MODAL_STATES.SIGNUP_STEP2);
          }}
        >
          <div className={`${styles["previous-button"]}`}></div>
          <div className={`${styles["caret-left"]}`}></div>
          <div className={`${styles["previous-button-label"]}`}>Previous</div>
        </div>
      </div>
    </div>
  );
};

export default OTPSignUp;
