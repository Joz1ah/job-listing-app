import { FC } from "react";
import { Button } from "components";
import {
  Card,
  CardContent,
  CardFooter,
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
import { MapPin, Bookmark, User, Building, BadgeCheck } from "lucide-react";

const EmployerSection: FC = () => {
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
              <span>Germany, South Africa and China</span>
            </div>
            <div className="flex items-center space-x-2 text-[11px] font-light text-white">
              <User className="fill-[#D6D6D6]" size={14} />
              <span>You have 20 Team members</span>
            </div>
          </div>
        </div>

        <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-4 items-center">
          <Select>
            <SelectTrigger className="flex justify-between items-center w-[336px] h-[42px] sm:w-[200px] bg-white text-black rounded-md border-0 shadow-md text-[17px]">
              <span></span>
              <SelectValue placeholder="Filter by Job Listings" />
            </SelectTrigger>
            <SelectContent className="bg-white text-black rounded-md border-0 shadow-md">
              <SelectGroup>
                <SelectItem
                  className="flex justify-center items-center text-[17px] pr-10"
                  value="fulltime"
                >
                  All Job Listings
                </SelectItem>
                <SelectItem
                  className="flex justify-center items-center text-[17px] pr-10"
                  value="parttime"
                >
                  Most Recent Job Listing
                </SelectItem>
                <SelectItem
                  className="flex justify-center items-center text-[17px] pr-10"
                  value="contractual"
                >
                  Saved Job Listing
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
          <h3 className="text-[17px] md:text-[17px] text-[#F5722E] text-center font-semibold pb-2">
            ◆ PERFECT MATCH
          </h3>

          <CarouselContent>
            {Array.from({ length: 5 }).map((_, index) => (
              <CarouselItem
                key={index}
                className="md:basis-1/2 lg:basis-1/3 xl:basis-1/4"
              >
                <div className="flex items-center justify-center">
                  <Card className="bg-[#F5F5F7] w-[308px] h-[380px] pl-4 pr-4">
                    <CardHeader className="flex items-start">
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
                        <p className="text-[10px] font-light">
                          expressed interest as you Data Analyst
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
                    </CardContent>
                    <CardFooter></CardFooter>
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

      {/* Navigation Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 pb-6">
        <Button
          variant="outline"
          className="w-full bg-black text-white border-gray-700 hover:bg-gray-700"
        >
          VIEW SHORTED CANDIDATES
        </Button>
        <Button
          variant="outline"
          className="w-full bg-black text-white border-gray-700 hover:bg-gray-700"
        >
          SCHEDULED INTERVIEWS
        </Button>
        <Button
          variant="outline"
          className="w-full bg-black text-white border-gray-700 hover:bg-gray-700"
        >
          BOOKMARKED APPLICATION CARDS
        </Button>
        <Button
          variant="outline"
          className="w-full bg-black text-white border-gray-700 hover:bg-gray-700"
        >
          JOB LISTING PERFORMANCE
        </Button>
        <Button
          variant="outline"
          className="w-full bg-black text-white border-gray-700 hover:bg-gray-700"
        >
          <span className="text-orange-500 mr-2">◆</span>
          AKAZA ACADEMY COMING SOON
        </Button>
      </div>

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
                  <Card className="bg-[#F5F5F7] w-[308px] h-[243px] pl-4 pr-4">
                    <CardHeader className="flex justify-between items-start">
                      <div className="flex flex-col items-end justify-end w-full gap-2 ml-4">
                        <span className="text-[11px] text-gray-600 font-light">
                          Posted 3 days ago
                        </span>
                        <Bookmark className="text-orange-500" size={24} />
                      </div>
                      <div>
                        <CardTitle className="text-[17px]">
                          Olivia Davis
                        </CardTitle>
                        <p className="text-[10px] text-[#F5722E] flex items-center ">
                          <MapPin size={9} className="mr-1 text-[#F5722E]" />{" "}
                          Located in London, United Kingdom
                        </p>
                        <p className="text-[10px] font-light">
                          expressed interest as you Data Analyst
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
                    <CardContent></CardContent>
                    <CardFooter></CardFooter>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </div>
  );
};

export { EmployerSection };
