import { FC } from "react";
import { Skeleton } from "components";
import { Card, CardHeader, CardContent, CardFooter } from "components";

const InterviewCardSkeleton: FC = () => {
  return (
    <Card className="bg-white border-none w-full md:w-[436px] h-auto md:h-[275px] relative">
      <CardHeader className="flex flex-col justify-between items-start pb-0">
        <div className="flex flex-row -mt-4 justify-between w-full">
          <div className="h-[20px]">
            <Skeleton className="h-4 w-12" />
          </div>
          <div className="flex flex-col items-end relative">
            <Skeleton className="h-3 w-24" />
            <div className="absolute top-6 -right-2">
              <Skeleton className="h-6 w-6" />
            </div>
          </div>
        </div>
        <div className="w-full relative mt-2">
          <Skeleton className="h-4 w-3/4 mb-2" />
          <Skeleton className="h-4 w-1/2 mb-2" />
          <div className="flex flex-row items-center">
            <Skeleton className="h-4 w-4 mr-2" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-1">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1">
            <Skeleton className="h-4 w-[40px]" />
            <Skeleton className="h-4 w-[135px] rounded-[2px]" />
          </div>
          <div className="flex items-center gap-1">
            <Skeleton className="h-4 w-[40px]" />
            <Skeleton className="h-4 w-[135px] rounded-[2px]" />
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex flex-col items-start space-y-4">
        <div className="flex flex-row justify-start space-x-6 w-full">
          <div className="flex items-center gap-1">
            <Skeleton className="h-8 w-[118px] rounded-sm" />
            <Skeleton className="h-3 w-3" />
          </div>
          <Skeleton className="h-8 w-[108px] rounded-sm" />
        </div>
        <div className="flex flex-row justify-start w-full items-center">
          <div className="flex items-center gap-1">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export { InterviewCardSkeleton };