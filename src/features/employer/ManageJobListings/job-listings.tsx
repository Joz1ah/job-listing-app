import { FC, useState, useEffect, useRef } from "react";
import { JobListingCard } from "./JobListingCard";
import { InterviewCardSkeleton } from "components";
import { NavLink } from "react-router-dom";
import emptyBookmark from "images/bookmark-empty.svg?url";
import { useEmployerContext } from "components";

interface JobListing {
  id: string;
  title: string;
  company: string;
  location: string;
  isNew: boolean;
  posted: string;
  requiredSkills: string[];
  experienceLevel: string;
  employmentType: string[];
  salary: string;
  isBookmarked?: boolean;
}

// Example mock data - replace with your actual data
const mockJobListings: JobListing[] = [
  /* {
    id: "1",
    title: "Senior Frontend Developer",
    company: "Tech Corp",
    location: "United Kingdom",
    isNew: true,
    posted: "1 day",
    requiredSkills: ["React", "TypeScript", "GraphQL", "Tailwind CSS"],
    experienceLevel: "5+ years",
    employmentType: ["Full Time", "Remote"],
    salary: "$120k - $150k",
    isBookmarked: false
  },
  {
    id: "2",
    title: "Full Stack Engineer",
    company: "Innovation Labs",
    location: "Germany",
    isNew: true,
    posted: "2 days",
    requiredSkills: ["Node.js", "React", "PostgreSQL", "Docker"],
    experienceLevel: "3+ years",
    employmentType: ["Full Time"],
    salary: "$90k - $120k",
    isBookmarked: false
  } */
];

const JobListingsContent: FC = () => {
  const [displayedJobs, setDisplayedJobs] = useState<JobListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef<HTMLDivElement>(null);
  const [initialLoad, setInitialLoad] = useState(true);
  const { subscriptionPlan } = useEmployerContext();

  const loadMore = async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const currentCount = displayedJobs.length;
    const remainingJobs = mockJobListings.length - currentCount;

    if (remainingJobs <= 0) {
      setHasMore(false);
      setLoading(false);
      return;
    }

    const jobsToLoad = Math.min(2, remainingJobs);
    const newJobs = mockJobListings.slice(
      currentCount,
      currentCount + jobsToLoad,
    );
    setDisplayedJobs((prev) => [...prev, ...newJobs]);

    if (currentCount + jobsToLoad >= mockJobListings.length) {
      setHasMore(false);
    }

    setLoading(false);
  };

  useEffect(() => {
    const loadInitialJobs = async () => {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const initialJobs = mockJobListings.slice(0, 6);
      setDisplayedJobs(initialJobs);
      setHasMore(mockJobListings.length > 6);
      setLoading(false);
      setInitialLoad(false);
    };

    loadInitialJobs();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && !loading && hasMore && !initialLoad) {
          loadMore();
        }
      },
      {
        threshold: 0.1,
        rootMargin: "20px",
      },
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current);
      }
    };
  }, [loading, hasMore, initialLoad]);

  const showLoadingCards = loading;
  const loadingCardsCount = Math.min(6, mockJobListings.length);

  // Show empty state if there are no jobs and we're not loading
  if (loading) {
    return (
      <div className="h-full w-full flex items-center justify-center p-4 sm:p-8">
        <div className="flex flex-col items-center justify-center text-center max-w-full">
          {/* Skeleton for image - responsive width */}
          <div className="mb-6 w-48 h-48 sm:w-[249px] sm:h-[249px] bg-gray-700 rounded animate-pulse" />

          {/* Skeleton for title - responsive width */}
          <div className="h-8 w-44 sm:w-56 bg-gray-700 rounded mb-4 animate-pulse" />

          {/* Skeleton for description - responsive width */}
          <div className="h-5 w-64 sm:w-80 bg-gray-700 rounded mb-6 animate-pulse" />

          {/* Skeleton for button - responsive width */}
          <div className="h-10 w-32 sm:w-36 bg-gray-700 rounded animate-pulse" />
        </div>
      </div>
    );
  }

  // Show empty state if there are no jobs or on free trial
  if (displayedJobs.length === 0 || subscriptionPlan === "freeTrial") {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <div className="mb-6">
            <img src={emptyBookmark} alt="No Jobs Available" />
          </div>

          <h2 className="text-2xl font-normal mb-4 text-[#F5722E]">
            No Jobs Available
          </h2>

          <p className="text-white mb-6 text-[15px]">
            We couldn't find any job listings matching your criteria.
          </p>

          <NavLink
            to="/dashboard/job-listing"
            className="bg-[#F5722E] text-white px-6 py-2 rounded-md hover:bg-orange-600 transition-colors"
          >
            Create Job Listings
          </NavLink>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center w-full">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-y-6 gap-x-14 justify-items-center w-full">
        {!initialLoad &&
          displayedJobs.map((job) => (
            <JobListingCard
              key={job.id}
              job={job}
              onBookmark={(jobId) => console.log("Bookmarked:", jobId)}
              onApply={(jobId) => console.log("Applied:", jobId)}
              subscriptionPlan={subscriptionPlan}
            />
          ))}

        {showLoadingCards && (
          <>
            {Array.from({ length: loadingCardsCount }).map((_, index) => (
              <InterviewCardSkeleton key={`skeleton-${index}`} />
            ))}
          </>
        )}
        <div ref={loaderRef} className="h-px w-px" />
      </div>
    </div>
  );
};

// Wrap the content with any necessary providers
const JobListings: FC = () => {
  //const { subscriptionPlan } = useEmployerContext();

  return <JobListingsContent />;
};

export { JobListings };
