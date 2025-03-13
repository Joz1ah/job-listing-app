import { FC, useState, useEffect, useRef } from "react";
import { Bell, Ellipsis, ChevronDown } from "lucide-react";
import { ScrollArea } from "components";
import { Badge } from "components";
import { Popover, PopoverContent, PopoverTrigger } from "components";
import jobHunterPopAds from "images/popup-hunter.svg?url";
import employerPopAds from "images/popup-employer.svg?url";
import { NotificationItem } from "types/notification";
import DOMPurify from "dompurify";
import sparkle_icon from "assets/sparkle-icon.svg?url";
import { AdDialogWrapper } from "components";
import { useAuth } from "contexts/AuthContext/AuthContext";

interface NotificationFeedProps {
  subscriptionPlan?: "freeTrial" | "monthlyPlan" | "yearlyPlan";
  userType?: "employer" | "job_hunter";
  notifications?: NotificationItem[];
}

const NotificationFeed: FC<NotificationFeedProps> = ({
  subscriptionPlan,
  userType = "job_hunter",
  notifications,
}) => {
  const [expandedNew, setExpandedNew] = useState(false);
  const [newNotifications, setNewNotifications] = useState<NotificationItem[]>(
    [],
  );
  const adTriggerRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const [displayPlan, setDisplayPlan] = useState(subscriptionPlan);

  useEffect(() => {
    // Get user data from context or wherever it's available
    const userData = user?.data?.user || {};
    // Access nested subscriptions array correctly
    const subscriptions = userData.subscriptions || [];

    // IMPORTANT: We want to show the plan type regardless of free trial status
    // if there are any subscriptions in the history (even inactive ones)
    if (subscriptions && subscriptions.length > 0) {
      // Sort subscriptions by ID to find the most recent one (highest ID)
      const sortedSubscriptions = [...subscriptions].sort(
        (a, b) => b.id - a.id,
      );
      const latestSubscription = sortedSubscriptions[0];

      // Convert plan value to displayPlan format - ignore subscription status
      if (latestSubscription.plan === "Monthly") {
        setDisplayPlan("monthlyPlan");
      } else if (latestSubscription.plan === "Yearly") {
        setDisplayPlan("yearlyPlan");
      }
    } else {
      // Only fall back to the current subscription plan if no subscription history
      setDisplayPlan(subscriptionPlan);
    }
  }, [subscriptionPlan, user]);

  useEffect(() => {
    setNewNotifications(notifications ?? []);
  }, [notifications]);

  const [olderNotifications, setOlderNotifications] = useState<
    NotificationItem[]
  >([]);
  const [hasBeenViewed, setHasBeenViewed] = useState(false);
  const [open, setOpen] = useState(false);

  const displayedNewNotifications = expandedNew
    ? newNotifications
    : newNotifications.slice(0, 3);

  const unreadCount = [...newNotifications, ...olderNotifications].filter(
    (n) => n.unread,
  ).length;

  const getTimeLabel = (timestamp: Date) => {
    const diff = Date.now() - timestamp.getTime();
    const minutes = diff / (1000 * 60);
    const hours = minutes / 60;
    const days = hours / 24;

    if (minutes <= 60) {
      return { label: "New", timeText: "now" };
    } else if (minutes < 300) {
      return { label: "Earlier", timeText: `${Math.floor(hours)}h` };
    } else if (hours < 24) {
      return { label: "", timeText: `${Math.floor(hours)}h` };
    } else {
      return { label: "", timeText: `${Math.floor(days)}d` };
    }
  };

  const markAsRead = (notificationId: number) => {
    setNewNotifications((prev) =>
      prev.map((notification) =>
        notification.id === notificationId
          ? { ...notification, unread: false }
          : notification,
      ),
    );

    setOlderNotifications((prev) =>
      prev.map((notification) =>
        notification.id === notificationId
          ? { ...notification, unread: false }
          : notification,
      ),
    );
  };

  const handleOpenChange = (openState: boolean) => {
    setOpen(openState);
    if (openState) {
      setHasBeenViewed(true);
    } else {
      setExpandedNew(false);
    }
  };

  const NotificationItem = ({
    notification,
  }: {
    notification: NotificationItem;
  }) => {
    const { label, timeText } = getTimeLabel(notification.createdAt);

    return (
      <div
        className="group cursor-pointer"
        onClick={() => markAsRead(notification.id)}
      >
        <div className="py-4 px-4 hover:bg-[#1E1E1E] relative">
          {notification.unread && (
            <div className="absolute left-2 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[#F5722E]" />
          )}
          <div className="flex flex-col pl-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[#FF5E34] text-[13px]">{label}</span>
              <button className="text-white opacity-0 group-hover:opacity-100 transition-opacity">
                <Ellipsis className="h-5 w-5" />
              </button>
            </div>
            <h4 className="text-white text-[13px] font-normal flex gap-2 items-center">
              {notification.title}
              {notification.hasMatch && (
                <img src={sparkle_icon} alt="sparkle" className="w-4 h-4" />
              )}
            </h4>
            <p
              className="text-[10px] text-white mt-2 leading-[1.4]"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(notification.message),
              }}
            ></p>
            <p className="text-[10px] text-white mt-2 flex justify-end">
              {timeText}
            </p>
          </div>
        </div>
      </div>
    );
  };

  const EmptyState = () => {
    return (
      <div className="py-8 px-4 text-center">
        <p className="text-[#808080] text-[13px]">No notifications yet</p>
      </div>
    );
  };

  const handleClearNotifications = () => {
    setNewNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
    setOlderNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  // Programmatically trigger the ad dialog
  const openAdDialog = () => {
    if (adTriggerRef.current) {
      adTriggerRef.current.click();
    }
  };

  return (
    <div className="relative">
      {displayPlan === "freeTrial" ? (
        <div className="relative">
          <button
            className="relative p-2 rounded-full z-50"
            onClick={openAdDialog} // Changed to open the ad dialog
          >
            <Bell className="w-[22px] h-[25px] text-[#F5722E] [transform:rotate(35deg)] cursor-pointer" />
          </button>

          {/* AdDialogWrapper component */}
          <div className="hidden">
            <AdDialogWrapper
              popupImage={
                userType === "employer" ? employerPopAds : jobHunterPopAds
              }
              ref={adTriggerRef}
            />
          </div>
        </div>
      ) : (
        <Popover open={open} onOpenChange={handleOpenChange}>
          <PopoverTrigger asChild>
            <button className="relative p-2 rounded-full">
              <Bell className="w-[22px] h-[25px] text-[#F5722E] [transform:rotate(35deg)] cursor-pointer" />
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
              {newNotifications.length === 0 ? (
                <EmptyState />
              ) : (
                <div className="flex-none">
                  {!expandedNew &&
                    displayedNewNotifications.map((notification) => (
                      <NotificationItem
                        key={notification.id}
                        notification={notification}
                      />
                    ))}

                  {expandedNew && newNotifications.length > 3 && (
                    <ScrollArea className="h-[480px]">
                      <div>
                        {newNotifications.map((notification) => (
                          <NotificationItem
                            key={notification.id}
                            notification={notification}
                          />
                        ))}
                      </div>
                    </ScrollArea>
                  )}

                  {newNotifications.length > 3 && (
                    <button
                      onClick={() => setExpandedNew(!expandedNew)}
                      className="w-full py-2 text-sm text-[#808080] hover:text-gray-400 hover:bg-[#1E1E1E] flex items-center justify-center gap-1 bg-black"
                    >
                      {expandedNew ? "Show Less" : "Show More"}
                      <ChevronDown
                        className={`h-4 w-4 transition-transform ${
                          expandedNew ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                  )}

                  <button
                    onClick={handleClearNotifications}
                    className="w-full py-3 text-center text-[13px] text-[#F5722E] hover:text-gray-400 hover:bg-[#1E1E1E] transition-colors"
                  >
                    Clear Notification
                  </button>
                </div>
              )}
            </div>
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
};

export { NotificationFeed };
