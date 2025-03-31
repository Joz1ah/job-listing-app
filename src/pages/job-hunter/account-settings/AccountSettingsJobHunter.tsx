import { FC } from "react";
import { Outlet } from "react-router-dom";
import { SettingsSidebar } from "features/job-hunter";
import { useAuth } from "contexts/AuthContext/AuthContext";
import { PageMeta } from "components";

const AccountSettingsJobHunter: FC = () => {

  const { user } = useAuth();
    
      const userName = [
        user?.data?.user?.relatedDetails?.firstName,
        user?.data?.user?.relatedDetails?.lastName
      ].filter(Boolean).join(" ");

  return (
    <>
      <PageMeta 
          title="Account Settings" 
          description="Akaza is a modern job marketplace with a new concept. No resume, No endless scrolling, you just choose your Perfect Match!"
      />
    <div className="flex justify-center w-full max-w-screen-xl mx-auto md:py-16 py-6">
      <div className="flex flex-col lg:flex-row w-full pt-8">
        <SettingsSidebar
          userName={userName}
          userType="job-hunter"
          className="w-[395px]"
        />
        <div className="w-auto lg:w-full max-w-[855px] min-h-[750px] bg-[#2D3A41] rounded-lg px-4 py-8 m-4">
          <Outlet />
        </div>
      </div>
    </div>
  </>
  );
};

export { AccountSettingsJobHunter };