import { FC } from "react";
import { EditEmployerProfile } from "features/employer";
import { PageMeta } from "components";

const EditProfile: FC = () => {
  return (    
  <>
    <PageMeta 
        title="Edit Profile" 
        description="Akaza is a modern job marketplace with a new concept. No resume, No endless scrolling, you just choose your Perfect Match!"
    />
    <main className="flex flex-col bg-[#2D3A41] md:bg-[#242625] w-full xl:px-12 md:py-16">
      <div className="flex flex-col">
          <EditEmployerProfile />
      </div>
    </main>
  </>
  );
};

export { EditProfile };