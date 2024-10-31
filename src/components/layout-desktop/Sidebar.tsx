import { FC } from "react";
import { NavLink } from "react-router-dom";

const Sidebar : FC = () => {

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

        <div className="w-full md:w-[311px] h-auto md:h-[652px] bg-[#2D3A41] rounded mb-12 md:mb-12 mt-2">
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

    )
}

export { Sidebar }