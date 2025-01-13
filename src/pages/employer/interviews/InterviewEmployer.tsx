import { FC } from "react";
import { Outlet } from "react-router-dom";
import { InterviewSidebarEmployer } from "features/employer";
import { useAuth } from "contexts/AuthContext/AuthContext";

const InterviewEmployer: FC = () => {

  const { user } = useAuth();

  return (
    <div className="flex justify-center w-full max-w-screen-xl mx-auto md:py-16 py-6">
      <div className="flex flex-col lg:flex-row w-full pt-8">
        <InterviewSidebarEmployer
          userName={user?.data?.user?.relatedDetails?.businessName}
          userType="employer"
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