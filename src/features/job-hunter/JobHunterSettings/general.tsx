import React, { FC, useState, useRef, useEffect } from "react";
import { Info, X } from "lucide-react";
import { cn } from "lib/utils";
import { Label } from "components";
import { Input } from "components";
import { Tooltip } from "components";
import { Switch } from "components";
import googleLogo from "images/google-logo-icon.svg?url";
import { useJobHunterContext } from "components";
import { AdDialogWrapper } from "components";
import jobHunterPopAds from "images/jobhunter-dashboard-popup-ads.svg?url";
import { TimezoneSelector } from "components";
import { useAuth } from "contexts/AuthContext/AuthContext";
import spinner_loading_fallback from "assets/images/spinner-loading-akaza.svg?url";
import button_loading_spinner from "assets/loading-spinner-orange.svg?url";
import {
  useGetAccountSettingsQuery,
  useUpdateAccountSettingsMutation,
  useUpdateEmailMutation,
  useGetUserInfoQuery,
} from "api/akaza/akazaAPI";

interface FormFieldProps {
  label: string;
  children: React.ReactNode;
  className?: string;
}

const NOTIFICATION_OPTIONS = [
  { key: "pushNotification", label: "Push Notifications" },
] as const;

const THEME_OPTIONS = [
  { value: "dark", label: "Dark" },
  { value: "light", label: "Light" },
] as const;

const DEFAULT_SETTINGS = {
  pushNotification: false,
  theme: "dark" as const,
  timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  emailNotification: false,
  smsNotification: false,
};

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
  const { subscriptionPlan } = useJobHunterContext();
  const { user } = useAuth();
  const adTriggerRef = useRef<HTMLDivElement>(null);
  const emailAdTriggerRef = useRef<HTMLDivElement>(null);
  const timezoneAdTriggerRef = useRef<HTMLDivElement>(null);

  // Get user info for most up-to-date email
  const { data: userInfoData } = useGetUserInfoQuery(undefined, {
    skip: !user?.data?.user,
  });

  const [email, setEmail] = useState("");
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [tempEmail, setTempEmail] = useState("");
  const [emailUpdateError, setEmailUpdateError] = useState("");

  // Update email state when userInfoData changes
  useEffect(() => {
    if (userInfoData?.data?.email) {
      setEmail(userInfoData.data.email);
      setTempEmail(userInfoData.data.email);
    } else if (user?.data?.user?.email) {
      setEmail(user.data.user.email);
      setTempEmail(user.data.user.email);
    }
  }, [userInfoData, user]);

  const { data: settingsData, isLoading: isLoadingSettings } =
    useGetAccountSettingsQuery(undefined, {
      skip: !user?.data?.user,
    });

  const [updateSettings] = useUpdateAccountSettingsMutation();
  const [updateEmail, { isLoading: isUpdatingEmail }] =
    useUpdateEmailMutation();

  const settings = settingsData?.data || DEFAULT_SETTINGS;

  const handleTimezoneChange = async (newTimeZone: string) => {
    if (!user?.data?.user?.id) return;

    try {
      await updateSettings({
        ...settings,
        timeZone: newTimeZone,
      });
    } catch (error) {
      console.error("Error updating timezone:", error);
    }
  };

  const handleBeforeOpenTimezone = () => {
    if (subscriptionPlan === "freeTrial") {
      timezoneAdTriggerRef.current?.click();
      return false;
    }
    return true;
  };

  const handleNotificationToggle = async () => {
    if (subscriptionPlan === "freeTrial") {
      adTriggerRef.current?.click();
      return;
    }

    if (!user?.data?.user?.id) return;

    try {
      await updateSettings({
        ...settings,
        pushNotification: !settings.pushNotification,
      });
    } catch (error) {
      console.error("Error updating notifications:", error);
    }
  };

  const handleEmailEdit = async () => {
    if (subscriptionPlan === "freeTrial" && !isEditingEmail) {
      emailAdTriggerRef.current?.click();
      return;
    }

    if (!isEditingEmail) {
      // Start editing
      setIsEditingEmail(true);
      setTempEmail(email);
      setEmailUpdateError("");
    } else {
      // Submit email update
      if (tempEmail === email) {
        // No change, just cancel edit mode
        setIsEditingEmail(false);
        return;
      }

      try {
        setEmailUpdateError("");
        const result = await updateEmail({
          oldEmail: email,
          newEmail: tempEmail,
        }).unwrap();

        if (result.success) {
          setEmail(tempEmail);
          setIsEditingEmail(false);
        } else {
          setEmailUpdateError(result.message || "Failed to update email");
        }
      } catch (error: any) {
        console.error("Error updating email:", error);
        setEmailUpdateError(
          error.data?.message || "Failed to update email. Please try again.",
        );
      }
    }
  };

  const cancelEmailEdit = () => {
    setIsEditingEmail(false);
    setTempEmail(email);
    setEmailUpdateError("");
  };

  const renderNotificationSwitch = () => (
    <Switch
      checked={settings.pushNotification}
      onCheckedChange={handleNotificationToggle}
      disabled={isLoadingSettings}
      className={cn(
        "data-[state=checked]:bg-[#F5722E] data-[state=unchecked]:bg-gray-600/70 h-5 w-9 [&>span]:h-4 [&>span]:w-4 [&>span[data-state=checked]]:translate-x-4",
        subscriptionPlan === "freeTrial" && "cursor-pointer",
        isLoadingSettings && "opacity-50",
      )}
    />
  );

  const renderTimezoneSelector = () => (
    <TimezoneSelector
      className={cn("w-full", isLoadingSettings && "opacity-50")}
      onTimezoneChange={handleTimezoneChange}
      onBeforeOpen={handleBeforeOpenTimezone}
      defaultTimezone={settings.timeZone}
      disabled={isLoadingSettings}
      key={settings.timeZone}
    />
  );

  if (isLoadingSettings) {
    return (
      <div className="flex items-center justify-center h-screen">
        <img
          src={spinner_loading_fallback}
          alt="spinners"
          className="w-20 h-20"
        />
      </div>
    );
  }

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
                <div
                  key={key}
                  className="flex items-center justify-between mr-4"
                >
                  <span className="text-white text-[15px]">{label}</span>
                  <div className="flex items-center">
                    {renderNotificationSwitch()}
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
          {renderTimezoneSelector()}
          <div className="hidden">
            <AdDialogWrapper
              popupImage={jobHunterPopAds}
              ref={timezoneAdTriggerRef}
            />
          </div>
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
                    <img src={googleLogo} alt="G" className="w-5 h-5" />
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
                          value === settings.theme
                            ? "border-[#F5722E]"
                            : "border-white"
                        }`}
                      />
                      <span
                        className={`w-2 h-2 rounded-full ${
                          value === settings.theme
                            ? "bg-[#F5722E]"
                            : "bg-transparent"
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
          <div>
            <FormField label="Email address">
              <div className="flex items-center gap-2">
                <div className="flex-1 relative">
                  <Input
                    type="email"
                    value={isEditingEmail ? tempEmail : email}
                    onChange={(e) =>
                      isEditingEmail && setTempEmail(e.target.value)
                    }
                    disabled={!isEditingEmail || isUpdatingEmail}
                    className={cn(
                      "w-full bg-transparent border-[#AEADAD] h-[45px] border-2 focus:border-[#F5722E] text-white",
                      !isEditingEmail && "opacity-70",
                      emailUpdateError && "border-red-500",
                    )}
                    placeholder="Enter email address"
                  />
                  {emailUpdateError && (
                    <p className="text-red-500 text-xs mt-1 absolute">
                      {emailUpdateError}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleEmailEdit}
                    disabled={isUpdatingEmail}
                    className={cn(
                      "w-[80px] h-[45px] bg-transparent border border-[#F5722E] text-[#F5722E] text-sm rounded hover:bg-[#F5722E] hover:text-white transition-colors duration-200 flex items-center justify-center",
                      isUpdatingEmail && "opacity-70 cursor-not-allowed",
                    )}
                  >
                    {isUpdatingEmail ? (
                      <img
                        src={button_loading_spinner}
                        alt="Loading"
                        className="w-5 h-5 animate-spin"
                      />
                    ) : isEditingEmail ? (
                      "Update"
                    ) : (
                      "Change"
                    )}
                  </button>
                  {isEditingEmail && (
                    <button
                      onClick={cancelEmailEdit}
                      disabled={isUpdatingEmail}
                      className="absolute -right-10 flex items-center justify-center h-[50px] w-[50px] text-gray-400 hover:text-white transition-colors"
                    >
                      <X size={20} />
                    </button>
                  )}
                </div>
              </div>
            </FormField>
            <div className="hidden">
              <AdDialogWrapper
                popupImage={jobHunterPopAds}
                ref={emailAdTriggerRef}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { GeneralSettings };
