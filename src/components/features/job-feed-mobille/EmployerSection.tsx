import { FC } from "react";
import { Button } from "components";
import sparkeIcon from "images/sparkle-icon.png";

import { Card, CardContent, CardHeader, CardTitle } from "components";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "components";
import { Carousel, CarouselContent, CarouselItem } from "components";
import {
  MapPin,
  Bookmark,
  User,
  Building,
  BadgeCheck,
  MoreVertical,
} from "lucide-react";

const EmployerSection: FC = () => {
  const perfectMatchData = Array.from({ length: 5 }).map(() => ({
    name: "Olivia Davis",
    location: "Located in London, United Kingdom",
    postedAgo: "3 days ago",
    skills: [
      { name: "Data Visualization", required: true },
      { name: "Tablue", required: false },
      { name: "Excel", required: false },
      { name: "Statistical Analysis", required: false },
    ],
    languages: ["English", "French"],
    workTypes: ["Full Time", "Part Time"],
    salary: "CAD $47.00",
  }));

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
              <span className="text-[12px]">
                Germany, South Africa and China
              </span>
            </div>
            <div className="flex items-center space-x-2 text-[11px] font-light text-white">
              <User className="fill-[#D6D6D6]" size={14} />
              <span>You have 20 Team members</span>
            </div>
          </div>
        </div>

        <div className="mt-16 md:mt-0 flex flex-col sm:flex-row gap-4 items-center justify-center">
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

      <Carousel
        opts={{
          align: "center",
          loop: false,
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
          {perfectMatchData.map((match, index) => (
            <CarouselItem key={index} className="pl-4 basis-[320px]">
              <div className="relative">
                <Card className="bg-[#F5F5F7] w-[300px] h-[380px] p-4 transition-all duration-300 hover:shadow-lg">
                  <CardHeader className="flex items-start p-0 relative">
                    <div className="w-full">
                      <div className="flex flex-col items-end justify-end">
                        <div className="flex-1">
                          <span className="text-[11px] text-gray-600 font-light">
                            Applied {match.postedAgo}
                          </span>
                        </div>
                        <div className="absolute top-7">
                          <Bookmark className="text-[#F5722E]" size={25} />
                        </div>
                      </div>

                      <div className="pt-2 pl-2">
                        <CardTitle className="text-[17px]">
                          {match.name}
                        </CardTitle>
                        <p className="text-[10px] text-[#F5722E] flex items-center mb-2">
                          <MapPin size={9} className="mr-1 text-[#F5722E]" />
                          {match.location}
                        </p>
                        <p className="text-[10px] font-light pb-2">
                          expressed interest as you Data Analyst
                        </p>

                        <div className="flex flex-col gap-2">
                          <div>
                            <span className="text-[10px] font-light">
                              Primary Skills:
                            </span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {match.skills.map((skill, skillIndex) => (
                                <span
                                  key={skillIndex}
                                  className={`px-2 py-1 text-[8px] rounded-[2px] font-semibold ${
                                    skill.required
                                      ? "bg-[#168AAD] text-white"
                                      : "bg-[#184E77] text-white"
                                  }`}
                                >
                                  {skill.name}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <span className="text-[10px] font-light">
                              Experience: 1 - 3 Years
                            </span>
                          </div>

                          <div className="flex gap-2">
                            <span className="text-[10px] font-light">
                              Language:
                            </span>
                            {match.languages.map((lang, langIndex) => (
                              <span
                                key={langIndex}
                                className="text-[#F5722E] rounded-[4px] text-[8px] px-1 h-[18px] flex justify-center items-center outline outline-1 outline-[#F5722E]"
                              >
                                {lang}
                              </span>
                            ))}
                          </div>

                          <div className="flex gap-2">
                            <span className="text-[10px] font-light">
                              Work Type:
                            </span>
                            {match.workTypes.map((type, typeIndex) => (
                              <span
                                key={typeIndex}
                                className="bg-[#F5722E] text-white rounded-[4px] text-[8px] px-1 h-[18px] flex justify-center items-center"
                              >
                                {type}
                              </span>
                            ))}
                          </div>

                          <div className="flex gap-2">
                            <span className="text-[10px] font-light">
                              Salary:
                            </span>
                            <span className="bg-[#F5722E] text-white rounded-[4px] text-[8px] px-1 flex justify-center items-center">
                              {match.salary}
                            </span>
                            <span className="bg-[#F5722E] text-white rounded-[4px] text-[8px] px-1 h-[18px] flex justify-center items-center">
                              per hour
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="flex flex-col items-center mt-4">
                    <Button
                      variant="default"
                      className="bg-[#F5722E] text-[12px] font-semibold"
                    >
                      Schedule Interview
                    </Button>
                    <MoreVertical
                      size={12}
                      className="text-gray-700 cursor-pointer absolute bottom-2 right-2"
                    />
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        <div className="flex justify-center mt-4 space-x-2">
          {perfectMatchData.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full ${
                index === 0 ? "bg-[#F5722E]" : "bg-gray-400"
              }`}
            />
          ))}
        </div>
      </Carousel>

      {/* Other Opportunities */}
      <div className="pt-4">
        <Carousel
          opts={{
            align: "start",
          }}
          className="w-full relative"
        >
          <h3 className="text-[17px] md:text-[17px] font-semibold text-gray-400 mb-4 text-center">
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
                        <span className="absolute top-7 left-6 text-[#F5722E] text-[10px] font-semibold">
                          ☆ NEW
                        </span>
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
                          expressed interest as your{" "}
                          <span className="underline text-[#F5722E]">
                            Mobile App Developer
                          </span>
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

                    <MoreVertical
                      size={12}
                      className="text-gray-700 cursor-pointer absolute bottom-2 right-2"
                    />
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
