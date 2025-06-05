import { FC, useState, useEffect, useRef, useCallback } from "react";
import { motion, useMotionValue, animate, PanInfo } from "framer-motion";
import sparkeIcon from "images/sparkle-icon.png";
import light_bulb from "assets/light-bulb.svg?url";
import { AppCardSkeleton } from "components";
import { AppCard } from "features/employer";
import employerPopAds from "images/employer-dashboard-popup-ads.svg?url";
import { Match } from "contexts/PerfectMatch/types";
import { AdDialogWrapper } from "components";

interface AdItem {
  isAd: true;
  image: string;
}

type CardItem = Match | AdItem;

interface FramerMobileCarouselProps {
  items: CardItem[];
  subscriptionPlan: string;
  onLoadMore: () => void;
  hasMore: boolean;
  loading: boolean;
  title: string;
  showTitle?: boolean;
  onNavigateToOtherTab?: () => void; // Add callback for navigation
}

const FramerMobileCarousel: FC<FramerMobileCarouselProps> = ({
  items,
  onLoadMore,
  hasMore,
  loading,
  title,
  showTitle = true,
  onNavigateToOtherTab
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  
  const cardWidth = 290;
  const cardGap = 12;
  
  // Calculate total items including end card if needed
  const shouldShowEndCard = !hasMore && items.length > 0 && !loading;
  const totalItems = items.length + (loading ? 2 : 0) + (shouldShowEndCard ? 1 : 0);
  const maxIndex = Math.max(0, totalItems - 1);

  // Framer Motion values
  const x = useMotionValue(0);
  const dragConstraints = useRef({ left: 0, right: 0 });

  // Calculate the X position to center a specific card
  const getCenterPosition = useCallback((index: number) => {
    const containerWidth = containerRef.current?.offsetWidth || window.innerWidth;
    const centerX = (containerWidth / 2) - (cardWidth / 2) - 8;
    return centerX - (index * (cardWidth + cardGap));
  }, [cardWidth, cardGap]);

  // Update drag constraints
  const updateConstraints = useCallback(() => {
    if (!containerRef.current) return;
    
    const containerWidth = containerRef.current.offsetWidth;
    const boundsPadding = containerWidth > 480 ? 150 : 80;
    
    const firstCardPosition = getCenterPosition(0);
    const lastCardPosition = getCenterPosition(maxIndex);
    
    dragConstraints.current = {
      left: lastCardPosition - boundsPadding,
      right: firstCardPosition + boundsPadding
    };
  }, [getCenterPosition, maxIndex]);

  // Move to specific index with smooth animation
  const moveToIndex = useCallback((index: number, duration = 0.25) => {
    if (isAnimating) return;
    
    const clampedIndex = Math.max(0, Math.min(index, maxIndex));
    if (clampedIndex === currentIndex) return;
    
    const targetX = getCenterPosition(clampedIndex);
    
    setIsAnimating(true);
    setCurrentIndex(clampedIndex);
    
    animate(x, targetX, {
      duration,
      ease: [0.25, 0.1, 0.25, 1],
      onComplete: () => {
        setIsAnimating(false);
        // Load more when near the end (but not if we're at the end card)
        if (clampedIndex >= items.length - 2 && hasMore && !loading && clampedIndex < items.length) {
          onLoadMore();
        }
      }
    });
  }, [maxIndex, getCenterPosition, items.length, hasMore, loading, onLoadMore, currentIndex, isAnimating, x]);

  // Handle card click to focus
  const handleCardClick = useCallback((index: number, e: React.MouseEvent) => {
    if (isDragging || isAnimating) {
      e.preventDefault();
      return;
    }
    
    if (index === currentIndex) return;
    moveToIndex(index, 0.2);
  }, [isDragging, isAnimating, currentIndex, moveToIndex]);

  // Find closest index based on position
  const findClosestIndex = useCallback((xPos: number) => {
    let closestIndex = 0;
    let smallestDistance = Infinity;
    
    for (let i = 0; i <= maxIndex; i++) {
      const cardPosition = getCenterPosition(i);
      const distance = Math.abs(xPos - cardPosition);
      if (distance < smallestDistance) {
        smallestDistance = distance;
        closestIndex = i;
      }
    }
    
    return closestIndex;
  }, [maxIndex, getCenterPosition]);

  // Handle drag end
  const handleDragEnd = useCallback((_: any, info: PanInfo) => {
    const currentX = x.get();
    let finalIndex = findClosestIndex(currentX);
    
    // Apply momentum based on velocity
    const velocity = Math.abs(info.velocity.x);
    const momentumThreshold = 300;
    
    if (velocity > momentumThreshold) {
      const direction = info.velocity.x > 0 ? -1 : 1;
      const momentumIndex = Math.max(0, Math.min(maxIndex, finalIndex + direction));
      finalIndex = momentumIndex;
    }
    
    // Animate to final position
    const targetX = getCenterPosition(finalIndex);
    const animationDuration = Math.min(0.35, 0.15 + Math.abs(velocity / 1000 * 0.3));
    
    setIsAnimating(true);
    
    animate(x, targetX, {
      duration: animationDuration,
      ease: [0.25, 0.1, 0.25, 1],
      onComplete: () => {
        setIsDragging(false);
        setIsAnimating(false);
        setCurrentIndex(finalIndex);
        
        // Load more if needed (but not if we're at the end card)
        if (finalIndex >= items.length - 2 && hasMore && !loading && finalIndex < items.length) {
          onLoadMore();
        }
      }
    });
  }, [x, findClosestIndex, maxIndex, getCenterPosition, items.length, hasMore, loading, onLoadMore]);

  // Handle drag during motion with throttling to prevent excessive re-renders
  const handleDrag = useCallback(() => {
    if (!isDragging) return;
    
    // Throttle the index updates during drag to prevent blinking
    const throttleUpdate = () => {
      const currentX = x.get();
      const closestIndex = findClosestIndex(currentX);
      
      if (closestIndex !== currentIndex) {
        setCurrentIndex(closestIndex);
      }
    };
    
    // Use requestAnimationFrame for smooth updates without excessive re-renders
    requestAnimationFrame(throttleUpdate);
  }, [x, findClosestIndex, currentIndex, isDragging]);

  // Initialize carousel position and constraints
  useEffect(() => {
    if (totalItems === 0) return;
    
    updateConstraints();
    const initialPosition = getCenterPosition(currentIndex);
    x.set(initialPosition);
  }, [totalItems, currentIndex, getCenterPosition, updateConstraints, x]);

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      if (!isDragging && !isAnimating) {
        updateConstraints();
        const newPosition = getCenterPosition(currentIndex);
        x.set(newPosition);
      }
    };

    const debouncedResize = debounce(handleResize, 150);
    window.addEventListener('resize', debouncedResize);
    return () => window.removeEventListener('resize', debouncedResize);
  }, [currentIndex, getCenterPosition, isDragging, isAnimating, updateConstraints, x]);

  // Reset to first card when items change
  useEffect(() => {
    if (currentIndex > maxIndex && maxIndex >= 0) {
      moveToIndex(0, 0.3);
    }
  }, [currentIndex, maxIndex, moveToIndex]);

  // Subscribe to x changes for real-time updates during drag with throttling
  useEffect(() => {
    let rafId: number | null = null;
    let lastUpdate = 0;
    
    const throttledHandler = () => {
      const now = Date.now();
      // Throttle to 60fps max to prevent excessive updates
      if (now - lastUpdate >= 16) {
        handleDrag();
        lastUpdate = now;
      }
      rafId = null;
    };
    
    const unsubscribe = x.on("change", () => {
      if (!rafId && isDragging) {
        rafId = requestAnimationFrame(throttledHandler);
      }
    });
    
    return () => {
      unsubscribe();
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
    };
  }, [x, handleDrag, isDragging]);

  // Debounce utility
  function debounce(func: Function, wait: number) {
    let timeout: NodeJS.Timeout;
    return function executedFunction(...args: any[]) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // End card component
  const EndCard = ({ isPerfectMatch }: { isPerfectMatch: boolean }) => (
    <div 
      className="bg-transparent rounded-2xl shadow-lg"
      style={{ 
        width: `${cardWidth}px`, 
        height: '350px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <div className="p-6 text-center">
        <p className="text-lg font-semibold text-white mb-4">
          {isPerfectMatch 
            ? "You've reached the end of your perfect matches for now!"
            : "You've reached the end of your other application cards for now!"
          }
        </p>
        <div className="mb-4">
          <span className="text-white text-lg font-semibold block mb-1">
            {isPerfectMatch ? "Explore" : "Explore your"}
          </span>
          <button
            onClick={onNavigateToOtherTab}
            className="text-lg text-[#F5722E] font-semibold underline hover:opacity-80 transition-opacity"
          >
            {isPerfectMatch ? "other application cards" : "perfect matches"}
          </button>
        </div>
        <div className="flex justify-center">
          <img
            src={light_bulb}
            alt="Light Bulb"
            className="w-12 h-12"
          />
        </div>
      </div>
    </div>
  );

  if (items.length === 0 && !loading) {
    return null;
  }

  return (
    <div className="w-full overflow-hidden mb-8 relative z-0">
      {showTitle && (
        <div className="flex items-center justify-center mb-6">
          <div className="flex items-center gap-2">
            {title === "PERFECT MATCH" && (
              <img
                src={sparkeIcon}
                alt="Sparkle Icon"
                className="w-5 h-5"
              />
            )}
            <h2 className="text-[17px] font-semibold text-[#F5722E]">
              {title}
            </h2>
          </div>
        </div>
      )}
      
      <div 
        ref={containerRef}
        className="relative w-full h-[420px]"
        style={{ 
          touchAction: 'pan-y pinch-zoom',
          overflow: 'hidden'
        }}
      >
        {/* Side card visibility mask */}
        <div 
          className="absolute inset-0 pointer-events-none z-30"
          style={{
            background: `linear-gradient(to right, 
              rgba(0,0,0,0.05) 0%, 
              transparent 18%, 
              transparent 82%, 
              rgba(0,0,0,0.05) 100%)`
          }}
        />
        
        <motion.div
          style={{ 
            x,
            cursor: isDragging ? 'grabbing' : 'grab',
            gap: `${cardGap}px`,
            willChange: 'transform',
            userSelect: 'none'
          }}
          className="absolute top-0 flex items-start"
          drag="x"
          dragConstraints={dragConstraints.current}
          dragElastic={0.2}
          dragMomentum={false}
          onDragStart={() => {
            setIsDragging(true);
            setIsAnimating(true); // Prevent other animations during drag
          }}
          onDragEnd={handleDragEnd}
        >
          {items.map((item, index) => {
            // Calculate distance from current index for scaling
            const distance = Math.abs(index - currentIndex);
            const isActive = index === currentIndex;
            const isAdjacent = distance === 1;
            const isVisible = distance <= 2;
            
            // Dynamic scaling and opacity based on position
            let scale = 1;
            let opacity = 1;
            let translateY = 0;
            let zIndex = 5;
            
            if (isActive) {
              scale = 1;
              opacity = 1;
              translateY = 0;
              zIndex = 20;
            } else if (isAdjacent) {
              scale = 0.85;
              opacity = 0.7;
              translateY = 5;
              zIndex = 15;
            } else if (isVisible) {
              scale = 0.75;
              opacity = 0.4;
              translateY = 8;
              zIndex = 10;
            } else {
              scale = 0.7;
              opacity = 0.2;
              translateY = 10;
              zIndex = 5;
            }

            return (
              <motion.div 
                key={index} 
                className={`flex-shrink-0 transition-all duration-150 ease-out ${
                  !isActive ? 'hover:opacity-90 cursor-pointer' : 'cursor-default'
                }`}
                animate={{
                  scale,
                  opacity,
                  y: translateY
                }}
                transition={{
                  duration: isDragging ? 0 : 0.15, // Disable transitions during drag
                  ease: "easeOut"
                }}
                style={{ 
                  width: `${cardWidth}px`,
                  zIndex,
                  transformOrigin: 'top center',
                  // Enable clicking on non-active cards to focus them
                  pointerEvents: isActive ? 'none' : 'auto',
                  display: 'flex',
                  alignItems: 'flex-start'
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleCardClick(index, e);
                }}
              >
                <div 
                  style={{ 
                    // Enable pointer events on active card content, disable on inactive cards
                    pointerEvents: isActive ? 'auto' : 'none',
                    position: 'relative',
                    filter: isActive ? 'none' : 'brightness(0.8)',
                    transition: 'filter 0.2s ease',
                    width: '100%',
                    height: '100%'
                  }}
                >
                  {"isAd" in item ? (
                    <AdDialogWrapper
                      adImage={item.image}
                      popupImage={employerPopAds}
                    />
                  ) : (
                    <AppCard
                      jobId={123}
                      match={item}
                      popupImage={employerPopAds}
                      isMobile={true}
                    />
                  )}
                </div>
              </motion.div>
            );
          })}
          
          {/* Loading cards */}
          {loading && (
            <>
              {[0, 1].map((loadingIndex) => {
                const index = items.length + loadingIndex;
                const distance = Math.abs(index - currentIndex);
                const isActive = index === currentIndex;
                const isAdjacent = distance === 1;
                const isVisible = distance <= 2;
                
                let scale = 1;
                let opacity = 1;
                let translateY = 0;
                let zIndex = 5;
                
                if (isActive) {
                  scale = 1;
                  opacity = 1;
                  translateY = 0;
                  zIndex = 20;
                } else if (isAdjacent) {
                  scale = 0.85;
                  opacity = 0.7;
                  translateY = 5;
                  zIndex = 15;
                } else if (isVisible) {
                  scale = 0.75;
                  opacity = 0.4;
                  translateY = 8;
                  zIndex = 10;
                } else {
                  scale = 0.7;
                  opacity = 0.2;
                  translateY = 10;
                  zIndex = 5;
                }

                return (
                  <motion.div 
                    key={`loading-${loadingIndex}`}
                    className="flex-shrink-0"
                    animate={{
                      scale,
                      opacity,
                      y: translateY
                    }}
                    transition={{
                      duration: isDragging ? 0 : 0.1, // Disable transitions during drag
                      ease: "easeOut"
                    }}
                    style={{ 
                      width: `${cardWidth}px`,
                      zIndex,
                      transformOrigin: 'top center',
                      pointerEvents: 'none',
                      display: 'flex',
                      alignItems: 'flex-start'
                    }}
                  >
                    <div style={{ 
                      position: 'relative',
                      filter: isActive ? 'none' : 'brightness(0.8)',
                      transition: 'filter 0.2s ease',
                      width: '100%',
                      height: '100%',
                      pointerEvents: 'none'
                    }}>
                      <AppCardSkeleton />
                    </div>
                  </motion.div>
                );
              })}
            </>
          )}

          {/* End card */}
          {shouldShowEndCard && (
            <motion.div 
              className={`flex-shrink-0 transition-all duration-150 ease-out ${
                currentIndex !== items.length ? 'hover:opacity-90 cursor-pointer' : 'cursor-default'
              }`}
              animate={{
                scale: currentIndex === items.length ? 1 : 0.85,
                opacity: currentIndex === items.length ? 1 : 0.7,
                y: currentIndex === items.length ? 0 : 5
              }}
              transition={{
                duration: isDragging ? 0 : 0.15,
                ease: "easeOut"
              }}
              style={{ 
                width: `${cardWidth}px`,
                zIndex: currentIndex === items.length ? 20 : 15,
                transformOrigin: 'top center',
                pointerEvents: currentIndex === items.length ? 'none' : 'auto',
                display: 'flex',
                alignItems: 'flex-start'
              }}
              onClick={(e) => {
                e.stopPropagation();
                handleCardClick(items.length, e);
              }}
            >
              <div 
                style={{ 
                  pointerEvents: currentIndex === items.length ? 'auto' : 'none',
                  position: 'relative',
                  filter: currentIndex === items.length ? 'none' : 'brightness(0.8)',
                  transition: 'filter 0.2s ease',
                  width: '100%',
                  height: '100%'
                }}
              >
                <EndCard isPerfectMatch={title === "PERFECT MATCH"} />
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export { FramerMobileCarousel };