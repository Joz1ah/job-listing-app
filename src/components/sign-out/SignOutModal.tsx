import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import companyLogo from "images/company-logo.png";
import { useAuth } from 'contexts/AuthContext/AuthContext';

interface SignOutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SignOutModal = ({ isOpen, onClose }: SignOutModalProps) => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleSignOut = async () => {
    try {
      // Call the auth context logout first
      logout();
      
      // Then clear any additional storage if needed
      localStorage.clear();
      sessionStorage.clear();
      
      // Close modal and navigate
      onClose();
      navigate('/');
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div 
        className="bg-[#2D3A41] w-full max-w-[740px] h-[300px] relative"
        onClick={handleContentClick}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors duration-200"
          aria-label="Close modal"
        >
          <X size={24} />
        </button>

        <div className="flex flex-col h-full">
          {/* Logo section with bottom border */}
          <div className="p-4 border-b border-gray-600">
            <img 
              src={companyLogo}
              alt="Logo" 
              className="w-[150px] h-12"
            />
          </div>

          <div className="mt-4">
            <h2 className="text-white text-base font-medium px-6">
              Are you sure you want to sign out of Akaza?
            </h2>
          </div>

          <div className="flex-grow" />

          <div className="flex justify-end px-8 pb-8 space-x-2">
            <button
              onClick={onClose}
              className="bg-[#F5722E] hover:bg-[#F5722E]/90 text-white w-[100px] h-10 transition-colors duration-200 rounded"
            >
              Cancel
            </button>
            <button
              onClick={handleSignOut}
              className="bg-transparent text-[#E53835] hover:text-white hover:bg-[#E53835] border border-[#E53835] w-[100px] h-10 transition-colors duration-200 rounded"
            >
              Sign out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export { SignOutModal }