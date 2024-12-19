import { FC } from "react";
import { EmployerHeader } from "layouts";
import { EmployerFeed, Sidebar } from "features/employer";
import { useEmployerTrialStatus } from "components";

const EmployerFeedLayout: FC = () => {
  const { isFreeTrial } = useEmployerTrialStatus();

  return (
    <div className="px-4 xl:px-12 md:pt-20">
      {/* Main content area with two columns */}
      <div className="flex flex-col md:flex-row md:space-x-6">
        {/* Left column - contains header and sidebar */}
        <div className="md:w-[311px] flex-shrink-0">
          <EmployerHeader isFreeTrial={isFreeTrial} />
          <Sidebar />
        </div>
        
        {/* Right column - contains feed */}
        <div className="flex-1 md:pt-8">
          <EmployerFeed />
        </div>
      </div>
    </div>
  );
};

export { EmployerFeedLayout };