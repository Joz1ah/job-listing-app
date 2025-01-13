import { FC } from "react";
import { Outlet } from "react-router-dom";
import { BookmarkSidebar } from "features/job-hunter";
import { useAuth } from "contexts/AuthContext/AuthContext";

const JobHunterBookmarkedJobs: FC = () => {

  const { user } = useAuth();
  
    const userName = [
      user?.data?.user?.relatedDetails?.firstName,
      user?.data?.user?.relatedDetails?.lastName
    ].filter(Boolean).join(" ");

  return (
    <div className="flex justify-center w-full max-w-screen-xl mx-auto md:py-16 py-6">
      <div className="flex flex-col lg:flex-row w-full pt-8">
        <BookmarkSidebar
          userName={userName}
          className="w-[395px]"
        />
        <div className="flex-1 m-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export { JobHunterBookmarkedJobs };