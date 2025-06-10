import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  Settings,
  Palette,
  Globe,
  Bell,
  MapPin,
  Clock,
  Save,
  RefreshCw,
  Moon,
  Sun,
  Monitor,
  Mail,
  Phone,
  Building,
} from "lucide-react";
import { useBusinessSettings } from "@/hooks/useEnhancedSupabase";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";

export function BusinessSettings() {
  const { settings, loading, updateSettings } = useBusinessSettings();
  const { theme, setTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();

  const [localSettings, setLocalSettings] = useState({
    business_name: "",
    business_email: "",
    business_phone: "",
    business_address: "",
    theme: "light" as "light" | "dark",
    language: "en" as "en" | "es" | "fr" | "de",
    currency: "USD",
    timezone: "UTC",
    notification_preferences: {
      email_bookings: true,
      sms_bookings: true,
      email_payments: true,
      maintenance_alerts: true,
    },
    working_hours: {
      monday: { start: "08:00", end: "17:00", closed: false },
      tuesday: { start: "08:00", end: "17:00", closed: false },
      wednesday: { start: "08:00", end: "17:00", closed: false },
      thursday: { start: "08:00", end: "17:00", closed: false },
      friday: { start: "08:00", end: "17:00", closed: false },
      saturday: { start: "09:00", end: "15:00", closed: false },
      sunday: { start: "00:00", end: "00:00", closed: true },
    },
  });

  useEffect(() => {
    if (settings) {
      setLocalSettings({
        business_name: settings.business_name,
        business_email: settings.business_email,
        business_phone: settings.business_phone,
        business_address: settings.business_address,
        theme: settings.theme,
        language: settings.language,
        currency: settings.currency,
        timezone: settings.timezone,
        notification_preferences: settings.notification_preferences,
        working_hours: settings.working_hours,
      });
    }
  }, [settings]);

  const handleSaveSettings = async () => {
    try {
      await updateSettings(localSettings);

      // Apply theme change
      setTheme(localSettings.theme);

      // Apply language change
      setLanguage(localSettings.language);

      toast.success(t("settings.save_settings") + " ✓");
    } catch (error) {
      toast.error("Failed to save settings");
    }
  };

  const languages = [
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "es", name: "Español", flag: "🇪🇸" },
    { code: "fr", name: "Français", flag: "🇫🇷" },
    { code: "de", name: "Deutsch", flag: "🇩🇪" },
  ];

  const currencies = [
    { code: "USD", name: "US Dollar", symbol: "$" },
    { code: "EUR", name: "Euro", symbol: "€" },
    { code: "GBP", name: "British Pound", symbol: "£" },
    { code: "CAD", name: "Canadian Dollar", symbol: "C$" },
    { code: "AUD", name: "Australian Dollar", symbol: "A$" },
    { code: "XAF", name: "Central African CFA Franc (FCFA)", symbol: "FCFA" }, // Added Cameroon currency
    { code: "JPY", name: "Japanese Yen", symbol: "¥" },
    { code: "CHF", name: "Swiss Franc", symbol: "CHF" },
    { code: "CNY", name: "Chinese Yuan", symbol: "¥" },
    { code: "INR", name: "Indian Rupee", symbol: "₹" },
  ];

  const timezones = [
    "UTC",
    "America/New_York",
    "America/Los_Angeles",
    "America/Chicago",
    "Europe/London",
    "Europe/Paris",
    "Africa/Douala", // Added Cameroon timezone
    "Asia/Tokyo",
    "Australia/Sydney",
    "Africa/Lagos",
    "Europe/Berlin",
    "Asia/Shanghai",
  ];

  const weekDays = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-32 bg-gray-200 rounded-lg"></div>
        <div className="h-96 bg-gray-200 rounded-lg"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t("nav.settings")}
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Manage your business settings and preferences
          </p>
        </div>
        <Button
          onClick={handleSaveSettings}
          className="bg-orange-500 hover:bg-orange-600"
        >
          <Save className="w-4 h-4 mr-2" />
          {t("settings.save_settings")}
        </Button>
      </div>

      <Tabs defaultValue="business" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="business">{t("settings.business")}</TabsTrigger>
          <TabsTrigger value="appearance">
            {t("settings.appearance")}
          </TabsTrigger>
          <TabsTrigger value="localization">
            {t("settings.localization")}
          </TabsTrigger>
          <TabsTrigger value="notifications">
            {t("settings.notifications")}
          </TabsTrigger>
          <TabsTrigger value="hours">{t("settings.working_hours")}</TabsTrigger>
        </TabsList>

        {/* Business Information */}
        <TabsContent value="business">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Building className="w-5 h-5" />
                <span>{t("settings.business_info")}</span>
              </CardTitle>
              <CardDescription>
                Update your business details that appear throughout the
                application
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="business_name">
                    {t("settings.business_name")}
                  </Label>
                  <Input
                    id="business_name"
                    value={localSettings.business_name}
                    onChange={(e) =>
                      setLocalSettings({
                        ...localSettings,
                        business_name: e.target.value,
                      })
                    }
                    placeholder="EquipEase Rentals"
                  />
                </div>

                <div>
                  <Label htmlFor="business_email">
                    {t("settings.business_email")}
                  </Label>
                  <Input
                    id="business_email"
                    type="email"
                    value={localSettings.business_email}
                    onChange={(e) =>
                      setLocalSettings({
                        ...localSettings,
                        business_email: e.target.value,
                      })
                    }
                    placeholder="contact@equipease.com"
                  />
                </div>

                <div>
                  <Label htmlFor="business_phone">
                    {t("settings.business_phone")}
                  </Label>
                  <Input
                    id="business_phone"
                    value={localSettings.business_phone}
                    onChange={(e) =>
                      setLocalSettings({
                        ...localSettings,
                        business_phone: e.target.value,
                      })
                    }
                    placeholder="+237-XXX-XXX-XXX"
                  />
                </div>

                <div>
                  <Label htmlFor="currency">{t("settings.currency")}</Label>
                  <Select
                    value={localSettings.currency}
                    onValueChange={(value) =>
                      setLocalSettings({ ...localSettings, currency: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {currencies.map((currency) => (
                        <SelectItem key={currency.code} value={currency.code}>
                          <div className="flex items-center gap-2">
                            <span className="font-mono">{currency.symbol}</span>
                            <span>{currency.name}</span>
                            {currency.code === "XAF" && (
                              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                                🇨🇲 Cameroon
                              </span>
                            )}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="business_address">
                  {t("settings.business_address")}
                </Label>
                <Textarea
                  id="business_address"
                  value={localSettings.business_address}
                  onChange={(e) =>
                    setLocalSettings({
                      ...localSettings,
                      business_address: e.target.value,
                    })
                  }
                  placeholder="123 Industrial Ave, Douala, Cameroon"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appearance Settings */}
        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Palette className="w-5 h-5" />
                <span>{t("settings.appearance")}</span>
              </CardTitle>
              <CardDescription>
                Customize the look and feel of your application
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label>{t("settings.theme_mode")}</Label>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      localSettings.theme === "light"
                        ? "border-orange-500 bg-orange-50 dark:bg-orange-900/20"
                        : "border-gray-200 dark:border-gray-700"
                    }`}
                    onClick={() => {
                      setLocalSettings({ ...localSettings, theme: "light" });
                      setTheme("light");
                    }}
                  >
                    <div className="flex items-center justify-center mb-2">
                      <Sun className="w-8 h-8 text-yellow-500" />
                    </div>
                    <div className="text-center">
                      <div className="font-medium">{t("settings.light")}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Clean and bright interface
                      </div>
                    </div>
                  </div>

                  <div
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      localSettings.theme === "dark"
                        ? "border-orange-500 bg-orange-50 dark:bg-orange-900/20"
                        : "border-gray-200 dark:border-gray-700"
                    }`}
                    onClick={() => {
                      setLocalSettings({ ...localSettings, theme: "dark" });
                      setTheme("dark");
                    }}
                  >
                    <div className="flex items-center justify-center mb-2">
                      <Moon className="w-8 h-8 text-blue-500" />
                    </div>
                    <div className="text-center">
                      <div className="font-medium">{t("settings.dark")}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Easy on the eyes
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    <strong>Theme Status:</strong> Currently using{" "}
                    <span className="font-semibold">{theme}</span> mode.{" "}
                    {theme === "dark" ? "🌙" : "☀️"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Localization Settings */}
        <TabsContent value="localization">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Globe className="w-5 h-5" />
                <span>{t("settings.localization")}</span>
              </CardTitle>
              <CardDescription>
                Configure language and regional settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label>{t("settings.language")}</Label>
                  <Select
                    value={localSettings.language}
                    onValueChange={(value) => {
                      setLocalSettings({
                        ...localSettings,
                        language: value as any,
                      });
                      setLanguage(value);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {languages.map((lang) => (
                        <SelectItem key={lang.code} value={lang.code}>
                          <div className="flex items-center gap-2">
                            <span>{lang.flag}</span>
                            <span>{lang.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>{t("settings.timezone")}</Label>
                  <Select
                    value={localSettings.timezone}
                    onValueChange={(value) =>
                      setLocalSettings({ ...localSettings, timezone: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {timezones.map((tz) => (
                        <SelectItem key={tz} value={tz}>
                          {tz}
                          {tz === "Africa/Douala" && (
                            <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                              🇨🇲 Cameroon
                            </span>
                          )}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <p className="text-sm text-green-800 dark:text-green-200">
                  <strong>Language Status:</strong> Currently using{" "}
                  <span className="font-semibold">
                    {languages.find((l) => l.code === language)?.name ||
                      "English"}
                  </span>{" "}
                  {languages.find((l) => l.code === language)?.flag}
                </p>
                <p className="text-xs text-green-700 dark:text-green-300 mt-1">
                  Interface text will update when you save settings.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="w-5 h-5" />
                <span>{t("settings.notifications")}</span>
              </CardTitle>
              <CardDescription>
                Configure how you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Email Bookings</Label>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Receive email notifications for new bookings
                    </p>
                  </div>
                  <Switch
                    checked={
                      localSettings.notification_preferences.email_bookings
                    }
                    onCheckedChange={(checked) =>
                      setLocalSettings({
                        ...localSettings,
                        notification_preferences: {
                          ...localSettings.notification_preferences,
                          email_bookings: checked,
                        },
                      })
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label>SMS Bookings</Label>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Receive SMS notifications for urgent bookings
                    </p>
                  </div>
                  <Switch
                    checked={
                      localSettings.notification_preferences.sms_bookings
                    }
                    onCheckedChange={(checked) =>
                      setLocalSettings({
                        ...localSettings,
                        notification_preferences: {
                          ...localSettings.notification_preferences,
                          sms_bookings: checked,
                        },
                      })
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Email Payments</Label>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Receive email notifications for payments received
                    </p>
                  </div>
                  <Switch
                    checked={
                      localSettings.notification_preferences.email_payments
                    }
                    onCheckedChange={(checked) =>
                      setLocalSettings({
                        ...localSettings,
                        notification_preferences: {
                          ...localSettings.notification_preferences,
                          email_payments: checked,
                        },
                      })
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Maintenance Alerts</Label>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Receive alerts for equipment maintenance schedules
                    </p>
                  </div>
                  <Switch
                    checked={
                      localSettings.notification_preferences.maintenance_alerts
                    }
                    onCheckedChange={(checked) =>
                      setLocalSettings({
                        ...localSettings,
                        notification_preferences: {
                          ...localSettings.notification_preferences,
                          maintenance_alerts: checked,
                        },
                      })
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Working Hours */}
        <TabsContent value="hours">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="w-5 h-5" />
                <span>{t("settings.working_hours")}</span>
              </CardTitle>
              <CardDescription>
                Set your business operating hours for each day of the week
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {weekDays.map((day) => (
                  <div
                    key={day}
                    className="flex items-center justify-between space-x-4"
                  >
                    <div className="w-24">
                      <Label className="capitalize">{day}</Label>
                    </div>
                    <div className="flex items-center space-x-2 flex-1">
                      <Switch
                        checked={
                          !localSettings.working_hours[
                            day as keyof typeof localSettings.working_hours
                          ].closed
                        }
                        onCheckedChange={(checked) =>
                          setLocalSettings({
                            ...localSettings,
                            working_hours: {
                              ...localSettings.working_hours,
                              [day]: {
                                ...localSettings.working_hours[
                                  day as keyof typeof localSettings.working_hours
                                ],
                                closed: !checked,
                              },
                            },
                          })
                        }
                      />
                      {!localSettings.working_hours[
                        day as keyof typeof localSettings.working_hours
                      ].closed && (
                        <>
                          <Input
                            type="time"
                            value={
                              localSettings.working_hours[
                                day as keyof typeof localSettings.working_hours
                              ].start
                            }
                            onChange={(e) =>
                              setLocalSettings({
                                ...localSettings,
                                working_hours: {
                                  ...localSettings.working_hours,
                                  [day]: {
                                    ...localSettings.working_hours[
                                      day as keyof typeof localSettings.working_hours
                                    ],
                                    start: e.target.value,
                                  },
                                },
                              })
                            }
                            className="w-24"
                          />
                          <span className="text-gray-500">to</span>
                          <Input
                            type="time"
                            value={
                              localSettings.working_hours[
                                day as keyof typeof localSettings.working_hours
                              ].end
                            }
                            onChange={(e) =>
                              setLocalSettings({
                                ...localSettings,
                                working_hours: {
                                  ...localSettings.working_hours,
                                  [day]: {
                                    ...localSettings.working_hours[
                                      day as keyof typeof localSettings.working_hours
                                    ],
                                    end: e.target.value,
                                  },
                                },
                              })
                            }
                            className="w-24"
                          />
                        </>
                      )}
                      {localSettings.working_hours[
                        day as keyof typeof localSettings.working_hours
                      ].closed && (
                        <span className="text-gray-500 italic">Closed</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
