import { FC } from "react";
import { Button } from "components";
import sparkeIcon from "images/sparkle-icon.png";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "components";

import { Carousel, CarouselContent, CarouselItem } from "components";
import {
  MapPin,
  Bookmark,
  Star,
  DollarSign,
  BriefcaseBusiness,
} from "lucide-react";

const JobHunterSection: FC = () => {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="md:flex md:justify-between md:items-center mb-12">
        <h1 className="text-3xl md:text-3xl text-white font-normal">
          Welcome to your dashboard, Michael!
        </h1>
        <div className="flex items-center space-x-2 mt-2">
          <MapPin className="text-[#F5722E]" size={19} />
          <span className="text-[13px] font-light text-white">
            Metro Manila•
          </span>
          <span className="flex items-center text-[13px] font-light text-white">
            4.5
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className="text-[#F5722E] fill-current ml-1 mb-[2px]"
                size={16}
              />
            ))}
          </span>
          <span className="text-[13px] font-normal text-white">
            Employer Rating
          </span>
        </div>
        <div className="flex flex-col items-start mt-2 space-y-2">
          <div className="flex items-center space-x-2 text-[13px] font-light text-white">
            <DollarSign className="text-[#F5722E]" size={19} />
            <span>Expected Salary:</span>
            <span className="underline text-[#F5722E]">$95,000</span>
            <span className=" text-white px-2 py-1 rounded-[2px] text-[10px] outline outline-1 outline-white">
              per year
            </span>
          </div>
          <div className="flex items-center space-x-2 text-[13px] font-light text-white">
            <BriefcaseBusiness className="text-[#F5722E]" size={19} />
            <span>Employment Preference:</span>
            <span className=" text-[#F5722E] px-2 py-1 rounded-[2px] text-[10px] outline outline-1 outline-[#F5722E]">
              Full Time
            </span>
            <span className=" text-[#F5722E] px-2 py-1 rounded-[2px] text-[10px] outline outline-1 outline-[#F5722E]">
              Part Time
            </span>
          </div>
        </div>
      </div>

      <div className="w-full max-w-sm mx-auto relative">
        <Carousel
          opts={{
            align: "center",
            loop: true,
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

          <CarouselContent className="-ml-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <CarouselItem key={index} className="pl-4 basis-[320px]">
                <div className="relative">
                  <Card className="bg-[#F5F5F7] w-[308px] h-[380px] p-4 transition-all duration-300 hover:shadow-lg">
                    <CardHeader className="flex items-start p-0">
                      <div className="flex flex-col items-end justify-end w-full gap-2">
                        <span className="text-sm text-gray-600 font-light">
                          Posted 3 days ago
                        </span>
                        <Bookmark className="text-[#F5722E]" size={24} />
                      </div>
                      <div>
                        <CardTitle className="text-[17px]">
                          Solutions Architect
                        </CardTitle>
                        <CardDescription className="text-[13px] text-black underline">
                          Samsung Australia
                        </CardDescription>
                        <p className="text-[10px] text-[#F5722E] flex items-center mb-2">
                          <MapPin size={9} className="mr-1 text-[#F5722E]" />
                          Remote (Company based in Australia)
                        </p>
                      </div>
                      <div className="flex flex-wrap justify-start gap-2">
                        <span className="bg-white text-[#F5722E] px-2 py-1 rounded-[2px] text-[10px] outline outline-1 outline-[#F5722E]">
                          PHP 80,000 / month
                        </span>
                        <span className="bg-[#F5722E] text-white px-2 py-1 rounded-[2px] text-[10px]">
                          Full Time
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent className="p-0 mt-4">
                      <p className="text-[11px]">
                        The Mobile Application Developer develops and tests new
                        hybrid mobile applications using web technologies and
                        the Ionic framework to deliver high-quality application
                        experiences across multiple mobile platforms.
                      </p>
                    </CardContent>
                    <CardFooter className="flex flex-wrap gap-2 p-0 mt-4">
                      {[
                        "Angular",
                        "JavaScript",
                        "Flutter",
                        "React",
                        "HTML5",
                        "Golang",
                        "CSS",
                      ].map((skill) => (
                        <span
                          key={skill}
                          className={`px-1 py-0.5 text-[8px] rounded-[2px] font-semibold ${
                            Math.random() > 0.5
                              ? "bg-[#2194F3] text-white outline-none"
                              : "bg-transparent text-[#2194F3] outline outline-1 outline-[#2194F3]"
                          }`}
                        >
                          {skill}
                        </span>
                      ))}
                    </CardFooter>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>

      {/* Navigation Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 pb-6">
        <Button
          variant="outline"
          className="w-full bg-black text-white border-gray-700 hover:bg-gray-700"
        >
          SUGGESTED SKILLS
        </Button>
        <Button
          variant="outline"
          className="w-full bg-black text-white border-gray-700 hover:bg-gray-700"
        >
          YOUR INTERVIEWS
        </Button>
        <Button
          variant="outline"
          className="w-full bg-black text-white border-gray-700 hover:bg-gray-700"
        >
          RATE EMPLOYER
        </Button>
        <Button
          variant="outline"
          className="w-full bg-black text-white border-gray-700 hover:bg-gray-700"
        >
          <span className="text-orange-500 mr-2">◆</span>
          SUBSCRIBE TO MORE OPPORTUNITIES
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
            OTHER OPPORTUNITIES
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
                      <CardTitle className="text-[17px]">
                        Jr. App Developer
                      </CardTitle>
                      <div>
                        <CardDescription className="text-[13px] text-black underline">
                          OneTime Pay Digital Corporation
                        </CardDescription>
                        <p className="text-[10px] text-orange-500 flex items-center mb-2">
                          <MapPin size={16} className="mr-1 " /> Remote (Company
                          based in Philippines)
                        </p>
                      </div>
                    </CardHeader>
                    <CardContent className="flex flex-wrap gap-2">
                      {[
                        "Angular",
                        "JavaScript",
                        "Flutter",
                        "React",
                        "HTML5",
                        "Golang",
                        "CSS",
                      ].map((skill) => (
                        <span
                          key={skill}
                          className={`px-1 py-0.5 text-[8px] rounded-[2px] font-semibold ${
                            Math.random() > 0.5
                              ? "bg-[#2194F3] text-white outline-none"
                              : "bg-transparent text-[#2194F3] outline outline-1 outline-[#2194F3]"
                          }`}
                        >
                          {skill}
                        </span>
                      ))}
                    </CardContent>
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

export { JobHunterSection };
