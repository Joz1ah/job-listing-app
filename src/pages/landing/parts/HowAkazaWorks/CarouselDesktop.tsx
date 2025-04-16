import { useState, useEffect } from "react";
import carousel1_jobhunter from "assets/landing-carousel/landing-carousel-1-jobhunter.mp4";
import carousel1_employer from "assets/landing-carousel/landing-carousel-1-employer.mp4";
import carousel2 from "assets/landing-carousel/landing-carousel-2-desktop.gif";
import carousel3 from "assets/landing-carousel/landing-carousel-3-desktop.gif";
import carousel4 from "assets/landing-carousel/landing-carousel-4-desktop.mp4";
import sparkle_icon from "assets/sparkle-icon.svg?url";
import company_logo from "assets/images/company-logo-light.svg?url";
import { useModal } from "components/modal/useModal";
import { useLanding } from "pages/landing/useLanding";
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

  // Navigation functions
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

  // Handle sign up button click
  const handleSignup = () => {
    handleSetModalState(MODAL_STATES.SIGNUP_SELECT_USER_TYPE);
    handleSetSelectedModalHeader(MODAL_HEADER_TYPE.WITH_LOGO_AND_CLOSE);
    handleSetHeroState(HERO_STATES.PERFECT_MATCH_ALGO);
    toggleModal(true);
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

  // Navigation buttons component for consistency
  const NavigationButtons = () => (
    <>
      {currentIndex > 0 && (
        <button
          onClick={goToPrevious}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 w-20 h-20 flex items-center justify-center text-white hover:text-orange-500 transition-colors"
          aria-label="Previous"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="80"
            height="80"
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
        className="absolute right-0 top-1/2 transform -translate-y-1/2 w-20 h-20 flex items-center justify-center text-white hover:text-orange-500 transition-colors"
        aria-label="Next"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="80"
          height="80"
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
    </>
  );

  // Render current slide with appropriate desktop layout that works at various sizes
  const renderCurrentSlide = () => {
    const slide = slides[currentIndex];

    if (currentIndex === 0) {
      // First slide with How Akaza Works? showing both videos closer together
      return (
        <div className="flex flex-col w-full relative">
          {/* Main content area - responsive layout with reduced gap */}
          <div className="flex flex-wrap lg:flex-nowrap w-full items-center relative" style={{ minHeight: "60vh" }}>
            {/* Left side with Akaza logo - positioned closer to videos but left-aligned */}
            <div className="w-full lg:w-1/3 flex items-center justify-center lg:justify-start">
              <div className="text-center lg:text-left pl-4 lg:pl-8 xl:pl-12">
                <h1 className="text-6xl lg:text-7xl xl:text-8xl font-bold leading-tight">
                  How
                  <br />
                  Does
                  <br />
                  <span className="inline-block">
                    <img
                      src={company_logo}
                      className="h-16 lg:h-20 xl:h-24 my-0 inline-block"
                      alt="Akaza logo"
                    />
                  </span>
                  <br />
                  Work?
                </h1>
              </div>
            </div>

            {/* Videos container - adjusted width to fill space */}
            <div className="w-full lg:w-2/3 flex justify-center lg:justify-start lg:pt-0 mt-0 lg:pl-0">
              {/* Video container with reduced spacing */}
              <div className="flex flex-wrap lg:flex-nowrap justify-center lg:justify-start lg:space-x-4 xl:space-x-6">
                {/* Job Hunter video */}
                <div className="w-full lg:w-auto flex flex-col items-center mt-2 lg:mt-0">
                  <div className="mb-2 lg:mb-3">
                    <div
                      className="border border-orange-500 bg-orange-500 text-white px-6 lg:px-8 xl:px-10 py-2 lg:py-3 rounded-md text-base lg:text-lg xl:text-xl cursor-default"
                    >
                      {slide.buttons?.left}
                    </div>
                  </div>
                  <div className="flex justify-center">
                    <video
                      key={`jobhunter-${Date.now()}`}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="max-w-full h-auto object-contain"
                      style={{ maxHeight: "300px", width: "auto" }}
                    >
                      <source src={slide.srcJobHunter} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                </div>

                {/* Employer video */}
                <div className="w-full lg:w-auto flex flex-col items-center mt-2 lg:mt-0">
                  <div className="mb-2 lg:mb-3">
                    <div
                      className="border border-orange-500 bg-transparent text-orange-500 px-6 lg:px-8 xl:px-10 py-2 lg:py-3 rounded-md text-base lg:text-lg xl:text-xl cursor-default"
                    >
                      {slide.buttons?.right}
                    </div>
                  </div>
                  <div className="flex justify-center">
                    <video
                      key={`employer-${Date.now()}`}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="max-w-full h-auto object-contain"
                      style={{ maxHeight: "300px", width: "auto" }}
                    >
                      <source src={slide.srcEmployer} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                </div>
              </div>
            </div>

            {/* Common navigation buttons */}
            <NavigationButtons />
          </div>

          {/* Footer text for slide 1 - moved up by removing margins */}
          <div className="text-center mt-0 pt-2">
            <p className="text-lg lg:text-xl xl:text-2xl">
              As a Job Hunter, <span className="text-orange-500">Complete your application card</span> &<br />
              as an Employer, <span className="text-orange-500">Complete your first job listing</span>
            </p>
          </div>
        </div>
      );
    } else if (slide.isLastSlide) {
      // Last slide with "It's that simple" content
      return (
        <div className="w-full flex flex-col items-center justify-center relative" style={{ minHeight: "60vh" }}>
          <h2 className="text-3xl lg:text-4xl xl:text-5xl font-medium mb-8 lg:mb-12">It's that simple</h2>
          <button
            onClick={handleSignup}
            className="bg-orange-500 text-white px-10 lg:px-12 xl:px-16 py-3 lg:py-4 xl:py-5 text-xl lg:text-2xl rounded-md hover:bg-orange-600 transition-colors"
          >
            {slide.buttons?.left}
          </button>

          {/* Common navigation buttons */}
          <NavigationButtons />
        </div>
      );
    } else {
      // Slides 2-4 with similar layout
      return (
        <div className="flex flex-col w-full relative" style={{ minHeight: "60vh" }}>
          {/* Top buttons with more spacing - responsive */}
          <div className="flex justify-center mb-6 lg:mb-8 mt-6 lg:mt-10 space-x-10">
            <div
              className="border border-orange-500 px-5 lg:px-8 xl:px-10 py-2 lg:py-3 rounded-md text-orange-500 text-base lg:text-lg xl:text-xl mx-4 lg:mx-8 xl:mx-10 cursor-default"
            >
              {slide.buttons?.left}
            </div>
            {slide.buttons?.right && (
              <div
                className="border border-orange-500 px-5 lg:px-8 xl:px-10 py-2 lg:py-3 rounded-md text-orange-500 text-base lg:text-lg xl:text-xl mx-4 lg:mx-8 xl:mx-10 cursor-default"
              >
                {slide.buttons.right}
              </div>
            )}
          </div>

          {/* Underlined Text Display in the middle top */}
          {slide.underlinedText && (
            <div className="flex justify-center mb-6 lg:mb-8">
              <div className="text-center">
                <span className="text-orange-500 font-semibold border-b-2 border-orange-500 pb-1 text-lg lg:text-xl xl:text-2xl inline-block">
                  {slide.underlinedText === "Perfect Match" ? (
                    <span className="inline-flex items-center align-middle">
                      <img
                        src={sparkle_icon}
                        className="w-5 h-5 lg:w-6 lg:h-6 mr-1 lg:mr-2"
                        alt=""
                      />
                      {slide.underlinedText}
                    </span>
                  ) : (
                    slide.underlinedText
                  )}
                </span>
              </div>
            </div>
          )}

          {/* Media Content - responsive */}
          <div className="flex justify-center mb-2 lg:mb-4">
            <div className="w-full px-6 lg:px-10 xl:px-16">
              {currentIndex === 3 && slide.type === "image" ? (
                // For slide 4, properly show the mp4 video instead
                <video
                  key={`slide4-${Date.now()}`}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-auto object-contain mx-auto"
                  style={{ maxHeight: "400px" }}
                >
                  <source src={carousel4} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              ) : (
                <img
                  src={slide.src}
                  alt="Carousel content"
                  className="w-full h-auto object-contain mx-auto"
                  style={{ maxHeight: "400px" }}
                />
              )}
            </div>
          </div>

          {/* Footer text - moved up by reducing margins */}
          <div className="text-center mt-0 mb-0 px-4 lg:px-0">
            <p className="text-lg lg:text-xl xl:text-2xl">
              {currentIndex === 1 ? (
                <>No Resume. No more endless scrolling. Just choose your <span className="text-orange-500">Perfect Match</span></>
              ) : currentIndex === 2 ? (
                <>Job hunters and employers can now <span className="text-orange-500">schedule interviews</span> instantly!</>
              ) : (
                <>Start the conversation, show up ready & hold each other accountable by providing feedback</>
              )}
            </p>
          </div>
          
          {/* Common navigation buttons */}
          <NavigationButtons />
        </div>
      );
    }
  };

  return (
    <div className="flex flex-col w-full bg-[#161A1D] text-white min-h-screen">
      {/* Full-width container with dark background - centered vertically with flex and padding */}
      <div className="w-full bg-[#161A1D] flex flex-col justify-center min-h-screen py-16">
        {/* Responsive content container - position relative for the absolute positioned nav buttons */}
        <div className="w-full mx-auto max-w-screen-xl relative">
          <div className="flex flex-col">
            {/* Main content section */}
            {renderCurrentSlide()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarouselDesktop;