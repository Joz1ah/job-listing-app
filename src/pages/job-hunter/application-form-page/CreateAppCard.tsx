import { FC } from "react";
import { PageMeta } from "components";
import { ApplicationCardForm } from "features/job-hunter";
import { KeywordMappingProvider } from "contexts/KeyWordMappingContext";

const CreateAppCard: FC = () => {
  return (
    <>
    <KeywordMappingProvider>
      <PageMeta title="Complete your Profile" />
      <div className="md:p-[60px] flex justify-center">
        <ApplicationCardForm />
      </div>
      </KeywordMappingProvider>
    </>
  );
};

export { CreateAppCard };