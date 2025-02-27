import React, { useEffect, useState, ReactNode } from 'react';
import { useAuth } from 'contexts/AuthContext/AuthContext';
import { ExpiredSubModal } from './ExpiredSubModal';

interface SubscriptionExpiryWrapperProps {
  children: ReactNode;
  forceShow?: boolean; // Add prop for testing
}

/**
 * SubscriptionExpiryWrapper - Checks for expired trial subscriptions
 * and displays the modal throughout the application.
 */
export const SubscriptionExpiryWrapper: React.FC<SubscriptionExpiryWrapperProps> = ({ 
  children, 
  forceShow = false // Default to false
}) => {
  const { user } = useAuth();
  const [showExpiredModal, setShowExpiredModal] = useState(forceShow);
  
  useEffect(() => {
    // If forceShow is true, always show the modal
    if (forceShow) {
      setShowExpiredModal(true);
      return;
    }
    
    if (!user?.data?.user) return;
    
    const userData = user.data.user;
    
    // Check if user is on free trial
    if (userData.freeTrial === true) {
      const emailVerifiedAt = userData.emailVerifiedAt;
      
      if (emailVerifiedAt) {
        const emailVerifiedDate = new Date(emailVerifiedAt);
        const currentDate = new Date();
        
        // Calculate difference in days
        const diffTime = currentDate.getTime() - emailVerifiedDate.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        // Show modal if trial period has passed (3 days)
        setShowExpiredModal(diffDays > 3);
      }
    } else {
      setShowExpiredModal(false);
    }
  }, [user, forceShow]);

  // Determine user type for the modal
  const userType = user?.data?.user?.type === 'job_hunter' ? 'job-hunter' : 'employer';

  return (
    <>
      <ExpiredSubModal 
        open={showExpiredModal} 
        userType={userType} 
      />
      {children}
    </>
  );
};

export default SubscriptionExpiryWrapper;