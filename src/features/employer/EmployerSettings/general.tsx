import React, { FC, useState, useRef } from "react";
import { Info } from "lucide-react";
import { cn } from "lib/utils";
import { Label } from "components";
import { Input } from "components";
import { Tooltip } from "components";
import { Switch } from "components";
import googleLogo from 'images/google-logo-icon.svg?url';
import { useEmployerContext } from "components";
import { AdDialogWrapper } from "components";
import jobHunterPopAds from "images/popup-hunter.svg?url";
import { TimezoneSelector } from "components";
import { useAuth } from "contexts/AuthContext/AuthContext";

interface FormFieldProps {
  label: string;
  children: React.ReactNode;
  className?: string;
}

interface NotificationState {
  push: boolean;
}

const NOTIFICATION_OPTIONS = [
  { key: "push", label: "Push Notifications" },
] as const;

const THEME_OPTIONS = [
  { value: "dark", label: "Dark" },
  { value: "light", label: "Light" },
] as const;


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

const GeneralSettings: FC = () => {
  const { subscriptionPlan } = useEmployerContext();
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<NotificationState>({
    push: false,
  });
  const theme = "dark" as const;
  const [timeZone, setTimeZone] = useState<string>(() => {
    try {
      return Intl.DateTimeFormat().resolvedOptions().timeZone;
    } catch (error) {
      console.error('Error detecting timezone:', error);
      return 'UTC';
    }
  });
  const [email, setEmail] = useState(user?.data?.user?.email);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [tempEmail, setTempEmail] = useState(email);
  const adTriggerRef = useRef<HTMLDivElement>(null);

  const handleTimezoneChange = (newTimeZone: string) => {
    setTimeZone(newTimeZone);
  };

  const handleNotificationToggle = (type: keyof NotificationState) => {
    if (subscriptionPlan === 'freeTrial') {
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
                        subscriptionPlan === 'freeTrial' && "cursor-pointer"
                      )}
                    />
                    <div className="hidden">
                      <AdDialogWrapper
                        popupImage={jobHunterPopAds}
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
          <TimezoneSelector
            className="w-full"
            onTimezoneChange={handleTimezoneChange}
            defaultTimezone={timeZone}
          />
        </div>
      </div>

      {/* Full Width Sections */}
      <div className="space-y-12 pt-12">
        {/* Google Account Section */}
        <div className="space-y-3 opacity-50">
          <Tooltip content="This feature is coming soon.">
            <div>
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
                <Info className="w-3 h-3 text-[#2D3A41] fill-white mb-2" />
              </div>
              <div className="flex items-center gap-2 opacity-50 cursor-not-allowed">
                <span className="text-white text-[15px]">
                  Unlink your Google Account
                </span>
                <button className="px-3 py-1 border border-[#E53835] text-[#E53835] text-sm rounded transition-colors duration-200 cursor-not-allowed">
                  Unlink
                </button>
              </div>
            </div>
          </Tooltip>
        </div>

        {/* Theme Section */}
        <div className="space-y-3 opacity-50">
          <Tooltip content="This feature is coming soon.">
            <div>
              <div className="flex items-center gap-1">
                <h3 className="text-white text-2xl font-normal flex items-center">
                  Theme
                </h3>
                <Info className="w-3 h-3 text-[#2D3A41] fill-white mb-2" />
              </div>
              <div className="flex items-center gap-12">
                {THEME_OPTIONS.map(({ value, label }) => (
                  <div
                    key={value}
                    className="flex items-center cursor-not-allowed"
                  >
                    <span className="relative flex items-center justify-center w-4 h-4">
                      <span
                        className={`absolute w-4 h-4 rounded-full border-2 ${
                          value === theme ? "border-[#F5722E]" : "border-white"
                        }`}
                      />
                      <span
                        className={`w-2 h-2 rounded-full ${
                          value === theme ? "bg-[#F5722E]" : "bg-transparent"
                        }`}
                      />
                    </span>
                    <span className="text-white text-sm ml-2">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </Tooltip>
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