import { FC } from "react";
import { EditApplicationCard } from "features/job-hunter";

const EditAppCard: FC = () => {
  return (
    <main className="flex-1 flex-col bg-[#242625] md:p-[60px]">
      <div className="flex justify-center">
        <EditApplicationCard />
      </div>
    </main>
  );
};

export { EditAppCard };
