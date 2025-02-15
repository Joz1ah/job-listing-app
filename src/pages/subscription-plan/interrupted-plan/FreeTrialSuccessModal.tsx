import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle
  } from "components"
  import { Button } from "components"
  
  interface FreeTrialSuccessModalProps {
    isOpen: boolean;
    onClose: () => void;
  }
  
  const FreeTrialSuccessModal = ({
    isOpen,
    onClose
  }: FreeTrialSuccessModalProps) => {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="bg-[#263238] border-none w-full md:min-w-[550px] h-auto md:min-h-[550px] p-10 [&_button>svg]:text-white">
          <DialogHeader className="sr-only">
            <DialogTitle>Free Trial Success</DialogTitle>
          </DialogHeader>
  
          <div className="flex flex-col justify-end items-center space-y-4 pt-32">
            <div className="text-center">
              <p className="text-[#F5F5F7] text-[15px] font-normal mb-2">
                We're thrilled to have you as a subscriber!
              </p>
              <p className="text-[#F5722E] font-semibold text-[26px]">
                Congratulations!
              </p>
            </div>
  
            <div className="space-y-4">
              <p className="text-[#F8F8FF] text-sm text-center">
                You've successfully claimed your free trial, valid for the next 3 days.
              </p>
              
              <div className="flex justify-center">
                <Button
                  onClick={() => {
                    onClose();
                    window.location.href = "/dashboard";
                  }}
                  className="w-full bg-[#F5722E] hover:bg-[#F5722E]/90 text-[#F5F5F7] h-8 rounded-[2px]"
                >
                  Continue
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }
  
  export { FreeTrialSuccessModal };