import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from 'components';
import { Button } from 'components';
import { NavLink } from 'react-router-dom';

interface InvitationSentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const InvitationSentModal: React.FC<InvitationSentModalProps> = ({ 
  isOpen, 
  onClose,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-[535px] p-0">
        <DialogHeader>
          <DialogTitle className="sr-only">Invitation Sent</DialogTitle>
        </DialogHeader>
        <div className="h-[535px] flex flex-col items-center justify-center text-center px-6">
          <div className="flex flex-col items-center space-y-6">
            <h2 className="text-2xl font-semibold text-orange-500">
              Invitation sent!
            </h2>
            
            <p className="text-black text-sm max-w-xs">
              Please wait for the Job Hunter to respond within 72 hours.
            </p>

            <div className="flex flex-col w-full space-y-3 pt-4">
              <NavLink 
                to="/dashboard/interviews/pending"
                onClick={onClose}
              >
                <Button 
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-normal py-2"
                >
                  View Interviews
                </Button>
              </NavLink>

              <NavLink 
                to="/dashboard/feed"
                onClick={onClose}
              >
                <Button 
                  variant="link" 
                  className="text-orange-500 hover:text-orange-600"
                >
                  Go Back To Job Feed
                </Button>
              </NavLink>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export { InvitationSentModal }