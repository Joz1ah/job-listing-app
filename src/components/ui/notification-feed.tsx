import { FC, useState } from "react";
import { Bell, Ellipsis, ChevronDown } from "lucide-react";
import { ScrollArea } from "components";
import { Badge } from "components";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "components";
import freeTrialNotif from 'images/free-trial-bell.svg?url';

type NotificationItem = {
  id: string;
  title: string;
  message: string;
  timestamp: Date;
  hasMatch?: boolean;
  unread: boolean;
};

interface NotificationFeedProps {
  isFreeTrial?: boolean;
}

const initialNewNotifications: NotificationItem[] = [
  {
    id: "1",
    title: "Welcome to Akaza",
    message:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.",
    timestamp: new Date(Date.now() - 1000 * 20),
    unread: true,
  },
  {
    id: "2",
    title: "You have a new Perfect Match",
    message:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.",
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    hasMatch: true,
    unread: true,
  },
  {
    id: "3",
    title: "You have a new Perfect Match",
    message:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.",
    timestamp: new Date(Date.now() - 1000 * 60 * 45),
    hasMatch: true,
    unread: true,
  },
  {
    id: "4",
    title: "You have a new Perfect Match",
    message:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.",
    timestamp: new Date(Date.now() - 1000 * 60 * 50),
    hasMatch: true,
    unread: true,
  },
];

const initialOlderNotifications: NotificationItem[] = [
  {
    id: "5",
    title: "You have a new Perfect Match",
    message:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4),
    hasMatch: true,
    unread: true,
  },
  {
    id: "6",
    title: "You have a new Perfect Match",
    message:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
    hasMatch: true,
    unread: true,
  },
  {
    id: "7",
    title: "You have a new Perfect Match",
    message:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48),
    hasMatch: true,
    unread: true,
  },
  {
    id: "8",
    title: "You have a new Perfect Match",
    message:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 72),
    hasMatch: true,
    unread: true,
  },
];

const NotificationFeed: FC<NotificationFeedProps> = ({ isFreeTrial = false }) => {
  const [expandedNew, setExpandedNew] = useState(false);
  const [newNotifications, setNewNotifications] = useState(initialNewNotifications);
  const [olderNotifications, setOlderNotifications] = useState(initialOlderNotifications);
  const [hasBeenViewed, setHasBeenViewed] = useState(false);
  const [open, setOpen] = useState(false);

  const displayedNewNotifications = expandedNew 
    ? newNotifications 
    : newNotifications.slice(0, 3);

  const unreadCount = [...newNotifications, ...olderNotifications].filter(n => n.unread).length;

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

  const markAsRead = (notificationId: string) => {
    setNewNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, unread: false }
          : notification
      )
    );

    setOlderNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, unread: false }
          : notification
      )
    );
  };

  const handleOpenChange = (openState: boolean) => {
    setOpen(openState);
    if (openState) {
      setHasBeenViewed(true);
    }
  };

  const NotificationItem = ({ notification }: { notification: NotificationItem }) => {
    const { label, timeText } = getTimeLabel(notification.timestamp);
    
    return (
      <div className="group cursor-pointer" onClick={() => markAsRead(notification.id)}>
        <div className="py-4 px-4 hover:bg-[#1E1E1E] relative">
          {notification.unread && (
            <div className="absolute left-2 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[#F5722E]" />
          )}
          <div className="flex flex-col pl-4">
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

  const handleClearNotifications = () => {
    setNewNotifications(prev => prev.map(n => ({ ...n, unread: false })));
    setOlderNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  return (
    <div className="relative">
      {isFreeTrial ? (
        <div className="relative">
        <button 
          className="relative p-2 rounded-full z-50"
          onClick={() => handleOpenChange(!open)}
        >
          <Bell 
            className="w-[22px] h-[25px] text-[#F5722E] [transform:rotate(35deg)] cursor-pointer"
          />
        </button>
        
        <div 
          className={`
            fixed md:absolute left-0 md:left-auto right-0 md:right-0 top-[4rem] md:top-full
            w-full md:w-[400px] overflow-hidden
            transition-transform duration-1000 ease-out
            z-50 pointer-events-none
            ${open ? 'translate-y-0' : '-translate-y-full'}
          `}
        >
            <div 
              className={`
                transform transition-transform duration-900 ease-out
                ${open ? 'translate-y-0' : '-translate-y-full'}
              `}
            >
              <img 
                src={freeTrialNotif}
                alt="Free Trial Notification"
                className="w-full h-auto"
              />
            </div>
        </div>
      </div>
      ) : (
        <Popover open={open} onOpenChange={handleOpenChange}>
          <PopoverTrigger asChild>
            <button className="relative p-2 rounded-full">
              <Bell 
                className="w-[22px] h-[25px] text-[#F5722E] [transform:rotate(35deg)] cursor-pointer"
              />
              {unreadCount > 0 && !hasBeenViewed && (
                <Badge 
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500"
                  variant="secondary"
                >
                  {unreadCount}
                </Badge>
              )}
            </button>
          </PopoverTrigger>

          <PopoverContent 
            className="w-[350px] md:w-[400px] p-0 bg-black border border-black" 
            align="end"
          >
            <div className="flex flex-col max-h-[90vh]">
              <div className="flex-none">
                {displayedNewNotifications.map((notification) => (
                  <NotificationItem key={notification.id} notification={notification} />
                ))}
                {newNotifications.length > 3 && (
                  <button
                    onClick={() => setExpandedNew(!expandedNew)}
                    className="w-full py-2 text-sm text-[#808080] hover:text-gray-400 hover:bg-[#1E1E1E] flex items-center justify-center gap-1"
                  >
                    {expandedNew ? 'Show Less' : 'Show More'}
                    <ChevronDown className={`h-4 w-4 transition-transform ${expandedNew ? 'rotate-180' : ''}`} />
                  </button>
                )}
              </div>

              <div className="h-[2px] bg-white w-full" />

              <ScrollArea className="h-[400px]">
                {olderNotifications.map((notification) => (
                  <NotificationItem key={notification.id} notification={notification} />
                ))}
              </ScrollArea>

              <button 
                onClick={handleClearNotifications}
                className="w-full py-3 text-center text-[13px] text-[#F5722E] hover:text-gray-400 hover:bg-[#1E1E1E] transition-colors"
              >
                Clear Notification
              </button>
            </div>
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
};

export { NotificationFeed };