import { FC, useState, useEffect, useRef } from "react";
import { JobListingCard } from "./JobListingCard";
import { EditJobListingForm } from "../JobListingForm/EditJobListingForm";
import { InterviewCardSkeleton } from "components";
import { NavLink } from "react-router-dom";
import emptyBookmark from "images/bookmark-empty.svg?url";

import { useGetJobListQuery } from "api/akaza/akazaAPI";
import { useErrorModal } from "contexts/ErrorModalContext/ErrorModalContext";
import { ROUTE_CONSTANTS } from "constants/routeConstants";

// Define interfaces for API response structure
interface JobKeyword {
  keyword: string;
  type: string;
  id: number;
}

interface JobEmployer {
  businessName: string;
  firstName: string;
  lastName: string;
  country: string;
  industry: string;
}

interface ApiJob {
  id: number;
  employerId: number;
  title: string;
  priorityIndicator: string;
  description: string;
  location: string;
  employmentType: string;
  salaryRange: string;
  yearsOfExperience: string;
  expiresAt: string;
  isExpired: boolean;
  education: string;
  language: string;
  employer: JobEmployer;
  keywords: JobKeyword[];
}

interface ApiResponse {
  statusCode: number;
  message: string;
  data: {
    jobs: ApiJob[];
    pagination: {
      currentPage: string;
      nextPage: string | null;
      previousPage: string | null;
      lastPage: string;
      totalItems: number;
    };
  };
  success: boolean;
}

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
  language?: string | string[];
  isBookmarked?: boolean;
  description?: string;
}

const convertApiJobToCardFormat = (apiJob: ApiJob): JobListing => {
  // Extract core skills from keywords
  const coreSkills = apiJob.keywords
    .filter(kw => kw.type === "core")
    .map(kw => kw.keyword);

  // Format employment type as array
  const employmentTypeArray = apiJob.employmentType
    .split(',')
    .map(type => type.trim())
    .map(type => {
      // Convert to proper case format
      const formatted = type.toLowerCase().replace(/-/g, ' ');
      return formatted.charAt(0).toUpperCase() + formatted.slice(1);
    });

  // Calculate how long ago the job was posted
  const calculatePostedTime = (): string => {
    const creationDate = new Date(apiJob.expiresAt);
    creationDate.setMonth(creationDate.getMonth() - 1); // Assuming expiration is 1 month after posting
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - creationDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 1) return "today";
    if (diffDays === 1) return "1 day";
    if (diffDays < 7) return `${diffDays} days`;
    const diffWeeks = Math.floor(diffDays / 7);
    if (diffWeeks === 1) return "1 week";
    if (diffWeeks < 4) return `${diffWeeks} weeks`;
    const diffMonths = Math.floor(diffDays / 30);
    if (diffMonths === 1) return "1 month";
    return `${diffMonths} months`;
  };

  return {
    id: apiJob.id.toString(),
    title: apiJob.title,
    company: apiJob.employer.businessName,
    location: apiJob.location,
    isNew: calculatePostedTime() === "today" || calculatePostedTime() === "1 day",
    posted: calculatePostedTime(),
    requiredSkills: coreSkills.slice(0, 4), // Limit to 4 skills for display
    experienceLevel: apiJob.yearsOfExperience,
    employmentType: employmentTypeArray,
    salary: apiJob.salaryRange,
    language: apiJob.language,
    description: apiJob.description,
    isBookmarked: false // Default to false, update if you add bookmark functionality
  };
};

interface QueryParams {
  page: number;
  limit: number;
}

const JobListingsContent: FC = () => {
  const [displayedJobs, setDisplayedJobs] = useState<JobListing[]>([]);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [editingJobId, setEditingJobId] = useState<string | null>(null);
  const loaderRef = useRef<HTMLDivElement>(null);
  const { showError } = useErrorModal();

  // Replace limit with the number of items you want per page
  const { data: jobsData, isLoading, isFetching, error, refetch } = useGetJobListQuery<{
    data: ApiResponse | undefined;
    isLoading: boolean;
    isFetching: boolean;
    error: any;
  }>({ 
    page, 
    limit: 10 
  } as QueryParams);

  useEffect(() => {
    // Process jobs data when it comes in
    if (jobsData?.data?.jobs) {
      const formattedJobs = jobsData.data.jobs.map(convertApiJobToCardFormat);
      
      if (page === 1) {
        setDisplayedJobs(formattedJobs);
      } else {
        setDisplayedJobs(prev => [...prev, ...formattedJobs]);
      }
      
      // Check if there are more pages
      setHasMore(jobsData.data.pagination.nextPage !== null);
    }
  }, [jobsData, page]);

  const loadMore = (): void => {
    if (isFetching || !hasMore) return;
    setPage(prevPage => prevPage + 1);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && !isFetching && hasMore) {
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
      if (loaderRef.current && observer) {
        observer.unobserve(loaderRef.current);
      }
    };
  }, [isFetching, hasMore]);

  const handleDelete = (jobId: string): void => {
    // Implement your delete logic here
    setDisplayedJobs(prev => prev.filter(job => job.id !== jobId));
    console.log("Deleted:", jobId);
  };

  const handleEdit = (jobId: string): void => {
    setEditingJobId(jobId);
  };

  const handleCancelEdit = (): void => {
    setEditingJobId(null);
  };

  const handleEditSuccess = (): void => {
    // Refetch data after successful edit
    refetch();
    setEditingJobId(null);
  };

  // Show loading state
  if (isLoading && page === 1) {
    return (
      <div className="h-full w-full flex items-center justify-center p-4 sm:p-8">
        <div className="flex flex-col items-center justify-center text-center max-w-full">
          <div className="mb-6 w-48 h-48 sm:w-[249px] sm:h-[249px] bg-gray-700 rounded animate-pulse" />
          <div className="h-8 w-44 sm:w-56 bg-gray-700 rounded mb-4 animate-pulse" />
          <div className="h-5 w-64 sm:w-80 bg-gray-700 rounded mb-6 animate-pulse" />
          <div className="h-10 w-32 sm:w-36 bg-gray-700 rounded animate-pulse" />
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <div className="mb-6 text-red-500">
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M15 9L9 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M9 9L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h2 className="text-2xl font-normal mb-4 text-[#F5722E]">
            Error Loading Jobs
          </h2>
          <p className="text-white mb-6 text-[15px]">
            We couldn't load your job listings. Please try again later.
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-[#F5722E] text-white px-6 py-2 rounded-md hover:bg-orange-600 transition-colors"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  // If we're editing a job, show the edit form
  if (editingJobId) {
    const jobToEdit = jobsData?.data?.jobs?.find(job => job.id.toString() === editingJobId);
    
    if (!jobToEdit) {
      showError(
        "Error",
        "The job listing you're trying to edit could not be found."
      );
      setEditingJobId(null);
      return null;
    }
    
    // Convert the API job to the format expected by the edit form
    // Ensure skills type is correctly mapped to "core", "interpersonal", or "certification"
    const jobDetails = {
      id: jobToEdit.id.toString(),
      title: jobToEdit.title,
      employmentType: jobToEdit.employmentType,
      salaryRange: jobToEdit.salaryRange,
      yearsOfExperience: jobToEdit.yearsOfExperience,
      description: jobToEdit.description,
      priorityIndicator: jobToEdit.priorityIndicator,
      education: jobToEdit.education,
      location: jobToEdit.location,
      language: jobToEdit.language,
      skills: jobToEdit.keywords.map(k => {
        // Ensure type is one of the expected literal types
        let skillType: "core" | "interpersonal" | "certification" = "core";
        
        if (k.type === "core") {
          skillType = "core";
        } else if (k.type === "interpersonal") {
          skillType = "interpersonal";
        } else if (k.type === "certification") {
          skillType = "certification";
        }
        
        return {
          id: k.id,
          keyword: k.keyword,
          type: skillType
        };
      })
    };
    
    return (
      <EditJobListingForm 
        jobDetails={jobDetails} 
        onCancel={handleCancelEdit} 
        onSuccess={handleEditSuccess} 
      />
    );
  }

  // Show empty state if there are no jobs
  if (displayedJobs.length === 0 && !isLoading) {
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
            You haven't created any job listings yet.
          </p>
          <NavLink
            to={ROUTE_CONSTANTS.JOB_LISTING}
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
        {displayedJobs.map((job) => (
          <JobListingCard
            key={job.id}
            job={job}
            onDelete={handleDelete}
            onEdit={handleEdit}
          />
        ))}

        {isFetching && (
          <>
            {Array.from({ length: 2 }).map((_, index) => (
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
  return <JobListingsContent />;
};

export { JobListings };