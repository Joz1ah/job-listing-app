import { FC } from "react";
import { JobHunterHeader } from "layouts";
import { JobHunterFeed } from "features/job-hunter";
import { PageMeta } from "components";

const JobHunterFeedLayout: FC = () => {
  
  return (
  <>
    <PageMeta 
        title="Jobfeed" 
        description="Akaza is a modern job marketplace with a new concept. No resume, No endless scrolling, you just choose your Perfect Match!"
    />
    <div className="w-full px-4">
      <JobHunterHeader />
      <JobHunterFeed />
    </div>
  </>
  );
};

export { JobHunterFeedLayout };