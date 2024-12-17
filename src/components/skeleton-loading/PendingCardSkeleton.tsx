import { FC } from "react";
import { Skeleton } from "components";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "components";

const PendingCardSkeleton: FC = () => {
  return (
    <Card className="bg-white border-none w-full md:w-[436px] h-auto md:h-[275px]">
      <CardHeader className="flex flex-col justify-between items-start pb-0">
        <div className="flex flex-row -mt-4 justify-between w-full">
          <div className="h-[20px]">
            <Skeleton className="h-4 w-12" />
          </div>
          <div className="flex flex-col items-end">
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
        <div className="w-full relative mt-2">
          <div className="flex justify-between items-start">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-6 w-6 rounded-full" />
          </div>
          <Skeleton className="h-4 w-32 mt-2" />
          <div className="flex flex-row items-center mt-2">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-32 ml-2" />
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-1">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1">
            <Skeleton className="h-4 w-10" />
            <Skeleton className="h-4 w-24" />
          </div>
          <div className="flex items-center gap-1">
            <Skeleton className="h-4 w-10" />
            <Skeleton className="h-4 w-24" />
          </div>
          <div className="flex items-center gap-1">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-48" />
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex flex-row justify-center pt-2 space-x-6">
        <Skeleton className="h-8 w-[100px]" />
        <Skeleton className="h-8 w-[100px]" />
        <Skeleton className="h-8 w-[100px]" />
      </CardFooter>
    </Card>
  );
};

export { PendingCardSkeleton }