import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle
  } from "components"
  import { Button } from "components"
  import alert_listing from "assets/images/warning.gif"
  import { ROUTE_CONSTANTS } from "constants/routeConstants"
  
  interface InterviewLimitModalProps {
    isOpen: boolean;
    onClose: () => void;
  }
  
  // Modal for "3rd interview invitation"
  const ThirdInterviewLimitModal = ({
    isOpen,
    onClose
  }: InterviewLimitModalProps) => {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="bg-[#263238] border-none w-[90%] sm:w-[430px] md:min-h-[420px] p-6 rounded-none">
          <div className="flex flex-col items-center justify-center px-6 py-6">
            <DialogHeader className="sr-only">
              <DialogTitle className="text-center font-semibold text-[#F5722E] text-[15px]">
                Interview Limit
              </DialogTitle>
            </DialogHeader>
            
            <img src={alert_listing} alt="Warning" className="w-[135px] h-[135px] mb-4" />
            
            <div className="flex flex-col items-center justify-center gap-1 mb-6">
              <p className="text-center font-semibold text-[#F5722E] text-[15px]">
                This is your 3rd interview invitation
              </p>
              
              <p className="text-center text-white text-[13px]">
                Last invite this month! Refreshes next month.
              </p>
            </div>
            
            <div className="flex flex-col gap-2 items-center justify-center">
              <Button
                onClick={onClose}
                className="w-[135px] text-[13px] bg-[#F5722E] text-white hover:bg-[#d65d26] h-6 rounded-[2px] p-0"
              >
                Proceed
              </Button>
              <Button
                onClick={() => {
                  onClose();
                  window.location.href = ROUTE_CONSTANTS.DASHBOARD;
                }}
                variant="outline"
                className="w-[135px] text-[13px] bg-transparent border-[#F5722E] text-[#F5722E] hover:bg-[#F5722E] hover:text-[#F5F5F7] h-6 rounded-[2px] p-0"
              >
                Back to job feed
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }
  
  // Modal for "maxed out interview invites"
  const MaxedInterviewLimitModal = ({
    isOpen,
    onClose
  }: InterviewLimitModalProps) => {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="bg-[#263238] border-none w-[90%] sm:w-[430px] md:min-h-[420px] p-6 rounded-none">
          <div className="flex flex-col items-center justify-center px-6 py-6">
            <DialogHeader className="sr-only">
              <DialogTitle className="text-center font-semibold text-[#F5722E] text-[15px]">
                Interview Limit
              </DialogTitle>
            </DialogHeader>
            
            <img src={alert_listing} alt="Warning" className="w-[135px] h-[135px] mb-4" />
            
            <div className="flex flex-col items-center justify-center gap-1 mb-6">
              <p className="text-center font-semibold text-[#F5722E] text-[15px]">
                You've maxed out your interview invites
              </p>
              
              <p className="text-center text-white text-[13px]">
                Your interview invites refreshes next month.
              </p>
            </div>
            
            <div className="flex flex-col gap-2 items-center justify-center">
              <Button
                onClick={onClose}
                className="w-[135px] text-[13px] bg-[#F5722E] text-white hover:bg-[#d65d26] h-6 rounded-[2px] p-0"
              >
                Proceed
              </Button>
              <Button
                onClick={() => {
                  onClose();
                  window.location.href = ROUTE_CONSTANTS.DASHBOARD;
                }}
                variant="outline"
                className="w-[135px] text-[13px] bg-transparent border-[#F5722E] text-[#F5722E] hover:bg-[#F5722E] hover:text-[#F5F5F7] h-6 rounded-[2px] p-0"
              >
                Back to job feed
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }
  
  export { ThirdInterviewLimitModal, MaxedInterviewLimitModal };