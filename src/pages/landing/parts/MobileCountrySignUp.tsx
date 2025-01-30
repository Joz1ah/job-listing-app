import { useJobHunterContactMutation } from "api/akaza/akazaAPI";
import { PhoneInputLanding, CountrySelect } from "components";
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import styles from "./../landing.module.scss";
import { useModal } from "components/modal/useModal";
import { useLanding } from "../useLanding";
import button_loading_spinner from "assets/loading-spinner-orange.svg?url";
import { MODAL_HEADER_TYPE, MODAL_STATES } from "store/modal/modal.types";

interface FormValues {
  phoneNumber: string;
  country: string;
}

const MobileCountrySignUp = () => {
  const { handleSetSelectedModalHeader } = useModal();
  const { handleSetModalState, modalState } = useLanding();
  const [jobHunterContactSubmit] = useJobHunterContactMutation();

  const initialValues: FormValues = {
    phoneNumber: '',
    country: ''
  };

  const validationSchema = Yup.object({
    phoneNumber: Yup.string()
      .required('This field is required')
      .test('phone', 'Phone number must be between 8 and 15 digits', (value) => {
        if (!value) return false;
        const cleanPhone = value.replace(/\D/g, '');
        return cleanPhone.length >= 8 && cleanPhone.length <= 15;
      }),
    country: Yup.string()
      .required('This field is required')
  });

  return (
    modalState && modalState === MODAL_STATES.SIGNUP_STEP4 ?
    <div id="step4_signup" className={styles["modal-content"]}>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={async (values, { setErrors }) => {
          try {
            await jobHunterContactSubmit({
              phoneNumber: values.phoneNumber.replace(/[^\d]/g, ''),
              country: values.country
            }).unwrap();

            handleSetSelectedModalHeader(MODAL_HEADER_TYPE.WITH_CLOSE);
            handleSetModalState(MODAL_STATES.SIGNUP_STEP5);
          } catch (err: any) {
            console.error('Error submitting contact info:', err);
            
            if (err.status === 400) {
              const formErrors: { [key: string]: string } = {};
              if (err.data?.errors?.phoneNumber) {
                formErrors.phoneNumber = err.data.errors.phoneNumber[0];
              }
              if (err.data?.errors?.country) {
                formErrors.country = err.data.errors.country[0];
              }
              setErrors(formErrors);
            } else {
              alert('An error occurred while saving your information. Please try again.');
            }
          }
        }}
      >
        {({ values, errors, touched, handleChange, setFieldValue, isSubmitting }) => (
          <Form className={styles["country-mobtel-container"]}>
            <div className={styles["title-desc"]}>
              The information you provide will only be used for internal and verification purposes.
            </div>

            <div className={styles["input-fields-container"]}>
              {/* Phone Number Input */}
              <div className={styles["input-container"]}>
                <div className={styles["input-title-label-container"]}>
                  <label className={styles["input-title-label"]}>Mobile Number</label>
                  <label className={styles["input-title-label"]}>*</label>
                </div>
                <PhoneInputLanding
                  name="phoneNumber"
                  value={values.phoneNumber}
                  onChange={(e) => {
                    handleChange(e);
                    setFieldValue('phoneNumber', e.target.value);
                  }}
                  defaultCountry="PH"
                  className={styles["phone-input-wrapper"]}
                  onCountryChange={(country) => {
                    setFieldValue('country', country || '');
                  }}
                />
                {touched.phoneNumber && errors.phoneNumber && (
                  <div className="absolute text-red-500 text-[10px] mt-1 font-light bottom-0 right-0 top-[100%]">
                    {errors.phoneNumber}
                  </div>
                )}
              </div>

              {/* Country Input */}
              <div className={styles["input-container"]}>
                <div className={styles["input-title-label-container"]}>
                  <label className={styles["input-title-label"]}>Country</label>
                  <label className={styles["input-title-label"]}>*</label>
                </div>
                <div className={styles["input-wrapper"]}>
                  <CountrySelect
                    value={values.country}
                    onChange={(value) => setFieldValue('country', value)}
                  />
                  {touched.country && errors.country && (
                    <div className="absolute text-red-500 text-[10px] mt-1 font-light bottom-0 right-0 top-[100%]">
                      {errors.country}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className={styles["action-buttons"]}>
              <button
                type="button"
                onClick={() => handleSetModalState(MODAL_STATES.SIGNUP_STEP3)}
                className={styles["button-custom-basic"]}
              >
                Previous
              </button>
              <button
                type="submit"
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
                    Next
                  </>
                ) : (
                  "Next"
                )}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
    : <></>
  );
};

export default MobileCountrySignUp;