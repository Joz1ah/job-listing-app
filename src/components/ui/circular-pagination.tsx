import { FC, useState, useEffect } from 'react';
import type { Swiper as SwiperType } from 'swiper';
import type { CarouselApi } from "components";

interface CircularPaginationProps {
  api: SwiperType | CarouselApi | null | undefined;
  color?: string;
}

type ApiType = SwiperType | CarouselApi;

const isSwiperInstance = (api: ApiType | null | undefined): api is SwiperType => {
  return api !== null && api !== undefined && 'slides' in api;
};

const isCarouselApi = (api: ApiType | null | undefined): api is CarouselApi => {
  return api !== null && api !== undefined && 'scrollTo' in api;
};

const CircularPagination: FC<CircularPaginationProps> = ({ api, color = "#F5722E" }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    if (!api) return;

    let cleanup: (() => void) | undefined;

    if (isSwiperInstance(api)) {
      const updateState = () => {
        setCurrentPage(api.realIndex);
        setTotalPages(api.slides.length);
      };

      updateState();
      api.on('slideChange', updateState);
      api.on('init', updateState);

      cleanup = () => {
        api.off('slideChange', updateState);
        api.off('init', updateState);
      };
    } else if (isCarouselApi(api)) {
      const onSelect = () => {
        setCurrentPage(api.selectedScrollSnap());
      };

      const onInit = () => {
        setTotalPages(api.scrollSnapList().length);
        setCurrentPage(api.selectedScrollSnap());
      };

      onInit();
      api.on("select", onSelect);
      api.on("init", onInit);
      api.on("reInit", onInit);

      cleanup = () => {
        api.off("select", onSelect);
        api.off("init", onInit);
        api.off("reInit", onInit);
      };
    }

    return () => {
      if (cleanup) {
        cleanup();
      }
    };
  }, [api]);

  const getDisplayedPages = () => {
    // Always return exactly 3 pages
    if (totalPages <= 3) {
      return Array.from({ length: totalPages }, (_, i) => i);
    }

    // If we're at the start
    if (currentPage === 0) {
      return [0, 1, 2];
    }

    // If we're at the end
    if (currentPage === totalPages - 1) {
      return [totalPages - 3, totalPages - 2, totalPages - 1];
    }

    // In the middle - show current page and one on each side
    return [currentPage - 1, currentPage, currentPage + 1];
  };

  const handleClick = (pageNum: number) => {
    if (!api) return;

    if (isSwiperInstance(api)) {
      api.slideTo(pageNum);
    } else if (isCarouselApi(api)) {
      api.scrollTo(pageNum);
    }
  };

  if (!api || totalPages <= 1) return null;

  return (
    <div className="flex items-center gap-2 justify-center mt-4">
      {getDisplayedPages().map((pageNum) => (
        <button
          key={pageNum}
          onClick={() => handleClick(pageNum)}
          className="flex items-center justify-center w-[7px] h-[7px] p-0 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
          aria-label={`Page ${pageNum + 1} of ${totalPages}`}
        >
          <div 
            className="w-full h-full rounded-full transition-all duration-200"
            style={{
              backgroundColor: pageNum === currentPage 
                ? color 
                : 'rgb(209 213 219)',
              transform: pageNum === currentPage ? 'scale(1.25)' : 'scale(1)'
            }}
          />
        </button>
      ))}
    </div>
  );
};

export { CircularPagination };