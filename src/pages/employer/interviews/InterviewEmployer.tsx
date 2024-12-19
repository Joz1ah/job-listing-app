import { FC } from "react";
import { Outlet } from "react-router-dom";
import { InterviewSidebarEmployer } from "features/employer";
import { useEmployerContext } from "components";

const InterviewEmployer: FC = () => {
  const { subscriptionTier } = useEmployerContext();

  return (
    <div className="flex justify-center w-full max-w-screen-xl mx-auto md:py-16 py-6">
      <div className="flex flex-col lg:flex-row w-full pt-8">
        <InterviewSidebarEmployer
          userName="ABC Incorporated"
          userType="employer"
          subscriptionTier={subscriptionTier}
          className="w-[395px]"
        />
        <div className="flex-1 m-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export { InterviewEmployer };