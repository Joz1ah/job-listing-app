import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle
  } from "components"
  import { Button } from "components"
  import alert_listing from "assets/images/warning.gif"
  import { ROUTE_CONSTANTS } from "constants/routeConstants"
  
  interface JobListingLimitModalProps {
    isOpen: boolean;
    onClose: () => void;
  }
  
  const JobListingLimitModal = ({
    isOpen,
    onClose
  }: JobListingLimitModalProps) => {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="bg-[#263238] border-none w-[90%] sm:w-[430px] md:min-h-[420px] p-6 [&_button>svg]:hidden">
            <DialogHeader className="sr-only">
              <DialogTitle>Job Listing Limit</DialogTitle>
            </DialogHeader>
    
            <div className="flex flex-col justify-center items-center space-y-4">
              <img 
                src={alert_listing} 
                alt="Warning icon" 
                className="w-[135px] h-[135px] mb-4"
              />
              
              <div className="text-center">
                <p className="text-[#F5722E] font-semibold text-[16px]">
                  You've reached your 5th and Final Job Listing
                </p>
                <p className="text-[#F5F5F7] text-[12px] font-normal mt-2">
                  Last listing this month! Refreshes next month.
                </p>
              </div>
  
              <div className="flex flex-col justify-center items-center space-y-4 w-full">
                <Button
                  onClick={onClose}
                  className="w-[135px] text-[13px] bg-[#F5722E] hover:bg-[#F5722E]/90 text-[#F5F5F7] h-6 rounded-[2px] p-0"
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
  
  export { JobListingLimitModal };