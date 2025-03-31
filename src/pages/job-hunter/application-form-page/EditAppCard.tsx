import { FC } from "react";
import { PageMeta } from "components";
import { EditApplicationCard } from "features/job-hunter";
import { KeywordMappingProvider } from "contexts/KeyWordMappingContext";

const EditAppCard: FC = () => {
  return (
    <>
      <PageMeta 
          title="Edit Application Card" 
          description="Akaza is a modern job marketplace with a new concept. No resume, No endless scrolling, you just choose your Perfect Match!"
      />
    <KeywordMappingProvider>
      <div className="md:p-[60px] flex justify-center">
        <EditApplicationCard />
      </div>
    </KeywordMappingProvider>
    </>
  );
};

export { EditAppCard };
