import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "components";

interface DeleteAccountAlertProps {
  onDelete: () => void;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const DeleteAccountAlert: React.FC<DeleteAccountAlertProps> = ({
  onDelete,
  isOpen,
  onOpenChange,
}) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogTrigger asChild>
        <button
          type="button"
          className="text-[#E53835] hover:text-white hover:bg-[#E53835] border border-[#E53835] rounded px-4 py-2 text-sm font-normal transition-colors duration-200"
        >
          Delete Your Account
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-[#263238] border-[#E53835] border-2 md:min-w-[680px] md:h-[190px]">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-[#E53835] text-[20px]">Delete Your Account</AlertDialogTitle>
          <AlertDialogDescription className="text-white text-[15px]">
            Deleting your account is permanent and cannot be undone. Do you wish
            to continue?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="bg-transparent text-white border-white hover:bg-white text-xs ">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            className="text-[#E53835] bg-[#263238] hover:text-white hover:bg-[#E53835] border border-[#E53835] rounded px-4 text-xs font-normal transition-colors duration-200"
            onClick={onDelete}
          >
            Yes, Delete My Account
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export { DeleteAccountAlert };