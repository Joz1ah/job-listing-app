import { FC } from "react";
import { Outlet } from "react-router-dom";
import { BookmarkSidebar } from "features/job-hunter";
import { useJobHunterTrialStatus } from "components";

const BookmarkedJobs: FC = () => {
  const { isFreeTrial } = useJobHunterTrialStatus();

  return (
    <main className="flex-1 flex flex-col w-full lg:flex-row md:py-16 py-6">
      <div className="flex justify-center w-full max-w-screen-xl mx-auto">
        <div className="flex flex-col lg:flex-row w-full pt-8">
          <BookmarkSidebar
            userName="John Doe"
            subscriptionType="Free Trial"
            isFreeTrial={isFreeTrial}
            className="w-[395px]"
          />
          <div className="flex-1 m-4">
            <Outlet />
          </div>
        </div>
      </div>
    </main>
  );
};

export { BookmarkedJobs }