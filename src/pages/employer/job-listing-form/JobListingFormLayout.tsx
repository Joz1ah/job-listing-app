import { FC } from "react";
import { EmployerHeader } from "layouts";
import { JobListingForm, Sidebar } from "features/employer";
import { KeywordMappingProvider } from "contexts/KeyWordMappingContext";
import { PageMeta } from "components";

const JobListingFormLayout: FC = () => {
  return (
    <>
      <PageMeta 
        title="Create Job Listing" 
        description="Akaza is a modern job marketplace with a new concept. No resume, No endless scrolling, you just choose your Perfect Match!"
      />
      <KeywordMappingProvider>
        <div className="flex justify-center md:pt-24 md:px-4">
          <div className="flex flex-col md:flex-row md:space-x-8 max-w-screen-xl w-full">
            {/* Left column - contains header and sidebar */}
            <div className="md:w-[311px] flex-shrink-0">
              <EmployerHeader />
              <Sidebar />
            </div>
            
            {/* Right column - contains job listing form */}
            <div className="flex-1">
              <JobListingForm />
            </div>
          </div>
        </div>
      </KeywordMappingProvider>
    </>
  );
};

export { JobListingFormLayout };