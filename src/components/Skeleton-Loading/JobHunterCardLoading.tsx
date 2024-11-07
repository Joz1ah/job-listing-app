import { FC } from "react";

import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
  CardTitle,
} from "components";
import { Skeleton } from "components";

const JobHunterCardLoading: FC = () => {
  return (
    <>
      <Card className="bg-white border-none w-full md:w-[436px] h-auto md:h-[275px]">
        <CardHeader className="flex flex-col justify-between items-start pb-0">
          <div className="flex flex-row -mt-4 justify-between w-full">
            <Skeleton className="h-[19px] w-14 bg-gray-300" />
            <div className="flex flex-col items-end">
              <div className="flex flex-col items-end -mr-2">
                <Skeleton className="h-[17px] w-24 bg-gray-300" />
              </div>
              <div className="absolute mt-5 -mr-2">
                <Skeleton className="h-[26px] w-[26px] bg-gray-300" />
              </div>
            </div>
          </div>
          <div className="w-full">
            <div className="flex flex-row justify-between items-start">
              <div>
                <CardTitle className="text-sm font-semibold">
                  <Skeleton className="h-[20px] w-48 bg-gray-300" />
                </CardTitle>
                <div className="mt-1">
                  <Skeleton className="h-[19px] w-32 bg-gray-300" />
                </div>
                <div className="flex flex-row items-center gap-1 mt-1">
                  <Skeleton className="h-[14px] w-[14px] bg-gray-300" />
                  <Skeleton className="h-[19px] w-32 bg-gray-300" />
                </div>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="h-[60px] mt-1">
            <Skeleton className="h-[19px] w-28 mb-1 bg-gray-300" />
            <div className="flex flex-wrap gap-1 max-h-[43px] overflow-hidden relative">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-[22px] w-16 bg-gray-300" />
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-1 mt-3">
            <div className="flex gap-2">
              <Skeleton className="h-[19px] w-20 bg-gray-300" />
              <Skeleton className="h-[18px] w-24 bg-gray-300" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-[19px] w-24 bg-gray-300" />
              <div className="flex gap-1">
                <Skeleton className="h-[18px] w-16 bg-gray-300" />
                <Skeleton className="h-[18px] w-16 bg-gray-300" />
              </div>
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-[19px] w-16 bg-gray-300" />
              <Skeleton className="h-[18px] w-24 bg-gray-300" />
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex flex-row justify-end -mt-3 -mr-4 space-x-1">
          <Skeleton className="h-3 w-3 bg-gray-300" />
        </CardFooter>
      </Card>
    </>
  );
};

export { JobHunterCardLoading };
