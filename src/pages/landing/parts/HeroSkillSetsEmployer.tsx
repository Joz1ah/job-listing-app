import { CoreSkillsTagInput } from "components";
import { useState, useEffect, useRef } from "react";
import { useLanding } from "../useLanding";
import * as Yup from "yup";
import styles from "./../landing.module.scss";
import { useSearchCoreQuery } from "api/akaza/akazaAPI";

import group_people_laptop from "assets/group-people-laptop.jpg";
import arrow_left_icon from "assets/Keyboard-arrow-left.svg?url";
import { HERO_STATES } from "store/hero/hero.types";

// Interface for the skill data returned from the API
interface SkillData {
  id: number | string;
  keyword: string;
  type: string;
}

const HeroSkillSetsEmployer = () => {
  const {
    selectedSkills,
    handleSetSkills,
    handleSetHeroState,
    heroState,
    handleSetSkillIds,
  } = useLanding();

  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Keep a direct map of skill names to IDs, completely separate from the context
  const [directSkillIds, setDirectSkillIds] = useState<Record<string, number>>(
    {},
  );

  // Prevent update loops with this ref
  const searchQueryInProgressRef = useRef("");

  // Keep track of previously selected skills to detect changes
  const prevSelectedSkillsRef = useRef<string[]>([]);

  // Make our own API call to search for core skills
  const { data: searchResults } = useSearchCoreQuery(
    {
      query: searchQuery,
      limit: 10,
    },
    {
      skip: !searchQuery,
    },
  );

  // When search results come back, update our direct map of skill IDs
  useEffect(() => {
    if (searchResults && searchResults.length > 0) {
      // Create a new map with the results
      const newSkillIds = { ...directSkillIds };

      searchResults.forEach((skill: SkillData) => {
        if (skill && skill.keyword && skill.id) {
          const numId = Number(skill.id);
          // Store both normal and lowercase versions
          newSkillIds[skill.keyword] = numId;
          newSkillIds[skill.keyword.toLowerCase()] = numId;
        }
      });

      // Update our state
      setDirectSkillIds(newSkillIds);

      // Reset the search
      searchQueryInProgressRef.current = "";
      setSearchQuery("");

      // Update the skill IDs in Redux
      updateReduxSkillIds();
    }
  }, [searchResults]);

  // Check for new skills that need IDs when selectedSkills changes
  useEffect(() => {
    const currentSkills = selectedSkills || [];
    const prevSkills = prevSelectedSkillsRef.current;

    // Skip if no change
    if (JSON.stringify(prevSkills) === JSON.stringify(currentSkills)) return;

    // Find newly added skills
    const newSkills = currentSkills.filter(
      (skill) => !prevSkills.includes(skill),
    );

    // Check if we need to fetch IDs for any of them
    if (newSkills.length > 0) {
      // Find skills we don't have IDs for yet
      const unmappedSkills = newSkills.filter((skill) => {
        return !directSkillIds[skill] && !directSkillIds[skill.toLowerCase()];
      });

      if (unmappedSkills.length > 0 && !searchQueryInProgressRef.current) {
        // Search for the first unmapped skill
        const skillToSearch = unmappedSkills[0];
        searchQueryInProgressRef.current = skillToSearch;
        setSearchQuery(skillToSearch);
      } else {
        // If all skills have IDs, update Redux
        updateReduxSkillIds();
      }
    } else {
      // If we haven't added any new skills, just update the IDs based on what we have
      updateReduxSkillIds();
    }

    // Update our reference
    prevSelectedSkillsRef.current = [...currentSkills];
  }, [selectedSkills, directSkillIds]);

  // Function to update skill IDs in Redux based on our direct mapping
  const updateReduxSkillIds = () => {
    if (selectedSkills && selectedSkills.length > 0) {
      // Map each selected skill to its ID
      const skillIds = selectedSkills
        .map((skill) => {
          const id =
            directSkillIds[skill] || directSkillIds[skill.toLowerCase()];

          return id;
        })
        .filter(Boolean);

      if (skillIds.length > 0) {
        handleSetSkillIds(skillIds);
      }
    }
  };

  const validationSchema = Yup.object().shape({
    skills: Yup.array()
      .min(3, "Please select at least 3 skills")
      .max(5, "Maximum of 5 skills allowed")
      .required("Skills are required"),
  });

  const validateSkills = async () => {
    try {
      await validationSchema.validate(
        { skills: selectedSkills },
        { abortEarly: false },
      );
      return true;
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        setError(err.errors[0]);
      }
      return false;
    }
  };

  const handleClickNext = async () => {
    const isValid = await validateSkills();
    if (isValid) {
      setError("");
      updateReduxSkillIds();
      handleSetHeroState(HERO_STATES.YEARS_OF_EXPERIENCE_EMPLOYER);
    }
  };

  const handleClickPrevious = () => {
    setError("");
    handleSetHeroState(HERO_STATES.JOB_TITLE_EMPLOYER);
  };

  const handleSkillsChange = (skills: string[]) => {
    handleSetSkills(skills);
    if (error) setError("");
  };

  return (
    <div
      id="step2_employer"
      className={`${styles["hero-content"]}`}
      hidden={heroState !== HERO_STATES.SKILLSETS_EMPLOYER}
    >
      <img src={group_people_laptop} className="w-full h-full object-cover" />
      <div
        className={`${styles["hero-container-overlay"]} ${styles["gradient-left-dark"]}`}
      >
        <div className="w-full max-w-[380px] mt-12 flex flex-col gap-8">
          <div className="w-full font-[600] text-[26px] sm:text-[36px] text-[#F5722E]">
            What skills are you looking for? Select up to 5 skill set
          </div>
          <div className="w-full flex flex-col gap-4">
            <div className="flex justify-between rounded-[4px] border-[2px] border-[#AEADAD] pr-2">
              <CoreSkillsTagInput
                value={selectedSkills ?? []}
                onChange={handleSkillsChange}
                placeholder="Type and select your skill set"
                className={`bg-transparent border-none text-white min-h-9 ${error ? styles["input-error"] : ""}`}
                alternateColors={{
                  firstColor: "#168AAD",
                  secondColor: "#184E77",
                }}
              />
            </div>
            {error && (
              <div className="text-[#e53835] italic text-[14px]">{error}</div>
            )}
            <div className="w-full flex flex-col items-center justify-center gap-2">
              <button
                onClick={handleClickNext}
                className="w-full h-[35px] border border-transparent rounded-[4px] bg-[#F5722E] text-[16px] font-[500] text-[#F5F5F7] text-center"
              >
                Next
              </button>
              <button
                onClick={handleClickPrevious}
                className="w-full h-[25px] flex items-center justify-center gap-4"
              >
                <img
                  className="absolute mr-[100px]"
                  src={arrow_left_icon}
                ></img>
                <span className="font-medium text-[10px] text-[#AEADAD]">
                  Previous
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSkillSetsEmployer;
