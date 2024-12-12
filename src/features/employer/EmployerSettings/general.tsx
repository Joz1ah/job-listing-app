import { FC, useState, useRef } from "react";
import { Info } from "lucide-react";
import { cn } from "lib/utils";
import { Label, Input } from "components";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "components";
import { Tooltip } from "components";
import { Switch } from "components";
import googleLogo from 'images/google-logo.svg?url';
import { useEmployerContext} from "components";
import { AdDialogWrapper } from "components";
import employerPopAds from "images/popup-employer.svg?url";

interface FormFieldProps {
  label: string;
  children: React.ReactNode;
  className?: string;
}

interface NotificationOption {
  key: string;
  label: string;
  tooltip?: string;
}

interface TimezoneOption {
  value: string;
  label: string;
}

interface NotificationState {
  push: boolean;
}

const POPULAR_TIMEZONES: TimezoneOption[] = [
  { value: 'America/New_York', label: '(GMT-05:00) Eastern Time' },
  { value: 'America/Chicago', label: '(GMT-06:00) Central Time' },
  { value: 'America/Denver', label: '(GMT-07:00) Mountain Time' },
  { value: 'America/Los_Angeles', label: '(GMT-08:00) Pacific Time' },
  { value: 'America/Anchorage', label: '(GMT-09:00) Alaska Time' },
  { value: 'Pacific/Honolulu', label: '(GMT-10:00) Hawaii Time' },
  { value: 'Europe/London', label: '(GMT+00:00) London' },
  { value: 'Europe/Paris', label: '(GMT+01:00) Paris' },
  { value: 'Europe/Berlin', label: '(GMT+01:00) Berlin' },
  { value: 'Asia/Dubai', label: '(GMT+04:00) Dubai' },
  { value: 'Asia/Singapore', label: '(GMT+08:00) Singapore' },
  { value: 'Asia/Tokyo', label: '(GMT+09:00) Tokyo' },
  { value: 'Asia/Shanghai', label: '(GMT+08:00) China' },
  { value: 'Australia/Sydney', label: '(GMT+11:00) Sydney' },
  { value: 'Pacific/Auckland', label: '(GMT+13:00) Auckland' }
];

const FormField: FC<FormFieldProps> = ({ label, children, className }) => {
  return (
    <div className={cn("relative pt-4", className)}>
      <div className="relative">
        <div className="absolute -top-3 left-4 bg-[#2D3A41] px-2 z-20">
          <Label className="text-sm font-normal text-white">{label}</Label>
        </div>
        <div className="relative">{children}</div>
      </div>
    </div>
  );
};

const NOTIFICATION_OPTIONS: NotificationOption[] = [
  { key: "push", label: "Push Notifications" },
];

// Function to generate timezone options
const generateTimezoneOptions = (): TimezoneOption[] => {
  return POPULAR_TIMEZONES.map(zone => {
    try {
      return {
        value: zone.value,
        label: zone.label
      };
    } catch (error) {
      console.error(`Error formatting timezone ${zone}:`, error);
      return null;
    }
  }).filter((option): option is TimezoneOption => option !== null);
};

const THEME_OPTIONS = [
  { value: "dark", label: "Dark" },
  { value: "light", label: "Light" },
] as const;

type ThemeOption = typeof THEME_OPTIONS[number]['value'];

const GeneralSettings: FC = () => {
  const { isFreeTrial } = useEmployerContext();
  const [notifications, setNotifications] = useState<NotificationState>({
    push: false,
  });
  const [theme, setTheme] = useState<ThemeOption>("dark");
  const [timeZone, setTimeZone] = useState(() => {
    try {
      return Intl.DateTimeFormat().resolvedOptions().timeZone;
    } catch (error) {
      console.error('Error detecting timezone:', error);
      return 'UTC';
    }
  });
  const [timezoneOptions] = useState<TimezoneOption[]>(() => generateTimezoneOptions());
  const [email, setEmail] = useState("john.smith@abc.com");
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [tempEmail, setTempEmail] = useState(email);
   const adTriggerRef = useRef<HTMLDivElement>(null);

  const handleTimeZoneChange = (newTimeZone: string) => {
    setTimeZone(newTimeZone);
  };

  const handleNotificationToggle = (type: keyof NotificationState) => {
    if (isFreeTrial) {
      // Trigger the ad dialog by clicking its trigger
      adTriggerRef.current?.click();
      return;
    }
    setNotifications((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  const handleEmailEdit = () => {
    if (!isEditingEmail) {
      setIsEditingEmail(true);
      setTempEmail(email);
    } else {
      setEmail(tempEmail);
      setIsEditingEmail(false);
    }
  };

  const tooltips = {
    googleAccount: "Link or unlink your Google account to easily manage your profile and settings seamlessly.",
    theme: "Switch between light and dark mode for your preference",
    notifications: "Enable or disable push notifications for better experience.",
    timezone: "Select your preferred timezone. Times across the application will be displayed according to this setting."
  } as const;

  return (
    <div className="w-full">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-white text-[24px] font-normal">General</h2>
        </div>
        <p className="text-white text-[15px] font-light leading-relaxed">
          Customize your account settings, manage notifications, unlink your
          Google account, modify your registered email, update your time zone,
          and select a theme to tailor your experience.
        </p>
      </div>

      {/* Responsive Two Column Section */}
      <div className="flex flex-col md:flex-row md:justify-between mb-8 gap-6 md:gap-4">
        {/* Notifications */}
        <div className="w-full md:w-1/2">
      <div className="space-y-3">
        <div className="flex items-center gap-1">
          <h3 className="text-white text-[24px] font-normal flex items-center">
            Notifications
          </h3>
          <Tooltip content="Enable or disable push notifications for better experience.">
            <Info className="w-3 h-3 text-[#2D3A41] fill-white mb-2" />
          </Tooltip>
        </div>
        <div className="space-y-3">
          {NOTIFICATION_OPTIONS.map(({ key, label }) => (
            <div key={key} className="flex items-center justify-between mr-4">
              <span className="text-white text-[15px]">{label}</span>
              <div className="flex items-center">
                <Switch
                  checked={notifications[key as keyof NotificationState]}
                  onCheckedChange={() => handleNotificationToggle(key as keyof NotificationState)}
                  className={cn(
                    "data-[state=checked]:bg-[#F5722E] data-[state=unchecked]:bg-gray-600/70 h-5 w-9 [&>span]:h-4 [&>span]:w-4 [&>span[data-state=checked]]:translate-x-4",
                    isFreeTrial && "cursor-pointer"
                  )}
                />
                <div className="hidden">
                  <AdDialogWrapper
                    popupImage={employerPopAds}
                    ref={adTriggerRef}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>

        {/* Time Zone */}
        <div className="w-full md:w-[330px]">
          <FormField label="Time zone">
            <Select value={timeZone} onValueChange={handleTimeZoneChange}>
              <SelectTrigger className="bg-transparent text-white border-[#AEADAD] h-[56px] border-2">
                <SelectValue placeholder="Select timezone" />
              </SelectTrigger>
              <SelectContent className="bg-[#F5F5F7] p-0 [&>*]:p-0 border-none rounded-none">
                {timezoneOptions.map(({ value, label }) => (
                  <SelectItem
                    key={value}
                    value={value}
                    className="text-black rounded-none py-3"
                  >
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>
        </div>
      </div>

      {/* Full Width Sections */}
      <div className="space-y-12 pt-12">
        {/* Google Account Section */}
        <div className="space-y-3">
          <div className="flex items-center gap-1">
            <h3 className="text-white text-2xl font-normal flex items-center">
              <div className="flex items-center">
                <img 
                  src={googleLogo}
                  alt="G"
                  className="w-5 h-5"
                />
                <span>oogle Account</span>
              </div>
            </h3>
            <Tooltip content={tooltips.googleAccount}>
              <Info className="w-3 h-3 text-[#2D3A41] fill-white mb-2" />
            </Tooltip>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-white text-[15px]">
              Unlink your Google Account
            </span>
            <button className="px-3 py-1 border border-[#E53835] text-[#E53835] text-sm rounded hover:bg-[#E53835] hover:text-white transition-colors duration-200">
              Unlink
            </button>
          </div>
        </div>

        {/* Theme Section */}
        <div className="space-y-3">
          <div className="flex items-center gap-1">
            <h3 className="text-white text-2xl font-normal flex items-center">
              Theme
            </h3>
            <Tooltip content={tooltips.theme}>
              <Info className="w-3 h-3 text-[#2D3A41] fill-white mb-2" />
            </Tooltip>
          </div>
          <div className="flex items-center gap-12">
            {THEME_OPTIONS.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => setTheme(value)}
                className="flex items-center group"
              >
                <span className="relative flex items-center justify-center w-4 h-4">
                  <span
                    className={`absolute w-4 h-4 rounded-full border-2 hover:border-[#F5722E] ${
                      theme === value ? "border-[#F5722E]" : "border-white"
                    }`}
                  />
                  <span
                    className={`w-2 h-2 rounded-full ${
                      theme === value ? "bg-[#F5722E]" : "bg-transparent"
                    }`}
                  />
                </span>
                <span className="text-white text-sm ml-2">{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Email Section */}
        <div className="space-y-3 w-full md:w-[450px]">
          <h3 className="text-white text-[24px] font-normal">
            Registered Email Address
          </h3>
          <div className="flex flex-col sm:flex-row items-start gap-2">
            <div className="w-full sm:flex-1">
              <FormField label="Email address">
                <Input
                  type="email"
                  value={isEditingEmail ? tempEmail : email}
                  onChange={(e) => isEditingEmail && setTempEmail(e.target.value)}
                  disabled={!isEditingEmail}
                  className={cn(
                    "w-full bg-transparent border-[#AEADAD] h-[45px] border-2 focus:border-[#F5722E] text-white",
                    !isEditingEmail && "opacity-70"
                  )}
                  placeholder="Enter email address"
                />
              </FormField>
            </div>
            <button 
              onClick={handleEmailEdit}
              className="w-full sm:w-[80px] mt-[18px] px-3 py-2 bg-transparent border border-[#F5722E] text-[#F5722E] text-sm rounded hover:bg-[#F5722E] hover:text-white transition-colors duration-200"
            >
              {isEditingEmail ? "Update" : "Change"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export { GeneralSettings };