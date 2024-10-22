import { FC } from "react";
import { Button } from "components";
import sparkeIcon from "images/sparkle-icon.png";
import { NavLink } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "components";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "components";
import { Carousel, CarouselContent, CarouselItem } from "components";
import { MapPin, Bookmark, User, Building, BadgeCheck, MoreVertical } from "lucide-react";

const EmployerSection: FC = () => {

  const navItems = [
    { name: 'BOOKMARKED APPLICATION CARDS', path: '#' },
    { name: 'INTERVIEWS', path: '#' },
    { name: 'BOOKMARKED APPLICATION CARDS', path: '#' },
    { name: 'REPORTS & ANALYTICS', path: '#' }
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="md:flex md:justify-between md:items-center">
        <div>
          <div className="flex flex-col items-start">
            <div className="flex items-center text-3xl md:text-3xl text-white font-normal">
              <span>ABC Incorporated</span>
              <BadgeCheck className="fill-[#F5722E] text-[#263238]" size={28} />
            </div>
          </div>
          <div className="flex flex-col items-start mt-2 space-y-2">
            <div className="flex items-center space-x-2 text-[11px] font-light text-white">
              <Building className="fill-[#D6D6D6] text-[#263238]" size={14} />
              <span className="text-[12px]">Germany, South Africa and China</span>
            </div>
            <div className="flex items-center space-x-2 text-[11px] font-light text-white">
              <User className="fill-[#D6D6D6]" size={14} />
              <span>You have 20 Team members</span>
            </div>
          </div>
        </div>

        <div className="mt-16 md:mt-0 flex flex-col sm:flex-row gap-4 items-center">
          <Select>
            <SelectTrigger className="flex justify-between items-center w-[336px] h-[42px] bg-white text-black rounded-md border-0 shadow-md text-[17px]">
              <span></span>
              <SelectValue placeholder="Filter by Job Listings" />
            </SelectTrigger>
            <SelectContent className="bg-white text-black rounded-md border-0 shadow-md w-[336px]">
              <SelectGroup>
                <SelectItem
                  className="flex justify-center text-[14px] px-0"
                  value="fulltime"
                >
                  All Job Listings
                </SelectItem>
                <SelectItem
                  className="flex justify-center text-[14px] px-0"
                  value="parttime"
                >
                  Most Recent Job Listing
                </SelectItem>
                <SelectItem
                  className="flex justify-center text-[14px] px-0"
                  value="contractual"
                >
                  Saved Job Listing
                </SelectItem>
                <SelectItem
                  className="flex justify-center text-[14px] px-0 "
                  value="saved"
                >
                  Sort Job Listing by Team Member
                </SelectItem>
                <SelectItem
                  className="flex justify-center text-[14px] px-0"
                  value="closed"
                >
                  Closed Listings
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="pt-4 pb-6">
        <Carousel
          opts={{
            align: "start",
          }}
          className="w-full"
        >
          <h3 className="flex justify-center items-center mt-2 gap-2 text-[17px] text-[#F5722E] text-center font-semibold pb-2">
            <img
              src={sparkeIcon}
              alt="Sparkle Icon"
              className="w-[22px] h-[24px]"
            />
            PERFECT MATCH
          </h3>

          <CarouselContent>
            {Array.from({ length: 5 }).map((_, index) => (
              <CarouselItem
                key={index}
                className="md:basis-1/2 lg:basis-1/3 xl:basis-1/4"
              >
                <div className="flex items-center justify-center">
                  <Card className="bg-[#F5F5F7] w-[300px] h-[380px] pr-4 relative">
                    <CardHeader className="flex items-start pb-3">
                      <div className="flex flex-col items-end justify-end w-full gap-2 ml-4">
                        <span className="text-sm text-gray-600 font-light">
                          Posted 3 days ago
                        </span>
                        <Bookmark className="text-[#F5722E] ml-2" size={24} />
                      </div>
                      <div>
                        <CardTitle className="text-[17px]">
                          Olivia Davis
                        </CardTitle>
                        <p className="text-[10px] text-[#F5722E] flex items-center ">
                          <MapPin size={9} className="mr-1 text-[#F5722E]" />{" "}
                          Located in London, United Kingdom
                        </p>
                        <p className="text-[10px] font-light pb-2">
                          expressed interest as you Data Analyst
                        </p>
                        <span className="text-[10px] font-light">
                          Primary Skills:
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        <span className="bg-[#168AAD] text-white px-2 py-1 rounded-[2px] text-[8px] font-semibold">
                          Data Visualization
                        </span>
                        <span className="bg-[#184E77] text-white px-2 py-1 rounded-[2px] text-[8px] font-semibold">
                          Tablue
                        </span>
                        <span className="bg-[#168AAD] text-white px-2 py-1 rounded-[2px] text-[8px] font-semibold">
                          Tablue
                        </span>
                        <span className="bg-[#184E77] text-white px-2 py-1 rounded-[2px] text-[8px] font-semibold">
                          Excel
                        </span>
                        <span className="bg-[#184E77] text-white px-2 py-1 rounded-[2px] text-[8px] font-semibold">
                          Statistical Analysis
                        </span>
                      </div>

                      <div className="flex flex-col gap-1">
                        <div className="flex gap-2">
                          <span className="text-[10px] font-light">
                            Experience: 1 - 3 Years
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <span className="text-[10px] font-light">
                            Language:
                          </span>
                          <span className="text-[#F5722E] rounded-[4px] text-[8px] px-1 h-[18px] flex justify-center items-center outline outline-1 outline-[#F5722E]">
                            English
                          </span>
                          <span className="text-[#F5722E] rounded-[4px] text-[8px] px-1 h-[18px] flex justify-center items-center outline outline-1 outline-[#F5722E]">
                            French
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <span className="text-[10px] font-light">
                            Language:
                          </span>
                          <span className="bg-[#F5722E] text-white rounded-[4px] text-[8px] px-1 h-[18px] flex justify-center items-center">
                            Full Time
                          </span>
                          <span className="bg-[#F5722E] text-white rounded-[4px] text-[8px] px-1 h-[18px] flex justify-center items-center">
                            Part Time
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <span className="text-[10px] font-light">
                            Language:
                          </span>
                          <span className="bg-[#F5722E] text-white rounded-[4px] text-[8px] px-1 flex justify-center items-center">
                            CAD $47.00
                          </span>
                          <span className="bg-[#F5722E] text-white rounded-[4px] text-[8px] px-1 h-[18px] flex justify-center items-center">
                            per hour
                          </span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-center">
                        <Button
                          variant="default"
                          className="bg-[#F5722E] text-[12px] font-semibold"
                        >
                          Schedule Interview
                        </Button>
                      </div>
                      <MoreVertical size={12} className="text-gray-700 cursor-pointer absolute bottom-2 right-2" />
                      
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          <div className="flex justify-center mt-4 space-x-2">
            {Array.from({ length: 3 }).map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full ${
                  index === 0 ? "bg-[#F5722E]" : "bg-gray-400"
                }`}
              />
            ))}
          </div>
        </Carousel>
      </div>

      {/*Navigations*/}
      <nav className="flex flex-col bg-black text-white w-full rounded-t-xl rounded-b-xl overflow-hidden py-2">
      {navItems.map((item, index) => (
        <div key={item.path}>
          <div className="w-full text-center">
            <NavLink
              to={item.path}
              className="hover:text-[#F5722E] py-4 inline-block"
            >
              {item.name}
            </NavLink>
          </div>
          {index < navItems.length - 1 && (
            <hr className="border-t border-white w-full my-0" />
          )}
        </div>
      ))}
    </nav>

      {/* Other Opportunities */}
      <div>
        <Carousel
          opts={{
            align: "start",
          }}
          className="w-full relative"
        >
          <h3 className="text-[17px] md:text-[17px] font-semibold text-gray-400 mb-4 text-center pb-4">
            OTHER APPLICATION CARDS
          </h3>

          <CarouselContent>
            {Array.from({ length: 5 }).map((_, index) => (
              <CarouselItem
                key={index}
                className="md:basis-1/2 lg:basis-1/3 xl:basis-1/4"
              >
                <div className="flex items-center justify-center">
                <Card className="bg-[#F5F5F7] w-[308px] h-[243px] pr-4 relative">
                    <CardHeader className="flex justify-between items-start">
                      <div className="flex flex-col items-end justify-end w-full gap-2 ml-4">
                        <span className="absolute top-7 left-6 text-[#F5722E] text-[10px] font-semibold">☆ NEW</span>
                        <span className="text-[11px] text-gray-600 font-light">
                          Posted 3 days ago
                        </span>
                        <Bookmark className="text-orange-500" size={24} />
                      </div>
                      <div>
                        <CardTitle className="text-[17px]">
                          Emma Johnson
                        </CardTitle>
                        <span className="text-[10px] text-[#F5722E] flex items-center">
                          <MapPin size={9} className="mr-1 text-[#F5722E]" />{" "}
                          Located in Perth, Australia
                        </span>
                        <p className="text-[10px] font-light">
                          expressed interest as your <span className="underline text-[#F5722E]">Mobile App Developer</span>
                        </p>
                        <span className="text-[10px] font-light">
                          Skilled in:
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        <span className="bg-[#3A86FF] text-white px-2 py-1 rounded-[2px] text-[8px] font-semibold">
                          Data Visualization
                        </span>
                        <span className="bg-[#3A0CA3] text-white px-2 py-1 rounded-[2px] text-[8px] font-semibold">
                          Tablue
                        </span>
                        <span className="bg-[#3A86FF] text-white px-2 py-1 rounded-[2px] text-[8px] font-semibold">
                          Tablue
                        </span>
                        <span className="bg-[#3A0CA3] text-white px-2 py-1 rounded-[2px] text-[8px] font-semibold">
                          Excel
                        </span>
                        <span className="bg-[#3A0CA3] text-white px-2 py-1 rounded-[2px] text-[8px] font-semibold">
                          Statistical Analysis
                        </span>
                      </div>
                    </CardHeader>
                    
                    <MoreVertical size={12} className="text-gray-700 cursor-pointer absolute bottom-2 right-2" />
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="flex justify-center mt-4 space-x-2">
            {Array.from({ length: 3 }).map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full ${
                  index === 0 ? "bg-[#F5722E]" : "bg-gray-400"
                }`}
              />
            ))}
          </div>
        </Carousel>
      </div>
    </div>
  );
};

export { EmployerSection };
