export type UserType = 'employer' | 'job-hunter' | 'guest';
export type SubscriptionPlan = 'freeTrial' | 'monthlyPlan' | 'yearlyPlan';

export interface BaseContextType {
  subscriptionPlan: SubscriptionPlan;
  setSubscriptionPlan: (tier: SubscriptionPlan) => void;
  isLoading: boolean;
  error: Error | null;
}