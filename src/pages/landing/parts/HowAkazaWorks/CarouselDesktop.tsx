import { useState, useEffect } from "react";
import carousel1_jobhunter from "assets/landing-carousel/landing-carousel-1-jobhunter.mp4";
import carousel1_employer from "assets/landing-carousel/landing-carousel-1-employer.mp4";
import carousel2 from "assets/landing-carousel/landing-carousel-2.gif";
import carousel3 from "assets/landing-carousel/landing-carousel-3.gif";
import carousel4 from "assets/landing-carousel/landing-carousel-4.gif";
import sparkle_icon from "assets/sparkle-icon.svg?url";
import company_logo from "assets/images/company-logo-light.svg?url";
import { useModal } from "components/modal/useModal";
import { useLanding } from "../../useLanding";
import { MODAL_HEADER_TYPE, MODAL_STATES } from "store/modal/modal.types";
import { HERO_STATES } from "store/hero/hero.types";

interface Slide {
  type: "video" | "image";
  src?: string;
  srcEmployer?: string;
  srcJobHunter?: string;
  header: string;
  subheader?: string;
  underlinedText?: string;
  buttons?: {
    left: string;
    right?: string;
  };
  isLastSlide?: boolean;
  showLogo?: boolean;
}

const CarouselDesktop = () => {
  const { handleSetSelectedModalHeader, toggleModal } = useModal();
  const { handleSetModalState, handleSetHeroState } = useLanding();

  const [userType, setUserType] = useState<"employer" | "jobhunter">("jobhunter"); // Default to jobhunter

  const slides: Slide[] = [
    {
      type: "video",
      srcJobHunter: carousel1_jobhunter,
      srcEmployer: carousel1_employer,
      header: "How Works?",
      buttons: {
        left: "Job Hunter",
        right: "Employer",
      },
      showLogo: true,
    },
    {
      type: "image",
      src: carousel2,
      header: "No Resume. No more endless scrolling.",
      subheader: "Just choose your Perfect Match",
      underlinedText: "Perfect Match",
      buttons: {
        left: "Job Hunter",
        right: "Employer",
      },
    },
    {
      type: "image",
      src: carousel3,
      header: "Job hunters and employers can now",
      subheader: "schedule interviews instantly!",
      underlinedText: "Interview Request",
      buttons: {
        left: "Job Hunter",
        right: "Employer",
      },
    },
    {
      type: "image",
      src: carousel4,
      header: "Start the conversation, show up ready &",
      subheader: "hold each other accountable by providing feedback",
      underlinedText: "Completed Interviews",
      buttons: {
        left: "Job Hunter",
        right: "Employer",
      },
    },
    {
      type: "image",
      header: "",
      subheader: "",
      buttons: {
        left: "Sign up today",
      },
      isLastSlide: true,
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Removed fade state as it's no longer needed

  // Pre-load both videos for smoother transitions
  useEffect(() => {
    const jobHunterVideo = new Audio(carousel1_jobhunter);
    const employerVideo = new Audio(carousel1_employer);
    
    // Preload videos
    jobHunterVideo.preload = "auto";
    employerVideo.preload = "auto";
    
    return () => {
      // Clean up
      jobHunterVideo.src = "";
      employerVideo.src = "";
    };
  }, []);

  // Handle sign up button click
  const handleSignup = () => {
    // First, update the modal state to show signup step 2
    handleSetModalState(MODAL_STATES.SIGNUP_SELECT_USER_TYPE);
    handleSetSelectedModalHeader(MODAL_HEADER_TYPE.WITH_LOGO_AND_CLOSE);
    handleSetHeroState(HERO_STATES.PERFECT_MATCH_ALGO);

    // Then open the modal with the updated state
    toggleModal(true);
  };
  
  // Remove fade effects for slide navigation
  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? slides.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === slides.length - 1 ? 0 : prevIndex + 1
    );
  };

  // Handle toggle between employer and job hunter in first slide
  const handleUserTypeToggle = (type: "employer" | "jobhunter") => {
    if (userType !== type && currentIndex === 0) {
      setUserType(type);
    }
  };

  // Render media based on type with consistent height
  const renderMedia = (slide: Slide) => {
    // Special handling for first slide with toggle functionality
    if (currentIndex === 0 && slide.type === "video") {
      return (
        <div
          className="w-full h-full flex items-center justify-center relative mt-10"
          style={{ height: "380px" }}
        >
          {/* Both videos are always in the DOM but only one is visible */}
          <div className="absolute inset-0 flex items-center justify-center">
            <video
              key="jobhunter-video"
              autoPlay
              loop
              muted
              playsInline
              className={`max-w-full max-h-full object-contain transition-opacity duration-700 ${
                userType === "jobhunter" ? "opacity-100" : "opacity-0"
              }`}
              style={{ maxHeight: "380px" }}
            >
              <source src={slide.srcJobHunter} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
          
          <div className="absolute inset-0 flex items-center justify-center">
            <video
              key="employer-video"
              autoPlay
              loop
              muted
              playsInline
              className={`max-w-full max-h-full object-contain transition-opacity duration-700 ${
                userType === "employer" ? "opacity-100" : "opacity-0"
              }`}
              style={{ maxHeight: "380px" }}
            >
              <source src={slide.srcEmployer} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      );
    } else if (slide.type === "image" && slide.src) {
      return (
        <div className="w-full h-full flex items-center justify-center mt-10"
          style={{ height: "380px" }}
        >
          <img
            src={slide.src}
            alt="Carousel content"
            className="max-w-full max-h-full object-contain"
            style={{ maxHeight: "380px" }}
          />
        </div>
      );
    }
    return null;
  };

  // Add resize handler to ensure consistent appearance
  useEffect(() => {
    const handleResize = () => {
      // Force re-render on resize to maintain proportions
      setCurrentIndex(currentIndex);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [currentIndex]);

  // Render current slide with fixed header and content areas
  const renderCurrentSlide = () => {
    const slide = slides[currentIndex];

    return (
      <div className="flex flex-col">
        {/* Header Section - Reduced height, even smaller for last slide */}
        <div
          className="w-full text-center px-2 sm:px-4 pt-6 pb-3 sm:pt-8 sm:pb-4 flex flex-col justify-center overflow-visible"
          style={{ height: slide.isLastSlide ? "100px" : "210px" }}
        >
          {!slide.isLastSlide ? (
            <>
              <h2
                className={`font-medium px-1 sm:px-2 overflow-visible break-words ${slide.showLogo ? "text-2xl sm:text-4xl mb-12 font-bold italic" : "text-lg sm:text-xl"}`}
              >
                {slide.showLogo ? (
                  <span className="inline-flex items-center justify-center">
                    How{" "}
                    <img
                      src={company_logo}
                      className="h-8 sm:h-10 mx-2 mb-2"
                      alt="Company logo"
                    />{" "}
                    Works?
                  </span>
                ) : (
                  slide.header
                )}
              </h2>
              {slide.subheader && (
                <p className="text-lg sm:text-xl mt-1 px-1 sm:px-2 overflow-visible break-words">
                  {slide.underlinedText === "Perfect Match" ? (
                    <>
                      {slide.subheader.split(slide.underlinedText)[0]}
                      <span className="inline-flex items-center align-middle">
                        <img
                          src={sparkle_icon}
                          className="w-5 h-5 mr-1"
                          alt=""
                        />{" "}
                        <span className="text-orange-500 font-semibold">
                          {slide.underlinedText}
                        </span>
                      </span>
                      {slide.subheader.split(slide.underlinedText)[1]}
                    </>
                  ) : slide.underlinedText ? (
                    <>{slide.subheader.split(slide.underlinedText)[0]}</>
                  ) : (
                    slide.subheader
                  )}
                </p>
              )}

              {/* Button Row - Consistent large size across all slides */}
              {slide.buttons && (
                <div className="flex flex-wrap justify-center gap-4 sm:gap-8 mt-6">
                  <button
                    onClick={() =>
                      currentIndex === 0
                        ? handleUserTypeToggle("jobhunter")
                        : null
                    }
                    className={`border border-orange-500 rounded-md transition-colors w-[140px] h-[50px] px-3 py-1 text-xl ${
                      userType === "jobhunter" && currentIndex === 0
                        ? "bg-orange-500 text-white shadow-[0_0_15px_rgba(249,115,22,0.7)]"
                        : "text-orange-500 hover:bg-orange-500 hover:text-white"
                    }`}
                    style={{
                      cursor: currentIndex === 0 ? "pointer" : "default",
                    }}
                  >
                    {slide.buttons.left}
                  </button>
                  {slide.buttons.right && (
                    <button
                      onClick={() =>
                        currentIndex === 0
                          ? handleUserTypeToggle("employer")
                          : null
                      }
                      className={`border border-orange-500 rounded-md transition-colors w-[140px] h-[50px] px-3 py-1 text-xl ${
                        userType === "employer" && currentIndex === 0
                          ? "bg-orange-500 text-white shadow-[0_0_15px_rgba(249,115,22,0.7)]"
                          : "text-orange-500 hover:bg-orange-500 hover:text-white"
                      }`}
                      style={{
                        cursor: currentIndex === 0 ? "pointer" : "default",
                      }}
                    >
                      {slide.buttons.right}
                    </button>
                  )}
                </div>
              )}

              {/* Underlined Text Display (shown only if needed) */}
              {slide.underlinedText && (
                <div className="mt-4 sm:mt-5 mb-6">
                  <span className="text-orange-500 font-semibold border-b-2 border-orange-500 pb-1">
                    {slide.underlinedText === "Perfect Match" ? (
                      <span className="inline-flex items-center align-middle">
                        <img
                          src={sparkle_icon}
                          className="w-5 h-5 mr-1"
                          alt=""
                        />
                        {slide.underlinedText}
                      </span>
                    ) : (
                      slide.underlinedText
                    )}
                  </span>
                </div>
              )}
            </>
          ) : (
            <div className="h-full w-full"></div> // Empty header for last slide
          )}
        </div>

        {/* Media Content Area - Adjusted height for last slide to center content better */}
        <div
          className="flex items-center justify-center p-4 pt-10"
          style={{ height: slide.isLastSlide ? "460px" : "400px" }}
        >
          {slide.isLastSlide ? (
            <div className="w-full flex flex-col items-center justify-center py-4">
              <h2 className="text-2xl font-medium mb-8">It's that simple</h2>
              <button
                onClick={handleSignup}
                className="bg-orange-500 text-white px-7 py-3 rounded-md hover:bg-orange-600 transition-colors text-lg sm:text-xl"
              >
                {slide.buttons?.left}
              </button>
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              {renderMedia(slide)}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col w-full bg-[#161A1D] text-white min-h-screen">
      {/* Full-width container with dark background */}
      <div className="w-full bg-[#161A1D] pt-10 sm:pt-12">
        {/* Content container with max width */}
        <div className="max-w-md mx-auto">
          <div className="flex flex-col">
            {/* Main content section */}
            {renderCurrentSlide()}

            {/* Footer section with navigation */}
            <div className="w-full flex justify-center space-x-6 py-6 mt-1">
              {currentIndex > 0 && (
                <button
                  onClick={goToPrevious}
                  className="w-10 h-10 flex items-center justify-center bg-transparent text-white"
                  aria-label="Previous"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="15 18 9 12 15 6"></polyline>
                  </svg>
                </button>
              )}
              <button
                onClick={goToNext}
                className="w-10 h-10 flex items-center justify-center bg-transparent text-white"
                aria-label="Next"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarouselDesktop;