import { FC } from "react";
import { EditEmployerProfile } from "features/employer";


const EditProfile: FC = () => {
  return (
    <main className="flex flex-col bg-[#2D3A41] md:bg-[#242625] w-full xl:px-12 md:py-16">
      <div className="flex flex-col">
          <EditEmployerProfile />
      </div>
    </main>
  );
};

export { EditProfile };