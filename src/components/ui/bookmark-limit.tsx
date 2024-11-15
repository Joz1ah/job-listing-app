import React, { useState, ReactElement } from 'react';
import {
  AlertDialog,
  AlertDialogContent,
} from 'components';
import subscribePopup from 'images/popup-subscribe.svg?url';

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
  isFreeTrial?: boolean;
}

interface BookmarkLimitHandlerProps {
  children: ReactElement<MatchCardProps> | ReactElement<MatchCardProps>[];
  isFreeTrial?: boolean;
  onUpgradeClick?: () => void;
  maxBookmarks?: number;
}

const BookmarkLimitHandler: React.FC<BookmarkLimitHandlerProps> = ({ 
  children, 
  isFreeTrial = false,
  onUpgradeClick,
  maxBookmarks = 3,
}) => {
  const [bookmarkedCards, setBookmarkedCards] = useState<Set<number | string>>(new Set());
  const [showLimitPopup, setShowLimitPopup] = useState<boolean>(false);

  const handleBookmarkToggle = (index: number | string): void => {
    if (bookmarkedCards.has(index)) {
      // Always allow unbookmarking
      setBookmarkedCards(prev => {
        const newSet = new Set(prev);
        newSet.delete(index);
        return newSet;
      });
    } else {
      // Check if we're at the limit when trying to add
      if (isFreeTrial && bookmarkedCards.size >= maxBookmarks) {
        setShowLimitPopup(true);
        return;
      }
      
      setBookmarkedCards(prev => {
        const newSet = new Set(prev);
        newSet.add(index);
        return newSet;
      });
    }
  };

  return (
    <>
      {React.Children.map(children, (child, index) => {
        if (React.isValidElement<MatchCardProps>(child)) {
          return React.cloneElement(child, {
            ...child.props,
            bookmarked: bookmarkedCards.has(child.key ?? index),
            onBookmark: () => handleBookmarkToggle(child.key ?? index),
            isFreeTrial
          });
        }
        return child;
      })}

      <AlertDialog open={showLimitPopup} onOpenChange={setShowLimitPopup}>
        <AlertDialogContent className="p-0 border-none bg-transparent">
          <img 
            src={subscribePopup} 
            alt="Subscribe Popup"
            className="w-full h-auto cursor-pointer"
            onClick={() => {
              setShowLimitPopup(false);
              onUpgradeClick?.();
            }}
          />
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export { BookmarkLimitHandler }