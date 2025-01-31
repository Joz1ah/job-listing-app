import styles from "./../landing.module.scss";

const InfoGraphics = () => {
  return (
    <div className={`${styles.infographic1}`}>
      <div className={`${styles["info-desc"]}`}>
        <div
          id="infographic-text"
          className={`${styles["info-desc-wrapper"]} flex justify-end items-center`}
        >
          <div className="text-center text-base sm:text-lg lg:text-2xl">
            <div className="mb-16">
              $5 for a chance to{" "}
              <span className="text-orange-500">#TakeBackYourTime</span>
            </div>
            <div className="mb-16">No more commuting</div>
            <div className="mb-16">No more hours of scrolling</div>
            <div className="mb-16">More sleep</div>
            <div className="mb-16">More money in your pockets</div>
            <div className="mb-16">
              It's time to{" "}
              <span className="text-orange-500">#TakeBackYourTime</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoGraphics;
