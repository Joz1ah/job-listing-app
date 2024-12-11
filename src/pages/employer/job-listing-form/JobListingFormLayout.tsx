import { FC } from "react";
import { EmployerHeader } from "layouts";
import { JobListingForm, Sidebar } from "features/employer";
import { useEmployerTrialStatus } from "components";

const JobListingFormLayout: FC = () => {
  const { isFreeTrial } = useEmployerTrialStatus();

  return (
    <main className="flex-1 flex flex-col bg-[#242625] w-full md:p-6 xl:px-12 md:py-16">
      <EmployerHeader isFreeTrial={isFreeTrial}/>
      <div className="flex flex-col md:flex-row">
        <div className="flex-shrink-0">
          <Sidebar />
        </div>
        <div className="flex-1 flex justify-center">
          <JobListingForm />
        </div>
      </div>
    </main>
  );
};

export { JobListingFormLayout };