import { FC } from "react";
import { NavLink, useLocation } from "react-router-dom";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from 'components';

const Sidebar: FC = () => {
  const location = useLocation();
  const hideOnPagesMobile = ['/job-feed-employer/job-creation', '/job-feed-employer/company-profile']; // Add any paths where you want to hide the mobile view
  const hideOnPagesDesktop = ['/job-feed-employer/company-profile']; // Add any paths where you want to hide the desktop view
  
  const shouldShowMobileView = !hideOnPagesMobile.includes(location.pathname);
  const shouldShowDesktopView = !hideOnPagesDesktop.includes(location.pathname);

  const jobListings = [
    { title: "Project Manager", path: "#" },
    { title: "DevOps Engineer", path: "#" },
    { title: "Virtual Admin Assistant", path: "#" },
    { title: "Sr. Software Engineer", path: "#" },
    { title: "Jr. Shopify Developer", path: "#" },
    { title: "Mobile App Developer", path: "#" },
    { title: "Social Media Manager", path: "#" },
    { title: "Content Creator", path: "#" },
  ];

  return (
    <>
      {/* Mobile View */}
      {shouldShowMobileView && (
        <div className="block md:hidden">
          <div className="mt-16 flex flex-col gap-4 items-center justify-center">
            <Select>
              <SelectTrigger className="flex justify-between items-center w-[336px] h-[42px] bg-white text-black rounded-md border-0 shadow-md text-[17px] border-none">
                <span></span>
                <SelectValue placeholder="Filter by Job Listings" />
              </SelectTrigger>
              <SelectContent className="bg-white p-0 [&>*]:p-0 w-[336px]">
                <SelectGroup>
                  <SelectItem
                    className="focus:bg-orange-500 focus:text-white border-b border-black last:border-b-0 rounded-none justify-center p-0"
                    value="fulltime"
                  >
                    <div className="py-3 w-full text-center">
                      All Job Listings
                    </div>
                  </SelectItem>
                  <SelectItem
                    className="focus:bg-orange-500 focus:text-white border-b border-black last:border-b-0 rounded-none justify-center p-0"
                    value="parttime"
                  >
                    <div className="py-3 w-full text-center">
                      Most Recent Job Listing
                    </div>
                  </SelectItem>
                  <SelectItem
                    className="focus:bg-orange-500 focus:text-white border-b border-black last:border-b-0 rounded-none justify-center p-0"
                    value="contractual"
                  >
                    <div className="py-3 w-full text-center">
                      Saved Job Listing
                    </div>
                  </SelectItem>
                  <SelectItem
                    className="focus:bg-orange-500 focus:text-white border-b border-black last:border-b-0 rounded-none justify-center p-0"
                    value="saved"
                  >
                    <div className="py-3 w-full text-center">
                      Sort Job Listing by Team Member
                    </div>
                  </SelectItem>
                  <SelectItem
                    className="focus:bg-orange-500 focus:text-white border-b border-black last:border-b-0 rounded-none justify-center p-0"
                    value="closed"
                  >
                    <div className="py-3 w-full text-center">Closed Listings</div>
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {/* Desktop View */}
      {shouldShowDesktopView && (
      <div className="hidden md:block">
        <div className="w-[311px] h-[652px] bg-[#2D3A41] rounded mb-12 mt-2">
          <h4 className="font-semibold mb-6 text-center pt-2 text-[16px] text-white">
            All Job Listings
          </h4>
          <nav className="flex flex-col text-white w-full h-full overflow-y-auto pt-12">
            {jobListings.map((item, index) => (
              <div key={item.path}>
                <div className="w-full text-center">
                  <NavLink
                    to={item.path}
                    className="hover:text-[#F5722E] py-4 inline-block text-sm"
                  >
                    {item.title}
                  </NavLink>
                </div>
                {index < jobListings.length && (
                  <div className="flex justify-center w-full">
                    <hr className="border-t border-white w-full" />
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>
      </div>
      )}
    </>
  );
};

export { Sidebar };