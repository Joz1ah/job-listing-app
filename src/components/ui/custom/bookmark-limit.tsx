import React, { useState, ReactElement } from 'react';
import { BookmarkProvider } from 'components';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from 'components';

interface Match {
  position: string;
  company: string;
  location: string;
  description: string;
  skills: Array<{ name: string; isMatch: boolean }>;
  appliedAgo: string;
  experience: string;
  lookingFor: string[];
  salaryExpectation: string;
}

interface MatchCardProps {
  match: Match;
  bookmarked?: boolean;
  onBookmark?: () => void;
  subscriptionTier: 'freeTrial' | 'monthlyPlan' | 'yearlyPlan';
}

interface BookmarkLimitHandlerProps {
  children: ReactElement<MatchCardProps> | ReactElement<MatchCardProps>[];
  subscriptionTier: 'freeTrial' | 'monthlyPlan' | 'yearlyPlan';
  onUpgradeClick?: () => void;
  maxBookmarks?: number;
  limitPopupImage: string;  // New prop for the popup image
  limitPopupTitle?: string; // Optional custom title
  limitPopupDescription?: string; // Optional custom description
  imageAltText?: string; // Optional custom alt text
}

const BookmarkLimitHandler: React.FC<BookmarkLimitHandlerProps> = ({
  children,
  subscriptionTier,
  maxBookmarks = 3,
  onUpgradeClick,
  limitPopupImage,
  limitPopupTitle = 'Bookmark Limit Reached',
  limitPopupDescription = "You've reached the maximum number of bookmarks allowed in the free trial.",
  imageAltText = "Bookmark limit reached",
}) => {
  const [showLimitPopup, setShowLimitPopup] = useState(false);

  return (
    <BookmarkProvider
      subscriptionTier={subscriptionTier}
      maxBookmarks={maxBookmarks}
      onLimitReached={() => setShowLimitPopup(true)}
    >
      {children}
      
      <AlertDialog open={showLimitPopup} onOpenChange={setShowLimitPopup}>
        <AlertDialogContent className="p-0 border-none bg-transparent">
          <AlertDialogTitle className="sr-only">
            {limitPopupTitle}
          </AlertDialogTitle>
          <AlertDialogDescription className="sr-only">
            {limitPopupDescription}
          </AlertDialogDescription>
          <img 
            src={limitPopupImage}
            alt={imageAltText}
            className="w-full h-auto cursor-pointer"
            onClick={() => {
              setShowLimitPopup(false);
              onUpgradeClick?.();
            }}
          />
        </AlertDialogContent>
      </AlertDialog>
    </BookmarkProvider>
  );
};

export { BookmarkLimitHandler }