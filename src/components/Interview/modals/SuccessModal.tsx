import React from "react";
import { Dialog, DialogContent, DialogTitle } from "components";
import { Button } from "components";
import { Link } from "react-router-dom";

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  variant: "employer" | "job-hunter";
}

const SuccessModal: React.FC<SuccessModalProps> = ({
  isOpen,
  onClose,
  variant,
}) => {
  const messages = {
    employer: "Successfully rated this candidate!",
    "job-hunter": "Successfully rated this company!",
  };

  const paths = {
    employer: "/employer/interviews/pending",
    "job-hunter": "/job-hunter/interviews/pending",
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogTitle className="sr-only">Rating Submission Success</DialogTitle>
        <div className="relative bg-white p-6 rounded-lg text-center">
          <h2 className="text-[#F5722E] text-2xl font-medium mb-8">
            {messages[variant]}
          </h2>

          <div className="flex flex-col items-center space-y-2">
            <Button
              onClick={onClose}
              variant="outline"
              className="w-[140px] h-6 border-2 border-[#F5722E] text-[#F5722E] font-light"
            >
              Go Back
            </Button>

            <Link to={paths[variant]} onClick={onClose}>
              <Button
                className="w-[140px] h-6 bg-[#F5722E] text-white hover:bg-[#F5722E]/90 font-light"
                type="button"
              >
                View Interviews
              </Button>
            </Link>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export { SuccessModal };
