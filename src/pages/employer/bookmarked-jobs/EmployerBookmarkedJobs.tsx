import { FC } from "react";
import { Outlet } from "react-router-dom";
import { BookmarkSidebar } from "features/employer";

const EmployerBookmarkedJobs: FC = () => {

  return (
    <div className="flex justify-center w-full max-w-screen-xl mx-auto md:py-16 py-6">
      <div className="flex flex-col lg:flex-row w-full pt-8">
        <BookmarkSidebar
          userName="ABC Incorporated"
          className="w-[395px]"
        />
        <div className="flex-1 m-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export { EmployerBookmarkedJobs };