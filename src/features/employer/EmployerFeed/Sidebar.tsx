import { FC, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "components";
import { cn } from "lib/utils";
import { useAuth } from "contexts/AuthContext/AuthContext";
import { useGetJobListQuery } from "api";
import { usePerfectMatchContext } from "contexts/PerfectMatch/PerfectMatchContext";

interface Keyword {
  keyword: string;
  type: string;
  id: number;
}

interface Employer {
  businessName: string;
  firstName: string;
  lastName: string;
  country: string;
}

interface Job {
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
  employer: Employer;
  keywords: Keyword[];
}

const Sidebar: FC = () => {
  const location = useLocation();
  const [selectedJob, setSelectedJob] = useState<string>("");
  const isDashboard = location.pathname === "/dashboard";
  const perfectMatchContext = isDashboard ? usePerfectMatchContext() : null;
  const { updateMatchState, setJobList, isLoadingMatches } =
    perfectMatchContext || {};
  const hideOnPagesMobile = [
    "/dashboard/job-listing",
    "/dashboard/employer-profile",
  ];
  const hideOnPagesDesktop = ["/dashboard/employer-profile"];

  const { data, isLoading } = useGetJobListQuery({
    page: 1,
    limit: 10,
  });
  const jobs = data?.data?.jobs || [];

  const shouldShowMobileView = !hideOnPagesMobile.includes(location.pathname);
  const shouldShowDesktopView = !hideOnPagesDesktop.includes(location.pathname);

  useEffect(() => {
    if (isDashboard && data) {
      if (data.data.jobs.length > 0) {
        // Initialize the first job
        const firstJob = data.data.jobs[0];
        setSelectedJob(firstJob.id.toString());
        updateMatchState?.({ selectedJobId: firstJob.id });
        setJobList?.(data.data.jobs);
      }
    }
  }, [data]);

  useEffect(() => {
    const jobIdMatch = location.pathname.match(/\/dashboard\/job\/(\d+)/);
    if (jobIdMatch) {
      const currentJobId = parseInt(jobIdMatch[1]);
      const currentJob = jobs.find((job: Job) => job.id === currentJobId);
      if (currentJob) {
        setSelectedJob(currentJob.id.toString());
      }
    }
  }, [location.pathname, jobs]);

  const handleJobSelect = (jobId: string) => {
    const _jobId = Number(jobId);
    setSelectedJob(jobId);

    // Call updateMatchState with the selected job ID
    // The isLoadingMatches state will be managed by the PerfectMatchContext
    updateMatchState?.({ selectedJobId: _jobId });
  };

  const SelectComponent = () => {
    const { user } = useAuth();
    const isFirstJobListing = user?.data?.user?.jobCounts?.count === 0 && data?.data.jobs.length < 1;

    return (
      <div className="relative pt-4 w-full">
        <div className="relative">
          {!isFirstJobListing && (
            <Select
              value={selectedJob}
              onValueChange={handleJobSelect}
              disabled={isLoading || isLoadingMatches}
            >
              <SelectTrigger
                className={cn(
                  "bg-transparent border-[#AEADAD] text-[#F5F5F7] h-[56px] border-2 focus:border-[#F5722E]",
                  (isLoading || isLoadingMatches) &&
                    "opacity-60 cursor-not-allowed",
                )}
              >
                <SelectValue
                  placeholder={
                    isLoading
                      ? "Loading..."
                      : isLoadingMatches
                        ? "Updating perfect match..."
                        : "Select a job listing"
                  }
                  className="text-left pl-4"
                />
              </SelectTrigger>
              <SelectContent
                className="bg-[#F5F5F7] items-center p-0 [&>*]:px-0 border-none rounded-none"
                position="popper"
                sideOffset={4}
              >
                <SelectGroup>
                  {jobs.map((job: Job) => (
                    <SelectItem
                      key={job.id}
                      value={job.id.toString()}
                      className="rounded-none justify-start pl-3 h-[55px]"
                    >
                      <div className="py-3 w-full text-center">{job.title}</div>
                    </SelectItem>
                  ))}
                  {jobs.length === 0 && !isLoading && (
                    <div className="p-4 text-center text-gray-500">
                      No job listings found
                    </div>
                  )}
                </SelectGroup>
              </SelectContent>
            </Select>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      {shouldShowMobileView && (
        <div className="block md:hidden w-full px-4 mb-6">
          <div className="max-w-[311px] mx-auto">
            <SelectComponent />
          </div>
        </div>
      )}

      {shouldShowDesktopView && (
        <div className="hidden md:block w-[311px] h-[652px] bg-[#2D3A41] rounded py-6 px-3">
          <h4 className="font-semibold mb-4 text-center text-sm md:text-base text-white">
            All Job Listings
          </h4>
          <SelectComponent />
        </div>
      )}
    </>
  );
};

export { Sidebar };
