import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "components"
import { Button } from "components"

interface SubscriptionSuccessModalProps {
  isOpen: boolean
  onClose: () => void
  type: string
}

const SubscriptionSuccessModal = ({
  isOpen,
  onClose,
  type
}: SubscriptionSuccessModalProps) => {
  // Determine price based on plan type
  const price = type === "Yearly" ? "55" : "5"

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#263238] border-none w-full md:min-w-[550px] h-auto md:min-h-[550px] p-10 [&_button>svg]:text-white">
        <DialogHeader className="sr-only">
          <DialogTitle>Subscription Success</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col justify-end items-center space-y-4 pt-32">
          <div className="text-center space-y-2">
            <h2 className="text-orange-500 text-2xl">
              We're thrilled to have you as a subscriber!
            </h2>
            
            <p className="text-gray-200 text-sm">
              Your ${price} {type.toLowerCase()} plan + 1 month free gives you access to our best features! Complete Your Application Card to start enjoying exclusive access.
            </p>
          </div>

          <Button
            onClick={() => {
              onClose();
              window.location.href = "/dashboard";
            }}
            className="w-40 bg-orange-500 hover:bg-orange-600 text-white rounded"
          >
            Continue
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default SubscriptionSuccessModal