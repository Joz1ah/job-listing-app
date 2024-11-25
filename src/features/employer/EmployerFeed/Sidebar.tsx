import { FC } from "react";
import { useLocation } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Label
} from "components";
import { cn } from "lib/utils";

const Sidebar: FC = () => {
  const location = useLocation();
  const hideOnPagesMobile = [
    "/job-feed-employer/job-listing",
    "/job-feed-employer/employer-profile",
  ];
  const hideOnPagesDesktop = ["/job-feed-employer/employer-profile"];

  const shouldShowMobileView = !hideOnPagesMobile.includes(location.pathname);
  const shouldShowDesktopView = !hideOnPagesDesktop.includes(location.pathname);

  const jobListings = [
    { title: "Full Stack Developer", path: "#" },
    { title: "DevOps Engineer", path: "#" },
    { title: "Virtual Admin Assistant", path: "#" },
    { title: "Sr. Software Engineer", path: "#" },
    { title: "Jr. Shopify Developer", path: "#" },
    { title: "Mobile App Developer", path: "#" },
    { title: "Social Media Manager", path: "#" },
    { title: "Content Creator", path: "#" },
  ];

  const SelectComponent = () => (
    <div className="relative pt-4 w-full">
      <div className="relative">
        <div className="absolute -top-3 left-5 bg-[#242625] md:bg-[#2D3A41] px-1 z-20">
          <div className="flex items-center">
            <Label className="text-base font-normal text-white">
              All Job Listing
            </Label>
          </div>
        </div>
        <Select>
          <SelectTrigger 
            className="bg-transparent border-[#AEADAD] h-[56px] border-2 text-white"
          >
            <SelectValue 
              placeholder="Full Stack Developer"
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
                    "rounded-none justify-center pl-3 h-[55px]",
                  )}
                >
                  <div className="py-3 w-full text-center">{item.title}</div>
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile View */}
      {shouldShowMobileView && (
        <div className="block md:hidden">
          <div className="md:mt-16 flex flex-col gap-4 items-center justify-center">
            <div className="w-[336px]">
              <SelectComponent />
            </div>
          </div>
        </div>
      )}

      {/* Desktop View */}
      {shouldShowDesktopView && (
        <div className="hidden md:block">
          <div className="w-[311px] h-[652px] bg-[#2D3A41] rounded mb-12 mt-2 px-2 py-4">
            <h4 className="font-semibold mb-6 text-center pt-2 text-[16px] text-white">
              All Job Listings
            </h4>
            <div className="w-full">
              <SelectComponent />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export { Sidebar };
