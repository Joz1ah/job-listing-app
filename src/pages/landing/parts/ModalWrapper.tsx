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
import { MODAL_STATES } from "store/modal/modal.types";

const MainModalContent = () => (
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
      </BookmarkProvider>
    </JobHunterProvider>
  </EmployerProvider>
);

const ModalWrapper = () => {
  const { modalState } = useLanding();

  if (modalState === MODAL_STATES.AUTHNET_PAYMENT_FULL) {
    return (
      <EmployerProvider initialTier="freeTrial">
        <JobHunterProvider initialTier="freeTrial">
          <BookmarkProvider>
            <AuthnetPaymentFullModal />
          </BookmarkProvider>
        </JobHunterProvider>
      </EmployerProvider>
    );
  }

  if (modalState === MODAL_STATES.PERFECT_MATCH_RESULTS) {
    return (
      <EmployerProvider initialTier="freeTrial">
        <JobHunterProvider initialTier="freeTrial">
          <PerfectMatchResultsModal />
        </JobHunterProvider>
      </EmployerProvider>
    );
  }

  return (
    <Modal>
      <MainModalContent />
    </Modal>
  );
};

export default ModalWrapper;