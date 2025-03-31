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
    <div className="md:px-4 xl:px-12 md:pt-20 md:pb-6">
      {/* Main content area with two columns */}
      <div className="flex flex-col md:flex-row md:space-x-6">
        {/* Left column - contains header and sidebar */}
        <div className="md:w-[311px] flex-shrink-0">
          <EmployerHeader />
          <Sidebar />
        </div>
        
        {/* Right column - contains job listing form */}
        <div className="flex-1 md:pt-8 flex justify-center">
          <JobListingForm />
        </div>
      </div>
    </div>
    </KeywordMappingProvider>
    </>
  );
};

export { JobListingFormLayout };