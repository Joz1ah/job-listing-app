import { FC } from "react";
import { Outlet } from "react-router-dom";
import { ReportsAnalyticsSidebar } from "features/employer";
import { useEmployerTrialStatus } from "components";

const ReportsAnalytics: FC = () => {
  const { isFreeTrial } = useEmployerTrialStatus();

  return (
    <main className="flex-1 flex flex-col w-full lg:flex-row md:py-16 py-6 bg-[#212529]">
      <div className="flex justify-center w-full max-w-screen-xl mx-auto">
        <div className="flex flex-col lg:flex-row w-full pt-8">
          <ReportsAnalyticsSidebar
            userName="ABC Incorporated"
            subscriptionType="Monthly Subscriber"
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

export { ReportsAnalytics };
