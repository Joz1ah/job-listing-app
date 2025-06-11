import { FC } from "react";
import { EmployerHeader } from "layouts";
import { EmployerFeed, Sidebar } from "features/employer";
import { PageMeta } from "components";

const EmployerFeedLayout: FC = () => {
  return (
    <>
      <PageMeta 
        title="Dashboard Feed" 
        description="Akaza is a modern job marketplace with a new concept. No resume, No endless scrolling, you just choose your Perfect Match!"
      />
      <div className="flex justify-center md:pt-24 px-0 md:px-4">
        <div className="flex flex-col md:flex-row md:space-x-8 max-w-screen-xl w-full">
          {/* Left column - contains header and sidebar */}
          <div className="md:w-[311px] flex-shrink-0">
            <EmployerHeader />
            <Sidebar />
          </div>
          
          {/* Right column - contains feed */}
          <div className="flex-1">
            <EmployerFeed />
          </div>
        </div>
      </div>
    </>
  );
};

export { EmployerFeedLayout };