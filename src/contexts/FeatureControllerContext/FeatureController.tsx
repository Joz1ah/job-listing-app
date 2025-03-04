import { createContext, useContext, useState, ReactNode } from "react";

type FeatureFlags = {
  earlyAccessUserOnly: boolean;
  aiResumeReview: boolean;
  instantMatching: boolean;
  premiumAnalytics: boolean;
};

type FeatureControllerType = {
  features: FeatureFlags;
  toggleFeature: (feature: keyof FeatureFlags) => void;
  setFeatures: (features: Partial<FeatureFlags>) => void;
};

const FeatureControllerContext = createContext<FeatureControllerType | undefined>(undefined);

export const FeatureControllerProvider = ({ children }: { children: ReactNode }) => {
  const [features, setFeaturesState] = useState<FeatureFlags>({
    earlyAccessUserOnly: process.env.EARLY_ACCESS_USER_ONLY || false,
    aiResumeReview: process.env.AI_RESUME_REVIEW || false,
    instantMatching: process.env.INSTANT_MATCHING || false,
    premiumAnalytics: process.env.PREMIUM_ANALYTICS || false,
  });
  
  const toggleFeature = (feature: keyof FeatureFlags) => {
    setFeaturesState((prev) => ({ ...prev, [feature]: !prev[feature] }));
  };

  const setFeatures = (updatedFeatures: Partial<FeatureFlags>) => {
    setFeaturesState((prev) => ({ ...prev, ...updatedFeatures }));
  };

  return (
    <FeatureControllerContext.Provider value={{ features, toggleFeature, setFeatures }}>
      {children}
    </FeatureControllerContext.Provider>
  );
};

export const useFeatureController = () => {
  const context = useContext(FeatureControllerContext);
  if (!context) throw new Error("useFeatureController must be used within a FeatureControllerProvider");
  return context;
};