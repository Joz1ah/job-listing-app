import { FC } from "react";
import { Outlet } from "react-router-dom";
import { BookmarkSidebar } from "features/job-hunter";
import { useAuth } from "contexts/AuthContext/AuthContext";
import { PageMeta } from "components";

const JobHunterBookmarkedJobs: FC = () => {

  const { user } = useAuth();
  
    const userName = [
      user?.data?.user?.relatedDetails?.firstName,
      user?.data?.user?.relatedDetails?.lastName
    ].filter(Boolean).join(" ");

  return (
      <>
        <PageMeta 
            title="Bookmarks" 
            description="Akaza is a modern job marketplace with a new concept. No resume, No endless scrolling, you just choose your Perfect Match!"
        />
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
    </>
  );
};

export { JobHunterBookmarkedJobs };