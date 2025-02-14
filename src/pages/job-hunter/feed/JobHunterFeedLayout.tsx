import { FC } from "react";
import { JobHunterHeader } from "layouts";
import { JobHunterFeed } from "features/job-hunter";

const JobHunterFeedLayout: FC = () => {
  
  return (
    <div className="w-full px-4">
      <JobHunterHeader />
      <JobHunterFeed />
    </div>
  );
};

export { JobHunterFeedLayout };