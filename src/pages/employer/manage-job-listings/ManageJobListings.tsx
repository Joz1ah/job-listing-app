import { FC } from "react";
import { Outlet } from "react-router-dom";
import { ManageJobListingsSidebar } from "features/employer";
import { useEmployerTrialStatus } from "components";

const ManageJobListings: FC = () => {
  const { isFreeTrial } = useEmployerTrialStatus();

  return (
    <div className="flex justify-center w-full max-w-screen-xl mx-auto md:py-16 py-6">
      <div className="flex flex-col lg:flex-row w-full pt-8">
        <ManageJobListingsSidebar
          userName="ABC Incorporated"
          isFreeTrial={isFreeTrial}
          className="w-[395px]"
        />
        <div className="flex-1 m-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export { ManageJobListings };