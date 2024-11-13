import { FC, useState } from 'react';
import { Bell, Ellipsis, ChevronDown } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from 'components';
import { ScrollArea } from 'components';
import { Badge } from 'components';

type NotificationItem = {
  id: string;
  title: string;
  message: string;
  timestamp: Date;
  hasMatch?: boolean;
};

// Mock data for new notifications
const mockNewNotifications: NotificationItem[] = [
  {
    id: '1',
    title: 'Welcome to Akaza',
    message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.',
    timestamp: new Date(Date.now() - 1000 * 20), 
  },
  {
    id: '2',
    title: 'You have a new Perfect Match',
    message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.',
    timestamp: new Date(Date.now() - 1000 * 60 * 30), 
    hasMatch: true
  },
  {
    id: '3',
    title: 'You have a new Perfect Match',
    message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.',
    timestamp: new Date(Date.now() - 1000 * 60 * 45), 
    hasMatch: true
  },
  {
    id: '4',
    title: 'You have a new Perfect Match',
    message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.',
    timestamp: new Date(Date.now() - 1000 * 60 * 50), 
    hasMatch: true
  },
];

// Mock data for earlier/old notifications
const mockOlderNotifications: NotificationItem[] = [
  {
    id: '5',
    title: 'You have a new Perfect Match',
    message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4), 
    hasMatch: true
  },
  {
    id: '6',
    title: 'You have a new Perfect Match',
    message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), 
    hasMatch: true
  },
  {
    id: '7',
    title: 'You have a new Perfect Match',
    message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48), 
    hasMatch: true
  },
  {
    id: '8',
    title: 'You have a new Perfect Match',
    message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 72), 
    hasMatch: true
  },
];

const NotificationFeed: FC = () => {
  const [expandedNew, setExpandedNew] = useState(false);
  const displayedNewNotifications = expandedNew 
    ? mockNewNotifications 
    : mockNewNotifications.slice(0, 3);

    const getTimeLabel = (timestamp: Date) => {
      const diff = Date.now() - timestamp.getTime();
      const minutes = diff / (1000 * 60);
      const hours = minutes / 60;
      const days = hours / 24;
      
      if (minutes <= 60) {
        return { label: 'New', timeText: 'now' };
      } else if (minutes < 300) {
        return { label: 'Earlier', timeText: `${Math.floor(hours)}h` };
      } else if (hours < 24) {
        return { label: '', timeText: `${Math.floor(hours)}h` };
      } else {
        return { label: '', timeText: `${Math.floor(days)}d` };
      }
    };

  const NotificationItem = ({ notification }: { notification: NotificationItem }) => {
    const { label, timeText } = getTimeLabel(notification.timestamp);
    
    return (
      <div className="group">
        <div className="py-4 px-4 hover:bg-[#1E1E1E]">
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[#FF5E34] text-[13px]">
                {label}
              </span>
              <button className="text-white opacity-0 group-hover:opacity-100 transition-opacity">
                <Ellipsis className="h-5 w-5" />
              </button>
            </div>
            <h4 className="text-white text-[13px] font-normal flex gap-2 items-center">
              {notification.title}
              {notification.hasMatch && (
                <span className="text-[#FF5E34]">🔥</span>
              )}
            </h4>
            <p className="text-[10px] text-white mt-2 leading-[1.4]">
              {notification.message}
            </p>
            <p className="text-[10px] text-white mt-2 flex justify-end">
              {timeText}
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="relative p-2 rounded-full hover:bg-gray-100/10">
          <Bell 
            className="w-[22px] h-[25px] text-orange-500 [transform:rotate(35deg)] cursor-pointer"
          />
          <Badge 
            className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500"
            variant="secondary"
          >
            {mockNewNotifications.length}
          </Badge>
        </button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-[400px] p-0 bg-[#121212] border-none shadow-xl rounded-none" 
        align="end"
      >
        <div className="flex flex-col max-h-[85vh]">
          {/* New Notifications Section - First 3 with expand option */}
          <div className="flex-none">
            {displayedNewNotifications.map((notification) => (
              <NotificationItem key={notification.id} notification={notification} />
            ))}
            {mockNewNotifications.length > 3 && (
              <button
                onClick={() => setExpandedNew(!expandedNew)}
                className="w-full py-2 text-sm text-[#808080] hover:text-gray-400 hover:bg-[#1E1E1E] flex items-center justify-center gap-1"
              >
                {expandedNew ? 'Show Less' : 'Show More'}
                <ChevronDown className={`h-4 w-4 transition-transform ${expandedNew ? 'rotate-180' : ''}`} />
              </button>
            )}
          </div>

          {/* Divider Line */}
          <div className="h-[2px] bg-white w-full" />

          {/* Earlier/Old Notifications Section - Scrollable */}
          <ScrollArea className="h-[400px]">
            {mockOlderNotifications.map((notification) => (
              <NotificationItem key={notification.id} notification={notification} />
            ))}
          </ScrollArea>

          {/* Clear Notification Button */}
          <button 
            className="w-full py-3 text-center text-[13px] text-orange-500 hover:text-gray-400 hover:bg-[#1E1E1E] transition-colors"
          >
            Clear Notification
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export { NotificationFeed }