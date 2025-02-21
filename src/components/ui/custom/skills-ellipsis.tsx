import { FC } from "react";

const skillColors = ["#184E77", "#168AAD"];

interface SkillsWithEllipsisProps {
  skills: string[];
}

const SkillsWithEllipsis: FC<SkillsWithEllipsisProps> = ({ skills }) => {
  return (
    <div className="w-full relative">
      <span className="text-[13px] font-light block text-[#263238]">Core Skills:</span>
      <div className="flex gap-1 overflow-hidden whitespace-nowrap">
        {skills.map((skill, skillIndex) => (
          <span
            key={skillIndex}
            title={skill}
            className="text-white text-xs font-semibold px-1.5 py-0.5 rounded-[2px] inline-block max-w-[125px] truncate"
            style={{
              backgroundColor: skillColors[skillIndex % 2],
            }}
          >
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
};

export { SkillsWithEllipsis };