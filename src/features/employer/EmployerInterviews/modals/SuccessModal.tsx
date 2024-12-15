import React from 'react';
import { Dialog, DialogContent, DialogTitle } from 'components';
import { Button } from 'components';
import { Link } from 'react-router-dom';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SuccessModal: React.FC<SuccessModalProps> = ({
  isOpen,
  onClose,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogTitle className="sr-only">
          Rating Submission Success
        </DialogTitle>
        <div className="relative bg-white p-6 rounded-lg text-center">
          <h2 className="text-[#FF5722] text-2xl font-medium mb-8">
            Successfully rated this candidate!
          </h2>

          <div className="flex flex-col gap-3">
            <Button
              onClick={onClose}
              variant="outline"
              className="w-full border-2 border-[#FF5722] text-[#FF5722] hover:bg-[#FBE9E7]"
            >
              Go Back
            </Button>
            
            <Link 
              to="/employer/interviews/pending" 
              onClick={onClose}
              className="w-full"
            >
              <Button
                className="w-full bg-[#FF5722] text-white hover:bg-[#F4511E]"
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