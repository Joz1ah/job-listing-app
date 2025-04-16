import { Dialog, DialogContent, DialogHeader, DialogTitle } from "components";
import { Button } from "components";
import confetti_success from "assets/confetti.gif";
import { useAuth } from "contexts/AuthContext/AuthContext";
import { ROUTE_CONSTANTS } from "constants/routeConstants";

interface SubscriptionSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: string;
}

const SubscriptionSuccessModal = ({
  isOpen,
  onClose,
  type,
}: SubscriptionSuccessModalProps) => {
  // Get user information from auth context to check if user is employer
  const { user } = useAuth();
  const isEmployer = user?.data?.user?.type === "employer";
  // Determine price based on plan type
  let price = "";

  if (type === "Yearly") {
    price = isEmployer ? "550" : "50";
  } else {
    price = isEmployer ? "50" : "5";
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#263238] border-none w-full md:min-w-[550px] h-auto md:min-h-[550px] p-10 [&_button>svg]:text-white">
        <DialogHeader className="sr-only">
          <DialogTitle>Subscription Success</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col justify-end items-center space-y-4 pt-32">
          <div className="absolute top-0 left-0 right-0 pointer-events-none z-0">
            <img
              src={confetti_success}
              alt="Success celebration"
              className="w-full h-full"
            />
          </div>
          <div className="text-center space-y-2">
            <h2 className="text-orange-500 text-2xl">
              We're thrilled to have you as a subscriber!
            </h2>

            <p className="text-gray-200 text-sm">
              Your ${price} {type.toLowerCase()} plan gives you access to our
              best features!
              {!isEmployer &&
                " Complete Your Application Card to start enjoying exclusive access."}
            </p>
          </div>

          <Button
            onClick={() => {
              onClose();
              window.location.href = ROUTE_CONSTANTS.DASHBOARD;
            }}
            className="w-40 bg-orange-500 hover:bg-orange-600 text-white rounded"
          >
            Continue
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SubscriptionSuccessModal;
