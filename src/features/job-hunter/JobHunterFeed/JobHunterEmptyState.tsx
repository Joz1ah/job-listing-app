import React from 'react';
import { Button } from 'components';
import { NavLink } from 'react-router-dom';
import  emptyStateFeed  from 'images/empty-state-feed.svg?url';
import  sparkleIcon  from 'images/sparkle-icon.png';

interface EmptyStateProps {
  onExploreClick?: () => void;
}

const PerfectMatchEmptyState: React.FC<EmptyStateProps> = ({ /* onExploreClick  */}) => (
  <div className="w-full flex flex-col items-center justify-center py-16 px-4">
    <div className="relative mb-6">
      <img src={emptyStateFeed} alt="Empty state" />
    </div>
    
    <div className="text-center max-w-md">
      <h3 className="text-[26px] font-normal text-white mb-8">
        No{" "}
        <span className="text-[#F5722E] inline-flex items-center p-2">
          <img src={sparkleIcon} alt="Sparkle" className="w-4 h-4 mr-1"/>
          Perfect Match{" "}
        </span>{" "}
        just yet, but we're still on the lookout!
      </h3>
      
      <p className="text-white mb-6 text-[15px]">
        Stay on top of your game by updating your skills, languages, and certifications as the need arises.
      </p>

      <div className="space-y-4">
        <NavLink to="/dashboard/edit-application">
          <Button className="bg-[#F5722E] hover:bg-[#F5722E]/90 text-lg font-semibold rounded-sm items-center p-0 w-[250px] h-[50px]">
            Update Application Card
          </Button>
        </NavLink>
        
        {/* <Button 
          variant="link" 
          onClick={onExploreClick}
          className="text-[#F5722E] hover:text-orange-400 underline font-light w-full"
        >
          Explore Other Opportunities
        </Button> */}
      </div>
    </div>
  </div>
);

const OtherOpportunitiesEmptyState: React.FC = () => (
  <div className="w-full flex flex-col items-center justify-center py-16 px-4">
    <div className="relative mb-6">
      <img src={emptyStateFeed} alt="Empty state" />
    </div>
    
    <div className="text-center max-w-md">
      <h3 className="text-[26px] font-normal text-white mb-8">
        No Other Application Cards just yet, but we're still on the lookout!
      </h3>
      
      <p className="text-white mb-6 text-[15px]">
        Stay on top of your game by updating your skills, languages, and certifications as the need arises.
      </p>

      <div className="space-y-4">
        <NavLink to="/dashboard/edit-application">
          <Button className="bg-[#F5722E] hover:bg-[#F5722E]/90 text-lg font-semibold rounded-sm items-center p-0 w-[250px] h-[50px]">
            Update Application Card
          </Button>
        </NavLink>
      </div>
    </div>
  </div>
);

export { PerfectMatchEmptyState, OtherOpportunitiesEmptyState };