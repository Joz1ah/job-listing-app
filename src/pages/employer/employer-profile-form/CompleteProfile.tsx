import { FC } from "react";
import { CompleteEmployerProfile } from "features/employer";
import { PageMeta } from "components";

const CompleteProfile: FC = () => {
  return (
    <>
    <PageMeta 
        title="Complete your Profile" 
        description="Akaza is a modern job marketplace with a new concept. No resume, No endless scrolling, you just choose your Perfect Match!"
    />
    <main className="flex flex-col bg-[#2D3A41] md:bg-[#242625] w-full xl:px-12 md:py-16">
      <div className="flex flex-col">
          <CompleteEmployerProfile />
      </div>
    </main>
    </>
  );
};

export { CompleteProfile };