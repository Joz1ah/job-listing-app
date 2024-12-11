import { FC } from "react";
import { EditEmployerProfile } from "features/employer";


const EditProfile: FC = () => {
  return (
    <main className="flex-1 flex flex-col bg-[#242625] w-full xl:px-12 md:py-16">
      <div className="flex flex-col md:flex-row">
        <div className="flex-1 flex justify-center">
          <EditEmployerProfile />
        </div>
      </div>
    </main>
  );
};

export { EditProfile };