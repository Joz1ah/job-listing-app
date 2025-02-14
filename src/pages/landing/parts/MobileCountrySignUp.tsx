import { useJobHunterContactMutation } from "api/akaza/akazaAPI";
import { PhoneInputLanding, CountrySelect } from "components";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useModal } from "components/modal/useModal";
import { useLanding } from "../useLanding";
import button_loading_spinner from "assets/loading-spinner-orange.svg?url";
import { MODAL_HEADER_TYPE, MODAL_STATES } from "store/modal/modal.types";
import { isValidPhoneNumber } from "react-phone-number-input";
import { getCountryByNumber } from 'utils/phoneUtils';
import countries from "constants/countries";

interface FormValues {
  phoneNumber: string;
  country: string;
}

const MobileCountrySignUp = () => {
  const { handleSetSelectedModalHeader } = useModal();
  const { handleSetModalState, modalState } = useLanding();
  const [jobHunterContactSubmit] = useJobHunterContactMutation();

  const initialValues: FormValues = {
    phoneNumber: "",
    country: "",
  };

  const validationSchema = Yup.object({
    phoneNumber: Yup.string()
        .required("This field is required")
        .test(
          "phone",
          "Phone number must be in international format and contain 11-12 digits",
          function (value) {
            if (!value) return false;
    
            // Check if it's a valid phone number first
            if (!isValidPhoneNumber(value)) return false;
    
            // Remove all non-digit characters to check length
            const digitsOnly = value.replace(/\D/g, "");
    
            // Check if the number of digits is between 11 and 12
            return digitsOnly.length >= 11 && digitsOnly.length <= 12;
          },
        ),
    country: Yup.string().required("This field is required"),
  });

  return modalState && modalState === MODAL_STATES.SIGNUP_STEP4 ? (
    <div
      id="step4_signup"
      className="flex flex-col items-center justify-center w-full h-full p-[2px]"
    >
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={async (values, { setErrors }) => {
          try {
            await jobHunterContactSubmit({
              phoneNumber: values.phoneNumber.replace(/[^\d]/g, ""),
              country: values.country,
            }).unwrap();

            handleSetSelectedModalHeader(MODAL_HEADER_TYPE.WITH_LOGO_AND_CLOSE);
            handleSetModalState(MODAL_STATES.SIGNUP_STEP5);
          } catch (err: any) {
            console.error("Error submitting contact info:", err);

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
              alert(
                "An error occurred while saving your information. Please try again.",
              );
            }
          }
        }}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          setFieldValue,
          isSubmitting,
        }) => (
          <Form className="flex flex-col gap-6 w-full max-w-md">
            <div className="text-center text-gray-700 mb-4">
              The information you provide will only be used for internal and
              verification purposes.
            </div>

            <div className="flex flex-col gap-4">
              {/* Phone Number Input */}
              <div className="flex flex-col">
                <div className="flex items-center border-b-[1px] border-[#aeadad]">
                  <label className="text-gray-700 w-1/3 text-sm">
                    Mobile Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative w-2/3">
                    <PhoneInputLanding
                      name="phoneNumber"
                      value={values.phoneNumber}
                      onChange={(e) => {
                        handleChange(e)
                        setFieldValue("phoneNumber", e.target.value);
                        const countryCode = getCountryByNumber(e.target.value);
                        const country = countries.find((c) => c.code === countryCode)?.name || '';
                        console.log(country)
                        setFieldValue("country", country);
                      }}
                      defaultCountry="PH"
                      className="w-full"
                    />
                  </div>
                </div>
                {touched.phoneNumber && errors.phoneNumber && (
                  <div className="text-red-500 text-xs mt-1">
                    {errors.phoneNumber}
                  </div>
                )}
              </div>

              {/* Country Input */}
              <div className="flex flex-col">
                <div className="flex items-center border-b-[1px] border-[#aeadad]">
                  <label className="text-gray-700 w-1/3 text-sm">
                    Country <span className="text-red-500">*</span>
                  </label>
                  <div className="relative w-2/3">
                    <CountrySelect
                      value={values.country}
                      onChange={(value) => setFieldValue("country", value)}
                    />
                  </div>
                </div>

                {touched.country && errors.country && (
                  <div className="text-red-500 text-xs mt-1">
                    {errors.country}
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center gap-2 mt-6 w-full">
              <button
                onClick={() => handleSetModalState(MODAL_STATES.SIGNUP_STEP3)}
                className="text-[#F5722E] rounded-[5px] border-[2px] bg-white border-[#F5722E] px-4 py-2"
              >
                Previous
              </button>
              <button
                type="submit"
                className={`flex justify-between items-center px-4 py-1 ${values.country && values.phoneNumber ? "bg-[#F5722E] text-white" : "bg-[#AEADAD] text-[#F5F5F7]"} rounded-md`}
                disabled={
                  isSubmitting || !values.country || !values.phoneNumber
                }
              >
                {isSubmitting ? (
                  <>
                    <img
                      src={button_loading_spinner}
                      alt="Loading"
                      className="w-4 h-4 mr-2"
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
  ) : (
    <></>
  );
};

export default MobileCountrySignUp;
