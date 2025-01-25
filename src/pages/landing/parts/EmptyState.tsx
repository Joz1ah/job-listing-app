import empty_matches from "assets/images/empty-match-modal.svg?url";

const EmptyState = () => (
  <div className="flex flex-col items-center gap-6">
    <img src={empty_matches} alt="No matches found" />
    <div className="text-center">
      <h3 className="text-[#F5722E] text-[22px] font-bold mb-2">
        Oops, no match today
      </h3>
      <p className="text-[#263238] text-[15px]">
        But the best matches don't wait around.
        <br />
        Sign up now and snag your next big opportunity tomorrow!
      </p>
    </div>
  </div>
);

export default EmptyState;
