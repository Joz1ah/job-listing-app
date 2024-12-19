import { FC } from "react";
import { PageMeta } from "components";
import { ApplicationCardForm } from "features/job-hunter";

const CreateAppCard: FC = () => {
  return (
    <>
      <PageMeta title="Complete your Profile" />
      <div className="md:p-[60px] flex justify-center">
        <ApplicationCardForm />
      </div>
    </>
  );
};

export { CreateAppCard };