import React, { useState, useEffect } from "react";

import { useLanding } from "../useLanding";
import { useModal } from "components/modal/useModal";
import { MODAL_HEADER_TYPE, MODAL_STATES } from "store/modal/modal.types";

// Import images directly with webpack
import CarouselImage1 from "assets/hero-carousel/info-carousel-1.svg?url";
import CarouselImage2 from "assets/hero-carousel/info-carousel-2.svg?url";
import CarouselImage3 from "assets/hero-carousel/info-carousel-3.svg?url";
import CarouselImage4 from "assets/hero-carousel/info-carousel-4.svg?url";
import CarouselImage5 from "assets/hero-carousel/info-carousel-5.svg?url";

import bus_alert_icon from "assets/hero-infographic/bus-alert.svg?url";
import sleep_icon from "assets/hero-infographic/sleep.svg?url";
import dollar_icon from "assets/hero-infographic/currency-usd.svg?url";
import time_alert_icon from "assets/hero-infographic/timer-alert-outline.svg?url";

// Define types for our carousel items
interface CarouselItem {
  id: number;
  imageUrl: string;
  title: string;
  hashtag: string;
  items: string[];
  cta: string;
  ctaHashtag: string;
  ctaEnd: string;
  isDark?: boolean;
}

const InfoGraphics: React.FC = () => {
  const [activeSlide, setActiveSlide] = useState<number>(0);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const { handleSetSelectedModalHeader, toggleModal } = useModal();
  const { handleSetModalState } = useLanding();

  const handleSignup = () => {
    // First, update the modal state to show signup step
    handleSetModalState(MODAL_STATES.SIGNUP_SELECT_USER_TYPE);
    handleSetSelectedModalHeader(MODAL_HEADER_TYPE.WITH_LOGO_AND_CLOSE);

    // Then open the modal with the updated state
    toggleModal(true);
  };

  // Check screen size on mount and when window resizes
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Check on initial load
    checkScreenSize();

    // Add event listener for resize
    window.addEventListener("resize", checkScreenSize);

    // Clean up
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Carousel items data
  const carouselItems: CarouselItem[] = [
    {
      id: 1,
      imageUrl: CarouselImage1,
      title: "$5 for a chance to",
      hashtag: "#TakeBackYourTime",
      items: [
        "No more commuting",
        "No more hours of scrolling",
        "More sleep",
        "More money in your pockets",
      ],
      cta: "Join us on our quest to",
      ctaHashtag: "#TakeBackYourTime",
      ctaEnd: "and reclaim what's truly yours!",
      isDark: true,
    },
    {
      id: 2,
      imageUrl: CarouselImage2,
      title: "$5 for a chance to",
      hashtag: "#TakeBackYourTime",
      items: [
        "No more commuting",
        "No more hours of scrolling",
        "More sleep",
        "More money in your pockets",
      ],
      cta: "Join us on our quest to",
      ctaHashtag: "#TakeBackYourTime",
      ctaEnd: "and reclaim what's truly yours!",
      isDark: false,
    },
    {
      id: 3,
      imageUrl: CarouselImage3,
      title: "$5 for a chance to",
      hashtag: "#TakeBackYourTime",
      items: [
        "No more commuting",
        "No more hours of scrolling",
        "More sleep",
        "More money in your pockets",
      ],
      cta: "Join us on our quest to",
      ctaHashtag: "#TakeBackYourTime",
      ctaEnd: "and reclaim what's truly yours!",
      isDark: false,
    },
    {
      id: 4,
      imageUrl: CarouselImage4,
      title: "$5 for a chance to",
      hashtag: "#TakeBackYourTime",
      items: [
        "No more commuting",
        "No more hours of scrolling",
        "More sleep",
        "More money in your pockets",
      ],
      cta: "Join us on our quest to",
      ctaHashtag: "#TakeBackYourTime",
      ctaEnd: "and reclaim what's truly yours!",
      isDark: false,
    },
    {
      id: 5,
      imageUrl: CarouselImage5,
      title: "$5 for a chance to",
      hashtag: "#TakeBackYourTime",
      items: [
        "No more commuting",
        "No more hours of scrolling",
        "More sleep",
        "More money in your pockets",
      ],
      cta: "Join us on our quest to",
      ctaHashtag: "#TakeBackYourTime",
      ctaEnd: "and reclaim what's truly yours!",
      isDark: false,
    },
  ];

  // Auto-advance carousel
  useEffect(() => {
    const interval = setInterval(() => {
      if (isAnimating) return;

      setIsAnimating(true);
      setTimeout(() => {
        setActiveSlide((prev) =>
          prev === carouselItems.length - 1 ? 0 : prev + 1,
        );
        setIsAnimating(false);
      }, 500); // Fade transition duration
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [isAnimating, carouselItems.length]);

  // Render appropriate icon based on index - without background
  const renderIcon = (index: number) => {
    const icons = [bus_alert_icon, time_alert_icon, sleep_icon, dollar_icon];
    return (
        <img src={icons[index]} alt="Icon" className="w-4 h-4 md:w-8 md:h-8" />
    );
  };

  return (
    <div className="relative w-full min-h-[500px] md:h-[763px] overflow-hidden">
      {carouselItems.map((item, index) => {
        // For mobile, always have content at bottom
        // For desktop, alternate left/right
        const isLeftContent = !isMobile && (item.id === 3 || item.id === 5);

        return (
          <div
            key={item.id}
            className={`absolute top-0 left-0 w-full h-full transition-opacity duration-500 ease-in-out ${
              activeSlide === index ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            {/* Background with gradient */}
            <div className="absolute inset-0 w-full h-full">
              {/* Base background color */}
              <div
                className={`absolute inset-0 ${item.isDark ? "bg-gray-900" : "bg-white"}`}
              ></div>

              {/* Full image */}
              <div className="absolute inset-0">
                <img
                  src={item.imageUrl}
                  alt={`Slide ${item.id}`}
                  className="h-full w-full object-cover"
                />
              </div>

              {/* Gradient overlay - different for mobile vs desktop */}
              {isMobile ? (
                // Mobile gradient - from right side (matching your screenshot)
                <div
                  className="absolute top-0 right-0 w-3/5 h-full z-20"
                  style={{
                    background: item.isDark
                      ? "linear-gradient(to right, rgba(0,0,0,0) 0%, rgba(0,0,0,0.7) 50%, rgba(0,0,0,0.95) 100%)"
                      : "linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(255,255,255,0.7) 50%, rgba(255,255,255,0.95) 100%)",
                  }}
                />
              ) : (
                // Desktop gradient - from left/right (UNCHANGED FROM ORIGINAL)
                <div
                  className={`absolute top-0 ${isLeftContent ? "left-0" : "right-0"} h-full z-20 w-[40%]`}
                  style={{
                    background: item.isDark
                      ? `linear-gradient(
                          ${isLeftContent ? "to left" : "to right"},
                          rgba(0, 0, 0, 0) 0%,
                          rgba(0, 0, 0, 0.7) 50%,
                          rgba(0, 0, 0, 0.95) 100%
                        )`
                      : `linear-gradient(
                          ${isLeftContent ? "to left" : "to right"},
                          rgba(255, 255, 255, 0) 0%,
                          rgba(255, 255, 255, 0.7) 50%,
                          rgba(255, 255, 255, 0.95) 100%
                        )`,
                  }}
                />
              )}
            </div>

            {/* Content - different positioning for mobile vs desktop */}
            <div
              className={`
                absolute z-30
                ${
                  isMobile
                    ? "top-0 right-0 w-3/5 h-full flex flex-col justify-center pr-4"
                    : `top-0 ${isLeftContent ? "left-0" : "right-0"} w-2/5 h-full flex flex-col justify-center ${isLeftContent ? "pl-8" : "pr-8"}`
                }
              `}
            >
              <div
                className={`
                  ${isMobile ? "text-right" : isLeftContent ? "text-left" : "text-right"}
                  ${item.isDark ? "text-white" : "text-gray-800"}
                `}
              >
                {/* Title and hashtag */}
                {isMobile ? (
                  // Mobile title - right aligned with both title and hashtag
                  <div className="mb-4 text-right">
                    <div className="text-md font-bold mb-1">
                      {item.title}
                    </div>
                    <div className="text-orange-500 text-md font-medium truncate">
                      {item.hashtag}
                    </div>
                  </div>
                ) : (
                  // Desktop title - UNCHANGED FROM ORIGINAL
                  <div
                    className={`mb-4 md:mb-8 ${isLeftContent ? "text-left" : "text-right"} flex items-end flex-wrap`}
                  >
                    <span
                      className="text-2xl md:text-4xl font-bold"
                      style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.5)" }}
                    >
                      {item.title}
                    </span>
                    <span
                      className="text-orange-500 text-2xl md:text-4xl font-medium"
                      style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.5)" }}
                    >
                      {item.hashtag}
                    </span>
                  </div>
                )}

                {/* List Items */}
                <div className={`space-y-2 md:space-y-7`}>
                  {item.items.map((listItem, i) => (
                    <div
                      key={i}
                      className={`flex items-center gap-2 md:gap-3 ${
                        isMobile ? "justify-end" : ""
                      }`}
                    >
                      {!isMobile && renderIcon(i)}
                      <span className={`${isMobile ? "text-md" : "text-lg"} md:text-4xl whitespace-normal md:whitespace-nowrap`}>
                        {listItem}
                      </span>
                      {isMobile && renderIcon(i)}
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <div className={`mt-4 md:mt-12 mb-2 md:mb-6 ${isMobile ? "text-right" : "text-center"}`}>
                  <div className={`${isMobile ? "text-md" : "text-xl"} md:text-3xl`}>{item.cta}</div>
                  <div className={`text-orange-500 font-medium ${isMobile ? "text-md" : "text-xl"} md:text-3xl truncate max-w-full`}>
                    {item.ctaHashtag}
                  </div>
                  <div className={`${isMobile ? "text-md" : "text-xl"} md:text-3xl`}>{item.ctaEnd}</div>
                </div>

                {/* Button */}
                <div className={`flex ${isMobile ? "justify-end" : "justify-center"}`}>
                  <button
                    onClick={handleSignup}
                    className="bg-orange-500 hover:bg-orange-600 text-white text-xs md:text-xl px-3 md:px-6 py-1 md:py-2 rounded font-medium uppercase mt-2 md:mt-3 transition-colors duration-200"
                  >
                    Experience it now
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default InfoGraphics;