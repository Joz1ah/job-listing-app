import { FC } from "react";
import { EditApplicationCard } from "features/job-hunter";

const EditAppCard: FC = () => {
  return (
    <main className="flex-1 flex-col bg-[#242625] md:p-[60px] flex justify-center">
      <EditApplicationCard />
    </main>
  );
};

export { EditAppCard }