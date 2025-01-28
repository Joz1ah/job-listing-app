import styles from "./../landing.module.scss";

const InfoGraphics = () => {
  return (
    <div className={`${styles.infographic1}`}>
      <div className={`${styles["info-desc"]}`}>
        <div className={`${styles["info-desc-wrapper"]}`}>
          <div>
            <div>
              <label>$5 for a chance to</label> <label>#TakeBackYourTime</label>
            </div>
          </div>
          <div>
            <div>No more commuting</div>
            <div>No more hours of scrolling</div>
            <div>More sleep</div>
            <div>More money in your pockets</div>
          </div>
          <div>
            <div>
              <label>It's time to</label> <label>#TakeBackYourTime</label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoGraphics;
