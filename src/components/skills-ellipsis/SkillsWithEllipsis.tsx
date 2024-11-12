import { FC, useRef, useEffect, useState } from "react";

interface Skill {
    name: string;
    isMatch: boolean;
  }

const skillColors = {
    matched: "#184E77",
    unmatched: "#168AAD",
  };
  
  interface SkillsWithEllipsisProps {
    skills: Skill[];
  }
  
  const SkillsWithEllipsis: FC<SkillsWithEllipsisProps> = ({ skills }) => {
    const skillsContainerRef = useRef<HTMLDivElement>(null);
    const [showEllipsis, setShowEllipsis] = useState(false);
  
    useEffect(() => {
      const checkOverflow = () => {
        const container = skillsContainerRef.current;
        if (container) {
          // Add a small buffer (2px) to account for potential rounding
          setShowEllipsis(container.scrollHeight > container.clientHeight + 2);
        }
      };
  
      // Initial check
      checkOverflow();
  
      // Add resize listener
      window.addEventListener("resize", checkOverflow);
      return () => window.removeEventListener("resize", checkOverflow);
    }, [skills]); // Re-run when skills change
  
    return (
      <div className="w-full relative">
        <span className="text-[13px] font-light block mb-1">Primary Skills:</span>
        <div
          ref={skillsContainerRef}
          className="flex flex-wrap gap-1 max-h-[40px] overflow-hidden relative w-full"
        >
          {skills.map((skill, skillIndex) => (
            <span
              key={skillIndex}
              className="text-white text-xs font-semibold px-1 pt-0.5 rounded-[2px] inline-block"
              style={{
                backgroundColor: skill.isMatch
                  ? skillColors.matched
                  : skillColors.unmatched,
              }}
            >
              {skill.name}
            </span>
          ))}
          {showEllipsis && (
            <span className="absolute bottom-0 right-0 bg-transparent px-1">
              ...
            </span>
          )}
        </div>
      </div>
    );
  };

  export { SkillsWithEllipsis }