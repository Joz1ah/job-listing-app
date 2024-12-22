import { FC } from "react";
import { JobHunterHeader } from "layouts";
import { JobHunterFeed } from "features/job-hunter";

const JobHunterFeedLayout: FC = () => {
  
  return (
    <div className="w-full">
      <JobHunterHeader />
      <JobHunterFeed />
    </div>
  );
};

export { JobHunterFeedLayout };