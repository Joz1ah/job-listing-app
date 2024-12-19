import { FC } from "react";
import { JobHunterHeader } from "layouts";
import { JobHunterFeed } from "features/job-hunter";
import { useJobHunterContext} from "components";

const JobHunterFeedLayout: FC = () => {
  const { subscriptionTier } = useJobHunterContext();
  
  return (
    <div className="w-full">
      <JobHunterHeader />
      <JobHunterFeed subscriptionTier={subscriptionTier} />
    </div>
  );
};

export { JobHunterFeedLayout };