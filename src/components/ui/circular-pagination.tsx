import { FC, useState, useEffect } from 'react';
import type { CarouselApi } from "components";

interface CircularPaginationProps {
  api: CarouselApi | null;
  color?: string;
}

const CircularPagination: FC<CircularPaginationProps> = ({ api, color = "#F5722E" }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (!api) return;

    const onSelect = () => {
      setCurrentPage(api.selectedScrollSnap() + 1);
    };

    setTotalPages(api.scrollSnapList().length);
    setCurrentPage(api.selectedScrollSnap() + 1);

    api.on("select", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  const getDisplayedPages = () => {
    if (totalPages <= 3) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (currentPage === 1) {
      return [1, 2, 3];
    }

    if (currentPage === totalPages) {
      return [totalPages - 2, totalPages - 1, totalPages];
    }

    return [currentPage - 1, currentPage, currentPage + 1];
  };

  const displayedPages = getDisplayedPages();

  return (
    <div className="flex items-center gap-2 justify-center mt-4">
      {displayedPages.map((pageNum) => (
        <button
          key={pageNum}
          onClick={() => api?.scrollTo(pageNum - 1)}
          className={`flex items-center justify-center p-0 focus:outline-none focus:ring-2 focus:ring-offset-2`}
          style={{ '--ring-color': color } as React.CSSProperties}
          aria-label={`Page ${pageNum} of ${totalPages}`}
        >
          <div 
            className={`w-[7px] h-[7px] rounded-full transition-all duration-200`}
            style={{
              backgroundColor: pageNum === currentPage 
                ? color 
                : pageNum <= totalPages 
                  ? 'rgb(209 213 219)' 
                  : 'rgb(229 231 235)',
              transform: pageNum === currentPage ? 'scale(1.25)' : 'scale(1)'
            }}
          />
        </button>
      ))}
    </div>
  );
};

export { CircularPagination }