import { useState, forwardRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialogOverlay
} from 'components';

interface AdDialogWrapperProps {
  adImage?: string;
  popupImage?: string;
}

const AdDialogWrapper = forwardRef<HTMLDivElement, AdDialogWrapperProps>(
  ({ adImage, popupImage }, ref) => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();

    const handleImageClick = () => {
      navigate('account-settings/subscription');
      setIsOpen(false);
    };

    return (
      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogTrigger asChild>
          <div 
            ref={ref}
            className="bg-white border-none h-[275px] w-full max-w-[436px] rounded-lg overflow-hidden"
          >
            <img
              src={adImage}
              alt="Job Hunter Ad"
              className="w-full h-[275px] object-cover cursor-pointer"
            />
          </div>
        </AlertDialogTrigger>
        <AlertDialogOverlay className="bg-black/50" />
        <AlertDialogContent className="bg-white p-0 border-none">
          <AlertDialogHeader>
            <AlertDialogTitle asChild>
              <img
                src={popupImage}
                alt="Popup Advertisement"
                className="w-full h-auto object-contain rounded-lg cursor-pointer"
                onClick={handleImageClick}
              />
            </AlertDialogTitle>
          </AlertDialogHeader>
        </AlertDialogContent>
      </AlertDialog>
    );
  }
);

AdDialogWrapper.displayName = 'AdDialogWrapper';

export { AdDialogWrapper };