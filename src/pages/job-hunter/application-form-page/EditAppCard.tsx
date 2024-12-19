import { FC } from "react";
import { EditApplicationCard } from "features/job-hunter";

const EditAppCard: FC = () => {
  return (
    <div className="md:p-[60px] flex justify-center">
      <EditApplicationCard />
    </div>
  );
};

export { EditAppCard };