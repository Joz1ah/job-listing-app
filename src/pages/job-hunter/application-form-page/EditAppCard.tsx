import { FC } from "react";
import { EditApplicationCard } from "features/job-hunter";
import { KeywordMappingProvider } from "contexts/KeyWordMappingContext";

const EditAppCard: FC = () => {
  return (
    <KeywordMappingProvider>
      <div className="md:p-[60px] flex justify-center">
        <EditApplicationCard />
      </div>
    </KeywordMappingProvider>
  );
};

export { EditAppCard };
