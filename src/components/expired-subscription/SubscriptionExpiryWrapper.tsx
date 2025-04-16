import React, { useEffect, useState, ReactNode } from "react";
import { useAuth } from "contexts/AuthContext/AuthContext";
import { ExpiredSubModal } from "./ExpiredSubModal";

interface SubscriptionExpiryWrapperProps {
  children: ReactNode;
  forceShow?: boolean; // Add prop for testing
}

/**
 * SubscriptionExpiryWrapper - Checks for expired subscriptions
 * and displays the modal throughout the application.
 * Note: Free trial expiration is handled elsewhere.
 */
export const SubscriptionExpiryWrapper: React.FC<
  SubscriptionExpiryWrapperProps
> = ({
  children,
  forceShow = false, // Default to false
}) => {
  const { user } = useAuth();
  const [showExpiredModal, setShowExpiredModal] = useState(forceShow);

  useEffect(() => {
    // If forceShow is true, always show the modal (for testing)
    if (forceShow) {
      setShowExpiredModal(true);
      return;
    }

    if (!user?.data?.user) return;

    const userData = user.data.user;
    // Access nested subscriptions array correctly
    const subscriptions = userData.subscriptions || [];

    // Define subscription interface for proper typing
    interface Subscription {
      id?: number;
      status?: string;
      plan?: string;
      startDate?: string;
      endDate?: string | null;
      [key: string]: any; // Allow for other properties
    }

    let allSubscriptions: Subscription[] = [];

    // Handle nested structure - subscriptions can be nested within subscriptions array
    if (Array.isArray(subscriptions)) {
      // Flatten nested subscriptions if needed
      subscriptions.forEach((sub) => {
        if (Array.isArray(sub)) {
          allSubscriptions = [...allSubscriptions, ...sub];
        } else {
          allSubscriptions.push(sub);
        }
      });
    }

    // Check if user has any active subscription
    const hasActiveSubscription = allSubscriptions.some(
      (subscription) => subscription.status === "active",
    );

    // Case 1: User has active subscription - don't show modal
    if (hasActiveSubscription) {
      setShowExpiredModal(false);
      return;
    }
    
    // Case 2: Subscription expired - user had subscriptions before but none are active now
    const hadSubscriptionsBefore = allSubscriptions.length > 0;
    if (hadSubscriptionsBefore) {
      // User has subscriptions but none are active = subscription expired
      setShowExpiredModal(true);
      return;
    }
    
    // For all other cases (including free trial expiry), don't show the modal
    setShowExpiredModal(false);
  }, [user, forceShow]);

  // Determine user type for the modal
  const userType =
    user?.data?.user?.type === "job_hunter" ? "job-hunter" : "employer";
    
  // Determine if the user had a subscription before
  const hadSubscriptionsBefore = 
    user?.data?.user?.subscriptions?.some((sub: any) => 
      Array.isArray(sub) ? sub.length > 0 : true
    ) || false;

  return (
    <>
      <ExpiredSubModal 
        open={showExpiredModal} 
        userType={userType}
        isSubscriptionExpired={hadSubscriptionsBefore} 
      />
      {children}
    </>
  );
};

export default SubscriptionExpiryWrapper;