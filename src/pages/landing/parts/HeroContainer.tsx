import styles from "./../landing.module.scss";
import HeroJobTitleEmployer from "./HeroJobTitleEmployer";
import HeroLoading from "./HeroLoading";
import HeroPerfectMatchAlgo from "./HeroPerfectMatchAlgo";
import HeroPerfectMatchResults from "./HeroPerfectMatchResults";
import HeroSkillSetsEmployer from "./HeroSkillSetsEmployer";
import HeroSkillSetsJobHunter from "./HeroSkillSetsJobHunter";
import HeroYearsOfExperienceEmployer from "./HeroYearsOfExperienceEmployer";
import HeroYearsOfExperienceJobHunter from "./HeroYearsOfExperienceJobHunter";

const HeroContainer = () => {
  return (
    <div className={`${styles["hero-container"]}`}>
      <HeroPerfectMatchAlgo />
      <HeroJobTitleEmployer />
      <HeroSkillSetsEmployer />
      <HeroYearsOfExperienceEmployer />
      <HeroSkillSetsJobHunter />
      <HeroYearsOfExperienceJobHunter />
      <HeroLoading />
      <HeroPerfectMatchResults />
    </div>
  );
};

export default HeroContainer;
