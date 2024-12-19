import { FC } from "react";
import { Outlet } from "react-router-dom";
import { SettingsSidebar } from "features/employer";
import { useEmployerTrialStatus } from "components";

const AccountSettingsEmployer: FC = () => {
  const { isFreeTrial } = useEmployerTrialStatus();

  return (
    <div className="flex justify-center w-full max-w-screen-xl mx-auto md:py-16 py-6">
      <div className="flex flex-col lg:flex-row w-full pt-8">
        <SettingsSidebar
          userName="ABC Incorporated"
          userType="employer"
          isFreeTrial={isFreeTrial}
          className="w-[395px]"
        />
        <div className="w-auto lg:w-full max-w-[855px] min-h-[750px] bg-[#2D3A41] rounded-lg px-5 py-8 m-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export { AccountSettingsEmployer };