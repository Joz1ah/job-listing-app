import { FC } from "react";
import { Outlet } from "react-router-dom";
import { ManageJobListingsSidebar } from "features/employer";
import { useAuth } from "contexts/AuthContext/AuthContext";
import { KeywordMappingProvider } from "contexts/KeyWordMappingContext";

const ManageJobListings: FC = () => {
  const { user } = useAuth();

  return (
    <>
      <KeywordMappingProvider>
        <div className="flex justify-center w-full max-w-screen-xl mx-auto md:py-16 py-6">
          <div className="flex flex-col lg:flex-row w-full pt-8">
            <ManageJobListingsSidebar
              userName={user?.data?.user?.relatedDetails?.businessName}
              className="w-[395px]"
            />
            <div className="flex-1 m-4">
              <Outlet />
            </div>
          </div>
        </div>
      </KeywordMappingProvider>
    </>
  );
};

export { ManageJobListings };
