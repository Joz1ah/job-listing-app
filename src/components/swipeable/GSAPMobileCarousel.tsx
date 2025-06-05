import { FC, useState, useEffect, useRef, useCallback } from "react";
import { gsap } from "gsap";
import { Draggable } from "gsap/Draggable";
import sparkeIcon from "images/sparkle-icon.png";
import { AppCardSkeleton } from "components";
import { AppCard } from "features/employer";
import employerPopAds from "images/employer-dashboard-popup-ads.svg?url";
import { Match } from "contexts/PerfectMatch/types";
import { AdDialogWrapper } from "components";

// Register GSAP plugins
gsap.registerPlugin(Draggable);

interface AdItem {
  isAd: true;
  image: string;
}

type CardItem = Match | AdItem;

interface GSAPMobileCarouselProps {
  items: CardItem[];
  subscriptionPlan: string;
  onLoadMore: () => void;
  hasMore: boolean;
  loading: boolean;
  title: string;
  showTitle?: boolean;
}

const GSAPMobileCarousel: FC<GSAPMobileCarouselProps> = ({
  items,
  onLoadMore,
  hasMore,
  loading,
  title,
  showTitle = true
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const draggableInstance = useRef<Draggable | null>(null);
  
  // Track velocity manually for smooth momentum
  const velocityTracker = useRef({ 
    lastX: 0, 
    lastTime: 0, 
    velocity: 0,
    positions: [] as Array<{x: number, time: number}>
  });
  
  const cardWidth = 290;
  const cardGap = 12;
  const totalItems = items.length + (loading ? 2 : 0);
  const maxIndex = Math.max(0, totalItems - 1);

  // Calculate the X position to center a specific card
  const getCenterPosition = useCallback((index: number) => {
    const containerWidth = containerRef.current?.offsetWidth || window.innerWidth;
    // Perfect centering: put the card exactly in the middle
    // Add slight adjustment to ensure equal side spacing visibility
    const centerX = (containerWidth / 2) - (cardWidth / 2) - 8; // 8px left shift for better side card visibility
    // Calculate position with proper spacing
    return centerX - (index * (cardWidth + cardGap));
  }, [cardWidth, cardGap]);

  // Calculate velocity manually
  const updateVelocity = useCallback((x: number) => {
    const now = Date.now();
    const tracker = velocityTracker.current;
    
    // Add current position to history
    tracker.positions.push({ x, time: now });
    
    // Keep only last 5 positions for smooth calculation
    if (tracker.positions.length > 5) {
      tracker.positions.shift();
    }
    
    // Calculate velocity from recent positions
    if (tracker.positions.length >= 2) {
      const recent = tracker.positions[tracker.positions.length - 1];
      const previous = tracker.positions[tracker.positions.length - 2];
      const deltaTime = recent.time - previous.time;
      
      if (deltaTime > 0) {
        tracker.velocity = (recent.x - previous.x) / deltaTime;
      }
    }
  }, []);

  // Move to specific index with smooth animation
  const moveToIndex = useCallback((index: number, duration = 0.25) => {
    if (!carouselRef.current || isAnimating) return;
    
    const clampedIndex = Math.max(0, Math.min(index, maxIndex));
    if (clampedIndex === currentIndex) return;
    
    const targetX = getCenterPosition(clampedIndex);
    
    setIsAnimating(true);
    // Update current index immediately for faster visual feedback
    setCurrentIndex(clampedIndex);
    
    gsap.to(carouselRef.current, {
      x: targetX,
      duration,
      ease: "power1.out", // Gentler easing for smoother feel
      onComplete: () => {
        setIsAnimating(false);
        // Load more when near the end
        if (clampedIndex >= items.length - 2 && hasMore && !loading) {
          onLoadMore();
        }
      }
    });
  }, [maxIndex, getCenterPosition, items.length, hasMore, loading, onLoadMore, currentIndex, isAnimating]);

  // Initialize carousel
  useEffect(() => {
    if (!carouselRef.current || !containerRef.current || totalItems === 0) return;

    const carousel = carouselRef.current;
    
    // Kill previous instance
    if (draggableInstance.current) {
      draggableInstance.current.kill();
    }

    // Set initial position
    const initialPosition = getCenterPosition(currentIndex);
    gsap.set(carousel, { x: initialPosition });

    // Calculate drag bounds with proper centering
    const firstCardPosition = getCenterPosition(0);
    const lastCardPosition = getCenterPosition(maxIndex);
    // Adjust bounds based on screen size
    const containerWidth = containerRef.current?.offsetWidth || window.innerWidth;
    const boundsPadding = containerWidth > 480 ? 150 : 80; // Less padding on smaller screens
    
    // Reset velocity tracker
    velocityTracker.current = { 
      lastX: 0, 
      lastTime: 0, 
      velocity: 0,
      positions: []
    };
    
    // Create draggable with smooth carousel behavior
    draggableInstance.current = Draggable.create(carousel, {
      type: "x",
      inertia: true,
      edgeResistance: 0.8, // Smoother edge resistance
      allowNativeTouchScrolling: false,
      bounds: {
        minX: lastCardPosition - boundsPadding,
        maxX: firstCardPosition + boundsPadding
      },
      snap: {
        x: function(endValue: number) {
          // Find the closest card position with improved logic
          let closestIndex = 0;
          let smallestDistance = Infinity;
          
          for (let i = 0; i <= maxIndex; i++) {
            const cardPosition = getCenterPosition(i);
            const distance = Math.abs(endValue - cardPosition);
            if (distance < smallestDistance) {
              smallestDistance = distance;
              closestIndex = i;
            }
          }
          
          return getCenterPosition(closestIndex);
        }
      },
      onDragStart: function() {
        setIsDragging(true);
        // Reset velocity tracking
        velocityTracker.current = { 
          lastX: this.x, 
          lastTime: Date.now(), 
          velocity: 0,
          positions: [{ x: this.x, time: Date.now() }]
        };
      },
      onDrag: function() {
        // Update velocity tracking more frequently for smoother feel
        updateVelocity(this.x);
        
        // Throttled update of current index during drag
        const throttledUpdate = () => {
          let closestIndex = 0;
          let smallestDistance = Infinity;
          
          for (let i = 0; i <= maxIndex; i++) {
            const cardPosition = getCenterPosition(i);
            const distance = Math.abs(this.x - cardPosition);
            if (distance < smallestDistance) {
              smallestDistance = distance;
              closestIndex = i;
            }
          }
          
          if (closestIndex !== currentIndex) {
            setCurrentIndex(closestIndex);
          }
        };
        
        // Use requestAnimationFrame for smoother updates
        requestAnimationFrame(throttledUpdate);
      },
      onDragEnd: function() {
        // Find final position after drag ends
        let finalIndex = 0;
        let smallestDistance = Infinity;
        
        for (let i = 0; i <= maxIndex; i++) {
          const cardPosition = getCenterPosition(i);
          const distance = Math.abs(this.x - cardPosition);
          if (distance < smallestDistance) {
            smallestDistance = distance;
            finalIndex = i;
          }
        }
        
        // Apply momentum based on manual velocity calculation
        const velocity = Math.abs(velocityTracker.current.velocity);
        const momentumThreshold = 0.3; // Lower threshold for more responsive swiping
        
        if (velocity > momentumThreshold) {
          // Determine direction and apply momentum
          const direction = velocityTracker.current.velocity < 0 ? 1 : -1;
          const momentumIndex = Math.max(0, Math.min(maxIndex, finalIndex + direction));
          finalIndex = momentumIndex;
        }
        
        // Animate to exact center position
        const exactPosition = getCenterPosition(finalIndex);
        const animationDuration = Math.min(0.35, 0.15 + Math.abs(velocity * 0.3)); // Even faster, smoother
        
        gsap.to(carousel, {
          x: exactPosition,
          duration: animationDuration,
          ease: "power1.out", // Gentler easing for smoother feel
          onComplete: () => {
            setIsDragging(false);
            setCurrentIndex(finalIndex);
            
            // Load more if needed
            if (finalIndex >= items.length - 2 && hasMore && !loading) {
              onLoadMore();
            }
          }
        });
      }
    })[0];

    return () => {
      if (draggableInstance.current) {
        draggableInstance.current.kill();
        draggableInstance.current = null;
      }
    };
  }, [totalItems, maxIndex, getCenterPosition, items.length, hasMore, loading, onLoadMore, currentIndex, updateVelocity]);

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      if (!isDragging && !isAnimating && carouselRef.current) {
        const newPosition = getCenterPosition(currentIndex);
        gsap.set(carouselRef.current, { x: newPosition });
        
        if (draggableInstance.current) {
          const firstPos = getCenterPosition(0);
          const lastPos = getCenterPosition(maxIndex);
          const containerWidth = containerRef.current?.offsetWidth || window.innerWidth;
          const boundsPadding = containerWidth > 480 ? 150 : 80;
          draggableInstance.current.applyBounds({
            minX: lastPos - boundsPadding,
            maxX: firstPos + boundsPadding
          });
        }
      }
    };

    const debouncedResize = debounce(handleResize, 150);
    window.addEventListener('resize', debouncedResize);
    return () => window.removeEventListener('resize', debouncedResize);
  }, [currentIndex, maxIndex, getCenterPosition, isDragging, isAnimating]);

  // Reset to first card when items change
  useEffect(() => {
    if (currentIndex > maxIndex && maxIndex >= 0) {
      moveToIndex(0, 0.3);
    }
  }, [currentIndex, maxIndex, moveToIndex]);

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
          overflow: 'hidden' // Hide cut-off cards on smaller screens
        }}
      >
        {/* Side card visibility mask for equal spacing */}
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
        
        <div
          ref={carouselRef}
          className="absolute top-0 flex items-start"
          style={{
            cursor: isDragging ? 'grabbing' : 'grab',
            gap: `${cardGap}px`,
            willChange: 'transform',
            userSelect: 'none'
          }}
        >
          {items.map((item, index) => {
            // Calculate distance from current index for scaling
            const distance = Math.abs(index - currentIndex);
            const isActive = index === currentIndex;
            const isAdjacent = distance === 1;
            const isVisible = distance <= 2; // Show up to 2 cards away
            
            // Dynamic scaling and opacity based on position
            let scale = 1;
            let opacity = 1;
            let translateY = 0;
            let zIndex = 5;
            
            if (isActive) {
              scale = 1;
              opacity = 1;
              translateY = 0; // Active card stays at baseline
              zIndex = 20;
            } else if (isAdjacent) {
              scale = 0.85;
              opacity = 0.7;
              // Push down slightly to keep tops roughly aligned
              translateY = 5;
              zIndex = 15;
            } else if (isVisible) {
              scale = 0.75;
              opacity = 0.4;
              // Push down a bit more for smaller cards
              translateY = 8;
              zIndex = 10;
            } else {
              scale = 0.7;
              opacity = 0.2;
              // Push down slightly more for smallest cards
              translateY = 10;
              zIndex = 5;
            }

            // Handle card click to center it (only if not already active)
            const handleCardClick = (e: React.MouseEvent) => {
              // Only prevent centering if clicking on interactive elements
              const target = e.target as HTMLElement;
              const isInteractiveElement = target.closest('button') || 
                                          target.closest('[role="button"]') || 
                                          target.closest('a') ||
                                          target.closest('.cursor-pointer');
              
              if (!isInteractiveElement && !isActive && !isDragging) {
                e.preventDefault();
                e.stopPropagation();
                moveToIndex(index);
              }
            };

            return (
              <div 
                key={index} 
                className={`flex-shrink-0 transition-all duration-100 ease-out`}
                style={{ 
                  width: `${cardWidth}px`,
                  transform: `scale(${scale}) translateY(${translateY}px)`,
                  opacity,
                  zIndex,
                  transformOrigin: 'top center', // Scale from top to maintain top alignment
                  display: 'flex',
                  alignItems: 'flex-start', // Align to top
                  cursor: isActive ? 'default' : 'pointer'
                }}
                onClick={handleCardClick}
              >
                <div 
                  style={{ 
                    // FIXED: Always allow pointer events for interactive elements
                    pointerEvents: 'auto',
                    position: 'relative',
                    filter: isActive ? 'none' : 'brightness(0.8)',
                    transition: 'filter 0.2s ease', // Faster filter transition
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
              </div>
            );
          })}
          
          {/* Loading cards */}
          {loading && (
            <>
              {/* First loading card */}
              {(() => {
                const index = items.length;
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
                  translateY = 5; // Slight push down to keep tops aligned
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
                  <div 
                    className={`flex-shrink-0 transition-all duration-100 ease-out`}
                    style={{ 
                      width: `${cardWidth}px`,
                      transform: `scale(${scale}) translateY(${translateY}px)`,
                      opacity,
                      zIndex,
                      transformOrigin: 'top center', // Scale from top
                      display: 'flex',
                      alignItems: 'flex-start'
                    }}
                  >
                    <div style={{ 
                      position: 'relative',
                      filter: isActive ? 'none' : 'brightness(0.8)',
                      transition: 'filter 0.2s ease', // Faster filter transition
                      width: '100%',
                      height: '100%',
                      // Loading cards should not be clickable
                      pointerEvents: 'none'
                    }}>
                      <AppCardSkeleton />
                    </div>
                  </div>
                );
              })()}
              
              {/* Second loading card */}
              {(() => {
                const index = items.length + 1;
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
                  <div 
                    className={`flex-shrink-0 transition-all duration-100 ease-out`}
                    style={{ 
                      width: `${cardWidth}px`,
                      transform: `scale(${scale}) translateY(${translateY}px)`,
                      opacity,
                      zIndex,
                      transformOrigin: 'top center',
                      display: 'flex',
                      alignItems: 'flex-start'
                    }}
                  >
                    <div style={{ 
                      position: 'relative',
                      filter: isActive ? 'none' : 'brightness(0.8)',
                      transition: 'filter 0.2s ease', // Faster filter transition
                      width: '100%',
                      height: '100%',
                      // Loading cards should not be clickable
                      pointerEvents: 'none'
                    }}>
                      <AppCardSkeleton />
                    </div>
                  </div>
                );
              })()}
            </>
          )}
        </div>
      </div>
      
      {/* End message */}
      {!hasMore && items.length > 0 && currentIndex >= items.length - 1 && (
        <div className="text-center py-6 relative z-0">
          <p className="text-lg font-semibold text-white mb-2">
            You've reached the end!
          </p>
        </div>
      )}
    </div>
  );
};

export { GSAPMobileCarousel };