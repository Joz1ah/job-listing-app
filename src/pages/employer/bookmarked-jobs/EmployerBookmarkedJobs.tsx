import { FC } from "react";
import { Outlet } from "react-router-dom";
import { BookmarkSidebar } from "features/employer";
import { useAuth } from "contexts/AuthContext/AuthContext";
import { PageMeta } from "components";

const EmployerBookmarkedJobs: FC = () => {

  const { user } = useAuth();

  return (
    <>
      <PageMeta 
          title="Bookmarks" 
          description="Akaza is a modern job marketplace with a new concept. No resume, No endless scrolling, you just choose your Perfect Match!"
      />
    <div className="flex justify-center w-full max-w-screen-xl mx-auto md:py-16 py-6">
      <div className="flex flex-col lg:flex-row w-full pt-8">
        <BookmarkSidebar
          userName={user?.data?.user?.relatedDetails?.businessName}
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

export { EmployerBookmarkedJobs };