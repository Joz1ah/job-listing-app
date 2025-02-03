import { FC } from "react";
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
import { useEmployerContext } from "components";

const Sidebar: FC = () => {
  const location = useLocation();
  const hideOnPagesMobile = [
    "/dashboard/job-listing",
    "/dashboard/employer-profile",
  ];
  const hideOnPagesDesktop = ["/dashboard/employer-profile"];
  const { subscriptionPlan } = useEmployerContext();
  
  const shouldShowMobileView = !hideOnPagesMobile.includes(location.pathname);
  const shouldShowDesktopView = !hideOnPagesDesktop.includes(location.pathname);

  const jobListings: { title: string; path: string }[] = [];

  const SelectComponent = () => {
    const { user } = useAuth();
    const isFirstJobListing = user?.data?.user?.jobCounts?.count === 0;
    const isFreeTrial = subscriptionPlan === 'freeTrial';
    
    return (
      <div className="relative pt-4 w-full">
        <div className="relative">
          {!isFirstJobListing && (
            <Select disabled={isFreeTrial}>
              <SelectTrigger 
                className={cn(
                  "bg-transparent border-[#AEADAD] h-[56px] border-2 text-white text-sm md:text-base",
                  isFreeTrial && "opacity-50 cursor-not-allowed"
                )}
              >
                <SelectValue
                  placeholder="Select Job Title"
                  className="text-left pl-4"
                />
              </SelectTrigger>
              <SelectContent
                className="bg-[#F5F5F7] p-0 [&>*]:p-0 border-none rounded-none"
                position="popper"
                sideOffset={4}
              >
                <SelectGroup>
                  {jobListings.map((item) => (
                    <SelectItem
                      key={item.title}
                      value={item.title.toLowerCase().replace(/\s+/g, '-')}
                      className={cn(
                        "rounded-none justify-center pl-3 h-[55px] text-sm md:text-base"
                      )}
                    >
                      <div className="py-3 w-full text-center">{item.title}</div>
                    </SelectItem>
                  ))}
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
      {/* Mobile View */}
      {shouldShowMobileView && (
        <div className="block md:hidden w-full px-4 mb-6">
          <div className="max-w-[311px] mx-auto">
            <SelectComponent />
          </div>
        </div>
      )}

      {/* Desktop View */}
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