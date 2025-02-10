import { memo } from "react";

type Props = {
  icon: string;
  clickHandler: () => void;
  label: string;
};

const Selection = ({ clickHandler, icon, label }: Props) => {
  return (
    <div className="flex flex-col items-center w-full sm:w-auto h-full sm:h-auto justify-center relative z-10">
      <div className="flex flex-col items-center">
        <img
          src={icon}
          className="h-32 w-32 sm:h-modal-image-h sm:w-modal-image-w mb-2"
          alt="Job Hunter Icon"
        />
        <button
          onClick={clickHandler}
          className="mt-6 border border-3 border-[#F5722E] rounded-[2px] flex w-36 h-10 sm:w-44 sm:h-16 p-2 justify-center items-center bg-[#D9D9D900] text-[#F5722E] font-semibold text-[20px]"
        >
          {label}
        </button>
      </div>
    </div>
  );
};

export default memo(Selection);
