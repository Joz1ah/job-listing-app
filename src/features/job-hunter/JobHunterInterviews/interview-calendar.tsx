import { FC } from "react";
import { NavLink } from "react-router-dom";
import emptyCalendar from 'images/calendar-empty.svg?url'

const InterviewCalendar: FC = () => {
    return (
        <div className="h-full w-full flex items-center justify-center">
            <div className="flex flex-col items-center justify-center p-8 text-center">
                <div className="mb-6">
                    <img 
                        src={emptyCalendar}
                        alt="Empty Calendar" 
                    />
                </div>
                
                <h2 className="text-[26px] font-normal mb-4 text-orange-500">
                    No Interviews Scheduled
                </h2>
                
                <p className="text-white mb-6">
                    You haven't scheduled any interviews yet. Explore your
                    <br />
                    <span className="text-orange-500 font-medium mx-1">
                        PERFECT MATCH
                    </span>
                    to connect & fill your job listing seamlessly.
                    <br />
                </p>
                
                <NavLink 
                    to="/job-hunter/feed"
                    className="bg-orange-500 text-white px-6 py-2 rounded-md hover:bg-orange-600 transition-colors"
                >
                    Go To Job Feed
                </NavLink>
            </div>
        </div>
    );
};

export { InterviewCalendar };