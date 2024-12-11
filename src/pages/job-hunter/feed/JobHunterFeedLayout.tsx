import { FC } from "react";
import { JobHunterHeader } from "layouts";
import { JobHunterFeed } from "features/job-hunter";

const JobHunterFeedLayout: FC = () => {
  return (
    <main className="flex-1 flex flex-col bg-[#242625] w-full">
      <JobHunterHeader />
      <JobHunterFeed />
    </main>
  );
};

export { JobHunterFeedLayout }