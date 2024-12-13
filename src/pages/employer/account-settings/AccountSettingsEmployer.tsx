import { FC } from "react";
import { Outlet } from "react-router-dom";
import { SettingsSidebar } from "features/employer";
import { useEmployerTrialStatus } from "components";

const AccountSettingsEmployer: FC = () => {
  const { isFreeTrial } = useEmployerTrialStatus();

  return (
    <main className="flex-1 flex flex-col w-full lg:flex-row md:py-16 py-6 bg-[#212529]">
      <div className="flex justify-center w-full max-w-screen-xl mx-auto">
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
    </main>
  );
};

export { AccountSettingsEmployer };
