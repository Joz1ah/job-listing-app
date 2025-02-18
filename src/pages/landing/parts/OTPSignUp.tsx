import React, { useRef, useState, useEffect, useCallback } from "react";
import {
  useOtpVerifyMutation,
  useLoginMutation,
  useOtpGenerateMutation,
} from "api/akaza/akazaAPI";
import { useLanding } from "../useLanding";
import { MODAL_STATES } from "store/modal/modal.types";
import { ChevronLeft } from "lucide-react";

interface AutoLoginFormValues {
  email: string;
  password: string;
}

const OTPSignUp = () => {
  const {
    handleSetCredentials,
    dataStates,
    tempLoginEmail,
    tempLoginPassword,
    handleSetModalState,
    modalState,
  } = useLanding();

  const [submitOTP] = useOtpVerifyMutation();
  const [loginSubmit] = useLoginMutation();
  const buttonPrevious = useRef<HTMLDivElement>(null);
  const ib1 = useRef<HTMLInputElement>(null);
  const ib2 = useRef<HTMLInputElement>(null);
  const ib3 = useRef<HTMLInputElement>(null);
  const ib4 = useRef<HTMLInputElement>(null);
  const ib5 = useRef<HTMLInputElement>(null);
  const ib6 = useRef<HTMLInputElement>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [hasError, setHasError] = useState(false);
  const [areFieldsPopulated, setAreFieldsPopulated] = useState(false);

  const otpTimerRef = useRef<NodeJS.Timeout>();

  const checkFieldsPopulated = useCallback(() => {
    const allFieldsFilled = [ib1, ib2, ib3, ib4, ib5, ib6].every(
      (ref) => ref.current?.value && ref.current.value.length === 1,
    );
    setAreFieldsPopulated(allFieldsFilled);
    return allFieldsFilled;
  }, []);

  const handleLogin = async (values: AutoLoginFormValues) => {
    try {
      await loginSubmit(values)
        .unwrap()
        .then((res) => {
          handleSetCredentials({ ...dataStates, userId: res.data.user.id });
        });
    } catch (err: any) {
      console.log(err);
    }
  };

  const handleOnInput = (ref: any, nextRef: any) => {
    setErrorMessage("");
    setHasError(false);
    let currentInput = ref.current;
    currentInput.value = currentInput.value.replace(/[^0-9]/g, "");

    if (currentInput.value.length > currentInput.maxLength)
      currentInput.value = currentInput.value.slice(0, currentInput.maxLength);
    if (currentInput.value.length >= currentInput.maxLength)
      nextRef.current.focus();

    checkFieldsPopulated();
  };

  const handleOnKeyDown = (e: any, ref: any, refFocus: any) => {
    if (e.keyCode === 8) {
      ref.current.value = "";
      refFocus.current.focus();
    }
    checkFieldsPopulated();
  };

  const handleOnPaste = (e: React.ClipboardEvent, refArray: any[]) => {
    const pasteData = e.clipboardData.getData("Text").replace(/[^0-9]/g, "");
    if (pasteData.length === 6) {
      pasteData.split("").forEach((digit, index) => {
        if (refArray[index].current) {
          refArray[index].current.value = digit;
        }
      });
      setErrorMessage("");
      setHasError(false);
      checkFieldsPopulated();
    } else {
      setErrorMessage("Please paste a valid 6-digit OTP");
      setHasError(true);
      refArray.forEach((ref) => {
        if (ref.current) {
          ref.current.value = "";
        }
      });
      setAreFieldsPopulated(false);
    }
    e.preventDefault();
  };

  const clearOTPFields = () => {
    [ib1, ib2, ib3, ib4, ib5, ib6].forEach((ref) => {
      if (ref.current) {
        ref.current.value = "";
      }
    });
    if (ib1.current) {
      ib1.current.focus();
    }
    setAreFieldsPopulated(false);
  };

  const handleContinue = useCallback(async () => {
    const otp =
      (ib1.current?.value || "") +
      (ib2.current?.value || "") +
      (ib3.current?.value || "") +
      (ib4.current?.value || "") +
      (ib5.current?.value || "") +
      (ib6.current?.value || "");

    if (otp.length !== 6) {
      setErrorMessage("Please enter all 6 digits of the OTP");
      setHasError(true);
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage("");
      setHasError(false);

      await submitOTP({
        email: dataStates.email,
        otp: otp,
      })
        .unwrap()
        .then(() => {
          handleLogin({
            email: String(tempLoginEmail),
            password: String(tempLoginPassword),
          }).then(() => {
            handleSetModalState(MODAL_STATES.SIGNUP_CONGRATULATIONS);
          });
        });

      setTimeout(() => {
        handleSetModalState(MODAL_STATES.SIGNUP_CONGRATULATIONS);
      }, 1000);
    } catch (err: any) {
      console.log("OTP Error details:", err);
      if (err?.data?.message?.toLowerCase().includes("expired")) {
        setErrorMessage("Your OTP has expired");
      } else {
        setErrorMessage("Please provide the valid OTP");
      }
      setHasError(true);
      clearOTPFields();
    } finally {
      setIsLoading(false);
    }
  }, [dataStates.email, tempLoginEmail, tempLoginPassword]);

  const [generateOTP] = useOtpGenerateMutation();

  const resendOTP = async () => {
    try {
      setErrorMessage("");
      setHasError(false);
      await generateOTP({ email: dataStates.email })
        .unwrap()
        .then(() => {
          console.log("OTP resent successfully");
        })
        .catch((error) => {
          console.error("Failed to resend OTP:", error);
          setErrorMessage("Failed to resend OTP. Please try again.");
          setHasError(true);
        });
    } catch (error) {
      console.error("Error in resendOTP:", error);
      throw error;
    }
  };

  const [countdown, setCountdown] = useState(90);

  useEffect(() => {
    if (modalState === MODAL_STATES.SIGNUP_STEP3) {
      otpTimerRef.current = setInterval(() => {
        setCountdown((prevCount) => {
          if (prevCount <= 0) {
            clearInterval(otpTimerRef.current);
            return 0;
          }
          return prevCount - 1;
        });
      }, 1000);
    }

    return () => clearInterval(otpTimerRef.current);
  }, [modalState]);

  const handleResendClick = async () => {
    try {
      await resendOTP();
      setCountdown(90);
    } catch (error) {
      console.error("Failed to resend OTP:", error);
    }
  };

  const formatTime = (timeInSeconds: number): string => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return modalState && modalState == MODAL_STATES.SIGNUP_STEP3 ? (
    <div
      id="step3_signup"
      className="flex flex-col w-full h-full  justify-center items-center"
    >
      <div id="verify-container" className="space-y-4 w-full pt-[30px]">
        <div className="text-[28px] text-[#F5722E] font-[500] text-center">
          Verify with One Time Password
        </div>
        <div className="text-[10px] md:text-sm text-[#525254] font-[400] text-center">
          To ensure your security, please enter the One-Time Password (OTP) sent
          to your registered email below.
        </div>

        <div
          className={`flex flex-wrap justify-center gap-2 pt-2 md:pt-12 ${hasError ? "animate-shake" : ""}`}
        >
          <div>
            <input
              onInput={() => handleOnInput(ib1, ib2)}
              onKeyDown={(e) => handleOnKeyDown(e, ib1, ib1)}
              ref={ib1}
              type="number"
              pattern="[0-9]*"
              maxLength={1}
              onPaste={(e) => handleOnPaste(e, [ib1, ib2, ib3, ib4, ib5, ib6])}
              className="w-[47px] h-[55px] text-center border-2 border-[#AEADAD] rounded focus:border-orange-500 focus:outline-none appearance-none"
              style={{ MozAppearance: "textfield" }}
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
              className="w-[47px] h-[55px] text-center border-2 border-[#AEADAD] rounded focus:border-orange-500 focus:outline-none appearance-none"
              style={{ MozAppearance: "textfield" }}
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
              className="w-[47px] h-[55px] text-center border-2 border-[#AEADAD] rounded focus:border-orange-500 focus:outline-none appearance-none"
              style={{ MozAppearance: "textfield" }}
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
              className="w-[47px] h-[55px] text-center border-2 border-[#AEADAD] rounded focus:border-orange-500 focus:outline-none appearance-none"
              style={{ MozAppearance: "textfield" }}
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
              className="w-[47px] h-[55px] text-center border-2 border-[#AEADAD] rounded focus:border-orange-500 focus:outline-none appearance-none"
              style={{ MozAppearance: "textfield" }}
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
              className="w-[47px] h-[55px] text-center border-2 border-[#AEADAD] rounded focus:border-orange-500 focus:outline-none appearance-none"
              style={{ MozAppearance: "textfield" }}
            />
          </div>
        </div>

        {errorMessage && (
          <div className="text-red-500 text-center mt-2 text-sm italic">
            {errorMessage}
          </div>
        )}

        <div className="mt-4 w-full flex justify-center">
          <button
            onClick={handleContinue}
            className={`w-full max-w-[calc(6*3rem+5*0.5rem)] px-4 py-2 ${
              areFieldsPopulated && !hasError ? "bg-orange-500" : "bg-[#aeadad]"
            } text-white rounded-md ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
            disabled={isLoading || !areFieldsPopulated || hasError}
          >
            {isLoading ? "Verifying..." : "Continue"}
          </button>
        </div>

        <div className="text-center mt-4">
          <label className="text-[#AEADAD] text-[11px]">
            Didn't receive the email?&nbsp;
          </label>
          {countdown > 0 ? (
            <>
              <label className="text-[#F5722E] text-[11px] underline">
                Click to resend in{" "}
              </label>
              <label className="text-[#F5722E] text-[11px]">
                {formatTime(countdown)}
              </label>
            </>
          ) : (
            <label
              onClick={handleResendClick}
              className="text-[#F5722E] text-[11px] underline cursor-pointer ml-2"
            >
              Click to resend
            </label>
          )}
        </div>

        <div
          ref={buttonPrevious}
          id="btn_signup_step3_previous"
          className="text-center text-gray-500 mt-4 cursor-pointer"
          onClick={() => {
            [ib1, ib2, ib3, ib4, ib5, ib6].forEach((ref) => {
              if (ref.current) {
                ref.current.value = "";
              }
            });
            handleSetModalState(MODAL_STATES.SIGNUP_STEP2);
          }}
        >
          <ChevronLeft className="inline h-4 w-4 text-[#AEADAD]" />
          <div className="inline-block text-[10px] text-[#AEADAD]">
            Previous
          </div>
        </div>
      </div>
    </div>
  ) : (
    <></>
  );
};

export default OTPSignUp;
