// bookmarkContext.tsx
import React, { createContext, useContext, useState, useCallback } from 'react';

interface BookmarkContextType {
  bookmarkedItems: Set<string>;
  handleBookmarkToggle: (id: string) => void;
  isBookmarked: (id: string) => boolean;
}

const BookmarkContext = createContext<BookmarkContextType | undefined>(undefined);

const useBookmarks = () => {
  const context = useContext(BookmarkContext);
  if (!context) {
    throw new Error('useBookmarks must be used within a BookmarkProvider');
  }
  return context;
};

interface BookmarkProviderProps {
  children: React.ReactNode;
  subscriptionPlan: 'freeTrial' | 'monthlyPlan' | 'yearlyPlan';
  maxBookmarks?: number;
  onLimitReached?: () => void;
}

const BookmarkProvider = ({
  children,
  subscriptionPlan,
  maxBookmarks = 3,
  onLimitReached,
}: BookmarkProviderProps) => {
  const [bookmarkedItems, setBookmarkedItems] = useState<Set<string>>(new Set());

  const handleBookmarkToggle = useCallback((id: string) => {
    setBookmarkedItems(prev => {
      const newSet = new Set(prev);
      if (prev.has(id)) {
        newSet.delete(id);
      } else if (subscriptionPlan === 'freeTrial' && prev.size >= maxBookmarks) {
        onLimitReached?.();
        return prev;
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  }, [subscriptionPlan, maxBookmarks, onLimitReached]);

  const isBookmarked = useCallback((id: string) => {
    return bookmarkedItems.has(id);
  }, [bookmarkedItems]);

  return (
    <BookmarkContext.Provider value={{ bookmarkedItems, handleBookmarkToggle, isBookmarked }}>
      {children}
    </BookmarkContext.Provider>
  );
};

export { BookmarkProvider, useBookmarks }