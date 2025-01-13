import React, { createContext, useState, useCallback } from 'react';

interface KeywordMappingContextType {
  keywordToIdMap: Record<string, string>;
  addMapping: (keyword: string, id: string) => void;
  addMappings: (mappings: Array<{ keyword: string; id: string }>) => void;
}

const KeywordMappingContext = createContext<KeywordMappingContextType>({
  keywordToIdMap: {},
  addMapping: () => {},
  addMappings: () => {},
});

export const KeywordMappingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [keywordToIdMap, setKeywordToIdMap] = useState<Record<string, string>>({});

  const addMapping = useCallback((keyword: string, id: string) => {
    setKeywordToIdMap(prev => {
      if (prev[keyword] === id) return prev; // Prevent unnecessary updates
      return { ...prev, [keyword]: id };
    });
  }, []);

  const addMappings = useCallback((mappings: Array<{ keyword: string; id: string }>) => {
    setKeywordToIdMap(prev => {
      const updates: Record<string, string> = {};
      let hasChanges = false;

      mappings.forEach(({ keyword, id }) => {
        if (prev[keyword] !== id) {
          updates[keyword] = id;
          hasChanges = true;
        }
      });

      return hasChanges ? { ...prev, ...updates } : prev;
    });
  }, []);

  return (
    <KeywordMappingContext.Provider value={{ keywordToIdMap, addMapping, addMappings }}>
      {children}
    </KeywordMappingContext.Provider>
  );
};

export { KeywordMappingContext };