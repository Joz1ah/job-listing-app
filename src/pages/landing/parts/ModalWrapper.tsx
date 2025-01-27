import {
  EmployerProvider,
  JobHunterProvider,
  BookmarkProvider,
} from "components";
import Modal from "components/modal/modal";
import AuthnetPaymentFullModal from "./AuthnetPaymentFullModal";
import CongratulationsModal from "./CongratulationsModal";
import EmployerAdditionalInformation from "./EmployerAdditionalInformation";
import JobHunterEmployerSelection from "./JobHunterEmployerSelection";
import LoadingModal from "./LoadingModal";
import LoginModal from "./LoginModal";
import MobileCountrySignUp from "./MobileCountrySignUp";
import OTPSignUp from "./OTPSignUp";
import PerfectMatchResultsModal from "./PerfectMatchResultsModal";
import StripePaymentModal from "./StripePaymentModal";
import SubscriptionPlanSelection from "./SubscriptionPlanSelection";
import UserNamePasswordSignup from "./UserNamePasswordSignup";
import { useLanding } from "../useLanding";
import { MODAL_STATES } from "store/types/modal.types";

const ModalWrapper = () => {
  const { modalState } = useLanding();
  return (
    <>
      {modalState !== MODAL_STATES.PERFECT_MATCH_RESULTS ? (
        <Modal>
          <EmployerProvider initialTier="freeTrial">
            <JobHunterProvider initialTier="freeTrial">
              <BookmarkProvider>
                <LoginModal />
                <JobHunterEmployerSelection />
                <UserNamePasswordSignup />
                <OTPSignUp />
                <MobileCountrySignUp />
                <EmployerAdditionalInformation />
                <SubscriptionPlanSelection />
                <LoadingModal />
                <CongratulationsModal />
                <StripePaymentModal />
                <AuthnetPaymentFullModal />
              </BookmarkProvider>
            </JobHunterProvider>
          </EmployerProvider>
        </Modal>
      ) : (
        <EmployerProvider initialTier="freeTrial">
          <JobHunterProvider initialTier="freeTrial">
            <PerfectMatchResultsModal />
          </JobHunterProvider>
        </EmployerProvider>
      )}
    </>
  );
};

export default ModalWrapper;
