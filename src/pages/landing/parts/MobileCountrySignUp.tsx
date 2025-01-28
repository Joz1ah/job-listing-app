import { useJobHunterContactMutation } from "api/akaza/akazaAPI";
import { PhoneInputLanding, CountrySelect } from "components";
import { useRef, useState, useEffect } from "react";
import styles from "./../landing.module.scss";
import { useModal } from "components/modal/useModal";
import { useLanding } from "../useLanding";
import button_loading_spinner from "assets/loading-spinner-orange.svg?url";
import { MODAL_HEADER_TYPE, MODAL_STATES } from "store/modal/modal.types";

const MobileCountrySignUp = () => {
  const { handleSetSelectedModalHeader } = useModal();
  const { handleSetModalState, modalState } = useLanding();
  const buttonNext = useRef<HTMLButtonElement>(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [country, setCountry] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [countryError, setCountryError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Add the mutation hook
  const [jobHunterContactSubmit] = useJobHunterContactMutation();

  const validatePhoneNumber = (phone: string): boolean => {
    const cleanPhone = phone.replace(/\D/g, "");

    if (!cleanPhone) {
      setPhoneError("This field is required");
      return false;
    }

    if (cleanPhone.length < 8 || cleanPhone.length > 15) {
      setPhoneError("Phone number must be between 8 and 15 digits");
      return false;
    }

    setPhoneError("");
    return true;
  };

  const validateForm = () => {
    const isPhoneValid = validatePhoneNumber(phoneNumber);
    let isCountryValid = true;

    if (!country) {
      setCountryError("This field is required");
      isCountryValid = false;
    } else {
      setCountryError("");
    }

    return isPhoneValid && isCountryValid;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setPhoneNumber(newValue);
    if (phoneError) {
      if (newValue.trim()) {
        validatePhoneNumber(newValue);
      } else {
        setPhoneError("");
      }
    }
  };

  const handleCountryChange = (value: string) => {
    setCountry(value);
    if (countryError) setCountryError("");
    if (phoneNumber) {
      validatePhoneNumber(phoneNumber);
    }
  };

  useEffect(() => {
    if (buttonNext.current) {
      buttonNext.current.onclick = async () => {
        if (validateForm()) {
          try {
            setIsSubmitting(true);

            // Submit the form data to the API
            await jobHunterContactSubmit({
              phoneNumber: phoneNumber.replace(/[^\d]/g, ""),
              country: country,
            }).unwrap();

            // If successful, move to next step
            handleSetSelectedModalHeader(MODAL_HEADER_TYPE.WITH_CLOSE);
            handleSetModalState(MODAL_STATES.SIGNUP_STEP5);
          } catch (err: any) {
            // Handle API errors
            console.error("Error submitting contact info:", err);

            if (err.status === 400) {
              // Handle validation errors from the API
              if (err.data?.errors?.phoneNumber) {
                setPhoneError(err.data.errors.phoneNumber[0]);
              }
              if (err.data?.errors?.country) {
                setCountryError(err.data.errors.country[0]);
              }
            } else {
              // Handle other types of errors
              alert(
                "An error occurred while saving your information. Please try again.",
              );
            }
          } finally {
            setIsSubmitting(false);
          }
        }
      };
    }
  }, [phoneNumber, country, jobHunterContactSubmit]);

  const [open, setOpen] = useState(false);

  const handleOpenSelect = () => {
    setOpen((state) => !state);
  };

  return (
    <div
      id="step4_signup"
      className={styles["modal-content"]}
      hidden={modalState !== MODAL_STATES.SIGNUP_STEP4}
    >
      <div className={styles["country-mobtel-container"]}>
        <div className={styles["title-desc"]}>
          The information you provide will only be used for internal and
          verification purposes.
        </div>

        <div className={styles["input-fields-container"]}>
          {/* Phone Number Input */}
          <div className={styles["input-container"]}>
            <div className={styles["input-title-label-container"]}>
              <label className={styles["input-title-label"]}>
                Mobile Number
              </label>
              <label className={styles["input-title-label"]}>*</label>
            </div>
            <PhoneInputLanding
              name="phoneNumber"
              value={phoneNumber}
              onChange={handlePhoneChange}
              defaultCountry="PH"
              className={styles["phone-input-wrapper"]}
              onCountryChange={(country) => {
                handleCountryChange(country || "");
              }}
            />
            {phoneError && (
              <div className="absolute text-red-500 text-[10px] mt-1 font-light bottom-0 right-0">
                {phoneError}
              </div>
            )}
          </div>

          {/* Country Input */}
          <div className={styles["input-container"]}>
            <div className={styles["input-title-label-container"]}>
              <label className={styles["input-title-label"]}>Country</label>
              <label className={styles["input-title-label"]}>*</label>
            </div>
            {/* <div className={styles["input-wrapper"]}> */}
            <CountrySelect
              value={country}
              onChange={handleCountryChange}
              error={countryError}
              handleToggle={handleOpenSelect}
              open={open}
            />
            {/* </div> */}
          </div>
        </div>

        {/* Action Buttons */}
        <div className={styles["action-buttons"]}>
          <button
            onClick={() => handleSetModalState(MODAL_STATES.SIGNUP_STEP3)}
            className={styles["button-custom-basic"]}
          >
            Previous
          </button>
          <button
            ref={buttonNext}
            className={styles["button-custom-orange"]}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <img
                  src={button_loading_spinner}
                  alt="Loading"
                  className={styles["button-spinner"]}
                />
                Loading...
              </>
            ) : (
              "Next"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MobileCountrySignUp;
